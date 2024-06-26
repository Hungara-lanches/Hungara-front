"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { MdiPassword } from "../../../../components/Icons/Password";
import { IMonitor } from "../../../../model/monitor";
import { IEstablishmentList } from "../../../../model/establishment";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import AccountType from "../account-type";
import toast from "react-hot-toast";

import { useQRCode } from "next-qrcode";

import { setCookie } from "cookies-next";

interface FormMonitorProps {
  monitors: IMonitor[];
  establishments: IEstablishmentList;
  qrCode: string;
}

declare const ActiveXObject: {
  new (s: string): any;
};
interface ExtendedHTMLElement extends HTMLElement {
  requestFullScreen?: () => Promise<void> | void;
  webkitRequestFullScreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
  msRequestFullScreen?: () => Promise<void> | void;
}

export default function FormMonitor({
  monitors,
  establishments,
  qrCode,
}: FormMonitorProps) {
  const schema = z.object({
    establishment: z.any(),
    monitor: z.string().min(1, "Selecione um monitor"),
    password: z.string().min(1, "Senha é obrigatória"),
    accountType: z.string().min(1, "Selecione um tipo de conta"),
  });

  type ISchema = z.infer<typeof schema>;

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push, replace } = useRouter();
  const { SVG } = useQRCode();

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      establishment: searchParams.get("establishmentId") || "",
      monitor: "",
      password: "",
      accountType: searchParams.get("accountType") || "admin",
    },
  });

  function requestFullScreen(element: ExtendedHTMLElement) {
    if (typeof window === "undefined") return;
    const requestMethod =
      element.requestFullscreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;

    const windowObj = window as any;

    if (requestMethod) {
      // Native full screen.
      requestMethod.call(element);
    } else if (typeof windowObj.ActiveXObject !== "undefined") {
      // Older IE.
      try {
        const wscript = new (window as any).ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      } catch (error) {
        console.error("ActiveXObject is not supported or not enabled.");
      }
    }
  }

  async function qrCodeHasRelation(
    qrCode: string
  ): Promise<{ isRelated: boolean; token: string }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/code-relation/${qrCode}`,
      {
        next: {
          revalidate: 3000,
        },
      }
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const responseBody = await res.json();

    return responseBody;
  }

  useEffect(() => {
    async function fetchQrCodeRelation() {
      try {
        const result = await qrCodeHasRelation(qrCode);
        if (result.token) {
          setCookie("monitor_auth", result.token);
        }

        if (result?.isRelated) {
          push("/monitor/advertisements");
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (typeof window !== "undefined") {
      fetchQrCodeRelation();
      const intervalId = setInterval(fetchQrCodeRelation, 3000);

      return () => clearInterval(intervalId);
    }
  }, [qrCode, push]);

  const onSubmits = async function (data: ISchema) {
    var elem = document.body;
    try {
      const response = await fetch("/api/auth/monitor", {
        method: "POST",
        body: JSON.stringify({
          id: +data.monitor,
          establishmentId: +data.establishment,
          password: data.password,
        }),
        cache: "no-store",
      });

      if (response.status === 200) {
        requestFullScreen(elem);
        push("/monitor/advertisements");
      } else if (response.status === 401) {
        toast.error("Usuário ou senha inválida");
      } else {
        throw new Error("Erro ao realizar login");
      }
    } catch (error) {
      toast.error("Erro ao realizar login");
    }
  };

  const handleSelectEstablishment = async function (
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value = (event.target as HTMLSelectElement).value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("establishmentId", value);
      setValue("establishment", value);
    } else {
      params.delete("establishmentId");
      setValue("establishment", "");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-evenly w-full items-center">
      <SVG
        text={qrCode}
        options={{
          width: 600,
        }}
      />

      <form
        onSubmit={handleSubmit(onSubmits)}
        className="space-y-6 bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12"
      >
        <div>
          <label
            htmlFor="establishment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Estabelecimento
          </label>
          <div className="mt-2">
            <Select
              id="establishment"
              {...register("establishment")}
              onChange={(event) => handleSelectEstablishment(event)}
              size="lg"
              placeholder="Selecione um estabelecimento"
              className="max-w-xs"
              isInvalid={!!errors.establishment}
              errorMessage={errors.establishment?.message as string}
              aria-label="Selecione um estabelecimento"
            >
              {establishments.establishments.map((establishment) => (
                <SelectItem key={establishment.id} value={establishment.id}>
                  {establishment.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label
            htmlFor="monitor"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Monitor
          </label>
          <div className="mt-2">
            <Select
              id="monitor"
              {...register("monitor")}
              size="lg"
              placeholder="Selecione um monitor"
              className="max-w-xs"
              isInvalid={!!errors.monitor}
              errorMessage={errors.monitor?.message as string}
              aria-label="Selecione um monitor"
            >
              {monitors.map((monitor) => (
                <SelectItem key={monitor.id} value={monitor.id}>
                  {monitor.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Senha
            </label>
          </div>
          <div className="mt-2">
            <Input
              {...register("password")}
              size="lg"
              id="password"
              placeholder="Senha"
              type="password"
              isInvalid={!!errors.password}
              autoComplete="password"
              startContent={
                <MdiPassword className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              errorMessage={errors.password?.message as string}
              aria-label="Senha"
            />
          </div>
        </div>

        <div>
          <AccountType
            getValues={getValues}
            register={register}
            pathname={pathname}
            searchParams={searchParams}
            replace={replace}
          />

          <Button
            isLoading={isSubmitting}
            variant="shadow"
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}
