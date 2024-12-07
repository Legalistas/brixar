import { Table as ReactTable } from "@tanstack/react-table";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  table: ReactTable<any>;
}

const Pagination: React.FC<PaginationProps> = ({ table }) => (
  <div className="flex items-center space-x-1">
    <button
      className="px-3 py-1 text-xs text-gray-600 border rounded bg-white hover:bg-gray-200 cursor-pointer"
      onClick={() => table.firstPage()}
      disabled={!table.getCanPreviousPage()}
    >
      <ChevronsLeft className="mr-1 w-5 h-5" />
    </button>
    <button
      className="px-3 py-1 text-xs text-gray-600 border rounded bg-white hover:bg-gray-200 flex items-center cursor-pointer"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      <ChevronLeft className="mr-1 w-5 h-5" />{" "}
      <span className="text-xs">Anterior</span>
    </button>

    <button
      className="px-3 py-1 text-xs text-gray-600 border rounded bg-white hover:bg-gray-200 flex items-center cursor-pointer"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      <span className="text-xs">Siguiente</span>
      <ChevronRight className="ms-1 w-5 h-5" />
    </button>
    <button
      className="px-3 py-1 text-xs text-gray-600 border rounded bg-white hover:bg-gray-200 cursor-pointer"
      onClick={() => table.lastPage()}
      disabled={!table.getCanNextPage()}
    >
      <ChevronsRight className="ms-1 w-5 h-5" />
    </button>
  </div>
);

export default Pagination;
