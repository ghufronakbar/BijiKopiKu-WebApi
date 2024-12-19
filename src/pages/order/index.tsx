import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import { $Enums, Coffee, Order, OrderItem, User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResOrder extends Order {
  user: User;
  orderItems: ResOrderItem[];
}

interface ResOrderItem extends OrderItem {
  coffee: Coffee;
}

const OrderPage = () => {
  const [data, setData] = useState<ResOrder[]>([]);
  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (item) =>
      item.user.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.user.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResOrder[]>>("/orders");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const colorStatus = (status: $Enums.OrderStatus) => {
    switch (status) {
      case "Dipesan":
        return "bg-orange-100 text-orange-600";
      case "Diterima":
        return "bg-blue-100 text-blue-600";
      case "Ditolak":
        return "bg-red-100 text-red-600";
      case "Dibatalkan":
        return "bg-yellow-100 text-yellow-600";
      case "Selesai":
        return "bg-green-100 text-green-600";
      case "Dibayar":
        return "bg-green-100 text-teal-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Navigation title="Pesanan">
      <div className="w-full flex flex-col gap-2">
        <input
          type="text"
          placeholder="Cari pesanan..."
          className="w-full md:w-1/2 lg:w-1/3 p-2 rounded-md border border-gray-300 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="text-white bg-primary">
              <tr>
                <th className="px-4 py-2 text-left"></th>
                <th className="px-4 py-2 text-left">#ID</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Pesanan</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <p className="font-semibold">{item.user.name}</p>
                      <p className="text-sm">{item.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="max-w-[300px] flex flex-wrap flex-row">
                      {item.orderItems.map((orderItem, index) => (
                        <div
                          key={orderItem?.id}
                          className="flex flex-row gap-2 items-center"
                        >
                          {" "}
                          {orderItem?.coffee?.name}
                          <span className="text-xs font-semibold">
                            X{orderItem.quantity}
                          </span>
                          {index < item.orderItems.length - 1 && ", "}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <span
                        className={
                          "font-semibold px-2 py-1 rounded-md " +
                          colorStatus(item.status)
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/order/${item.id}`}>
                      <button className="bg-white text-primary px-4 py-2 rounded-md shadow-sm hover:bg-gray-100">
                        Detail
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </Navigation>
  );
};

export default OrderPage;
