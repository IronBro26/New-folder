# BroSquad Static Site

A simple static website for the BroSquad community. Includes:

- Hub page (`index.html`) with sections: Chat, Fan Mail, Squad, Members list, links to Videos, Donate and Members Login.
- Fan Mail page (`fan-mail.html`) persisting messages in `localStorage`.
- Videos page (`videos.html`) linking to the YouTube channel.
- Donate page (`donate.html`) with a PayPal donate button.
- Join page (`join.html`) for membership flow with PayPal subscription link.
- Members-only page (`members-only.html`) gated via `localStorage` flag (demo only).
- Members Login/Sign-up page (`signup.html`) storing users in `localStorage` with an owner role.
- Admin page (`admin.html`) restricted to the owner email.
- 404 page (`404.html`).
- Assets in `assets/` (`logo.svg`, `member.svg`).

## Important Notes

- This project is fully static. There is no backend or database. All state is stored in the visitor's browser via `localStorage` and is not shared across devices/browsers.
- The PayPal subscription link on `join.html` redirects to PayPal but cannot verify payment automatically in a static site. As a demo, the owner email gets free access. To implement real membership, you will need a backend or a service like Stripe + webhooks + serverless functions.
- Owner email is set to `krfuchs11@icloud.com` (lowercase) in several pages — change it if needed.

## Deploy to Vercel

Option A — GitHub import (recommended):

1. Create a new GitHub repository and push this folder to it.
2. Go to https://vercel.com/new and import your repo.
3. Framework Preset: "Other" (static).
4. Root Directory: the repo root (contains `index.html`).
5. Build Command: none. Output: `.`
6. Deploy.

Option B — Vercel CLI:

1. Install Node.js (https://nodejs.org/) if you don't have it.
2. Install Vercel CLI: `npm i -g vercel`.
3. From this folder, run:
   - `vercel login`
   - `vercel` (first deploy, follow prompts)
   - `vercel --prod` (production deploy)

The included `vercel.json` config enables clean URLs and long-term caching for assets.

## Customize

- Replace images in `assets/` with your own. Update paths if needed.
- Update the PayPal IDs/links in `donate.html` and `join.html`.
- Adjust colors and text in each page's `<style>` section.

## Development

Just open `index.html` in a browser to test locally. Because we use `localStorage`, testing in private browsing mode will isolate data.

## License

MIT
