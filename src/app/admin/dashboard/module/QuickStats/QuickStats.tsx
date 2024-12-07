import React, { cloneElement } from "react";
import StatsCard from "@/components/ui/Cards/StatsCard";
import { DollarSign, Layers, ShoppingCart, Users } from "lucide-react";

interface StatisticsProps {
  statistics: {
    products: number;
    stockValue: number;
    sales: number;
    customers: number;
  };
}

const QuickStats = ({ statistics }: StatisticsProps) => {
  const statsData = [
    {
      title: "Productos Registrados",
      color: "border-blue-600",
      value: statistics.products || 0,
      icon: <Layers />,
    },
    {
      title: "Valor total del stock",
      color: "border-slate-600",
      value: statistics.stockValue || 0,
      isAmount: true,
      icon: <DollarSign />,
    },
    {
      title: "Ventas Realizadas",
      color: "border-green-600",
      value: statistics.sales || 0,
      icon: <ShoppingCart />,
    },
    {
      title: "Clientes",
      color: "border-sky-600",
      value: statistics.customers || 0,
      icon: <Users />,
    },
  ];

  return (
    <div className="flex flex-row w gap-4 w-full">
      {statsData.map((stat, index) => (
        <div key={index} className="flex-1 min-w-[200px]">
          <StatsCard
            key={index}
            title={stat.title}
            color={stat.color}
            value={stat.value}
            isAmount={stat.isAmount}
            icon={cloneElement(stat.icon, {
              className: "text-lg w-10 h-10 text-slate-700 dark:text-white",
            })}
          />
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
