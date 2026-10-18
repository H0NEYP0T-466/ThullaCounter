<div align="center">

# ThullaBoard

</div>

<p align="center">

  <!-- Core -->
  ![GitHub License](https://img.shields.io/github/license/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=brightgreen)
  ![GitHub Stars](https://img.shields.io/github/stars/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=yellow)
  ![GitHub Forks](https://img.shields.io/github/forks/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=blue)
  ![GitHub Issues](https://img.shields.io/github/issues/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=red)
  ![GitHub Pull Requests](https://img.shields.io/github/issues-pr/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=orange)
  ![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge)
  ![Live Demo](https://img.shields.io/badge/Live%20Demo-thulla--counter.vercel.app-f5b93c?style=for-the-badge&logo=vercel&logoColor=black)

  <!-- Activity -->
  ![Last Commit](https://img.shields.io/github/last-commit/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=purple)
  ![Commit Activity](https://img.shields.io/github/commit-activity/m/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=teal)
  ![Repo Size](https://img.shields.io/github/repo-size/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=blueviolet)
  ![Code Size](https://img.shields.io/github/languages/code-size/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=indigo)

  <!-- Languages -->
  ![Top Language](https://img.shields.io/github/languages/top/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=critical)
  ![Languages Count](https://img.shields.io/github/languages/count/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=success)

  <!-- Community -->
  ![Discussions](https://img.shields.io/github/discussions/H0NEYP0T-466/ThullaCounter?style=for-the-badge&color=blue)
  ![Documentation](https://img.shields.io/badge/Docs-Available-green?style=for-the-badge&logo=readthedocs&logoColor=white)
  ![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)

</p>

**ThullaBoard** is a browser-only scoreboard for the two games that ruin friendships during university breaks: **Bhabhi Thulla** (the card game where everyone escapes except one) and **Chess**. It keeps an indisputable record of who lost how many times, crowns the **Chief Bhabhi**, fires a wall of slaps and desi memes on every loss, and generates a WhatsApp challan you can paste straight into the group chat.

No backend, no accounts, no database. Everything lives in `localStorage` on the phone that keeps score.

## 🔗 Links

- **Live demo** — [thulla-counter.vercel.app](https://thulla-counter.vercel.app)
- **Repository** — [github.com/H0NEYP0T-466/ThullaCounter](https://github.com/H0NEYP0T-466/ThullaCounter)
- **Issues** — [Report a bug or request a feature](https://github.com/H0NEYP0T-466/ThullaCounter/issues)
- **Discussions** — [Ask a question](https://github.com/H0NEYP0T-466/ThullaCounter/discussions)
- **Contributing** — [CONTRIBUTING.md](CONTRIBUTING.md)
- **Security** — [SECURITY.md](SECURITY.md)
- **Audio credits** — [public/audio/CREDITS.md](public/audio/CREDITS.md)

## 📑 Table of Contents

- [🚀 Installation](#-installation)
- [⚡ Usage](#-usage)
- [✨ Features](#-features)
- [📂 Folder Structure](#-folder-structure)
- [📦 Submodules](#-submodules)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🛡 Security](#-security)
- [📏 Code of Conduct](#-code-of-conduct)
- [🛠 Tech Stack](#-tech-stack)
- [📦 Dependencies & Packages](#-dependencies--packages)

## 🚀 Installation

**Prerequisites**

- Node.js `20.19+` or `22.12+` (Vite 8 requirement)
- npm `10+`

**Setup**

```bash
# 1. Clone
git clone https://github.com/H0NEYP0T-466/ThullaCounter.git
cd ThullaCounter

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Or skip the setup and use the live app: **https://thulla-counter.vercel.app**

Locally, the app is served at `http://localhost:5173`. Open it on your phone over the same network (`npm run dev -- --host`) and add it to your home screen — it ships a web manifest and runs standalone.

**Production build**

```bash
npm run build     # type-check + bundle into dist/
npm run preview   # serve the built bundle
```

**Deploy**

Import the repo on Vercel and keep the detected defaults: framework **Vite**, build command `npm run build`, output directory `dist`. No environment variables, no rewrites, no server.

```bash
npx vercel --prod
```

## ⚡ Usage

**Around the table**

1. Open **Roster** and add the players. The suggestion chips add the usual suspects in one tap; tap any name later to rename it.
2. Toggle who is actually sitting at the table. Inactive players keep their history but disappear from the tap grid.
3. In **Thulla**, tap the player who got stuck with the last card. That is the whole interaction: the loss is recorded, the storm plays, and the stamp lands.
4. In **Chess**, pick white and black, then record a win either way or a draw. Head-to-head scorelines update immediately.
5. **Shame** ranks everyone by losses and holds the challan button.
6. **Roster → Session** starts a new day without touching all-time records.

**Data portability**

- Header menu → **Export JSON** writes a dated backup file.
- Header menu → **Import JSON** validates the file, shows what it contains, then replaces the board.
- **Start new session** archives today and keeps every all-time total.
- **Erase everything** requires the password `shoaib`. It is a guard against a fat thumb, not a security control — the check runs in the browser.

**Sound**

The speaker button in the header opens the soundboard: mute, volume, an optional spoken announcer, and all 51 clips grouped by category for preview. Audio unlocks on the first tap (mobile browser rule) and the clips are preloaded so a loss never waits on the network.

## ✨ Features

- **Roster management** — add, rename inline, remove, and toggle who is at the table without deleting anyone.
- **One-tap Bhabhi tracking** — a big tap target per player; the loss count, live losing streak, and round counter update instantly.
- **Chess 1v1 tracker** — white/black pickers, win/win/draw outcomes, per-pair head-to-head records with a win-share bar.
- **Hall of Shame** — ranked by losses, crown on the current Chief Bhabhi, Clean Sheet badge for the untouched, Today / All-time switch.
- **The storm** — every Bhabhi tap fires all 8 slaps, all 6 voice clips, and 3 desi memes in one scheduling pass on the audio clock, behind a soft-clip limiter so 17 overlapping sources never distort.
- **Real audio, not beeps** — 51 clips (Mixkit library plus a MyInstants desi-meme pack) trimmed, mono, peak-normalised, and decoded into `AudioBuffer`s for instant playback.
- **Slap stamp** — full-screen hand slam with a shockwave ring and **"NAME IS BHABHI"**, tuned to hold 60 fps on a mid-range phone.
- **WhatsApp challan** — a formatted receipt per player, plus a full session receipt, with copy-to-clipboard and a `wa.me` deep link.
- **Undo** — every recorded result gets an Undo action in the toast.
- **Portability** — auto-save to `localStorage`, validated JSON export/import, session reset that preserves all-time records, and a password-gated wipe.
- **Mobile-first UI** — dark theme, safe-area padding, 44px+ targets, installable as a PWA.

## 📂 Folder Structure

```text
ThullaCounter/
├── public/
│   ├── audio/                    # 51 audio clips + CREDITS.md
│   ├── favicon.svg
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   │   ├── BhabhiTab.tsx         # one-tap loss grid + today's casualties
│   │   ├── ChessTab.tsx          # match setup, outcomes, rivalries
│   │   ├── Icon.tsx              # inline SVG icon set + logo
│   │   ├── RosterTab.tsx         # add/rename/remove/toggle, session tools
│   │   ├── ShameTab.tsx          # leaderboard, chief card, clean sheets
│   │   └── Sheet.tsx             # bottom sheet, confirm dialog, toast
│   ├── lib/
│   │   ├── audio.ts              # audio engine, cue catalogue, storm, announcer
│   │   ├── format.ts             # time and plural helpers
│   │   ├── roasts.ts             # toast and spoken lines
│   │   ├── share.ts              # challan and session receipt text
│   │   ├── stats.ts              # leaderboard, streaks, head-to-head
│   │   ├── storage.ts            # localStorage, sanitiser, export/import
│   │   └── useStore.ts           # state hook and all mutations
│   ├── App.tsx                   # shell, tabs, sheets, wipe gate
│   ├── index.css                 # design tokens and all component styles
│   ├── main.tsx                  # entry point
│   └── types.ts                  # shared domain types
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── .oxlintrc.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE
```

## 📦 Submodules

No Git submodules. This is a single-package Vite application with no sub-repositories.

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. In short: fork, branch, keep `npm run lint` and `npm run build` clean, and credit any new audio clip in [public/audio/CREDITS.md](public/audio/CREDITS.md) with a license that allows redistribution.

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for the full text.

The audio clips in `public/audio/` are third-party works and are not covered by the MIT license. See [public/audio/CREDITS.md](public/audio/CREDITS.md) for each source. The desi meme pack is personal use only and is not cleared for commercial redistribution.

## 🛡 Security

Found a vulnerability? Do not open a public issue. See [SECURITY.md](SECURITY.md) for the reporting route and the handling policy.

## 📏 Code of Conduct

This project follows the [Contributor Covenant v2.1](CODE_OF_CONDUCT.md). Be decent, argue about the game, not the person.

## 🛠 Tech Stack

**Languages**

![TypeScript](https://img.shields.io/badge/TypeScript-%233178c6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-%23e34f26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572b6.svg?style=for-the-badge&logo=css3&logoColor=white)

**Frameworks & Libraries**

![React](https://img.shields.io/badge/React-%2361dafb.svg?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-%23646cff.svg?style=for-the-badge&logo=vite&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-%23ff6f00.svg?style=for-the-badge&logo=audiomack&logoColor=white)

**Databases & Storage**

![localStorage](https://img.shields.io/badge/localStorage-%23f7df1e.svg?style=for-the-badge&logo=javascript&logoColor=black)

**DevOps / CI / Tools**

![npm](https://img.shields.io/badge/npm-%23cb3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Oxlint](https://img.shields.io/badge/Oxlint-%23000000.svg?style=for-the-badge&logo=oxc&logoColor=white)
![Git](https://img.shields.io/badge/Git-%23f05033.svg?style=for-the-badge&logo=git&logoColor=white)

**Cloud / Hosting**

![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-%235a0fc8.svg?style=for-the-badge&logo=pwa&logoColor=white)

## 📦 Dependencies & Packages

### Runtime Dependencies

![react](https://img.shields.io/npm/v/react?style=for-the-badge&label=react&color=blue)
![react-dom](https://img.shields.io/npm/v/react-dom?style=for-the-badge&label=react-dom&color=blue)

| Package | Declared | Purpose |
| --- | --- | --- |
| [`react`](https://www.npmjs.com/package/react) | `^19.2.8` | Component model and state |
| [`react-dom`](https://www.npmjs.com/package/react-dom) | `^19.2.8` | DOM renderer |

<details>
<summary><strong>Dev / Build / Test Dependencies</strong> (7)</summary>

![vite](https://img.shields.io/npm/v/vite?style=for-the-badge&label=vite&color=purple)
![typescript](https://img.shields.io/npm/v/typescript?style=for-the-badge&label=typescript&color=purple)
![oxlint](https://img.shields.io/npm/v/oxlint?style=for-the-badge&label=oxlint&color=purple)
![@vitejs/plugin-react](https://img.shields.io/npm/v/@vitejs/plugin-react?style=for-the-badge&label=%40vitejs%2Fplugin-react&color=purple)
![@types/react](https://img.shields.io/npm/v/@types/react?style=for-the-badge&label=%40types%2Freact&color=purple)
![@types/react-dom](https://img.shields.io/npm/v/@types/react-dom?style=for-the-badge&label=%40types%2Freact-dom&color=purple)
![@types/node](https://img.shields.io/npm/v/@types/node?style=for-the-badge&label=%40types%2Fnode&color=purple)

| Package | Declared | Purpose |
| --- | --- | --- |
| [`vite`](https://www.npmjs.com/package/vite) | `^8.3.0` | Dev server and production bundler |
| [`typescript`](https://www.npmjs.com/package/typescript) | `~6.0.2` | Type checking (`tsc -b`) |
| [`oxlint`](https://www.npmjs.com/package/oxlint) | `^1.81.0` | Linter |
| [`@vitejs/plugin-react`](https://www.npmjs.com/package/@vitejs/plugin-react) | `^6.1.1` | React fast refresh and JSX transform |
| [`@types/react`](https://www.npmjs.com/package/@types/react) | `^19.2.18` | React type definitions |
| [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) | `^19.2.7` | React DOM type definitions |
| [`@types/node`](https://www.npmjs.com/package/@types/node) | `^24.13.3` | Node type definitions for config files |

</details>

No peer or optional dependencies are declared. No external runtime services, no database drivers, no analytics.

<p align="center">Made with ❤ by <a href="https://github.com/H0NEYP0T-466">H0NEYP0T-466</a></p>
