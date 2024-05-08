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
import { IEstablishment } from "../../../../../../model/establishment";

import { toast, Toaster } from "react-hot-toast";
import refreshPath from "../../../../../actions/revalidate";

interface DeleteEstablishmentProps {
  establishment: IEstablishment;
}

export default function DeleteEstablishment({
  establishment,
}: DeleteEstablishmentProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteEstablishment(onClose: () => void) {
    setIsLoading(true);
    try {
      await fetch(`/api/admin/establishments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: establishment.id }),
      });
      refreshPath("/admin/establishments");
      toast.success("Estabelecimento deletado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Erro ao deletar o estabelecimento");
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
                Deletar estabelecimento
              </ModalHeader>
              <ModalBody>
                <p>
                  Deseja deletar o estabelecimento <b>{establishment.name}?</b>
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
