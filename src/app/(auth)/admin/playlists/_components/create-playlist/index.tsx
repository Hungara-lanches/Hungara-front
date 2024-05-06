"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast, Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";

export default function CreatePlaylistForm() {
  const schema = z.object({
    name: z.string().min(1, "Nome da playlist é obrigatório"),
    description: z.string().min(1, "Descrição da playlist é obrigatória"),
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
      name: "",
      description: "",
    },
  });

  const handleSubmitCreatePlaylist = async (data: ISchema) => {
    try {
      const res = await fetch("/api/admin/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      toast.success("Playlist criada com sucesso");
      reset();
      refreshPath("/admin/playlists");
    } catch (error) {
      toast.error("Erro ao criar playlist");
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(handleSubmitCreatePlaylist)}
        className="ml-72 mt-44 max-w-md w-full flex flex-col gap-5"
      >
        <div>
          <Input
            id="name"
            {...register("name")}
            label="Nome da playlist"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            type="text"
            size="lg"
            aria-label="Nome da playlist"
          />
        </div>

        <div>
          <Input
            label="Descrição da playlist"
            {...register("description")}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message as string}
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
          Cadastrar playlist
        </Button>
      </form>
    </>
  );
}
