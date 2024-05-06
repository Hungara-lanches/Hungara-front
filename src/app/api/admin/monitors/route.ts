import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = cookies().get("token");
  const data = await req.json();

  const res = await fetch(`${process.env.URL}/create-monitor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json("Erro ao criar o monitor" + (await res.text()), {
      status: res.status,
    });
  }

  return Response.json({
    message: "Monitor criado com sucesso",
    data,
  });
}

export async function DELETE(req: Request) {
  const token = cookies().get("token");
  const { id } = await req.json();

  const res = await fetch(`${process.env.URL}/delete-monitor/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json("Erro ao deletar o monitor" + (await res.text()), {
      status: res.status,
    });
  }

  return Response.json({
    message: "Monitor deletado com sucesso",
  });
}
