# Codebase Map

npm workspaces monorepo at `/home/${username}/websites/${sandboxId}/public_html`. The web app ships standalone. Call `enable_pocketbase_integration` to add a database, or `enable_api_server_integration` to add an Express backend — each tool appends its own `## apps/<service>` section to this file.

## apps/web (React + Vite + Tailwind + shadcn/ui, port 3000)

Located at apps/web/. Run: `cd apps/web && npm run dev` (auto-started by the sandbox supervisor).
src/main.jsx — entry point, mounts <App />
src/App.jsx — React Router, all routes defined here
src/index.css — Tailwind theme, CSS variables, white/black/gold luxury color scheme
src/pages/HomePage.jsx — "/" route, hero section, featured products, shop grid, cart drawer
src/pages/AdminPage.jsx — "/admin" route, product management (create, edit, delete)
src/components/ScrollToTop.jsx — resets scroll on route change
src/components/ui/ — shadcn/ui primitives — import from `@/components/ui/<name>`, do not edit the files
src/hooks/use-mobile.jsx — mobile breakpoint detection
src/hooks/use-toast.js — toast notifications
src/lib/utils.js — cn() Tailwind class merge
src/lib/config.js — WhatsApp business number and app configuration
src/lib/pocketbaseClient.js — PocketBase SDK client (web-side); usage: `import pocketbaseClient from '@/lib/pocketbaseClient'`
src/lib/CartContext.jsx — cart state management, checkout to WhatsApp integration
vault/wiki/skills/design/SKILL.md — frontend craft, styling, typography, motion, and shadcn policy for UI surfaces.
apps/web/plugins/session-journal/ — infrastructure, DO NOT edit. Vite dev plugin injects the browser session journal client; events go over HMR (`import.meta.hot.send('session-journal:event', …)`); the plugin arranges persistence under `vault/temp/SESSION_JOURNAL.md`.
Routes: / → HomePage, /admin → AdminPage


## apps/pocketbase (PocketBase binary + SQLite, port 8090)
Located at apps/pocketbase/. Binary at apps/pocketbase/pocketbase. Dashboard: http://localhost:8090/_/, API: http://localhost:8090/api/
Data: apps/pocketbase/pb_data/ (auto-generated, gitignored).
Migrations: apps/pocketbase/pb_migrations/ — JS files; each exports `migrate(db, app) => { ... }`.
pb_migrations/1783213071_create_products.js — creates products collection with fields: name, description, category, price, image, stock
Server-side event hooks: apps/pocketbase/pb_hooks/*.pb.js — fire on record / mailer / request events.
Run: `cd apps/pocketbase && npm run dev` (auto-started by the sandbox supervisor).

apps/web/src/lib/pocketbaseClient.js — PocketBase SDK client (web-side); usage: `import pocketbaseClient from '@/lib/pocketbaseClient'`.

PocketBase skill: load `pocketbase/SKILL.md` first (the hub). Sub-references at `pocketbase/references/`: ACCESS_RULES, ADD_FIELD, CREATE_AUTH_COLLECTION, CREATE_COLLECTION, DELETE_COLLECTION, DELETE_RECORDS, FIELD_TYPES, HOOKS, INDEXES, MFA, MIGRATIONS, OAUTH_PROVIDERS, OTP_AUTH, RAW_SQL, RECORD_OPERATIONS, REMOVE_FIELD, RENAME_COLLECTION, RENAME_FIELD, SEED_DATA, UPDATE_FIELD, UPDATE_INDEXES, UPDATE_RECORDS, UPDATE_RULES, USING_IN_REACT — read the relevant one before any pocketbase change.
