import { catalog } from "../_lib/catalog.js";
import { corsHeaders } from "../_lib/cors.js";

export const onRequestGet = async ({ request }) => {
  const origin = request.headers.get("origin");
  return new Response(JSON.stringify({ products: Object.values(catalog) }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin)
    }
  });
};
