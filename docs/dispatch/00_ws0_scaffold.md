# WS-0 Scaffold (dispatch brief)

Objective: stand up the `mox_demo` skeleton so every other workstream has a place to build. Foundation. No product features yet.

Read first: `README.md`, `docs/property_ground_truth.md`.

Deliverables:
- `/frontend`: Next.js app, deployable to Vercel. A placeholder landing route that builds and deploys clean. Set up for client components, an APS viewer dependency slot, and a component-library directory.
- `/backend`: a small service (Node or Python, builder's call, match what the extraction-map repos use for easiest reuse) that will host the engine and the atom store. A health route and a stub read API.
- Shared types: wire in `@hauska/atom-contract` so both frontend and backend consume the contract atom shapes.
- `/data`: an empty fixtures directory with a README noting the atom JSON shape (per the contract).
- Config: `.env.example` listing the needed keys (APS_CLIENT_ID, APS_CLIENT_SECRET, LLM_API_KEY, etc.) with empty values. A real `.env` is gitignored.
- `.gitignore`: exclude `.env`, `node_modules`, build output, and the heavy assets under `apartment_bldg/`.
- Update `README.md` run instructions with the real commands.

Acceptance:
- Frontend deploys to Vercel (a live URL).
- Backend runs locally with a passing health check.
- `@hauska/atom-contract` types import and typecheck.
- `.env.example` present; no secret is committed.
- `apartment_bldg/` is gitignored.

Guardrails (hard):
- Never commit secrets. Not the APS client secret, not the LLM key, not the Autodesk account password (which is never used by the API at all). If a secret is needed, read it from `.env`.
- Do not commit the heavy assets.

Repos to reference: `hauska-atom-contract` (the contract package and its types).
