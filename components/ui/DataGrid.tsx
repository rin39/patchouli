import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { Library } from "../../types/common";
import NewEntryModal from "./NewEntryModal";

type DataGridProps = {
  selectedLibrary: Library;
};

export default function DataGrid({ selectedLibrary }: DataGridProps) {
  const [isNewEntryModalDisplayed, setIsNewEntryModalDisplayed] =
    useState(false);

  const entries = useQuery({
    queryKey: ["entries", selectedLibrary?._id],
    queryFn: () => {
      return axios.get(`/api/libraries/${selectedLibrary?._id}`);
    },
  });

  const columnHelper = createColumnHelper<any>();
  const fields = selectedLibrary.fields.map((field) => field.name);
  const columns = fields.map((field) => {
    return columnHelper.accessor(field, {
      cell: (info) => info.getValue(),
    });
  });

  const table = useReactTable({
    data: entries.data?.data.entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (entries.isLoading) return null;

  return (
    <>
      <button
        className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 rounded-md block text-center px-3 mb-2"
        onClick={() => setIsNewEntryModalDisplayed(true)}
      >
        New Entry
      </button>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-y">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-1 pr-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedLibrary && isNewEntryModalDisplayed && (
        <NewEntryModal
          hideModal={() => setIsNewEntryModalDisplayed(false)}
          library={selectedLibrary}
        />
      )}
    </>
  );
}