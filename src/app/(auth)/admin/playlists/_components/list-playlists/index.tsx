"use client";
import {
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
import { useCallback, useMemo, useState } from "react";

import { PencilIcon } from "@heroicons/react/24/outline";

import Link from "next/link";
import { IPlaylist } from "../../../../../../model/playlist";

interface listPlaylistsProps {
  playlists: IPlaylist[];
}

export function ListPlaylists({ playlists }: listPlaylistsProps) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadingState = isLoading || playlists.length === 0 ? "loading" : "idle";

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return playlists.length ? Math.ceil(playlists.length / rowsPerPage) : 0;
  }, [playlists?.length, rowsPerPage]);

  const columns = [
    { name: "Nome", uid: "name" },
    { name: "Descrição", uid: "description" },
    {
      name: "Propagandas ativas",
      uid: "activeAdvertisements",
    },
    {
      name: "Ações",
      uid: "actions",
    },
  ];

  const renderCell = useCallback((playlist: IPlaylist, columnKey: unknown) => {
    const cellValue = playlist[columnKey as keyof IPlaylist];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{playlist.name}</p>
          </div>
        );

      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{playlist.name}</p>
          </div>
        );

      case "activeAdvertisements":
        return (
          <div className="flex flex-col">
            {playlist.advertisements.length > 0 ? (
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

      case "actions":
        return (
          <div className="relative flex items-center gap-5">
            <Tooltip content="Editar">
              <Link href={`/admin/playlists/${playlist.id}`}>
                <PencilIcon className="cursor-pointer w-5 h-5" />
              </Link>
            </Tooltip>
            {/* <Tooltip color="danger" content="Deletar"> */}
            {/* <DeleteEstablishment establishment={establishment} /> */}
            {/* </Tooltip> */}
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

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
              onChange={(page) => setPage(page)}
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
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={playlists}>
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
