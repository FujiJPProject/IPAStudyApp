---
name: deploy-readiness
description: Verify that the Vue/Vite MVP is ready for Cloudflare Pages static deployment without actually deploying, pushing to GitHub, or changing Cloudflare settings.
---

# Deploy Readiness

## Required Context

Read:

1. `AGENTS.md`
2. `.agents/roles/release-auditor.md`
3. `doc/architecture.md`
4. package.json
5. package-lock.json
6. vite.config.ts if present
7. Vue Router configuration
8. README.md
9. integration Review

---

## Deployment Assumptions

Use the deployment assumptions defined by `architecture.md`.

Expected MVP configuration:

```text
Hosting:
Cloudflare Pages

Production branch:
main

Build command:
npm run build

Build output directory:
dist

Backend:
none

Pages Functions:
none
```

---

## Procedure

### Clean Install

If `package-lock.json` exists, run:

```bash
npm ci
```

### Test

Run:

```bash
npm run test
```

### Build

Run:

```bash
npm run build
```

Verify:

- build succeeds
- `dist/` exists
- `dist/index.html` exists
- asset paths are valid for the intended root deployment
- Vite base configuration is compatible with the architecture

### Production Preview

When useful, run:

```bash
npm run preview
```

Use it only for local production-build verification.

### Router

Verify architecture-defined routing behavior, including:

- HTML5 History Mode
- `/materials`
- `/materials/sort-visualizer`
- `/history`
- unknown route handling
- direct URL access assumptions
- Cloudflare Pages SPA behavior described by architecture.md

Check that repository output does not unintentionally conflict
with the chosen SPA fallback strategy.

### Repository Safety

Verify:

- package-lock.json exists
- `.gitignore` is appropriate
- no secrets are committed
- no local-only paths are required
- obvious temporary debug code is absent

### README

Verify documentation for:

```bash
npm ci
npm run dev
npm run test
npm run build
```

Verify Cloudflare Pages configuration is documented:

```text
Build command: npm run build
Build output directory: dist
```

---

## Forbidden Actions

Do not:

- deploy to Cloudflare Pages
- push to GitHub
- change Cloudflare settings
- change DNS

---

## Modification Rule

Do not modify application code.

The only permitted write is:

```text
.agents/reviews/deploy-readiness-review.md
```

---

## Output

Write:

```text
.agents/reviews/deploy-readiness-review.md
```

Include:

- Deployable: Yes / No
- Critical / High / Medium / Low findings
- mandatory changes before deployment
- Cloudflare Pages configuration values

