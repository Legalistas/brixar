"use client";
import Table from "@/components/Table/Table";
import { deleteUser } from "@/services/users-service";
import { Users } from "@/types/users";
import { getRoleLabel, RoleKey } from "@/utils/roleUtils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface UserListProps {
  users: Users[];
  pageSize: number;
  columns?: { id: string; header: string }[];
}

const UserList: React.FC<UserListProps> = ({
  users,
  pageSize,
  columns = [],
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (userId: number) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteUser(userId);

      toast.success("Usuario eliminado exitosamente!");
      // Redirect to the same page to force a refresh
      router.push("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error instanceof Error) {
        if (
          error.message.includes(
            "Cannot delete user due to existing references"
          )
        ) {
          toast.error(
            "No se puede eliminar el usuario. Está asociado con registros existentes."
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(
          "Error al eliminar el usuario. Por favor, inténtelo de nuevo."
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns: ColumnDef<Users>[] = [
    {
      accessorKey: "id",
      header: "#ID",
      cell: (info) => info.getValue(),
      size: 5,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Correo Electronico",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: (info) => getRoleLabel(info.getValue() as RoleKey),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: (info) => {
        const viewUrl = `/admin/users/${info.row.original.id}`;
        const userId = info.row.original.id;

        return (
          <div className="flex gap-0">
            <Link
              href={viewUrl}
              className="hover:text-blue-700 text-gray-700 font-bold py-2.5 px-2.5 rounded hover:bg-gray-200"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button
              onClick={() => handleDelete(userId)}
              disabled={isDeleting}
              className={`hover:text-red-700 text-gray-700 font-bold py-2.5 px-2.5 rounded hover:bg-gray-200 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        );
      },
      size: 10,
    },
  ];

  if (columns.length === 0) {
    return <div>No columns defined for the product list.</div>;
  }

  return (
    <div className="space-y-4">
      <Table columns={tableColumns} data={users} pageSize={pageSize} />
    </div>
  );
};

export default UserList;
