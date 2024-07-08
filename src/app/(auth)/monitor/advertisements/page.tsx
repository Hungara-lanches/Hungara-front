import { cookies } from "next/headers";
import { IMeMonitor } from "../../../../model/monitor";
import { AdvertisementGrid } from "../_components/advertisement-grid";
import { Metadata } from "next";
import { Suspense } from "react";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Propagandas",
  description: "Propagandas exibidas no monitor",
};

async function deleteCookie() {
  "use server";

  cookies().delete("token_monitor");
}

async function getMe(): Promise<IMeMonitor> {
  unstable_noStore();

  const token = cookies().get("token_monitor");
  const monitorAuth = cookies().get("monitor_auth");

  if (!token && !monitorAuth) {
    throw new Error("Not authorized");
  }

  const validToken = token?.value ? token?.value : monitorAuth?.value;

  const monitorInfo = await fetch(`${process.env.NEXT_PUBLIC_URL}/me-monitor`, {
    headers: {
      Authorization: `Bearer ${validToken}`,
    },
    cache: "no-store",
  });

  if (!monitorInfo.ok) {
    throw new Error(monitorInfo.statusText);
  }
  return monitorInfo.json();
}

async function getMeActive(): Promise<{
  user: {
    id: number;
    isLogged: boolean;
  };
}> {
  unstable_noStore();

  const token = cookies().get("token_monitor");
  const monitorAuth = cookies().get("monitor_auth");

  if (!token && !monitorAuth) {
    throw new Error("Not authorized");
  }

  const validToken = token?.value ? token?.value : monitorAuth?.value;

  const monitorInfo = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/me-monitor-active`,
    {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
      cache: "no-store",
    }
  );

  if (!monitorInfo.ok) {
    throw new Error(monitorInfo.statusText);
  }
  return monitorInfo.json();
}

export default async function Advertisements() {
  const monitor = await getMe();

  const active = await getMeActive();

  return (
    <>
      <div className="w-screen h-screen">
        <Suspense fallback="Carregando...">
          <AdvertisementGrid
            deleteCookie={deleteCookie}
            monitor={monitor}
            active={active}
          />
        </Suspense>
      </div>
    </>
  );
}
