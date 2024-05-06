"use client";

import { Checkbox } from "@nextui-org/react";
import { IMonitor } from "../../../../../../../model/monitor";

interface MonitorsGridProps {
  monitors: IMonitor[];
}

export function MonitoresGrid({ monitors }: MonitorsGridProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {monitors.map((monitor) => (
        <Checkbox key={monitor.id}>
          {monitor.name} <b>{`(${monitor.establishment.name})`}</b>
        </Checkbox>
      ))}
    </div>
  );
}
