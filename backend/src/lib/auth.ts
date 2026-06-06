//TEMP: until real session exists, id comes from x-user-id header.
// When auth is done, swap this function body
export async function getUserId(req: Bun.BunRequest): Promise<string | null> {
  return req.headers.get("x-user-id")
}
