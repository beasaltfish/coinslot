import type { Register } from 'claude-code'

import { GAMES } from './games'

const PANE = 'idle'
const MARKETPLACE = 'beasaltfish/idle-arcade'

const commandOf = (id: string): string => 'idle-' + id
const installOf = (id: string): string => '/plugin install ' + id + ' --marketplace ' + MARKETPLACE

// game id -> the command that runs it, read when /idle runs; undefined when it could not be read
// (then every game is offered, so a failed read never hides a game that is there)
let found: ReadonlyMap<string, string> | undefined

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // immediate: the list opens while Claude works, which is when it is wanted
    await $.command.register({ name: 'idle', description: 'Pick an Idle Arcade game', immediate: true })

    return next(e)
  })

  on('command.run', { command: 'idle' }, async $ => {
    try {
      const m = new Map<string, string>()
      for (const c of await $.command.list()) {
        const g = GAMES.find(x => c.name === commandOf(x.id) || c.plugin === x.id)
        if (g) m.set(g.id, c.name)
      }
      found = m
    } catch {
      found = undefined
    }
    // running /idle again after an install redraws the list that is already open
    $.ui.invalidate('ui.render')
    await $.ui.open({ id: PANE, title: 'Idle Arcade', focus: true, closeOnEscape: true, rows: Math.min(GAMES.length + 5, 24) })

    return { text: 'Idle Arcade opened. Pick a game; esc closes it.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)

    const rows = GAMES.map((g, i) => {
      const hotkey = i < 9 ? String(i + 1) : undefined
      const run = found?.get(g.id)
      if (found === undefined || run !== undefined) {
        return Button({
          key: g.id,
          label: (hotkey ?? ' ') + '  ' + g.title + '   by ' + g.author,
          hotkey,
          onPress: async () => {
            // The command goes to the prompt for the person to send, not run from here: a game that
            // another plugin's command opens counts as unasked, and an unasked pane waits undrawn on a
            // terminal narrower than 144 columns. A command the person sends is placed at any width.
            const command = '/' + (run ?? commandOf(g.id))
            await $.ui.close({ id: PANE })
            const filled = await $.prompt.fill({ text: command })
            await $.ui.toast(filled.isFilled ? 'Press Enter to open ' + g.title : 'Type ' + command + ' to open ' + g.title)
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
        Text({
          dimColor: true,
          children: (GAMES.length > 9 ? 'Pick a game: keys 1-9, or Tab and Enter.' : 'Pick a game: number key, or Tab and Enter.') + ' It goes to the prompt; press Enter. Esc closes.',
        }),
        ...rows,
      ],
    })
  })
}
