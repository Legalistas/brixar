"use client";
import { getStatisticsDashboard } from "@/services/statistics-service";
import React, { useState, useEffect } from "react";
import QuickStats from "./module/QuickStats/QuickStats";
import QuickStatsSales from "./module/QuickStatsSales/QuickStatsSales";
import BestSelling from "./module/BestSelling/BestSelling";
import TopBuyers from "./module/TopBuyers/TopBuyers";
import ProductLowStock from "./module/ProductLowStock/ProductLowStock";

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    products: 0,
    stockValue: 0,
    sales: 0,
    customers: 0,
    lowStock: [],
    salesToday: 0,
    salesWeek: 0,
    salesMonth: 0,
    topProducts: [], // Inicializa topProducts como un array vacío
    sortedTopBuyers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStatisticsDashboard();
        setStatistics(response);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.log(error.response.data.message);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <QuickStats statistics={statistics} />
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-9">
          <BestSelling statistics={statistics} />
        </div>
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-7.5">
          <QuickStatsSales statistics={statistics} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6">
          <ProductLowStock statistics={statistics} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <TopBuyers statistics={statistics} />
        </div>
      </div>
    </div>
  );
}
