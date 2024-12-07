import React, { cloneElement } from "react";
import StatsCard from "@/components/ui/Cards/StatsCard";
import {
  DollarSign,
  Globe,
  Layers,
  Medal,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";

interface StatisticsProps {
  statistics: {
    salesToday: number;
    salesWeek: number;
    salesMonth: number;
  };
}

const QuickStatsSales = ({ statistics }: StatisticsProps) => {
  const statsData = [
    {
      title: "Ventas hoy",
      color: "border-blue-600",
      value: statistics.salesToday || 0,
      icon: <Globe />,
    },
    {
      title: "Ventas de la semana",
      color: "border-slate-600",
      value: statistics.salesWeek || 0,
      isAmount: true,
      icon: <ShoppingBag />,
    },
    {
      title: "Ventas del mes",
      color: "border-green-600",
      value: statistics.salesMonth || 0,
      icon: <Medal />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
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

export default QuickStatsSales;
