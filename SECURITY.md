# Security Policy

## Supported Versions

ThullaBoard is a single-page application with no server component. Only the current `main` branch is supported.

| Version | Supported |
| --- | --- |
| `main` (latest) | ✅ |
| Older commits | ❌ |

## Reporting a Vulnerability

**Do not open a public issue for a security problem.**

Use GitHub's private reporting channel:

👉 [Report a vulnerability privately](https://github.com/H0NEYP0T-466/ThullaCounter/security/advisories/new)

Please include:

- A description of the issue and its impact.
- Steps to reproduce, or a minimal proof of concept.
- The browser and version you tested on.
- Any suggested fix, if you have one.

If private reporting is unavailable, contact the maintainer through the GitHub profile [@H0NEYP0T-466](https://github.com/H0NEYP0T-466) and ask for a private channel before sending details.

## What to Expect

| Stage | Target |
| --- | --- |
| Acknowledgement of the report | within 3 days |
| Initial assessment and severity | within 7 days |
| Fix or mitigation for confirmed issues | within 30 days, faster for high severity |
| Public disclosure | after a fix ships, coordinated with you |

You will be credited in the advisory unless you ask otherwise.

## Scope

**In scope**

- Cross-site scripting through player names, imported JSON, or generated challan text.
- Prototype pollution or crashes reachable through a crafted `thullaboard.v1` payload or an imported backup file.
- Data loss caused by a bug in the storage layer.
- Anything that leaks data off the device — the app is meant to be fully local.

**Out of scope**

- The "Erase everything" password (`shoaib`). It is a guard against accidental taps, not an authentication mechanism. The check runs in the browser and is trivially bypassable by design; the README says so.
- Anyone with access to the unlocked device reading `localStorage`. That is the storage model.
- Missing security headers on a deployment you control.
- Denial of service through a deliberately enormous imported file.
- Vulnerabilities in third-party audio assets.

## Handling Policy

1. The report is acknowledged and reproduced on the latest `main`.
2. A severity is assigned using CVSS v3.1 as a guide.
3. A fix is prepared on a private branch, reviewed, and merged.
4. A GitHub Security Advisory is published with the affected range and the fix.
5. Credit is given to the reporter.

## Hardening Notes for Deployers

- Serve over HTTPS. Clipboard access and the audio context both behave better, and `localStorage` is origin-bound.
- The app makes no network requests at runtime except Google Fonts. If you need a strict Content Security Policy, self-host the two font families and drop the `fonts.googleapis.com` / `fonts.gstatic.com` allowances.
- Backups are plain JSON with no encryption. Treat an exported file as you would the scoreboard itself.
