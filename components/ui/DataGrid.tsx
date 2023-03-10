import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";
import { Item, Library } from "../../types/common";
import NewItemModal from "./NewItemModal";

type DataGridProps = {
  selectedLibrary: Library;
};

type ApiResponseData = {
  items: Item[];
};

export default function DataGrid({ selectedLibrary }: DataGridProps) {
  const [isNewItemModalDisplayed, setIsNewItemModalDisplayed] = useState(false);

  const items = useQuery({
    queryKey: ["items", selectedLibrary?._id],
    queryFn: async () => {
      return axios
        .get<ApiResponseData>(`/api/libraries/${selectedLibrary?._id}/items`)
        .then((res) => res.data);
    },
  });

  const columnHelper = createColumnHelper<Item>();
  const fields = selectedLibrary.fields.map((field) => field.name);
  const columns = fields.map((field) => {
    return columnHelper.accessor(field, {
      cell: (info) => info.getValue(),
    });
  });

  const table = useReactTable({
    data: items.data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <button
        className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 rounded-md block text-center px-3 mb-2"
        onClick={() => setIsNewItemModalDisplayed(true)}
      >
        New Item
      </button>
      {items.isSuccess && (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left py-1 pr-2">
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
      )}
      {selectedLibrary && isNewItemModalDisplayed && (
        <NewItemModal
          hideModal={() => setIsNewItemModalDisplayed(false)}
          library={selectedLibrary}
        />
      )}
    </>
  );
}
