import { expect, test } from 'claude-code/testing'

// Opening a game while Claude works is the point of the mod: a command that is not
// immediate would wait for the turn to end (found by typing it during a 30 s task).
test('the game command is registered as immediate', async ($, on) => {
  const stub = on as unknown as (event: string, fn: (...a: any[]) => any) => void
  let immediate: unknown
  stub('session.start', () => ({ cwd: '/' }))
  stub('command.register', (_: unknown, e: { immediate?: unknown }) => {
    immediate = e.immediate

    return { value: undefined }
  })
  await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/' })
  expect(immediate).toBe(true)
})
