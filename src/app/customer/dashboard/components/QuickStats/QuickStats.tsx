import React, { cloneElement } from "react";
import StatsCard from "@/components/ui/Cards/StatsCard";
import { Building, DollarSign, Home, Layers, ShoppingCart, Users } from "lucide-react";

interface StatisticsProps {
  statistics: {
    brixs: number;
    totalBrixs: number;
    projects: number;
    properties: number;
  };
}

const QuickStats = ({ statistics }: StatisticsProps) => {
  const statsData = [
    {
      title: "Mis Brics",
      color: "border-blue-600",
      value: statistics.brixs || 0,
      icon: <Layers />,
    },
    {
      title: "Valor de mis Brics",
      color: "border-slate-600",
      value: statistics.totalBrixs || 0,
      isAmount: true,
      icon: <DollarSign />,
    },
    {
      title: "Inmuebles Comprados",
      color: "border-green-600",
      value: statistics.properties || 0,
      icon: <Home />,
    },
    {
      title: "Proyectos invertidos",
      color: "border-sky-600",
      value: statistics.projects || 0,
      icon: <Building />,
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
