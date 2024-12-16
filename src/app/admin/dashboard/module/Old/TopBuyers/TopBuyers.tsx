import GeneralCard from "@/components/ui/Cards/GeneralCard";
import Empty from "@/components/common/Empty";
import { Users } from "lucide-react";

interface Buyer {
  id: number;
  name: string;
  email: string;
  salesCount: number;
}

interface StatisticsProps {
  statistics: {
    sortedTopBuyers: Buyer[];
  };
}

const TopBuyers = ({ statistics }: StatisticsProps) => {
  return (
    <GeneralCard
      title="Compradores frecuentes"
      className="h-[300px] overflow-auto p-4"
    >
      {statistics.sortedTopBuyers && statistics.sortedTopBuyers.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b text-left">#</th>
              <th className="px-4 py-2 border-b text-left">Nombre</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">
                Cantidad de compras
              </th>
            </tr>
          </thead>
          <tbody>
            {statistics.sortedTopBuyers.map((buyer, index) => (
              <tr
                key={buyer.id}
                className="border-b hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                <td className="px-4 py-2 text-gray-800">{buyer.name}</td>
                <td className="px-4 py-2 text-gray-800">{buyer.email}</td>
                <td className="px-4 py-2 text-gray-800">{buyer.salesCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Empty
          emptyStateMessage="No hay compradores frecuentes."
          emptyStateDescription="Aún no hay clientes con múltiples compras."
          icon={<Users className="w-16 h-16" />}
        />
      )}
    </GeneralCard>
  );
};

export default TopBuyers;
