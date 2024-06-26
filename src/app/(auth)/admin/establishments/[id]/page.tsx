import { cookies } from "next/headers";
import { IEstablishment } from "../../../../../model/establishment";
import { EditEstablishment } from "./_components/edit-establishment";
import { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = +params.id;

  const data = await listEstablishmentById(id);

  return {
    title: "Atualizar" + " " + data.name,
    description: data.name,
  };
}

async function listEstablishmentById(id: number): Promise<IEstablishment> {
  const token = cookies().get("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishment/${id}`,
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

export default async function EstablishmentDetails({
  params,
}: {
  params: { id: string };
}) {
  const establishment = await listEstablishmentById(parseInt(params.id));

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Atualizar {establishment.name}</h1>
      </header>
      <EditEstablishment establishment={establishment} />
    </>
  );
}
