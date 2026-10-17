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
3. Set two server secrets in the hosting environment (Lovable project settings):
   - `ORDERS_WEBHOOK_URL`: the web app URL
   - `ORDERS_WEBHOOK_SECRET`: the same password as `SECRET`

Until both are set, checkout shows an error and asks customers to call. To run locally:

```sh
ORDERS_WEBHOOK_URL=… ORDERS_WEBHOOK_SECRET=… npm run dev
```
