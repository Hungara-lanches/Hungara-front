import { cookies } from "next/headers";
import { IEstablishmentList } from "../../model/establishment";

export async function listEstablishments(): Promise<IEstablishmentList> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishments`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}
