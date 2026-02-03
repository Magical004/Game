# Phase 0 Research: Core Features and Enhancements

## Technical Decisions

Decision: Target platform is modern web browsers (desktop and mobile).
Rationale: Single-player, local-only gameplay maps cleanly to an instant-play browser experience and avoids install friction while meeting low-latency goals.
Alternatives considered: Native desktop (Electron/Tauri), mobile native, Unity/Godot.

Decision: Language/runtime is TypeScript 5.5 targeting ES2022.
Rationale: Type safety for game state, wide browser support, and straightforward Canvas/Web Audio usage with minimal runtime overhead.
Alternatives considered: C# (Unity), Rust (Bevy), Godot (GDScript), Python (Pygame).

Decision: Project type is a single web client (no backend services).
Rationale: The spec is single-player, local-only with no external services; a single client keeps latency minimal and simplifies delivery.
Alternatives considered: Split frontend/backend architecture; native client + local API.

Decision: Primary dependencies are Vite (build/dev), HTML5 Canvas 2D, and Web Audio API.
Rationale: Vite keeps iteration fast, Canvas 2D delivers low-overhead rendering, and Web Audio provides low-latency SFX/music control.
Alternatives considered: Phaser or PixiJS for rendering; howler.js for audio.

Decision: Local persistence uses `localStorage` with a single versioned JSON blob.
Rationale: Match history is capped to 10 and settings are small, so synchronous localStorage is sufficient and simplest.
Alternatives considered: IndexedDB for larger histories; local file storage for native builds.

Decision: Testing stack is Vitest (unit/property tests) plus Playwright (E2E flows).
Rationale: Core rules are deterministic and testable with unit tests; Playwright covers menu flow, timer, and win/loss UI.
Alternatives considered: Jest or Mocha for unit tests; Cypress for E2E.

Decision: Performance goals target 60 FPS and <50ms input-to-action latency.
Rationale: Consistent frame pacing and fast input response are central to the duel’s fairness and feel.
Alternatives considered: 30 FPS baseline; looser latency budgets.

Decision: Constraints include bounded per-frame allocations, capped snake length (<=200), and capped history (10 matches).
Rationale: Prevents GC spikes and unbounded memory growth while satisfying NFRs.
Alternatives considered: Unbounded growth with periodic compaction.

Decision: Scope assumes 1 player vs 1 AI, 6–8 UI screens, and a small asset set.
Rationale: Matches the spec’s single-player focus and keeps complexity proportional to feature goals.
Alternatives considered: Multi-mode expansion or online play.

## Best-Practice Notes

Decision: Use a `requestAnimationFrame` loop with a fixed-timestep update and input buffering.
Rationale: rAF aligns with browser paint cycles while fixed updates keep simulation stable and input latency predictable.
Alternatives considered: Variable timestep only; worker-driven simulation.

Decision: Web Audio uses a single `AudioContext` with separate gain nodes for SFX and music.
Rationale: Provides clean toggle behavior with fades and avoids per-sound context creation.
Alternatives considered: HTMLAudioElement-only playback; howler.js wrapper.

Decision: Persist settings on change and match history at round end only.
Rationale: Avoids main-thread blocking during gameplay and preserves responsiveness.
Alternatives considered: Per-tick persistence (rejected for performance).
