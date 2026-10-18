# Contributing to ThullaBoard

Thanks for taking the time. This is a small, dependency-light project — keep changes focused and the diff readable.

## 🍴 Fork & Branch

```bash
# 1. Fork on GitHub, then clone your fork
git clone https://github.com/<your-username>/ThullaCounter.git
cd ThullaCounter

# 2. Add the upstream remote
git remote add upstream https://github.com/H0NEYP0T-466/ThullaCounter.git

# 3. Branch off main
git checkout -b feat/short-description
```

**Branch names**

| Type | Pattern | Example |
| --- | --- | --- |
| Feature | `feat/<slug>` | `feat/chess-elo` |
| Fix | `fix/<slug>` | `fix/streak-reset` |
| Docs | `docs/<slug>` | `docs/readme-audio` |
| Chore | `chore/<slug>` | `chore/bump-vite` |

**Commits** follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(chess): add draw streak to head-to-head bar
fix(audio): restore mid-band harmonics on the vine boom
docs(readme): correct the wipe password note
```

## 🧹 Code Style & Linting

- **TypeScript everywhere.** No `any` unless there is a written reason next to it.
- **Strict types are already on** in `tsconfig.app.json`; `noUnusedLocals` and `noUnusedParameters` will fail the build.
- **Lint before pushing:**

  ```bash
  npm run lint     # oxlint
  npm run build    # tsc -b && vite build
  ```

  Both must be clean. A PR that fails either will not be merged.

- **Styling** lives in `src/index.css` as plain CSS with tokens (`--surface`, `--gold`, `--crimson`, …). Do not add a CSS framework.
- **State** goes through `src/lib/useStore.ts`. Components do not touch `localStorage` directly.
- **Derived values** (rankings, streaks, head-to-head) belong in `src/lib/stats.ts` so they stay testable and consistent across tabs.
- **No new runtime dependencies** without a justification in the PR description. The whole point is that this runs with two packages.

## 🐛 Bug Reports

Open an issue using the **Bug report** form. A useful report includes:

1. What you expected and what happened instead.
2. Exact steps, in order, starting from a fresh session if possible.
3. Device and browser (e.g. *Pixel 7, Chrome 141*).
4. Whether sound was on, and which tab was active.
5. Console output or a screenshot if the UI is involved.

If the bug is about lost data, say so first — that jumps the queue.

## 💡 Feature Requests

Use the **Feature request** form. Describe the problem before the solution. "The Hall of Shame does not show streaks past a session reset" is a better starting point than "add a streak column".

Scope guidance: features that keep the app backend-free, offline-capable, and usable one-handed on a phone are likely to land. Anything that needs a server, an account, or a database is out of scope for this repository.

## ✅ Testing & Documentation

There is no unit test runner configured yet. Before opening a PR:

1. Run `npm run lint` and `npm run build`.
2. Run the app (`npm run dev`) and walk the flow your change touches:
   - add a player, rename, toggle off/on, remove
   - record a Bhabhi loss and undo it
   - record a chess win, a loss, and a draw; check the head-to-head row
   - export, then import the file back
   - start a new session and confirm all-time totals survive
3. Reload the page mid-flow to confirm persistence.
4. Update `README.md` when behaviour, commands, or the folder structure change.

## 🎵 Adding Audio

New clips are welcome, with conditions:

- Put the file in `public/audio/`, mono 44.1 kHz, MP3, peak-normalised to roughly −1 dBFS, trimmed of silence.
- Add a row to `public/audio/CREDITS.md` with the source and its license.
- Only add audio that may legally be redistributed. Clips that are personal-use-only do not belong in a public repository.
- Register the cue in the `CUES` array in `src/lib/audio.ts` with a group, weight, label, and emoji.

## 🔀 Pull Requests

- One logical change per PR. Split unrelated refactors out.
- Reference the issue: `Fixes #123`.
- Fill in the PR template, including how you tested it.
- Keep the branch up to date with `main` before requesting review.

## 📜 License

By contributing you agree that your work is released under the [MIT License](LICENSE). Audio assets keep their own terms — see [public/audio/CREDITS.md](public/audio/CREDITS.md).
