"use client";

import React from "react";
import RowsSize from "@/components/Table/Module/RowsSize/RowsSize";
import ColumnVisibilityDropdown from "@/components/ui/Dropdowns/ColumnVisibilityDropdown";
import { FileDown, FileUp, Plus, Search } from "lucide-react";
import Link from "next/link";

interface UsersHeaderProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  columns: { id: string; header: string }[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const UserHeader: React.FC<UsersHeaderProps> = ({
  pageSize,
  setPageSize,
  columns,
  visibleColumns,
  setVisibleColumns,
  searchTerm,
  setSearchTerm,
}) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting data...");
  };

  const handleImport = () => {
    // Implement import functionality here
    console.log("Importing data...");
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-white p-2">
      <div className="flex flex-1 items-center gap-2">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="flex-1 border-0 bg-transparent focus:outline-none"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Link
        href="/admin/users/create"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        <Plus className="h-5 w-5" />
        Nuevo usuario
      </Link>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        <FileDown className="h-5 w-5" />
        Exportar
      </button>
      <button
        onClick={handleImport}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100"
      >
        <FileUp className="h-5 w-5" />
        Importar
      </button>
      <RowsSize pageSize={pageSize} setPageSize={setPageSize} />
      <ColumnVisibilityDropdown
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />
    </div>
  );
};

export default UserHeader;
