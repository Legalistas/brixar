// Tipos compartidos entre componentes de costos
import { ProyectCost } from "@/store/costStore";

export interface FilterValues {
  rubro: string;
  inversor: string;
  mes: string;
  año: string;
}

export interface FormattingFunctions {
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  formatCurrencyUSD: (amount: number) => string;
  getMonthName: (monthNumber: string) => string;
}

export interface FilterOptions {
  uniqueYears: string[];
  uniqueMonths: string[];
  uniqueRubros: string[];
  uniqueInversores: string[];
}

export interface MetricsData {
  totalPesos: number;
  totalDolares: number;
  costPorM2?: number;
}
