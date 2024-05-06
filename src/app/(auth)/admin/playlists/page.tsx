import { Metadata } from "next";

import { Suspense } from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { IEstablishmentList } from "../../../../model/establishment";
import { ListPlaylists } from "./_components/list-playlists";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Playlista para tocar em propagandas",
};

async function listPlaylists() {
  const token = cookies().get("token");

  const res = await fetch(`${process.env.URL}/list-playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar playlists");
  }

  return res.json();
}

export default async function Playlists({
  searchParams,
}: {
  searchParams?: {
    establishmentId?: number;
  };
}) {
  const playlists = await listPlaylists();

  return (
    <>
      <header className="flex items-center justify-between gap-5 mb-10 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Playlists</h1>
          <Button color="primary">
            <Link href="/admin/playlists/create">Cadastrar</Link>
          </Button>
        </div>
        <div>
          <Button color="primary">
            <Link href="/admin/playlists/bound-monitor-playlist">
              Vincular playlists aos monitores
            </Link>
          </Button>
        </div>
      </header>

      <Suspense fallback="Loading...">
        <ListPlaylists playlists={playlists} />
      </Suspense>
    </>
  );
}
