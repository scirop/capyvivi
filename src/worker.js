import { catalog } from "../functions/_lib/catalog.js";
import { corsHeaders } from "../functions/_lib/cors.js";

function buildStripeBody({ product, quantity, successUrl, cancelUrl }) {
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  params.set("line_items[0][quantity]", String(quantity));
  params.set("line_items[0][price_data][currency]", product.currency);
  params.set("line_items[0][price_data][unit_amount]", String(product.amount));
  params.set("line_items[0][price_data][product_data][name]", product.name);
  params.set("line_items[0][price_data][product_data][description]", product.description);
  params.set("shipping_address_collection[allowed_countries][0]", "US");
  return params.toString();
}

async function handleCatalog(request) {
  const origin = request.headers.get("origin");
  return new Response(JSON.stringify({ products: Object.values(catalog) }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function handleCreateCheckoutSession(request, env) {
  const origin = request.headers.get("origin");

  if (!env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  try {
    const body = await request.json();
    const product = catalog[body.productId];
    const quantity = Math.min(Math.max(Number(body.quantity) || 1, 1), 10);

    if (!product) throw new Error("Invalid product");

    const url = new URL(request.url);
    const successUrl = `${url.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${url.origin}/cancel.html`;

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buildStripeBody({ product, quantity, successUrl, cancelUrl }),
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok || !stripeData.url) {
      throw new Error(stripeData.error?.message || "Stripe session creation failed");
    }

    return new Response(JSON.stringify({ url: stripeData.url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, method } = url;
    const reqMethod = request.method;

    // CORS preflight
    if (reqMethod === "OPTIONS") {
      const origin = request.headers.get("origin");
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (pathname === "/api/catalog" && reqMethod === "GET") {
      return handleCatalog(request);
    }

    if (pathname === "/api/create-checkout-session" && reqMethod === "POST") {
      return handleCreateCheckoutSession(request, env);
    }

    // Fall back to static assets
    if (!env.ASSETS) {
      return new Response("Not found", { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};
