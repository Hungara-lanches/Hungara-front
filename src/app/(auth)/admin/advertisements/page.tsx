import { Button } from "@nextui-org/react";
import { cookies } from "next/headers";
import Link from "next/link";
import ListAdvertisements from "./_components/list-advertisements";
import { IAdvertisement } from "../../../../model/advertisement";

async function listAdvertisementsAdmin(): Promise<IAdvertisement[]> {
  const token = cookies().get("token");

  const res = await fetch(`${process.env.URL}/list-advertisements`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export default async function Advertisements() {
  const advertisements = await listAdvertisementsAdmin();

  return (
    <>
      <header className="flex items-center justify-between gap-5 mb-10 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Propagandas</h1>
          <Button color="primary">
            <Link href="/admin/advertisements/create">Cadastrar</Link>
          </Button>
        </div>
      </header>

      <ListAdvertisements advertisements={advertisements} />
    </>
  );
}
