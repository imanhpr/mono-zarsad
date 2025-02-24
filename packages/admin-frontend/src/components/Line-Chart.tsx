import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  Point,
  Filler,
} from "chart.js";

const Vazirmatn = "Vazirmatn";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
ChartJS.defaults.font = { family: Vazirmatn, size: 18, weight: "normal" };

function LineChart({
  labels,
  label,
  data,
  backgroundColor,
  borderColor,
}: {
  labels: string[];
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}) {
  const chartDataSet: ChartData<"line", (number | Point | null)[], unknown> = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: backgroundColor,
        borderColor,
        fill: true,
        tension: 0.3,
      },
    ],
  };
  const options: Parameters<typeof Line>[0]["options"] = {
    locale: "fa-IR",
    scales: {
      x: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        rtl: true,
        padding: 10,
      },
    },
  };
  return <Line className="w-100" data={chartDataSet} options={options} />;
}

export default LineChart;
