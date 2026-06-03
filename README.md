# Baby Activity Tracker

Mobile-first MVP for logging newborn feeding, diaper, sleep, and pumping activity.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. If that port is busy, Next.js will use the next available port.

## Backend Setup

The app runs in demo mode when Supabase env vars are missing. To enable real persistence and Google auth:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5. In Supabase Auth providers, enable Google OAuth.
6. Add the site callback URL:

```text
http://localhost:3000/auth/callback
```

Use your deployed domain callback in production.

## Checks

```bash
npm run lint
npm run build
```
