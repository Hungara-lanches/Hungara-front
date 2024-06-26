import { cookies } from "next/headers";
export async function POST(req: Request, res: Response) {
  const bodyResponse = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/login-monitor`,
      {
        method: "POST",
        body: JSON.stringify(bodyResponse),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const result = await response.json();
      cookies().set("token_monitor", result.token, {
        httpOnly: true,
      });
      return Response.json({ token_monitor: result.token }, { status: 200 });
    } else {
      return Response.json(
        { error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Erro ao realizar login" }, { status: 500 });
  }
}
