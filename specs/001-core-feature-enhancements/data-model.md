# Phase 1 Data Model: Core Features and Enhancements

## Entities

### Player
- id: string (fixed "local-player")
- displayName: string (optional)
- preferencesId: string

### PlayerPreferences
- id: string
- snakeColor: string (hex)
- difficulty: "easy" | "medium" | "hard"
- themeId: string
- audioEnabled: boolean
- musicEnabled: boolean

### Bot
- id: string (fixed "local-bot")
- difficulty: "easy" | "medium" | "hard"

### Snake
- id: string
- owner: "player" | "bot"
- segments: GridCoord[]
- size: number
- direction: "up" | "down" | "left" | "right"
- status: "alive" | "collided"
- activePowerUp: "shield" | "slow-time" | "speed" | null
- powerUpExpiresAt: number | null (ms timestamp)

### Item
- id: string
- type: "food" | "poison" | "powerup"
- powerUpType: "shield" | "slow-time" | "speed" | null
- position: GridCoord
- spawnedAt: number (ms timestamp)
- expiresAt: number | null

### ArenaTheme
- id: string
- name: string
- backgroundStyle: string (pattern/gradient reference)
- accentColor: string

### Match
- id: string
- state: "ready" | "active" | "ended"
- startedAt: number | null
- endedAt: number | null
- durationSec: number (fixed 30)
- remainingSec: number
- winner: "player" | "bot" | "draw" | null
- endReason: "collision" | "timer" | null
- playerSnakeId: string
- botSnakeId: string
- themeId: string
- difficulty: "easy" | "medium" | "hard"
- items: Item[]

### MatchRecord
- id: string
- timestamp: number (ms)
- winner: "player" | "bot" | "draw"
- playerSize: number
- botSize: number
- difficulty: "easy" | "medium" | "hard"
- durationSec: number
- themeId: string

### HighScoreEntry
- id: string
- score: number
- difficulty: "easy" | "medium" | "hard"
- timestamp: number

### GridCoord
- x: number
- y: number

## Relationships

- Player 1:1 PlayerPreferences
- Match 1:1 Player (by preferences) and 1:1 Bot
- Match 1:2 Snake (player + bot)
- Match 1:N Item
- MatchRecord derived from Match at end state

## Validation Rules

- Snake size is clamped to a minimum of 1 when poison is collected.
- Only one power-up effect is active at a time, resolved by priority: Shield > Slow-time > Speed.
- Match history is capped to the last 10 records.
- Teleport uses multiple entry/exit points; exits must not be blocked by snake segments.
- If timer ends with equal sizes, winner is "draw".
- If both snakes collide simultaneously, larger snake wins at collision time.

## State Transitions

- Match: ready -> active (on start) -> ended (on collision or timer).
- Snake: alive -> collided (on collision); size increases/decreases on food/poison.
- Power-up: inactive -> active (on pickup) -> inactive (on expiry or higher-priority pickup).
