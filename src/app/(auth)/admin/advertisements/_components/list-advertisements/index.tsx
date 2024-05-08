"use client";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IAdvertisement } from "../../../../../../model/advertisement";
import DeleteAdvertisement from "../delete-advertisement";

interface ListAdvertisementProps {
  advertisements: IAdvertisement[];
}

export default function ListAdvertisements({
  advertisements,
}: ListAdvertisementProps) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const loadingState =
    isLoading || advertisements.length === 0 ? "loading" : "idle";

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return advertisements.length
      ? Math.ceil(advertisements.length / rowsPerPage)
      : 0;
  }, [advertisements?.length, rowsPerPage]);

  const columns = [
    { name: "Nome", uid: "name" },
    { name: "Descrição", uid: "description" },
    {
      name: "Propaganda",
      uid: "visualizeAdvertisement",
    },
    {
      name: "Ações",
      uid: "actions",
    },
  ];

  const renderCell = useCallback(
    (advertisement: IAdvertisement, columnKey: unknown) => {
      const cellValue = advertisement[columnKey as keyof IAdvertisement];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {advertisement.name}
              </p>
            </div>
          );

        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {advertisement.name}
              </p>
            </div>
          );

        case "visualizeAdvertisement":
          return (
            <div className="flex flex-col">
              <a
                target="_blank"
                className="
                    text-bold
                    text-sm
                    text-primary
                    cursor-pointer
                    hover:underline
              "
                title="Visualizar propaganda"
                href={advertisement.url}
              >
                Visualizar propaganda
              </a>
            </div>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-5">
              <DeleteAdvertisement advertisement={advertisement} />
            </div>
          );

        default:
          return cellValue;
      }
    },
    []
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
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={advertisements}>
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
