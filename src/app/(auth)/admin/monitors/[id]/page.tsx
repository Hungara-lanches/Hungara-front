import { cookies } from "next/headers";
import { EditMonitor } from "./_componnets/edit-monitor";
import { IMonitor } from "../../../../../model/monitor";
import { IEstablishmentList } from "../../../../../model/establishment";

async function listMonitorstById(id: number): Promise<IMonitor> {
  const token = cookies().get("token");

  const res = await fetch(`${process.env.URL}/list-monitor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    Response.json("Erro ao listar o estabelecimento", {
      status: res.status,
    });
  }

  return res.json();
}

async function listEstablishments(): Promise<IEstablishmentList> {
  const token = cookies().get("token");

  const res = await fetch(
    `${process.env.URL}/list-establishments-admin?page=1&page_size=1000`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    Response.json("Erro ao listar o estabelecimento", {
      status: res.status,
    });
  }

  return res.json();
}

export default async function MonitorDetails({
  params,
}: {
  params: { id: string };
}) {
  const monitor = await listMonitorstById(parseInt(params.id));
  const establishments = await listEstablishments();

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Atualizar {monitor.name}</h1>
      </header>
      <EditMonitor monitor={monitor} establishments={establishments} />
    </>
  );
}
