import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({
  chartData,
  colors,
  labels,
}: {
  chartData: number[];
  colors: string[];
  labels: string[];
}) => {
  const data = {
    labels,
    datasets: [
      {
        data: chartData, // مقادیر برای اولین لایه
        backgroundColor: colors,
        borderWidth: 10, // ضخامت اولین لایه
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "70%", // اندازه سوراخ داخلی نمودار
    plugins: {
      legend: {
        display: false, // غیرفعال کردن لیبل‌ها
      },
      tooltip: {
        callbacks: {
          label: function () {
            return "";
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default Chart;
