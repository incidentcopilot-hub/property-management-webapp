# Property Management Webapp

Starter scaffold for a property management MVP targeted at private landlords. Built with React, Vite, TypeScript, and React Router to quickly iterate on features like property tracking, tenant organization, and task workflows.

## Getting started

All frontend commands are run from within the `frontend/` directory.

1. Install dependencies inside the frontend app (Node.js 18+ recommended):
   ```bash
   cd frontend && npm install
   ```
2. Run the dev server (default at http://localhost:5173):
   ```bash
   npm run dev
   ```
3. Lint the project:
   ```bash
   npm run lint
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Configure API base URL (optional). Create `frontend/.env` or `.env.local` with:
   ```bash
   VITE_API_URL=http://localhost:4000/api
   ```

## Backend (API)

Run these commands from `backend/`:

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```
2. Start in watch mode (ts-node-dev):
   ```bash
   npm run dev
   ```
3. Build TypeScript to `dist/`:
   ```bash
   npm run build
   ```
4. Run the built server (default at http://localhost:4000):
   ```bash
   npm start
   ```

## Run frontend + backend together

After installing dependencies in both `frontend/` and `backend/`, you can start both dev servers from the repo root:

```bash
npm run dev
```

## Repository layout

- `frontend/` – Frontend application (Vite + React) with routes, components, and styles.
- `backend/` – Placeholder Node/TypeScript backend package for future APIs.
- `infra/` – IaC and deployment scaffolding.
- `docs/` – Architecture notes and product documentation.

## Project structure

- `frontend/src/App.tsx` – Shell layout with navigation and high-level routes.
- `frontend/src/features/` – Domain-first folders (`dashboard`, `properties`, `units`, `tenants`) holding their pages, domain components, and API helpers.
- `frontend/src/components/` – Shared UI pieces such as summary cards, slide-overs, and task lists.
- `frontend/src/services/` – Cross-feature utilities like the API client.
- `frontend/src/styles.css` – Lightweight design system for the MVP.

## Development tips

- Use `npm run preview` after building to validate the production bundle locally.
- ESLint is configured to fail on warnings; fix lint issues before pushing.
- React Router is already wired for `/`, `/properties`, and `/tenants`; add new routes in `src/pages/` and register them in `src/App.tsx`.

This scaffold is intentionally lightweight so you can plug in data sources, auth, and design tokens as the product evolves.
