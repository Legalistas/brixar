import React, { createContext, useContext, ReactNode } from "react";
import { Table as ReactTableInstance } from "@tanstack/react-table";

interface TableContextProps<TData> {
  table: ReactTableInstance<TData> | null;
}

const TableContext = createContext<TableContextProps<any> | undefined>(
  undefined
);

export function useTableContext<TData>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context.table as ReactTableInstance<TData>;
}

interface TableProviderProps<TData> {
  table: ReactTableInstance<TData>;
  children: ReactNode;
}

export function TableProvider<TData>({
  table,
  children,
}: TableProviderProps<TData>) {
  return (
    <TableContext.Provider value={{ table }}>{children}</TableContext.Provider>
  );
}
