# Pixel Perfect Pixels

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pixel-perfect-view-6291.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/549cf0a0-8c31-4a5e-97fe-fe4d3d3cf11e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Orders → Google Sheet

Checkout sends each order to a Google Apps Script web app, which adds a row to a Google Sheet
(with a status column to follow up: Appelée, Confirmée, Expédiée…) and emails the shop.

1. Create a Google Sheet → **Extensions → Apps Script**, paste
   [`scripts/orders-google-sheet.gs`](scripts/orders-google-sheet.gs), and set `SECRET` to a long
   random password.
2. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*. Copy the URL.
3. In Vercel → Project → **Settings → Environment Variables**, add (Production and Preview),
   then redeploy:
   - `ORDERS_WEBHOOK_URL`: the web app URL
   - `ORDERS_WEBHOOK_SECRET`: the same password as `SECRET`

Until both are set, checkout shows an error and asks customers to call. To run locally:

```sh
ORDERS_WEBHOOK_URL=… ORDERS_WEBHOOK_SECRET=… npm run dev
```

## Adding or editing products

Go to **www.noauma.ma/admin** and click **Sign In with Token**. On GitHub, create a
*fine-grained* token: Repository access → **Only select repositories** → this repository,
permission **Contents: Read and write**, and an expiry date. Paste it in; it is remembered in that
browser only.

Good to know: renaming a color changes its id, so carts already holding the old color lose it. A
product with invalid data (e.g. no photo) is hidden from the shop rather than breaking it.

Each product is one JSON file in `src/content/products/` and its photos go in
`public/images/products/` (converted to WebP on upload). Saving in the admin commits to `main`;
Vercel redeploys in a few minutes. The editor is configured in `public/admin/config.yml`.
