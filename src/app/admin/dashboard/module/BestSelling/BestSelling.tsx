import GeneralCard from "@/components/ui/Cards/GeneralCard";
import Empty from "@/components/common/Empty";
import { formatCurrency } from "@/utils/formatUtils";
import { Box } from "lucide-react";
import Image from "next/image";

interface Product {
  name: string;
  color?: string;
  storage?: string;
  picture?: string;
  price?: number;
  qty: number;
}

interface TopProduct {
  product: Product;
  totalQty: number;
}

interface StatisticsProps {
  statistics: {
    topProducts: TopProduct[];
  };
}

const imgSrcPlaceholder = "https://placehold.co/600x400";

const BestSelling = ({ statistics }: StatisticsProps) => (
  <GeneralCard
    title="Artículos más vendidos"
    className="h-[300px] overflow-auto p-4"
  >
    {statistics.topProducts && statistics.topProducts.length > 0 ? (
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200 text-slate-800">
          <tr>
            <th className="px-4 py-2 text-left">Artículo</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Cantidad</th>
            <th className="px-4 py-2 text-left">Ventas</th>
          </tr>
        </thead>
        <tbody>
          {statistics.topProducts.map((item, index) => {
            const { product } = item;
            return (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        product.picture
                          ? `${process.env.NEXT_PUBLIC_BASE_UPLOAD_URL}/products/${product.picture}`
                          : imgSrcPlaceholder
                      }
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {product.name}
                    </p>
                    {product.color && product.storage && (
                      <p className="text-sm text-slate-800">
                        {product.color} - {product.storage}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-slate-800">{product.qty}</td>
                <td className="px-4 py-2 text-slate-800">{item.totalQty}</td>
                <td className="px-4 py-2 text-slate-800">
                  {product.price !== undefined
                    ? formatCurrency(item.totalQty * product.price)
                    : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <Empty
        emptyStateMessage="No hay productos con stock bajo."
        emptyStateDescription="Todos los productos tienen niveles de stock adecuados"
        icon={<Box className="w-16 h-16" />}
      />
    )}
  </GeneralCard>
);

export default BestSelling;
