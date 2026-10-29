# Idle Arcade

Original terminal mini-games, each a Claude Code mod that runs in a pane beside the chat. Type `/idle-` and the command menu lists every installed game.

Live demo: https://idlearcade.beasaltfish.com

## Install

### Fish Shooter

```
/plugin install fish-shooter --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install fish-shooter --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-fish-shooter`.

### Brick Breaker

```
/plugin install brick-breaker --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install brick-breaker --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-brick-breaker`.

### Snake

```
/plugin install snake --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install snake --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-snake`.

### Space Shooter

```
/plugin install space-shooter --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install space-shooter --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-space-shooter`.

### Tap Flyer

```
/plugin install tap-flyer --marketplace beasaltfish/idle-arcade
```

The first time, Claude Code asks `Add marketplace?` for `github:beasaltfish/idle-arcade`: answer `y`, then pick a scope (user scope is listed first). The mod is active in that session right away.

From a shell the same install is:

```
claude plugin install tap-flyer --marketplace beasaltfish/idle-arcade
```

Open the game with `/idle-tap-flyer`.

### Jump Runner

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
```

Changing a game's saved state shape? Bump `saveV` in its GameSpec so old saves are discarded instead of loaded.

Engine types are not committed; run `scripts/vendor-types.sh <path-to-claude-code.d.ts>` once per Claude Code build.

## Make a game

Anyone can add a game: fork the repo, hand [AGENTS.md](AGENTS.md) to your coding agent, and it opens a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).
