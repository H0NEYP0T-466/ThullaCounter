# Pull Request

<!--
Title: use Conventional Commits.
  feat(chess): add draw streak to head-to-head bar
  fix(audio): restore mid-band harmonics on the vine boom
  docs(readme): correct the wipe password note
Link the issue below. If there is no issue, say why the change is needed.
-->

Fixes #

## 📝 Summary of Changes

<!-- What changed, in order, and where. Point at files when it helps. -->

-
-
-

## 🎯 Motivation and Context

<!-- Why is this needed? What was broken, slow, or missing? Include the user-facing behaviour before and after. -->

## 🧪 How Has This Been Tested?

<!--
Environment and steps. Delete what does not apply, but do not leave this blank.
-->

**Environment**

- Device / OS:
- Browser and version:
- Build: `npm run dev` / `npm run build` + `npm run preview`

**Steps**

1.
2.
3.

**Flows checked**

- [ ] Add, rename, toggle, and remove a player
- [ ] Record a Bhabhi loss and undo it
- [ ] Record a chess win, loss, and draw; head-to-head row is correct
- [ ] Export, then import the file back
- [ ] Start a new session; all-time totals survive
- [ ] Reload mid-flow; state persists

## 📸 Screenshots

<!-- Required for UI changes. Before / after, or a short screen recording. -->

## ✅ Checklist

**Types of change**

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` — no behaviour change
- [ ] `perf` — performance
- [ ] `test` — tests
- [ ] `build` — build system or dependencies
- [ ] `ci` — CI configuration
- [ ] `chore` — housekeeping
- [ ] `revert` — reverts a previous commit

**Before requesting review**

- [ ] `npm run lint` passes with no warnings
- [ ] `npm run build` passes (`tsc -b` clean)
- [ ] Self-review of the diff completed
- [ ] No unrelated changes bundled in
- [ ] Tests added or updated where behaviour changed
- [ ] Documentation updated (README, CONTRIBUTING, or CREDITS)
- [ ] New audio clips credited in `public/audio/CREDITS.md` with a redistributable license
- [ ] No new runtime dependencies, or the reason is written above
- [ ] Breaking changes are called out below
- [ ] Backward compatible with existing `thullaboard.v1` data, or a migration is included

## 💥 Breaking Changes

<!--
None? Write "None." Otherwise: what breaks, who is affected, and what they must do.
Storage format changes count as breaking.
-->

None.

## 🔗 Related

<!-- Related issues, PRs, or external references. -->
