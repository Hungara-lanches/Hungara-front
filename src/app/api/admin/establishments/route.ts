import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = cookies().get("token");
  const data = await req.json();

  const res = await fetch(`${process.env.URL}/create-establishment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json("Erro ao criar o estabelecimento", {
      status: res.status,
    });
  }

  return Response.json({
    message: "Estabelecimento criado com sucesso",
    data,
  });
}

export async function PATCH(req: Request) {
  const token = cookies().get("token");
  const { id, ...data } = await req.json();

  const res = await fetch(`${process.env.URL}/update-establishment/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json("Erro ao atualizar o estabelecimento", {
      status: res.status,
    });
  }

  return Response.json({
    message: "Estabelecimento atualizado com sucesso",
    data,
  });
}

export async function DELETE(req: Request) {
  const token = cookies().get("token");
  const { id } = await req.json();

  console.log(id);

  const res = await fetch(`${process.env.URL}/delete-establishment/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.log(await res.text());
    return Response.json("Erro ao deletar o estabelecimento", {
      status: res.status,
    });
  }

  return Response.json({
    message: "Estabelecimento deletado com sucesso",
  });
}
