# QA Notes: Core Features and Enhancements

## Perf Notes Requirement (Loop Changes)

When modifying the game loop, add a short perf note to this file with:

- Date and change summary
- Expected impact on frame time or input latency
- Evidence: either a measurement (simple timing, FPS) or a brief reasoning note
- Any guardrails (caps, reuse, no per-frame allocations)

Example:

- 2026-02-03: Adjusted fixed timestep accumulator to clamp large deltas; expected to reduce long-frame spikes. Evidence: reasoning based on capped maxFrameMs; no per-frame allocations added.

## Quickstart Validation Notes

- 2026-02-03: Verified quickstart instructions align with current scripts (npm install, npm run dev, npm run test, npm run test:e2e, npm run build).
