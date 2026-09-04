# Integration Review: MVP Release Candidate

## MVP release scope

- `.agents/tasks/001-foundation.md`
- `.agents/tasks/002-learning-history.md`
- `.agents/tasks/003-sort-visualizer.md`

## Reviewed revision

- HEAD commit: `2a28d034b76d803758aae0ff9ee6032e5eada337`
- Branch/reference observed at review: `main`, with `origin/main` at the same commit
- Review-start working tree: clean; staged changes `None`; unstaged changes `None`; untracked files `None`
- Review-start tracked unstaged diff hash: `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391` (empty input)
- Review-start staged diff hash: `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391` (empty input)
- The Review artifact created by this review is not part of the reviewed repository state.

## MVP releaseable: Yes

## Next step: proceed

## Blocking findings

None

## Mandatory fixes before release

None

## Deferrable improvements

### IR-M-01

- Finding ID: `IR-M-01`
- Severity: Medium
- Affected Task repository path: `.agents/tasks/003-sort-visualizer.md`
- Recommended follow-up: Align the narrow-screen learning order with `doc/ui-reference.html` by placing algorithm selection with the initial conditions before the bars and placing the flowchart after current processing/variables but before Result / Why / Insight. Keep the controls and all Sort-specific state inside `src/materials/sort/**`.
- Evidence: The current template order is `SortVisualizationPanel` then `SortControls`, while the aside order is `SortExplanationPanel` (including Result / Why / Insight) then `SortFlowchart`. The 360px browser pass confirmed that this order increases vertical travel between the initial array, algorithm selection, current processing, flow position, and completion explanation. Functionality remains available.

### IR-M-02

- Finding ID: `IR-M-02`
- Severity: Medium
- Affected Task repository path: `.agents/tasks/003-sort-visualizer.md`
- Recommended follow-up: Raise the 360px bar marker, state, and index text to a comfortably readable presentation, using abbreviated markers plus a key, chips, or callouts if needed, and repeat browser verification with all nine bars visible.
- Evidence: At an explicit 360px viewport, computed font sizes were 8px for `.bar-marker`, 8px for `.bar-state`, and 8.32px for `.bar-index`. All nine bars and operations fit without document-level horizontal overflow, but these core learning labels are visibly very small.

### IR-M-03

- Finding ID: `IR-M-03`
- Severity: Medium
- Affected Task repository path: `.agents/tasks/003-sort-visualizer.md`
- Recommended follow-up: Add parameterized component regression coverage for all seven algorithm selections and completion explanations, variable-to-marker/chip mapping, rendered state priority and ARIA labels, and the active flow node's `aria-current="step"`.
- Evidence: Domain tests cover all seven algorithms and the integration browser pass completed all seven with distinct Result / Why / Insight content. Automated component completion coverage remains centered on bubble sort, and the variable marker, rendered overlap priority, and active flow node connection are not directly covered together.

### IR-L-01

- Finding ID: `IR-L-01`
- Severity: Low
- Affected Task repository path: `.agents/tasks/002-learning-history.md`
- Recommended follow-up: Validate the persisted timestamp as the intended ISO 8601 form and add a test that rejects a JavaScript-parseable non-ISO string.
- Evidence: `isLearningHistoryEntry()` accepts any string for which `Date.parse()` succeeds. `Date.parse('August 31, 2026')` succeeded in the review environment, although the persisted contract specifies ISO 8601. Application writes remain correct because `recordMaterialOpened()` uses `toISOString()`.

## Entry Gate verification

- All three explicitly supplied Tasks exist and have `Status: Done`.
- Their dependency order is coherent: foundation, learning history, then sort visualizer.
- Together they cover the four MVP screens, the sole MVP material, the complete sort learning flow, routing, history persistence, responsive UI, tests, and build required by `doc/requirements.md`.
- No required MVP Task is omitted, and no unknown Task is included.

## Review evidence

### MVP requirements and screens

- HOME, Learning Materials, Material, and Learning History rendered in the browser with their required purpose and navigation.
- The HOME-to-list-to-material learning route worked; the history screen showed the opened sort material and a link back to it.
- No authentication, backend, score, progress, free array input, or second material was introduced.

### Routing

- Browser-verified `/`, `/materials`, `/materials/sort-visualizer`, and `/history`.
- `/materials/unknown-material` displayed the in-page not-found state and the Learning Materials return link.
- `/unknown-path` redirected to `/`.
- Browser Back returned from history to the material, and Forward returned to history.
- Router tests independently cover all four routes, the catch-all redirect, and back/forward behavior.

### Material architecture and state ownership

- `src/materials/definitions.ts` is the single material metadata/component registration source.
- `MaterialView` resolves `materialId`, records history, and renders the registered component without Sort-specific state.
- Sort state, timers, presentation, components, styles, randomization, and Domain logic remain under `src/materials/sort/**`.
- No Sort Domain dependency on Vue, Vue Router, `historyService`, or `localStorage` was found.
- No common application module depends on the Sort Domain except the deliberate component registration in `materials/definitions.ts`.
- A second material can be added by adding its own material directory/component and one definition entry; the existing Sort material does not need rewriting.
- No Pinia, Repository, API client, generic material/step engine, plugin system, backend, database, or authentication layer was introduced.

### Persistence

- Production `localStorage` access occurs only in `src/services/historyService.ts`; Vue components use the service.
- Persisted entry construction contains only `materialId` and `lastOpenedAt`; sort execution state, base array, algorithm, speed, completion, scores, and progress are not persisted.
- Tests verify create/update ordering, malformed data tolerance, and read/write failure tolerance.
- Browser navigation showed history after opening the valid material; the unknown-material non-save rule is covered by `MaterialView.test.ts` and the implementation guard.

### Sort learning experience

- Browser-verified initial random permutation, disabled Step/autoplay before independent start, a phase Step, a comparison Step with orange/ARIA operands, a subsequent array-changing Step with red/ARIA state, automatic playback, sorted final result, Why, and Insight.
- Browser-verified all seven selectable algorithms through completion at 100ms playback. Each finished at its trace endpoint with `[1, 2, 3, 4, 5, 6, 7, 8, 9]` and non-empty algorithm-specific Result / Why / Insight:
  - bubble: `Step 69 / 69`
  - selection: `Step 61 / 61`
  - insertion: `Step 64 / 64`
  - quick: `Step 52 / 52`
  - merge: `Step 67 / 67`
  - heap: `Step 79 / 79`
  - shell: `Step 60 / 60`
- Automated tests additionally verify input immutability, compare/action separation, operand fidelity, settled semantics, heap build/extract phases, shell gaps `4 → 2 → 1`, state priority, random permutation, and forced-different shuffle.

### UI and responsive behavior

- At 1280px, the learning shell rendered as two columns (`751.362px 388.625px`) with no document-level horizontal overflow.
- At 360px, it rendered as one column (`328.8px`); all five operation buttons measured 303px wide and stayed within the viewport; all nine bars remained visible; document-level horizontal overflow was absent.
- HOME, Learning Materials, and Learning History were also checked at 360px without document-level horizontal overflow.
- The browser console produced no warning or error entries during the review flow.
- The remaining readability and information-order issues are recorded as `IR-M-01` and `IR-M-02` and do not prevent the required operations or completion flow.

### Feature Review re-evaluation

- `001-foundation-review.md`: no prior finding to carry forward.
- `002-learning-history-review.md`: its historical common-CSS Allowed Changes issue does not represent a current runtime, requirement, or architecture defect and is not carried forward as a release finding. Its non-strict ISO validation remains reproducible as `IR-L-01`.
- `003-sort-visualizer-review.md`: the former comparison-operand High finding remains closed; the integration browser pass showed matching comparison values, orange states, descriptions, and ARIA. Its three Medium findings remain reproducible as `IR-M-01` through `IR-M-03`.
- `src/**` and `tests/**` have no diff from feature merge tip `30ad07c`; the later package change adds only the `preview` script. The current revision was nevertheless retested and rebuilt.

## Verification

- `npm run test`: executed; a verbose rerun was used to capture complete evidence.
- `npm run test -- --reporter=verbose`: passed, 11 test files and 73 tests.
- `npm run build`: passed; `vue-tsc -b && vite build`, 70 modules transformed.
- Build output: `dist/index.html`, one CSS asset, and one JavaScript asset generated successfully.
- `npm run dev -- --host 127.0.0.1`: Vite 7.3.6 started successfully for the browser verification and was stopped after completion.
- Review environment: Node `v24.18.0`, npm `11.16.0`.

No Critical or High finding was identified. The MVP completion requirements are materially satisfied, and the remaining Medium/Low items are deferrable improvements.

Next step: proceed
