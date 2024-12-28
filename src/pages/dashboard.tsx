import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import formatRupiah from "@/utils/format/formatRupiah";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { GiCoffeeBeans } from "react-icons/gi";
import { IoReceipt } from "react-icons/io5";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ResDashboard {
  totalOrders: number;
  pendingOrders: number;
  coffees: number;
  incomeMonthly: number;
  incomeWeekly: number;
  chartData: ResChartData[];
}

interface ResChartData {
  month: string;
  total: number;
}

const DashboardPage = () => {
  const [data, setData] = useState<ResDashboard>();

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResDashboard>>("/dashboard");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cnIcon = "text-[#EFC3A4] w-16 h-16";

  if(!data){
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[#EFC3A4]" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <Navigation title="Dashboard">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GridChart chartData={data?.chartData} />
        <GridItem
          title="Total Produk"
          value={data?.coffees}
          icon={<GiCoffeeBeans className={cnIcon} />}
        />
        <GridItem
          title="Total Transaksi"
          value={data?.totalOrders}
          icon={<IoReceipt className={cnIcon} />}
        />
        <GridItem
          title="Transaksi Menunggu Konfirmasi"
          value={data?.pendingOrders}
          icon={<IoReceipt className={cnIcon} />}
        />
        <GridItem
          title="Pemasukan Bulanan"
          value={formatRupiah(data?.incomeMonthly)}
          icon={<FaRegMoneyBillAlt className={cnIcon} />}
        />
        <GridItem
          title="Pemasukan 7 hari terakhir"
          value={formatRupiah(data?.incomeWeekly)}
          icon={<FaRegMoneyBillAlt className={cnIcon} />}
        />
      </div>
      <Toaster />
    </Navigation>
  );
};

interface Props {
  title: React.ReactNode;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const GridItem = ({ title, value, icon }: Props) => {
  return (
    <div className="w-full h-60 overflow-hidden rounded-lg shadow-lg relative flex ">
      <Image
        src="/bg.webp"
        alt="bg"
        width={600}
        height={400}
        className="w-full h-full object-cover absolute inset-0 z-0"
      />

      <div className="w-full h-full absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="w-full h-full px-12 py-2 flex items-center justify-between gap-8 z-10">
        <div className="flex flex-col">
          <h1 className="text-[#EFC3A4] text-4xl font-black">{value}</h1>
          <h1 className="text-[#EFC3A4] text-xl font-black">{title}</h1>
        </div>
        {icon}
      </div>
    </div>
  );
};

const GridChart = ({ chartData }: { chartData: ResChartData[] }) => {
  const labels = chartData.map((item) => item.month);
  const dataValues = chartData.map((item) => item.total);

  const chartConfig: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "Total Penjualan",
        data: dataValues,
        backgroundColor: "#EFC3A4",
        borderColor: "#EFC3A4",
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="w-full h-30rem md:h-[31rem] overflow-hidden rounded-lg shadow-lg relative flex md:col-span-2 lg:col-span-2 row-span-2">
      <Image
        src="/bg.webp"
        alt="bg"
        width={1920}
        height={1080}
        className="w-full h-full object-cover absolute inset-0 z-0"
      />

      <div className="w-full h-full absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="w-full h-full px-12 py-6 flex flex-col gap-4 z-10">
        <h1 className="text-[#EFC3A4] text-xl font-black">Grafik Penjualan</h1>
        <div className="text-white w-full h-full py-8">
          <Bar
            data={chartConfig}
            style={{ width: "100%", height: "100%" }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: { color: "#fff" },
                },
                y: {
                  ticks: { color: "#fff" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
