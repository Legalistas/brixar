import { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ProyectCost } from '@/store/costStore';
import { FormattingFunctions } from './types';

// Registrar los componentes de Chart.js que necesitamos
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface CostosChartsProps {
  costs: ProyectCost[];
  formatting: FormattingFunctions;
}

const CostosCharts = ({ costs, formatting }: CostosChartsProps) => {
  const { formatCurrency, formatCurrencyUSD } = formatting;

  // Datos para el gráfico de torta (distribución por rubro)
  const pieData = () => {
    // Agrupar costos por rubro y sumar sus importes en dólares
    const rubroSums: Record<string, number> = {};
    costs.forEach(cost => {
      const rubro = cost.rubro || 'Sin categoría';
      rubroSums[rubro] = (rubroSums[rubro] || 0) + Number(cost.importeDolar);
    });

    // Colores para los diferentes rubros
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(255, 99, 255, 0.7)',
      'rgba(255, 99, 64, 0.7)',
    ];

    const labels = Object.keys(rubroSums);
    const values = Object.values(rubroSums);

    return {
      labels,
      datasets: [
        {
          label: 'Gastos por rubro (USD)',
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  // Datos para el gráfico de barras (gastos por inversor)
  const barData = () => {
    // Agrupar costos por inversor y sumar sus importes en dólares
    const inversorSums: Record<string, number> = {};
    costs.forEach(cost => {
      const inversor = cost.inversor || 'Sin especificar';
      inversorSums[inversor] = (inversorSums[inversor] || 0) + Number(cost.importeDolar);
    });

    const labels = Object.keys(inversorSums);
    const values = Object.values(inversorSums);

    return {
      labels,
      datasets: [
        {
          label: 'Inversión (USD)',
          data: values,
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gastos por Inversor',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrencyUSD(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'USD ' + Number(value).toLocaleString('es-ES');
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución por Rubro',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += formatCurrencyUSD(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  if (costs.length === 0) {
    return <div className="p-4 text-center text-slate-500">No hay datos suficientes para mostrar los gráficos</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
      <h2 className="text-lg font-medium text-slate-800 mb-4">Gráficos de costos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Pie data={pieData()} options={pieOptions} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Bar data={barData()} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default CostosCharts;
