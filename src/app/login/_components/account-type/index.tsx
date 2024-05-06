import { Radio, RadioGroup } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";

interface AccountTypeProps {
  register: any;
  getValues: any;
  searchParams: URLSearchParams;
  pathname: string;
  replace: any;
}

export default function AccountType({
  replace,
  register,
  searchParams,
  getValues,
}: AccountTypeProps) {
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (getValues("accountType") === "admin") {
      params.set("accountType", "admin");
    } else {
      params.set("accountType", "monitor");
    }

    replace(`${pathname}?${params.toString()}`);
  }, []);

  const handleSelectAccountType = (e: ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const accountType = e.target.value;
    if (accountType === "admin") {
      params.set("accountType", "admin");
      params.delete("establishmentId");
    } else {
      params.set("accountType", "monitor");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <RadioGroup
      className="mb-5"
      orientation="horizontal"
      label="Selecione o tipo de conta"
      {...register("accountType")}
      onChange={(e) => handleSelectAccountType(e)}
      defaultValue={searchParams.get("accountType") || "admin"}
    >
      <Radio value="admin">Administrador</Radio>
      <Radio value="monitor">Monitor</Radio>
    </RadioGroup>
  );
}
