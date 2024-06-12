import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  const token = cookies().get("token");

  const id = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/generate-monitor-token/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      cookies().set("monitor_auth", result.monitor_auth);
      return Response.json(result, { status: 200 });
    } else {
      return Response.json(
        { error: "Erro ao retornar o token" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Erro ao gerar o token" }, { status: 500 });
  }
}
