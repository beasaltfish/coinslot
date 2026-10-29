import { expect, test } from 'bun:test'
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { HUB_ID } from './games'
import { gamesSource, syncHub, titleOf } from './hub'

const root = resolve(import.meta.dir, '..')
const market = () => JSON.parse(readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8')) as { plugins: { name: string }[] }

// a copy of just what the hub generator reads
function copy(): string {
  const tmp = mkdtempSync(join(tmpdir(), 'idle-hub-'))
  cpSync(join(root, '.claude-plugin'), join(tmp, '.claude-plugin'), { recursive: true })
  for (const p of market().plugins) cpSync(join(root, 'plugins', p.name, '.claude-plugin'), join(tmp, 'plugins', p.name, '.claude-plugin'), { recursive: true })
  cpSync(join(root, 'plugins', HUB_ID, 'hooks', 'games.ts'), join(tmp, 'plugins', HUB_ID, 'hooks', 'games.ts'))

  return tmp
}

test('titles are the id in words', () => {
  expect(titleOf('fish-shooter')).toBe('Fish Shooter')
  expect(titleOf('snake')).toBe('Snake')
})

test('the marketplace lists the hub, and it is not a game', () => {
  expect(market().plugins.map(p => p.name)).toContain(HUB_ID)
})

// The committed hub is checked against the marketplace on main by .github/workflows/hub.yml, not here:
// a contributor's PR adds a marketplace entry and may not touch the hub, so a test of the real files would fail it.
test('a game added to the marketplace shows up as out of date, and syncing bumps the version', () => {
  const tmp = copy()
  const m = JSON.parse(readFileSync(join(tmp, '.claude-plugin', 'marketplace.json'), 'utf8'))
  m.plugins.push({ name: 'new-game', source: './plugins/new-game', description: 'x' })
  writeFileSync(join(tmp, '.claude-plugin', 'marketplace.json'), JSON.stringify(m))
  cpSync(join(root, 'plugins', 'snake', '.claude-plugin'), join(tmp, 'plugins', 'new-game', '.claude-plugin'), { recursive: true })

  const before = JSON.parse(readFileSync(join(tmp, 'plugins', HUB_ID, '.claude-plugin', 'plugin.json'), 'utf8')).version as string
  const report = syncHub(tmp, false)
  expect(report.changed).toBe(true)
  expect(report.files.length).toBe(2)

  expect(syncHub(tmp, true).changed).toBe(true)
  const after = JSON.parse(readFileSync(join(tmp, 'plugins', HUB_ID, '.claude-plugin', 'plugin.json'), 'utf8'))
  expect(after.dependencies).toContain('new-game')
  expect(after.version).not.toBe(before)
  expect(readFileSync(join(tmp, 'plugins', HUB_ID, 'hooks', 'games.ts'), 'utf8')).toContain('"new-game"')
  expect(syncHub(tmp, false).changed).toBe(false)
})

test('author names are written as data, never as code', () => {
  const tmp = copy()
  const pj = join(tmp, 'plugins', 'snake', '.claude-plugin', 'plugin.json')
  const manifest = JSON.parse(readFileSync(pj, 'utf8'))
  manifest.author = { name: 'x"); process.exit(1); ("' }
  writeFileSync(pj, JSON.stringify(manifest))
  const src = gamesSource(tmp)
  expect(src).toContain(JSON.stringify('x"); process.exit(1); ("'))
  expect(src.split('\n').filter(l => l.includes('process.exit')).length).toBe(1)
})

test('a changed game list alone still bumps the hub version', () => {
  const tmp = copy()
  const gamesPath = join(tmp, 'plugins', HUB_ID, 'hooks', 'games.ts')
  writeFileSync(gamesPath, readFileSync(gamesPath, 'utf8').replace('"Snake"', '"Serpent"'))
  const before = JSON.parse(readFileSync(join(tmp, 'plugins', HUB_ID, '.claude-plugin', 'plugin.json'), 'utf8')).version as string
  expect(syncHub(tmp, true).changed).toBe(true)
  const after = JSON.parse(readFileSync(join(tmp, 'plugins', HUB_ID, '.claude-plugin', 'plugin.json'), 'utf8')).version as string
  expect(after).not.toBe(before)
  expect(readFileSync(gamesPath, 'utf8')).toContain('"Snake"')
})
