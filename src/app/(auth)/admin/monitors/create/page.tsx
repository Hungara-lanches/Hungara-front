import { cookies } from "next/headers";
import CreateMonitorForm from "../_components/create-monitor";
import { IEstablishmentList } from "../../../../../model/establishment";

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
    throw new Error("Erro ao buscar estabelecimentos");
  }

  return res.json();
}

export default async function CreateMonitor() {
  const establishments = await listEstablishments();

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Criar monitor</h1>
      </header>

      <CreateMonitorForm establishments={establishments} />
    </>
  );
}
