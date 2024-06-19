import { cookies } from "next/headers";

export async function GET(req: Request) {
  const data = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/code-relation/${data.qrCode}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return Response.json("Erro ao buscar relacionamento" + (await res.text()), {
      status: res.status,
    });
  }

  const responseBody = await res.json();
  cookies().set("monitor_auth", responseBody.token);

  return Response.json(await res.json());
}

export async function POST(req: Request) {
  const token = cookies().get("token");

  const data = await req.json();

  console.log(data);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/relate-code-to-monitor`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return Response.json("Erro ao relacionar" + (await res.text()), {
      status: res.status,
    });
  }

  return Response.json({
    message: "Success",
    data,
  });
}
