import { expect, test } from 'claude-code/testing'

import { GAMES } from './games'

const PANE = {
  plugin: 'idle-arcade',
  component: 'Pane',
  requestId: 'idle',
  props: { title: 'Idle Arcade', isFocused: true, bodyColumns: 60, placement: 'dock', scroll: { offset: 0, bodyRows: 20 }, view: {} },
  surface: 'terminal',
} as const

const loose = (on: unknown) => on as (event: string, fn: (...a: any[]) => any) => void

// run /idle (which reads the command list) and then draw the pane, as a person would
async function openList($: any, on: unknown, ids: readonly string[] | 'unreadable') {
  const stub = loose(on)
  stub('command.list', () => (ids === 'unreadable' ? { deny: 'refused' } : { value: installedOnly(ids) }))
  stub('ui.open', () => ({ value: { isPlaced: true } }))
  await ($.command.run as unknown as (a: { command: string; args: string }) => Promise<unknown>)({ command: 'idle', args: '' })

  return $.ui.mount({ ...PANE })
}

// the other mods, as the engine would list their commands once installed
const installedOnly = (ids: readonly string[]) =>
  ids.map(id => ({ name: 'idle-' + id, description: '', source: 'plugin', plugin: id }))

test('the command is registered as immediate', async ($, on) => {
  const stub = loose(on)
  let spec: { name?: string; immediate?: unknown } = {}
  stub('session.start', () => ({ cwd: '/' }))
  stub('command.register', (_: unknown, e: { name?: string; immediate?: unknown }) => {
    spec = e

    return { value: undefined }
  })
  await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/' })
  expect(spec.name).toBe('idle')
  expect(spec.immediate).toBe(true)
})

test('/idle opens the pane', async ($, on) => {
  const stub = loose(on)
  stub('command.list', () => ({ value: [] }))
  let opened: { id?: string } = {}
  stub('ui.open', (_: unknown, e: { id?: string }) => {
    opened = e

    return { value: { isPlaced: true } }
  })
  // the test kit's `$.command.run` types the engine-stamped fields too; a person's /idle has none
  await ($.command.run as unknown as (a: { command: string; args: string }) => Promise<unknown>)({ command: 'idle', args: '' })
  expect(opened.id).toBe('idle')
})

test('lists every game, installed ones as buttons', async ($, on) => {
  const ui = await openList($, on, GAMES.map(g => g.id))
  for (const g of GAMES) expect(await ui.find({ key: g.id })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /not installed/ })).toBeUndefined()
})

test('a game that is not installed shows its install command to copy', async ($, on) => {
  const stub = loose(on)
  const missing = GAMES[GAMES.length - 1]!
  let copied = ''
  stub('ui.copy', (_: unknown, e: { text: string }) => {
    copied = e.text

    return { value: { isCopied: true } }
  })
  const ui = await openList($, on, GAMES.filter(g => g.id !== missing.id).map(g => g.id))
  expect(await ui.find({ type: 'Text', text: /not installed/ })).toBeDefined()
  await ui.press({ key: missing.id + '-copy' })
  expect(copied).toBe('/plugin install ' + missing.id + ' --marketplace beasaltfish/idle-arcade')
})

test('pressing an installed game closes the list and runs its command', async ($, on) => {
  const stub = loose(on)
  const steps: string[] = []
  stub('ui.close', (_: unknown, e: { id: string }) => {
    steps.push('close:' + e.id)

    return { value: undefined }
  })
  stub('command.run', (_: unknown, e: { command: string }) => {
    steps.push('run:' + e.command)

    return { value: { text: 'ok' } }
  })
  const ui = await openList($, on, GAMES.map(g => g.id))
  await ui.press({ key: 'snake' })
  await ui.advance(50)
  expect(steps).toEqual(['close:idle', 'run:idle-snake'])
})

test('a command the engine names another way is still found and run by its own name', async ($, on) => {
  const stub = loose(on)
  const steps: string[] = []
  stub('ui.close', () => ({ value: undefined }))
  stub('command.run', (_: unknown, e: { command: string }) => {
    steps.push(e.command)

    return { value: { text: 'ok' } }
  })
  stub('command.list', () => ({ value: [{ name: 'snake:idle-snake', description: '', source: 'plugin', plugin: 'snake' }] }))
  stub('ui.open', () => ({ value: { isPlaced: true } }))
  await ($.command.run as unknown as (a: { command: string; args: string }) => Promise<unknown>)({ command: 'idle', args: '' })
  const ui = await $.ui.mount({ ...PANE })
  expect(await ui.find({ key: 'snake' })).toBeDefined()
  await ui.press({ key: 'snake' })
  await ui.advance(50)
  expect(steps).toEqual(['snake:idle-snake'])
})

test('if the command list cannot be read, every game is offered', async ($, on) => {
  const ui = await openList($, on, 'unreadable')
  for (const g of GAMES) expect(await ui.find({ key: g.id })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /not installed/ })).toBeUndefined()
})
