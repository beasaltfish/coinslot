import type { Register } from 'claude-code'

import { GAMES } from './games'

const PANE = 'idle'
const MARKETPLACE = 'beasaltfish/idle-arcade'

const commandOf = (id: string): string => 'idle-' + id
const installOf = (id: string): string => '/plugin install ' + id + ' --marketplace ' + MARKETPLACE

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // immediate: the list opens while Claude works, which is when it is wanted
    await $.command.register({ name: 'idle', description: 'Pick an Idle Arcade game', immediate: true })

    return next(e)
  })

  on('command.run', { command: 'idle' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Idle Arcade', focus: true, closeOnEscape: true, rows: Math.min(GAMES.length + 5, 24) })

    return { text: 'Idle Arcade opened. Pick a game; esc closes it.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const { Box, Text, Button } = $.ui.resolve(e)

    // a game counts as installed when its command exists; if the list cannot be read, offer them all
    let known: ReadonlySet<string> | undefined
    try {
      known = new Set((await $.command.list()).map(c => c.name))
    } catch {
      known = undefined
    }

    const rows = GAMES.map((g, i) => {
      const hotkey = i < 9 ? String(i + 1) : undefined
      if (known === undefined || known.has(commandOf(g.id))) {
        return Button({
          key: g.id,
          label: (hotkey ?? ' ') + '  ' + g.title + '   by ' + g.author,
          hotkey,
          onPress: async () => {
            await $.ui.close({ id: PANE })
            await $.command.run({ command: commandOf(g.id) })
          },
        })
      }

      return Box({
        key: g.id,
        flexDirection: 'column',
        children: [
          Text({ dimColor: true, children: '   ' + g.title + '   by ' + g.author + '   (not installed)' }),
          Button({
            key: g.id + '-copy',
            label: 'copy install command',
            plain: true,
            onPress: async press => {
              await $.ui.copy({ text: installOf(g.id), surface: press.surface })
            },
          }),
        ],
      })
    })

    return Box({
      flexDirection: 'column',
      paddingX: 1,
      children: [
        Text({ weight: 'bold', children: 'IDLE ARCADE' }),
        Text({ dimColor: true, children: 'Pick a game: number key, or Tab and Enter. Esc closes.' }),
        ...rows,
      ],
    })
  })
}
