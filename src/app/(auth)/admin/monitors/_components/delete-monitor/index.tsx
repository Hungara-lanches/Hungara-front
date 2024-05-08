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
import { IMonitor } from "../../../../../../model/monitor";

interface DeleteMonitorProps {
  monitor: IMonitor;
}

export default function DeleteMonitor({ monitor }: DeleteMonitorProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteMonitor(onClose: () => void) {
    setIsLoading(true);
    try {
      await fetch(`/api/admin/monitors`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: monitor.id }),
      });
      toast.success("Monitor deletado com sucesso");
      refreshPath("/admin/monitors");
      onClose();
    } catch (error) {
      toast.error("Erro ao deletar o monitor");
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
                Deletar monitor
              </ModalHeader>
              <ModalBody>
                <p>
                  Deseja deletar o monitor <b>{monitor.name}?</b>
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
                  onPress={() => handleDeleteMonitor(onClose)}
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
