"use client";
import {
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import {
  IEstablishment,
  IEstablishmentList,
} from "../../../../../../model/establishment";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteEstablishment from "../delete-establishment";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface ListEstablishmentsProps {
  establishments: IEstablishmentList;
}

export default function ListEstablishments({
  establishments,
}: ListEstablishmentsProps) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const loadingState =
    isLoading || establishments?.establishments.length === 0
      ? "loading"
      : "idle";

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return establishments?.count
      ? Math.ceil(establishments.count / rowsPerPage)
      : 0;
  }, [establishments?.count, rowsPerPage]);

  const columns = [
    { name: "Nome", uid: "name" },
    { name: "Descrição", uid: "description" },
    {
      name: "Monitores ativos",
      uid: "activeMonitors",
    },
    {
      name: "Ações",
      uid: "actions",
    },
  ];

  const renderCell = useCallback(
    (establishment: IEstablishment, columnKey: unknown) => {
      const cellValue = establishment[columnKey as keyof IEstablishment];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {establishment.name}
              </p>
            </div>
          );

        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {establishment.name}
              </p>
            </div>
          );

        case "activeMonitors":
          return (
            <div className="flex flex-col">
              {establishment.monitors.length > 0 ? (
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
                <Link href={`/admin/establishments/${establishment.id}`}>
                  <PencilIcon className="cursor-pointer w-5 h-5" />
                </Link>
              </Tooltip>
              <Tooltip color="danger" content="Deletar">
                <DeleteEstablishment establishment={establishment} />
              </Tooltip>
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
      <TableBody items={establishments.establishments}>
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
