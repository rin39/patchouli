import { useInfiniteQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Item, Library } from "@/types/common";
import NewItemModal from "@/components/ui/NewItemModal";

type DataGridProps = {
  selectedLibrary: Library;
};

type ApiResponseData = {
  items: Item[];
  metadata: {
    pages: number;
    nextPage?: number;
  };
};

export default function DataGrid({ selectedLibrary }: DataGridProps) {
  const [isNewItemModalDisplayed, setIsNewItemModalDisplayed] = useState(false);

  const {
    data: items,
    fetchNextPage,
    isFetching,
    isSuccess,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["items", selectedLibrary?._id],
    queryFn: async ({ pageParam = 1 }) => {
      return axios
        .get<ApiResponseData>(
          `/api/libraries/${selectedLibrary?._id}/items?page=${pageParam}`
        )
        .then((res) => res.data);
    },
    getNextPageParam: (prevData) => prevData.metadata.nextPage,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const columnHelper = createColumnHelper<Item>();
  const fields = selectedLibrary.fields.map((field) => field.name);
  const columns = fields.map((field) => {
    return columnHelper.accessor(field, {
      cell: (info) => info.getValue(),
    });
  });

  const tableData = useMemo(() => {
    return items?.pages.flatMap((data) => data.items) ?? [];
  }, [items]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const fetchNextPageOnBottomReached = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight -
        document.documentElement.scrollTop -
        document.documentElement.clientHeight;
      if (distanceToBottom <= 500 && hasNextPage && !isFetching)
        fetchNextPage();
    };
    document.addEventListener("scroll", fetchNextPageOnBottomReached);
    return () => {
      document.removeEventListener("scroll", fetchNextPageOnBottomReached);
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  return (
    <>
      <button
        className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 rounded-md block text-center px-3 mb-2"
        onClick={() => setIsNewItemModalDisplayed(true)}
      >
        New Item
      </button>
      {isSuccess && (
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
