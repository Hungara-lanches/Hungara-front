import { cookies } from "next/headers";
import { EditMonitor } from "./_componnets/edit-monitor";
import { IMonitor } from "../../../../../model/monitor";
import { IEstablishmentList } from "../../../../../model/establishment";

export default async function PlaylistDetails({
  params,
}: {
  params: { id: string };
}) {
  const monitor = await listMonitorstById(parseInt(params.id));
  const establishments = await listEstablishments();

  return (
    <>
      <header className="flex items-center gap-5 mb-10 flex-wrap">
        <h1 className="text-2xl font-bold">Atualizar {monitor.name}</h1>
      </header>
      {/* <EditMonitor monitor={monitor} establishments={establishments} /> */}
    </>
  );
}
