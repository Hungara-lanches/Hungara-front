import { Metadata } from "next";

import { Suspense } from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { IEstablishmentList } from "../../../../model/establishment";
import { FilterMonitors } from "./_components/filter-monitors";
import ListMonitors from "./_components/list-monitors";

export const metadata: Metadata = {
  title: "Monitores",
  description: "Listagem de todos os monitores",
};

async function listEstablishments(): Promise<IEstablishmentList> {
  const token = cookies().get("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishments-admin?page=1&page_size=1000`,
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

async function listMonitorEstablishment(establishmentId: number) {
  const token = cookies().get("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishment-monitors?id=${establishmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar monitores do estabelecimento");
  }

  return res.json();
}

export default async function Monitors({
  searchParams,
}: {
  searchParams?: {
    establishmentId?: number;
  };
}) {
  const establishmentId = searchParams?.establishmentId || 1;

  const establishments = await listEstablishments();

  const monitorsEstablishment = await listMonitorEstablishment(establishmentId);

  console.log(establishments);

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Monitores</h1>
        <Button color="primary">
          <Link href="/admin/monitors/create">Cadastrar</Link>
        </Button>
      </header>

      <div className="flex justify-end w-full">
        <div className="max-w-80 w-full">
          <Suspense fallback="Carregando...">
            <FilterMonitors establishments={establishments} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback="Loading...">
        <ListMonitors monitors={monitorsEstablishment} />
      </Suspense>
    </>
  );
}
