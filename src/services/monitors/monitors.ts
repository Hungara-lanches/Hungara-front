import { IMonitor } from "../../model/monitor";

export async function listMonitors(): Promise<IMonitor[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/list-monitors`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
}

export async function listMonitorsEstablishmentLogin(
  establishmentId: string
): Promise<IMonitor[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/list-establishment-monitors-login?id=${establishmentId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.log(await res.text());
    // throw new Error(res.statusText);
  }

  return res.json();
}
