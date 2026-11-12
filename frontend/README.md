# Facet — Digital Product Marketplace (UI boilerplate)

The complete React frontend for **Facet**, an AI-powered marketplace for digital products: UI kits, code templates, icons, fonts, e-books, Notion templates, presets and audio.

This boilerplate runs entirely on **mock data in the browser**, so every screen works right away with no backend: browsing, search and filters, product pages, wishlist, cart, checkout, receipts, the download library, reviews, the AI shopping assistant, and the full seller studio (dashboard, analytics, product editor and AI listing generator).

It's the starting point for the full-stack tutorial, where we build the real backend with **Express, Neon Postgres, Neon Auth, Neon Object Storage, Gemini and Stripe**, then switch this UI over to it.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

- **Sign in** with any email and password, or click **Use demo account** to sign in as the owner of the *Northlight Studio* store, which has sales history in the seller dashboard.
- **Checkout** uses a demo card form: `4242 4242 4242 4242` succeeds and `4000 0000 0000 0002` is declined.
- Your changes (purchases, wishlist, reviews, listings) are saved in the browser. To start over, run `resetMockData()` in the browser console.

## How the mock works

The whole app talks to the backend through **two files**:

| File | Live mode | Mock mode (default) |
|---|---|---|
| `src/lib/api.js` | `fetch` calls to the Express API (`/api/*`, proxied by Vite) | `mockRequest()` from `src/mock/server.js` |
| `src/lib/auth.js` | Neon Auth client (`@neondatabase/auth`) | mock auth client from `src/mock/auth.js` |

Each file contains both versions: the real one commented out, the mock one active. The mock versions have the same functions, routes and response shapes as the real ones, so no page or component changes when you switch.

- `src/mock/server.js` — an in-browser version of every API route
- `src/mock/auth.js` — a stand-in for the Neon Auth client
- `src/mock/ai.js` — simple keyword rules standing in for Gemini
- `src/mock/data.json` — the demo catalog; `public/mock/` holds its cover images and avatars

## Going live

Once the backend is running on port 4000:

1. In **`src/lib/api.js`** — uncomment the `REAL` blocks (the import and `request()`), and delete the `MOCK` import and the mock `request()`.
2. In **`src/lib/auth.js`** — uncomment the `REAL` block, and delete the `MOCK` export line.
3. Delete the **`src/mock/`** and **`public/mock/`** folders.
4. Copy `.env.example` to `.env` and set `VITE_NEON_AUTH_URL` to your Neon Auth URL.

The Vite dev server already proxies `/api` to `http://localhost:4000`.

## Tech

React 19 · Vite · Tailwind CSS v4 · React Router · TanStack Query · lucide-react
