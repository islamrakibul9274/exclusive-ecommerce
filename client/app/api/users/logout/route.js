import { sessionCookie } from "../../../../src/lib/auth";
export async function POST() {
  return Response.json(
    { message: "Signed out." },
    { headers: { "Set-Cookie": sessionCookie("", 0) } },
  );
}
