import { cookies } from "next/headers";

export function GET() {
  const token = cookies().get("token");
  if (token) {
    cookies().delete("token");
    return new Response("Token deleted", { status: 200 });
  } else {
    return new Response("No token found", { status: 400 });
  }
}
