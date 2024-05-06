import { cookies } from "next/headers";
import { PlaylistsGrid } from "./_components/playlists-grid";
import { IEstablishmentList } from "../../../../../model/establishment";
import { MonitoresGrid } from "./_components/monitors-grid";
import { Suspense } from "react";
import { IPlaylist } from "../../../../../model/playlist";
import { FormGrid } from "./_components/form-grid";

async function listPlaylists(): Promise<IPlaylist[]> {
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

async function listMonitors() {
  const token = cookies().get("token");

  const res = await fetch(`${process.env.URL}/list-monitors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar monitores");
  }

  return res.json();
}

export default async function BoundMonitorPlaylist() {
  const playlistsData = await listPlaylists();
  const monitorsData = await listMonitors();

  const [playlists, monitors] = await Promise.all([
    playlistsData,
    monitorsData,
  ]);

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Vincular playlists aos monitores</h1>
      </header>
      <Suspense fallback="Carregando...">
        <FormGrid playlists={playlists} monitors={monitors} />
      </Suspense>
    </>
  );
}
