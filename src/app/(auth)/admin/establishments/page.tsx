import { Metadata } from "next";

import { Suspense } from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { cookies } from "next/headers";
import ListEstablishments from "./_components/list-establishments";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Estabelecimentos",
  description: "Listagem de todos os estabelecimentos",
};

async function listEstablishmentsAdmin(page: number) {
  unstable_noStore();
  const pageSize = 10;

  const token = cookies().get("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishments-admin?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return Response.json("Erro ao listar os estabelecimentos", {
      status: res.status,
    });
  }

  return res.json();
}

export default async function Establishments({
  searchParams,
}: {
  searchParams?: {
    page?: number;
  };
}) {
  const page = searchParams?.page || 1;

  const establishments = await listEstablishmentsAdmin(page);

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Estabelecimentos</h1>
        <Button color="primary">
          <Link href="/admin/establishments/create">Cadastrar</Link>
        </Button>
      </header>
      <Suspense fallback="Loading...">
        <ListEstablishments establishments={establishments} />
      </Suspense>
    </>
  );
}
