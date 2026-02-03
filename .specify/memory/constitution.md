<!--
Sync Impact Report
- Version change: N/A (template) → 0.1.0
- Modified principles: [PRINCIPLE_1_NAME] → I. Low-Lag Responsiveness; [PRINCIPLE_2_NAME] → II. Memory-Efficient Simulation; [PRINCIPLE_3_NAME] → III. Polished Visual Feedback; [PRINCIPLE_4_NAME] → IV. Readable UI and Consistent Motion
- Added sections: Performance and UX Standards; Development Workflow
- Removed sections: Principle 5 placeholder
- Templates requiring updates: ✅ updated `.specify/templates/plan-template.md`; ✅ updated `.specify/templates/spec-template.md`; ✅ updated `.specify/templates/tasks-template.md`
- Follow-up TODOs: TODO(RATIFICATION_DATE)
-->
# Snake Duel Constitution

## Core Principles

### I. Low-Lag Responsiveness
The game loop MUST prioritize input handling and frame stability. Any change that risks
noticeable latency MUST include mitigation or be rejected. Responsiveness is the primary
user-facing quality bar.
Rationale: This is a reflex-driven duel; latency erodes fairness and fun.

### II. Memory-Efficient Simulation
Logic and rendering MUST minimize per-frame allocations and avoid unbounded growth in
state or asset usage. Memory costs must be understood before adding new systems.
Rationale: Stable memory keeps frame time smooth and prevents mid-round performance drops.

### III. Polished Visual Feedback
Every meaningful state change (food, poison, teleport, collision, timer, win/loss) MUST
have immediate, clear visual feedback. Visuals MUST feel modern and cohesive.
Rationale: Clear feedback communicates outcomes quickly and makes the duel legible.

### IV. Readable UI and Consistent Motion
Typography, color contrast, and spacing MUST keep UI readable at a glance. Animations
MUST be consistent, purposeful, and never impede responsiveness.
Rationale: Clarity and consistency reduce cognitive load during fast play.

## Performance and UX Standards

- Input handling and frame updates MUST run on the critical path; avoid blocking work in
  the main loop.
- Per-frame allocations SHOULD be near-constant; reuse objects and cap effects to avoid
  spikes.
- Visual feedback MUST preserve contrast even with snake color customization.
- Teleportation entry/exit and collision outcomes MUST be visually distinct and immediate.
- Round timer and win condition MUST be visible without clutter.

## Development Workflow

- Each feature spec MUST include acceptance criteria for responsiveness, memory behavior,
  and visual feedback.
- Changes that affect the game loop MUST include a short perf note (measurement or
  reasoning).
- Visual changes SHOULD include before/after screenshots or a short clip when feasible.
- Regression checks MUST cover collisions, teleport rules, food/poison effects, and round
  timer logic.
- Reviews MUST verify alignment with all Core Principles.

## Governance

- This constitution supersedes other guidance; deviations require documented exceptions
  in the feature plan with rationale.
- Amendments require a documented change summary, impact assessment, and a version bump
  per the semantic policy below.
- Versioning policy: MAJOR for principle removal or incompatible governance changes;
  MINOR for new principles or substantial expansions; PATCH for clarifications or typos.
- Compliance review is required in plan and spec stages; reviewers must explicitly
  confirm principle alignment.
- Ratification date records original adoption; last amended date updates on any change.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date not provided | **Last Amended**: 2026-02-03
