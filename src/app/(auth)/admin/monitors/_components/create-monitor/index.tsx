"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast, Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";
import { IEstablishmentList } from "../../../../../../model/establishment";

interface CreateMonitorFormProps {
  establishments: IEstablishmentList;
}

export default function CreateMonitorForm({
  establishments,
}: CreateMonitorFormProps) {
  const schema = z.object({
    establishmentId: z.coerce.number().gte(1, "Estabelecimento é obrigatório"),
    name: z.string().min(1, "Nome do monitor é obrigatório"),
    description: z.string().optional(),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  });

  type ISchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      establishmentId: 0,
      name: "",
      description: "",
      password: "",
    },
  });

  const handleSubmitCreateMonitor = async (data: ISchema) => {
    try {
      const res = await fetch("/api/admin/monitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      toast.success("Monitor criado com sucesso");
      reset();
      refreshPath("/admin/monitors");
    } catch (error) {
      toast.error("Erro ao criar o monitor");
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(handleSubmitCreateMonitor)}
        className="ml-72 mt-44 max-w-md w-full flex flex-col gap-5"
      >
        <div>
          <Select
            {...register("establishmentId")}
            isInvalid={!!errors.establishmentId}
            errorMessage={errors.establishmentId?.message as string}
            size="lg"
            label="Selecione um estabelecimento"
          >
            {establishments.establishments.map((establishment) => (
              <SelectItem key={establishment.id} value={establishment.id}>
                {establishment.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <Input
            id="name"
            {...register("name")}
            label="Nome do monitor"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            type="text"
            size="lg"
            aria-label="Nome do monitor"
          />
        </div>

        <div>
          <Input
            label="Descrição do monitor"
            {...register("description")}
            type="text"
            size="lg"
          />
        </div>

        <div>
          <Input
            label="******"
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message as string}
            type="password"
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
          Cadastrar monitor
        </Button>
      </form>
    </>
  );
}
