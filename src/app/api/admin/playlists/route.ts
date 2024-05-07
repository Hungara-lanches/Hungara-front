import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = cookies().get("token");
  const data = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/create-playlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return Response.json({
    message: "Playlist criada com sucesso",
    data,
  });
}
