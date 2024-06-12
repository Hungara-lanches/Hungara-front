import { cookies } from "next/headers";
import { IMeMonitor } from "../../../../model/monitor";
import { AdvertisementGrid } from "../_components/advertisement-grid";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Propagandas",
  description: "Propagandas exibidas no monitor",
};

async function getMe(): Promise<IMeMonitor> {
  const token = cookies().get("token_monitor");

  if (!token) {
    throw new Error("Not authorized");
  }

  const revalidateTime = 15 * 60 * 1000; // 15 min

  const monitorInfo = await fetch(`${process.env.NEXT_PUBLIC_URL}/me-monitor`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    cache: "no-store",
    next: {
      revalidate: revalidateTime,
    },
  });

  if (!monitorInfo.ok) {
    throw new Error("An error occurred while fetching monitor info");
  }
  return monitorInfo.json();
}

export default async function Advertisements() {
  const monitor = await getMe();

  return (
    <>
      <div className="w-screen h-screen">
        <Suspense fallback="Carregando...">
          <AdvertisementGrid monitor={monitor} />
        </Suspense>
      </div>
    </>
  );
}
