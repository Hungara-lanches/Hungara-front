"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { IEstablishmentList } from "../../../../../../model/establishment";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FilterMonitorsProps {
  establishments: IEstablishmentList;
}

export function FilterMonitors({ establishments }: FilterMonitorsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = (event.target as HTMLSelectElement).value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("establishmentId", value);
    } else {
      params.delete("establishmentId");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      defaultSelectedKeys={
        (searchParams.get("establishmentId") as string) || "1"
      }
      onChange={(e) => handleSelectChange(e)}
      label="Selecione um estabelecimento"
    >
      {establishments?.establishments.map((establishment) => (
        <SelectItem key={establishment.id}>{establishment.name}</SelectItem>
      ))}
    </Select>
  );
}
