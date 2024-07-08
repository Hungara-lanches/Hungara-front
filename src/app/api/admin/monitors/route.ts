import { cookies } from "next/headers";

export async function GET(req: Request) {
  const token = cookies().get("token_monitor");
  const monitorAuth = cookies().get("monitor_auth");

  if (!token && !monitorAuth) {
    throw new Error("Not authorized");
  }

  const validToken = token?.value ? token?.value : monitorAuth?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/me-monitor-active`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${validToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json("Erro ao buscar os monitores" + (await res.text()), {
      status: res.status,
    });
  }

  return Response.json(await res.json());
}

export async function POST(req: Request) {
  const token = cookies().get("token");
  const data = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/create-monitor`, {
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

export async function PATCH(req: Request) {
  const token = cookies().get("token");
  const data = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/update-monitor`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json("Erro ao atualizar o monitor" + (await res.text()), {
      status: res.status,
    });
  }

  return Response.json({
    message: "Monitor atualizado com sucesso",
    data,
  });
}

export async function DELETE(req: Request) {
  const token = cookies().get("token");
  const { id } = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/delete-monitor/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  if (!res.ok) {
    return Response.json("Erro ao deletar o monitor" + (await res.text()), {
      status: res.status,
    });
  }

  return Response.json({
    message: "Monitor deletado com sucesso",
  });
}
