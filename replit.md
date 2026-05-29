# My Workspace

A personal cloud file storage app — login with your account, upload files and folders, and everything stays there permanently.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Clerk (Replit-managed)
- File Storage: Google Cloud Storage (Replit Object Storage) with presigned URL uploads
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React 19, Vite, Tailwind v4, shadcn/ui, wouter

## Where things live

- DB schema: `lib/db/src/schema/files.ts`
- API spec: `lib/api-spec/openapi.yaml`
- API routes: `artifacts/api-server/src/routes/`
  - `files.ts` — file/folder CRUD and storage stats
  - `storage.ts` — presigned upload URL + object serving
- Frontend: `artifacts/workspace/src/`
  - `pages/home.tsx` — landing page
  - `pages/drive.tsx` — main workspace (file browser, uploads, folders)
  - `pages/sign-in.tsx` / `sign-up.tsx` — Clerk auth pages

## Architecture decisions

- Files are stored in Google Cloud Storage (via Replit Object Storage); only metadata (name, size, mimeType, objectPath) lives in PostgreSQL.
- File uploads use presigned URLs: client requests a URL from `/api/storage/uploads/request-url`, PUTs the file directly to GCS, then registers the file with `/api/files`.
- Clerk auth is proxied through the Express server for production compatibility. Session is cookie-based — no bearer tokens needed on the frontend.
- The `filesTable` has a `parentId` column for folder hierarchy; `null` parentId means root level.
- All file/folder operations require `requireAuth()` and are scoped to `userId` from Clerk.

## Product

- Landing page explains the product and links to sign-in/sign-up
- After login, users land in `/drive` — a file browser showing their files and folders
- Users can upload any file type, create folders, rename and delete items
- Storage stats (total files, folders, bytes used, recent files) shown in sidebar
- Folder navigation via breadcrumbs (drill into folders by parentId)
- File download via direct link to `/api/storage/objects/:objectPath`

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Run `pnpm --filter @workspace/db run push` after changing the DB schema
- The Clerk proxy middleware must be mounted BEFORE body parsers in `app.ts`
- `zod/v4` subpath can't be resolved by esbuild — use `import { z } from "zod"` in server code

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
