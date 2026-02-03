---

description: "Task list for feature implementation"
---

# Tasks: Core Features and Enhancements

**Input**: Design documents from `/specs/001-core-feature-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Regression tests are included and aligned with constitution requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Align TypeScript/Vite config to ES2022 in `tsconfig.json` and `vite.config.ts`
- [x] T002 [P] Configure Vitest base setup in `vitest.config.ts`
- [x] T003 [P] Configure Playwright base setup in `playwright.config.ts`
- [x] T004 [P] Create core entry modules in `src/game/engine/index.ts` and `src/ui/screens/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Define shared game types from data model in `src/game/engine/types.ts`
- [x] T006 Implement fixed-timestep rAF loop and input buffering in `src/game/engine/loop.ts`
- [x] T007 Implement deterministic RNG and spawn utilities in `src/game/engine/spawn.ts`
- [x] T008 Implement versioned local storage wrapper with history cap in `src/storage/storage.ts`
- [x] T009 Implement canvas resize + render pipeline scaffold in `src/game/engine/render.ts`
- [x] T051 Add perf note requirements for loop changes in `specs/001-core-feature-enhancements/qa-notes.md`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Play a Competitive Round (Priority: P1) 🎯 MVP

**Goal**: A full 30-second duel against an AI with core rules and clear winner.

**Independent Test**: Start a round, complete a full 30-second match, and receive a clear winner based on snake size.

### Tests for User Story 1 (Regression + Core Rules)

- [x] T010 [P] [US1] Add growth/poison clamp regression tests in `tests/unit/snake-growth.spec.ts`
- [x] T011 [P] [US1] Add collision and timer outcome regression tests in `tests/unit/match-resolution.spec.ts`
- [x] T012 [P] [US1] Add teleport entry/exit regression tests in `tests/unit/teleport.spec.ts`
- [x] T013 [P] [US1] Add end-to-end full-round regression flow in `tests/e2e/play-round.spec.ts`

### Implementation for User Story 1

- [x] T014 [US1] Implement match state creation in `src/game/engine/state.ts`
- [x] T015 [P] [US1] Implement snake movement and collision rules in `src/game/rules/collision.ts`
- [x] T016 [P] [US1] Implement teleport entry/exit resolution in `src/game/rules/teleport.ts`
- [x] T017 [P] [US1] Implement food/poison spawn and apply logic in `src/game/items/items.ts`
- [x] T018 [P] [US1] Implement baseline AI pathing in `src/game/ai/basic-ai.ts`
- [x] T019 [US1] Implement timer + winner resolution in `src/game/rules/match-end.ts`
- [x] T020 [US1] Wire loop updates to state transitions in `src/game/engine/runner.ts`
- [x] T021 [US1] Implement play screen scaffold and canvas mount in `src/ui/screens/play-screen.ts`
- [x] T022 [US1] Render snakes, items, and timer HUD in `src/game/engine/render.ts`
- [x] T023 [US1] Implement main menu start flow in `src/ui/screens/main-menu.ts`

**Checkpoint**: User Story 1 is functional and independently testable

---

## Phase 4: User Story 2 - Customize and Read the Match (Priority: P2)

**Goal**: Snake color customization and readable, high-contrast match HUD.

**Independent Test**: Change the snake color, start a round, and confirm that all key match states are readable without pausing.

### Tests for User Story 2 (Regression + Readability)

- [x] T024 [P] [US2] Add preferences persistence regression tests in `tests/unit/preferences.spec.ts`
- [x] T025 [P] [US2] Add customization + HUD readability e2e regression test in `tests/e2e/customization-hud.spec.ts`
- [x] T026 [P] [US2] Add visual feedback regression assertions in `tests/e2e/visual-feedback.spec.ts`

### Implementation for User Story 2

- [x] T027 [P] [US2] Implement preferences defaults and validation in `src/storage/preferences.ts`
- [x] T028 [P] [US2] Implement customization screen UI in `src/ui/screens/customize-screen.ts`
- [x] T029 [US2] Apply player color in renderer in `src/game/engine/render.ts`
- [x] T030 [P] [US2] Implement HUD components (timer, item cues) in `src/ui/components/hud.ts`
- [x] T031 [US2] Wire preferences load/save in `src/main.ts`

**Checkpoint**: User Stories 1 and 2 are independently functional

---

## Phase 5: User Story 3 - Enhance Replayability (Priority: P3)

**Goal**: Difficulty options, power-ups, themes, audio toggles, and local match history.

**Independent Test**: Select a difficulty, play a round with a power-up, change the arena theme, toggle audio, and confirm match history updates.

### Tests for User Story 3 (Regression + Replayability)

- [x] T032 [P] [US3] Add power-up priority regression tests in `tests/unit/powerups.spec.ts`
- [x] T033 [P] [US3] Add AI difficulty selection regression tests in `tests/unit/ai-difficulty.spec.ts`
- [x] T034 [P] [US3] Add match history and high-score cap tests in `tests/unit/history-storage.spec.ts`
- [x] T035 [P] [US3] Add replayability flow e2e regression test in `tests/e2e/replayability.spec.ts`
- [x] T036 [P] [US3] Add local API schema regression tests in `tests/unit/local-api-contract.spec.ts`

### Implementation for User Story 3

- [x] T037 [P] [US3] Implement AI difficulty tiers in `src/game/ai/difficulty.ts`
- [x] T038 [P] [US3] Implement power-up effects and timers in `src/game/items/powerups.ts`
- [x] T039 [P] [US3] Implement arena theme catalog in `src/styles/themes.ts`
- [x] T052 [P] [US3] Implement theme selection UI in `src/ui/screens/replayability-screen.ts`
- [x] T053 [P] [US3] Persist selected theme in `src/storage/preferences.ts` and wire in `src/main.ts`
- [x] T054 [P] [US3] Apply selected theme in `src/game/engine/render.ts`
- [x] T040 [P] [US3] Implement audio manager with SFX/music toggles in `src/audio/audio-manager.ts`
- [x] T055 [P] [US3] Implement audio toggle UI in `src/ui/screens/replayability-screen.ts`
- [x] T056 [P] [US3] Persist audio toggle in `src/storage/preferences.ts` and wire in `src/main.ts`
- [x] T041 [P] [US3] Implement match history + high scores storage in `src/storage/history.ts`
- [x] T042 [US3] Implement replayability screen UI in `src/ui/screens/replayability-screen.ts`
- [x] T043 [US3] Wire match record creation on round end in `src/game/rules/match-end.ts`
- [x] T044 [US3] Implement local API adapter for settings/history in `src/storage/local-api.ts`
- [x] T057 [US3] Add history access from main menu in `src/ui/screens/main-menu.ts`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Regression coverage for constitution requirements and cross-story polish

- [x] T045 [P] Add input-to-action latency regression harness in `tests/unit/perf/input-latency.spec.ts`
- [x] T046 [P] Add frame-time + allocation regression checks in `tests/unit/perf/frame-memory.spec.ts`
- [x] T047 [P] Add responsiveness + HUD clarity regression sweep in `tests/e2e/constitution-regression.spec.ts`
- [x] T048 [P] Add visual cue coverage regression sweep in `tests/e2e/visual-cues.spec.ts`
- [x] T049 Add cross-cutting refactors for shared rules in `src/game/rules/index.ts`
- [x] T050 Add quickstart validation notes in `specs/001-core-feature-enhancements/qa-notes.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - independent of US1/US2

### Within Each User Story
- Tests (if included) should be written before implementation
- Core rules before UI wiring
- Storage/persistence before UI surfaces that depend on it
- Story complete before moving to next priority

---

## Parallel Example: User Story 1

```bash
# Launch all regression tests for User Story 1 together:
Task: "Add growth/poison clamp regression tests in tests/unit/snake-growth.spec.ts"
Task: "Add collision and timer outcome regression tests in tests/unit/match-resolution.spec.ts"
Task: "Add teleport entry/exit regression tests in tests/unit/teleport.spec.ts"
Task: "Add end-to-end full-round regression flow in tests/e2e/play-round.spec.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch all regression tests for User Story 2 together:
Task: "Add preferences persistence regression tests in tests/unit/preferences.spec.ts"
Task: "Add customization + HUD readability e2e regression test in tests/e2e/customization-hud.spec.ts"
Task: "Add visual feedback regression assertions in tests/e2e/visual-feedback.spec.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch all regression tests for User Story 3 together:
Task: "Add power-up priority regression tests in tests/unit/powerups.spec.ts"
Task: "Add AI difficulty selection regression tests in tests/unit/ai-difficulty.spec.ts"
Task: "Add match history and high-score cap tests in tests/unit/history-storage.spec.ts"
Task: "Add replayability flow e2e regression test in tests/e2e/replayability.spec.ts"
Task: "Add local API schema regression tests in tests/unit/local-api-contract.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. Validate with regression tests for User Story 1

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Add Polish regression coverage

---

## Notes

- [P] tasks = different files, no dependencies
- Each user story is independently completable and testable
- Constitution alignment is enforced via Phase 6 regression tasks
