"use client";
import { useState } from "react";
import UserHeader from "./module/UserHeader/UserHeader";
import UserContainer from "./module/UserContainer/UserContainer";

export default function Users() {
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const columns = [
    { id: "id", header: "#ID" },
    { id: "name", header: "Usuario" },
    { id: "email", header: "Correo electrónico" },
    { id: "role", header: "Rol" },
    { id: "actions", header: "Acciones" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.id)
  );
  return (
    <>
      <UserHeader
        pageSize={pageSize}
        setPageSize={setPageSize}
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="mt-4">
        <UserContainer
          pageSize={pageSize}
          columns={columns.filter((col) => visibleColumns.includes(col.id))}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
}
