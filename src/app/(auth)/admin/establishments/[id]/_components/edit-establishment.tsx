"use client";

import { Button, Input } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IEstablishment } from "../../../../../../model/establishment";

interface EditEstablishmentProps {
  establishment: IEstablishment;
}

export function EditEstablishment({ establishment }: EditEstablishmentProps) {
  const schema = z.object({
    name: z.string().min(1, "Nome do estabelecimento é obrigatório"),
    address: z.string().optional(),
  });

  type ISchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: establishment.name,
      address: establishment.address,
    },
  });

  const handleSubmitUpdateEstablishment = async (data: ISchema) => {
    try {
      const res = await fetch("/api/admin/establishments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: establishment.id, ...data }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      toast.success("Estabelecimento atualizado com sucesso");
      reset();
      refreshPath("/admin/establishments");
    } catch (error) {
      toast.error("Erro ao atualizar estabelecimento");
    }
  };
  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(handleSubmitUpdateEstablishment)}
        className="ml-72 mt-44 max-w-md w-full flex flex-col gap-5"
      >
        <div>
          <Input
            id="name"
            {...register("name")}
            placeholder="Nome do estabelecimento"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            type="text"
            size="lg"
            aria-label="Nome do estabelecimento"
          />
        </div>

        <div>
          <Input
            label="Endereço do estabelecimento"
            {...register("address")}
            type="text"
            size="lg"
          />
        </div>

        <Button
          disabled={isSubmitting}
          isLoading={isSubmitting}
          size="lg"
          className="mt-5"
          color="primary"
          type="submit"
        >
          Atualizar estabelecimento
        </Button>
      </form>
    </>
  );
}
