"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { toast, Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";
import { IAdvertisement } from "../../../../../../model/advertisement";

interface DeleteAdvertisementProps {
  advertisement: IAdvertisement;
}

export default function DeleteAdvertisement({
  advertisement,
}: DeleteAdvertisementProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteEstablishment(onClose: () => void) {
    setIsLoading(true);
    try {
      await fetch(`/api/admin/advertisements`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: advertisement.id }),
      });
      refreshPath("/admin/advertisements");
      toast.success("Propaganda deletada com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao deletar a propaganda");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster />
      <Tooltip color="danger" content="Deletar">
        <TrashIcon onClick={onOpen} className="cursor-pointer w-5 h-5" />
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deletar propaganda
              </ModalHeader>
              <ModalBody>
                <p>
                  Deseja deletar a propaganda <b>{advertisement.name}?</b>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  color="primary"
                  onPress={() => handleDeleteEstablishment(onClose)}
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
