"use client";

import { Button, Input } from "@nextui-org/react";
import { EmailIcon } from "../../../../components/Icons/EmailIcon";
import { MdiPassword } from "../../../../components/Icons/Password";
import { z } from "zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

import AccountType from "../account-type";

export default function FormEmployee() {
  const schema = z.object({
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
    password: z.string().min(1, "Senha é obrigatória"),
    accountType: z.string().min(1, "Selecione um tipo de conta"),
  });

  type ISchema = z.infer<typeof schema>;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      accountType: searchParams.get("accountType") || "employee",
    },
  });

  const onSubmits = async function (data: ISchema) {
    try {
      const response = await fetch("/api/auth/employee", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        cache: "no-store",
      });

      if (response.status === 200) {
        push("/employee/monitors");
      } else if (response.status === 401) {
        toast.error("Usuário ou senha inválida");
      } else {
        throw new Error("Erro ao realizar login");
      }
    } catch (error) {
      toast.error("Erro ao realizar login");
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmits)}
        className="space-y-6 bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            E-mail
          </label>
          <div className="mt-2">
            <Input
              size="lg"
              {...register("email")}
              id="email"
              placeholder="E-mail"
              type="email"
              autoComplete="email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              startContent={
                <EmailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
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
              size="lg"
              id="password"
              placeholder="Senha"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              type="password"
              autoComplete="password"
              startContent={
                <MdiPassword className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
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
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="shadow"
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Entrar
          </Button>
        </div>
      </form>
    </>
  );
}
