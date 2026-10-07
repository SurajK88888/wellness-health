# Architecture Rules

- Configure Vercel to rewrite direct page requests to the SPA entry document so React Router routes remain refreshable; Vite client-side routing otherwise returns a hosting 404 on deep links.