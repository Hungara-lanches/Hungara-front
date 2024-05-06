import { cookies } from "next/headers";
import { IMeMonitor } from "../../../../model/monitor";
import { AdvertisementGrid } from "../_components/advertisement-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propagandas",
  description: "Propagandas exibidas no monitor",
};

export async function getMe(): Promise<IMeMonitor> {
  const token = cookies().get("token");

  if (!token) {
    throw new Error("Not authorized");
  }

  const monitorInfo = await fetch(`${process.env.URL}/me-monitor`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    cache: "no-store",
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
        <AdvertisementGrid monitor={monitor} />
      </div>
    </>
  );
}
