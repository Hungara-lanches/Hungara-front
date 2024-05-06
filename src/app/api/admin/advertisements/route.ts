import { cookies } from "next/headers";

export async function POST(req: Request) {
  const token = cookies().get("token");
  const data = await req.formData();

  const res = await fetch(`${process.env.URL}/create-advertisement`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
    cache: "no-store",
  });
  console.log(data);

  if (!res.ok) {
    console.log(await res.text());
    return Response.json("Erro ao criar o estabelecimento", {
      status: res.status,
    });
  }

  return Response.json({
    message: "Estabelecimento criado com sucesso",
  });
}

export async function DELETE(req: Request) {
  const token = cookies().get("token");
  const { id } = await req.json();

  console.log("id", id);

  const res = await fetch(`${process.env.URL}/delete-advertisement/${+id}`, {
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
