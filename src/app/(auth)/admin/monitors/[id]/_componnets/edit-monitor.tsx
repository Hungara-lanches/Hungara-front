"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IMonitor } from "../../../../../../model/monitor";
import { IEstablishmentList } from "../../../../../../model/establishment";

interface EditMonitorProps {
  monitor: IMonitor;
  establishments: IEstablishmentList;
}

export function EditMonitor({ monitor, establishments }: EditMonitorProps) {
  const schema = z.object({
    establishmentId: z.coerce.number().gte(1, "Estabelecimento é obrigatório"),
    name: z.string().min(1, "Nome do monitor é obrigatório"),
    description: z.string().optional(),
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
      establishmentId: monitor.establishmentId,
      name: monitor.name || "",
      description: monitor.description || "",
    },
  });

  const handleSubmitUpdateMonitor = async (data: ISchema) => {
    try {
      const res = await fetch("/api/admin/establishments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: monitor.id, ...data }),
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
        onSubmit={handleSubmit(handleSubmitUpdateMonitor)}
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
            placeholder="Nome do estabelecimento"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            type="text"
            size="lg"
            aria-label="Nome do monitor"
          />
        </div>

        <div>
          <Input
            label="Descrição do estabelecimento"
            {...register("description")}
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
