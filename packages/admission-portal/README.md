# @jcer-erp/admission-portal

Student-facing admission portal for the JCER ERP system.

## Overview

This is a standalone Vite + React app that handles the student admission workflow:
- Student registration and login
- 7-step admission form (personal details, academic details, documents, etc.)
- Application status tracking dashboard

The package lives at `packages/admission-portal/` in the monorepo root. Its source code is located at `frontend/src/pages/admission/src/` — the Vite config uses Vite's `root` option to point directly at that directory, so no files need to be duplicated.

## Running

From the monorepo root:

```bash
# Install all workspace dependencies (one-time)
npm install

# Run only the admission portal
npm run dev:admission

# Or run everything together
npm run dev
```

The admission portal starts on **http://localhost:5174**

## Building

```bash
npm run build:admission
```

The built output is placed at `packages/admission-portal/dist/`.

## Architecture

```
packages/admission-portal/
  package.json        ← workspace package (@jcer-erp/admission-portal)
  vite.config.js      ← Vite config, root points to ../../frontend/src/pages/admission
  tailwind.config.js  ← Tailwind scoped to the admission source tree
  postcss.config.js
  eslint.config.js
  dist/               ← build output (gitignored)

frontend/src/pages/admission/   ← actual source code (stays here)
  index.html
  src/
    App.jsx
    main.jsx
    api/
    components/
    context/
    layouts/
    pages/
    utils/
```

## Environment

The axios client at `src/api/axios.js` calls `http://localhost:5000/api` in development. In production, set the `VITE_API_BASE_URL` environment variable.

## Port Layout

| Service           | Port  |
|-------------------|-------|
| Backend API       | 5000  |
| Main ERP Frontend | 5173  |
| Admission Portal  | 5174  |
