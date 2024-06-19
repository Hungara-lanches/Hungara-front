import { cookies } from "next/headers";
import { IMeMonitor } from "../../../../model/monitor";
import { AdvertisementGrid } from "../_components/advertisement-grid";
import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Propagandas",
  description: "Propagandas exibidas no monitor",
};

async function getMe(): Promise<IMeMonitor> {
  const token = cookies().get("token_monitor");
  const monitorAuth = cookies().get("monitor_auth");

  if (!token && !monitorAuth) {
    throw new Error("Not authorized");
  }

  const validToken = token?.value ? token?.value : monitorAuth?.value;

  const revalidateTime = 15 * 60 * 1000; // 15 min

  const monitorInfo = await fetch(`${process.env.NEXT_PUBLIC_URL}/me-monitor`, {
    headers: {
      Authorization: `Bearer ${validToken}`,
    },

    next: {
      revalidate: revalidateTime,
    },
  });

  if (!monitorInfo.ok) {
    console.log(await monitorInfo.json());
    throw new Error(monitorInfo.statusText);
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
