"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import Image from "next/image";
import { IPlaylist } from "../../../../../../model/playlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../../../../../utils/cn";
import refreshPath from "../../../../../actions/revalidate";

interface CreateAdvertisementFormProps {
  playlists: IPlaylist[];
}

export function CreateAdvertisementForm({
  playlists,
}: CreateAdvertisementFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"image" | "video" | null>(
    null
  );

  const schema = z.object({
    name: z.string().min(1, "Nome da propaganda é obrigatório"),
    duration: z.string().min(1, "Duração da propaganda é obrigatória"),
    playlistId: z.string().min(1, "Playlist é obrigatória"),
    url: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        return file !== null || file !== undefined;
      }, "Propaganda obrigatória"),
  });

  type ISchema = z.infer<typeof schema>;

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
  });

  const handleSelectAdvertisement = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("url", file);
      const fileType = file.type.split("/")[0];
      setSelectedType(fileType as "image" | "video");
    } else {
      setSelectedFile(null);
      setValue("url", undefined);
      setSelectedType(null);
    }
  };

  const handleSubmitAdvertisement = async (data: ISchema) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("playlistId", data.playlistId.toString());
    formData.append("duration", data.duration.toString());
    if (selectedFile) {
      formData.append("url", selectedFile);
    } else {
      formData.append("url", data.url as File);
    }

    try {
      const res = await fetch("/api/admin/advertisements", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erro ao criar propaganda");
      }

      toast.success("Propaganda criada com sucesso");
      refreshPath("/admin/advertisements");

      setSelectedFile(null);
      reset();
    } catch (error) {
      toast.error("Erro ao criar propaganda");
    }
  };

  function handleDeleteAdvertisement() {
    setSelectedFile(null);
    setValue("url", undefined);
    setSelectedType(null);
  }

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(handleSubmitAdvertisement)}
        className="mt-24 w-full flex flex-col gap-5"
      >
        <div className="flex flex-wrap gap-5">
          <div className="max-w-96 w-full">
            <Input
              {...register("name")}
              label="Nome da propaganda"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              type="text"
              size="lg"
              aria-label="Nome da propaganda"
            />
          </div>
          <div className="max-w-96 w-full -translate-y-3">
            <Input
              {...register("duration")}
              label="Duração da propaganda (em segundos)"
              placeholder="Duração da propaganda (em segundos)"
              labelPlacement="outside"
              isInvalid={!!errors.duration}
              errorMessage={errors.duration?.message}
              type="number"
              size="lg"
              aria-label="Duração da propaganda"
            />
          </div>
          <div className="max-w-96 w-full">
            <Select
              {...register("playlistId")}
              isInvalid={!!errors.playlistId}
              errorMessage={errors.playlistId?.message}
              size="lg"
              label="Selecione uma playlist"
            >
              {playlists.map((playlist) => (
                <SelectItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div>
          {!selectedFile ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="url"
                className={`${cn(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500",
                  {
                    "border-red-500 dark:border-red-400": errors.url,
                  }
                )} `}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      className={`${cn("font-semibold", {
                        "text-red-500 dark:text-red-400": errors.url,
                      })}`}
                    >
                      Clique para fazer um upload
                    </span>{" "}
                    <span
                      className={`${cn("font-semibold", {
                        "text-red-500 dark:text-red-400": errors.url,
                      })}`}
                    >
                      ou arraste e solte
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qualquer tipo de arquivo
                  </p>
                </div>
                <Input
                  className="invisible"
                  id="url"
                  {...register("url")}
                  label="URL da propaganda"
                  isInvalid={!!errors.url}
                  errorMessage={errors.url?.message}
                  type="file"
                  size="lg"
                  aria-label="URL da propaganda"
                  onChange={handleSelectAdvertisement}
                />
              </label>
            </div>
          ) : selectedType === "image" ? (
            <div className="mt-9">
              <div className="flex items-center justify-center ">
                <Image
                  unoptimized
                  width={500}
                  height={500}
                  src={URL.createObjectURL(selectedFile)}
                  alt="Advertisement"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleDeleteAdvertisement} color="danger">
                  Mudar propaganda
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-9">
              <div className="flex flex-col items-center justify-center">
                <video controls className="w-full">
                  <source
                    src={URL.createObjectURL(selectedFile)}
                    type={selectedFile.type}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleDeleteAdvertisement}
                  size="lg"
                  className="mt-4"
                  color="danger"
                >
                  Mudar propaganda
                </Button>
              </div>
            </div>
          )}
        </div>
        <Button
          disabled={isSubmitting}
          isLoading={isSubmitting}
          color="primary"
          type="submit"
        >
          Cadastrar propaganda
        </Button>
      </form>
    </>
  );
}
