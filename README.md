# Happy-bara Coloring Book Store

Simple, colorful kids-friendly ecommerce storefront with Stripe test checkout on Cloudflare Pages Functions.

## Features

- Single product ecommerce flow for a physical book
- Modular frontend: separate HTML, CSS, and JavaScript files
- Stripe hosted Checkout in test mode
- Cloudflare Pages Functions endpoint for secure server-side checkout session creation
- Required attribution and footer copy included

## Project structure

- `index.html` main storefront page
- `styles/main.css` colorful playful visual style
- `scripts/catalog.js` storefront product catalog data
- `scripts/cart.js` cart model and quantity logic
- `scripts/app.js` rendering and checkout action wiring
- `functions/api/create-checkout-session.js` Stripe Checkout session creation endpoint
- `functions/api/catalog.js` product API example
- `success.html` and `cancel.html` post-checkout pages

## Stripe auth keys

1. Go to Stripe Dashboard.
2. Open Developers > API keys.
3. Copy your test secret key (`sk_test_...`).
4. Local dev: add it to `.dev.vars`.
5. Cloudflare deployment: add `STRIPE_SECRET_KEY` in your Pages project settings under Environment Variables for each environment.

Never expose the secret key in frontend files.

## Local development

1. Install dependencies:
   npm install
2. Create local env file:
   cp .dev.vars.example .dev.vars
3. Put your `sk_test_...` value in `.dev.vars`.
4. Start local server:
   npm run dev

## Stripe test card

Use test card number `4242 4242 4242 4242` with any valid future date, any CVC, any ZIP.

## Deploy on Cloudflare Pages

1. Create or open your Cloudflare Pages project.
2. Set build command empty (not required), output directory `.`.
3. Enable Functions from the `functions/` directory.
4. Add env var `STRIPE_SECRET_KEY` with your Stripe test key.
5. Deploy.

## Required credits

- Book creator attribution: Victoria (Vivi) Jacobs
- Footer note: Created with joy in Philadelphia, PA and Round Rock, TX
