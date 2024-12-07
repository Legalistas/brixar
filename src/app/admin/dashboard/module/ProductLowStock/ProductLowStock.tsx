import GeneralCard from "@/components/ui/Cards/GeneralCard";
import Empty from "@/components/common/Empty";
import EmptyBoxIcon from "@/components/Icons/EmptyBoxIcon";

interface Product {
  name: string;
  qty: number;
}

interface StatisticsProps {
  statistics: {
    lowStock: Product[];
  };
}

const ProductLowStock = ({ statistics }: StatisticsProps) => (
  <GeneralCard
    title={`Existen ${
      statistics.lowStock && statistics.lowStock.length > 0
        ? statistics.lowStock.length
        : 0
    } productos con stock bajo:`}
    className="h-[300px] overflow-auto p-4"
  >
    {statistics.lowStock && statistics.lowStock.length > 0 ? (
      <div className="overflow-auto">
        <ul className="list-none space-y-2">
          {statistics.lowStock.map((product, index) => (
            <li
              key={index}
              className="text-sm p-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{product.name}</span>
                <span className="text-gray-600">{product.qty} unidades</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <Empty
        emptyStateMessage="No hay productos con stock bajo."
        emptyStateDescription="Todos los productos tienen niveles de stock adecuados"
        icon={<EmptyBoxIcon />}
      />
    )}
  </GeneralCard>
);

export default ProductLowStock;
