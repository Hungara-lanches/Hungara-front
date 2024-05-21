"use client";

import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IMonitor } from "../../../../../../model/monitor";
import { IEstablishmentList } from "../../../../../../model/establishment";
import { IPlaylist } from "../../../../../../model/playlist";
import { ChangeEvent } from "react";

interface EditMonitorProps {
  monitor: IMonitor;
  establishments: IEstablishmentList;
  playlists: IPlaylist[];
}

export function EditMonitor({
  monitor,
  establishments,
  playlists,
}: EditMonitorProps) {
  const schema = z.object({
    establishmentId: z.coerce.number().gte(1, "Estabelecimento é obrigatório"),
    name: z.string().min(1, "Nome do monitor é obrigatório"),
    description: z.string().optional(),
    playlistIds: z.any(),
  });

  type ISchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      establishmentId: monitor.establishmentId,
      name: monitor.name || "",
      description: monitor.description || "",
      playlistIds: monitor?.playlists?.[0]?.playlist?.id,
    },
  });

  function handleSelectPlaylist(e: ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    setValue("playlistIds", value);
  }

  const handleSubmitUpdateMonitor = async (data: ISchema) => {
    let body = {
      ...data,
      playlistIds: [data.playlistIds],
    };
    console.log(body.playlistIds);

    if (body.playlistIds[0] === undefined) {
      body = {
        ...data,
        playlistIds: [],
      };
    }

    try {
      const res = await fetch("/api/admin/monitors", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ id: monitor.id, ...body }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      toast.success("Estabelecimento atualizado com sucesso");
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
            placeholder="Nome do monitor"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            type="text"
            size="lg"
            aria-label="Nome do monitor"
          />
        </div>

        <div>
          <Input
            placeholder="Descrição"
            labelPlacement="inside"
            {...register("description")}
            type="text"
            size="lg"
          />
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-2xl">Playlists:</h1>
          <RadioGroup
            defaultValue={monitor?.playlists?.[0]?.playlist?.id.toString()}
          >
            {playlists.map((playlist) => (
              <Radio
                onChange={(e) => handleSelectPlaylist(e)}
                key={playlist.id}
                value={playlist.id.toString()}
              >
                {playlist.name}
              </Radio>
            ))}
          </RadioGroup>
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
