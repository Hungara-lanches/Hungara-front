import { cookies } from "next/headers";
import { CreateAdvertisementForm } from "../_components/create-advertisement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar propaganda",
  description: "Página para criar propagandas",
};

async function listPlaylists() {
  const token = cookies().get("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/list-playlists`, {
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
export default async function CreateAdvertisement() {
  const playlists = await listPlaylists();

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Criar propaganda</h1>
      </header>

      <CreateAdvertisementForm playlists={playlists} />
    </>
  );
}
