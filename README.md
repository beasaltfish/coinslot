# Idle Arcade

Original terminal mini-games, each a Claude Code mod that runs in a pane beside the chat. Install the hub, then type `/idle` to pick a game.

Live demo: https://idlearcade.beasaltfish.com

## Install

### Everything (recommended)

```
/plugin install idle-arcade --marketplace beasaltfish/idle-arcade
```

One install brings every game. Then type `/idle` to open the list and pick one; it works while Claude is busy. A game you removed shows its install command with a copy button.

### Or one game at a time

#### Fish Shooter

```
/plugin install fish-shooter --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install fish-shooter --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-fish-shooter`.

#### Brick Breaker

```
/plugin install brick-breaker --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install brick-breaker --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-brick-breaker`.

#### Snake

```
/plugin install snake --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install snake --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-snake`.

#### Space Shooter

```
/plugin install space-shooter --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install space-shooter --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-space-shooter`.

#### Tap Flyer

```
/plugin install tap-flyer --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install tap-flyer --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-tap-flyer`.

#### Jump Runner

```
/plugin install jump-runner --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install jump-runner --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-jump-runner`.

## Notifications

System notifications need a notification channel configured in Claude Code (`preferredNotifChannel`).

## Development

```
bun run bundle   # copy shared/*.ts into plugins/*/hooks/shared/
bun run check    # bundle --check, validate, tsc, test for every plugin
bun run hub      # after a game is added to the marketplace: update the hub's game list and dependencies
```

Changing a game's saved state shape? Bump `saveV` in its GameSpec so old saves are discarded instead of loaded.

Engine types are not committed; run `scripts/vendor-types.sh <path-to-claude-code.d.ts>` once per Claude Code build.

## Make a game

Anyone can add a game: fork the repo, hand [AGENTS.md](AGENTS.md) to your coding agent, and it opens a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).
