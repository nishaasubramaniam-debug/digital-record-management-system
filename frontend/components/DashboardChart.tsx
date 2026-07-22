"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Props Interface
interface DashboardChartProps {
  totalDocuments: number;
  totalCategories: number;
}

export default function DashboardChart({
  totalDocuments,
  totalCategories,
}: DashboardChartProps) {

  const data = {
    labels: ["Documents", "Categories"],
    datasets: [
      {
        label: "DRMS Analytics",
        data: [totalDocuments, totalCategories],
        backgroundColor: [
          "#2563EB", // Blue
          "#16A34A", // Green
        ],
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },

      title: {
        display: true,
        text: "📊 Digital Record Statistics",
        color: "white",
        font: {
          size: 20,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#374151",
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
          precision: 0,
        },
        grid: {
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mt-10">
      <Bar data={data} options={options} />
    </div>
  );
}