import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = cookies().get("token");
  const data = await req.json();

  const res = await fetch(`${process.env.URL}/assign-playlists-to-monitors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 400) {
    return Response.json(await res.text(), {
      status: 400,
    });
  }
  return Response.json("Playlist criada com sucesso", data);
}
