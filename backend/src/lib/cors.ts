// Decorates a Bun.serve routes object with CORS:
//  - adds the CORS headers to every response
//  - answers the browser's preflight OPTIONS request on each path
// Single allowed origin from env — credentialed CORS (cookies) forbids the "*" wildcard.
type Handler = (req: Bun.BunRequest) => Response | Promise<Response>;
type Routes = Record<string, Record<string, Handler>>;

export function withCors(routes: Routes): Routes {
  const origin = Bun.env.FRONTEND_ORIGIN ?? "";
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": origin,        // specific origin, never "*", because we send cookies
    "Access-Control-Allow-Credentials": "true",   // lets the browser send/receive the session cookie
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type", // the frontend sends JSON, which preflights this header
    "Vary": "Origin",
  };

  const wrapped: Routes = {};
  for (const [path, methods] of Object.entries(routes)) {
    const newMethods: Record<string, Handler> = {};
    for (const [method, handler] of Object.entries(methods)) {
      newMethods[method] = async (req) => {
        const res = await handler(req);
        for (const [k, v] of Object.entries(corsHeaders)) res.headers.set(k, v);
        return res;
      };
    }
    // Preflight: the browser fires OPTIONS before any non-simple request (POST/PATCH/DELETE + JSON).
    newMethods.OPTIONS = () => new Response(null, { status: 204, headers: corsHeaders });
    wrapped[path] = newMethods;
  }
  return wrapped;
}
