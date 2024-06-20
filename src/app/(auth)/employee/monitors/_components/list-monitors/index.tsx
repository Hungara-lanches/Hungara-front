"use client";
import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PencilIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { IMonitor } from "../../../../../../model/monitor";
import { QrReader } from "react-qr-reader";

import { getCookie, getCookies } from "cookies-next";

interface ListMonitorProps {
  monitors: IMonitor[];
}

export default function ListMonitors({ monitors }: ListMonitorProps) {
  const [page, setPage] = useState(1);
  const [openCameraId, setOpenCameraId] = useState<number | null>(null);

  const [openCamera, setOpenCamera] = useState(false);

  const [cameraData, setCameraData] = useState<string | null>("");

  const [monitorToken, setMonitorToken] = useState<string | null>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace, refresh } = useRouter();

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return monitors?.length ? Math.ceil(monitors.length / rowsPerPage) : 0;
  }, [monitors?.length, rowsPerPage]);

  const columns = [
    { name: "Nome", uid: "name" },
    { name: "Descrição", uid: "description" },
    {
      name: "Playlist Ativa",
      uid: "activePlaylists",
    },

    {
      name: "Abrir Câmera",
      uid: "openCamera",
    },
  ];

  useEffect(() => {
    const handleRelateTokenToCode = async () => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/relate-code-to-monitor`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${monitorToken}`,
            },
            body: JSON.stringify({
              code: cameraData,
              token: monitorToken,
            }),
          }
        );

        if (result.ok) {
          setOpenCameraId(null);
        }
      } catch (error) {
        console.log("erro", error);
      }
    };
    handleRelateTokenToCode();
  }, [cameraData]);

  const handleGenerateTokenForMonitor = async (id: number) => {
    try {
      const res = await fetch("/api/auth/monitor/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });

      if (res.ok) {
        const result = await res.json();
        setMonitorToken(result.monitor_auth);
        return Response.json(result, { status: 200 });
      } else {
        return Response.json(
          { error: "Erro ao retornar o token" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.log(error);
      return Response.json({ error: "Erro ao gerar o token" }, { status: 500 });
    }
  };

  const renderCell = useCallback(
    (monitor: IMonitor, columnKey: unknown) => {
      const cellValue = monitor[columnKey as keyof IMonitor];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{monitor.name}</p>
            </div>
          );

        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {monitor.description || " - "}
              </p>
            </div>
          );

        case "activePlaylists":
          return (
            <div className="flex flex-col">
              {monitor.playlists.length > 0 ? (
                <Chip
                  className="capitalize"
                  color="success"
                  size="sm"
                  variant="flat"
                >
                  Sim
                </Chip>
              ) : (
                <Chip
                  className="capitalize"
                  color="danger"
                  size="sm"
                  variant="flat"
                >
                  Não
                </Chip>
              )}
            </div>
          );

        case "openCamera":
          return (
            <div className="relative flex items-center gap-5">
              {openCameraId !== monitor.id ? (
                <Button
                  color="primary"
                  type="button"
                  onClick={async () => {
                    setOpenCameraId(monitor.id);
                    refresh();
                    await handleGenerateTokenForMonitor(monitor.id);
                  }}
                >
                  Abrir câmera
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpenCameraId(null);
                      window.location.reload();
                    }}
                  >
                    Fechar câmera
                  </Button>
                  <QrReader
                    className="w-96 h-96"
                    constraints={{ facingMode: "environment" }}
                    onResult={async (result, error) => {
                      if (!!result) {
                        setCameraData(result.getText());
                      }

                      if (!!error) {
                        console.log(error.cause);
                      }
                    }}
                  />
                </>
              )}
            </div>
          );

        default:
          return cellValue;
      }
    },
    [openCameraId, refresh]
  );
  function handlePageChange(page: number) {
    setPage(page);
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Table
      aria-label="Listagem de estabelecimentos"
      isStriped
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-end">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => handlePageChange(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name} {cameraData}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={monitors}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey) as JSX.Element}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
