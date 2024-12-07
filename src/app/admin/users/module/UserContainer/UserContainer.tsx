"use client";

import { useEffect, useMemo, useState } from "react";
import { Users } from "@/types/users";
import { getAllUsers } from "@/services/users-service";
import EmptyBig from "@/components/common/EmptyBig";
import { Plus, User } from "lucide-react";
import UserList from "../UserList/UserList";
import Loading from "@/components/ui/Loading";

interface UserContainerProps {
  pageSize: number;
  columns: { id: string; header: string }[];
  searchTerm: string;
}

const UserContainer: React.FC<UserContainerProps> = ({
  pageSize,
  columns,
  searchTerm,
}) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCreateProduct = () => {
    // Implement your create product logic here
    console.log("Create product clicked");
  };

  return (
    <>
      {users.length > 0 ? (
        <UserList users={filteredUsers} pageSize={pageSize} columns={columns} />
      ) : (
        <EmptyBig
          emptyStateMessage="Aún no tienes usuarios"
          emptyStateDescription="Crea tu primer usuario y empieza a vender."
          icon={<User className="mx-auto h-16 w-16 text-gray-400" />}
          button={
            <button
              onClick={handleCreateProduct}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" />
              Crear usuario
            </button>
          }
        />
      )}
    </>
  );
};

export default UserContainer;
