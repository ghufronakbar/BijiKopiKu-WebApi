import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import formatRupiah from "@/utils/format/formatRupiah";
import { Coffee } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResCoffee extends Coffee {
  _count: {
    orderItems: number;
  };
}

const CoffeePage = () => {
  const [data, setData] = useState<ResCoffee[]>([]);
  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResCoffee[]>>("/coffee");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navigation title="Produk">
      <div className="w-full flex flex-col gap-2">
        <input
          type="text"
          placeholder="Cari produk..."
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
                <th className="px-4 py-2 text-left">Tipe</th>
                <th className="px-4 py-2 text-left">Jumlah Terjual</th>
                <th className="px-4 py-2 text-left">Harga</th>
                <th className="px-4 py-2 text-left">Terakhir Diubah</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col font-semibold">
                      {item.name}
                    </div>
                  </td>

                  <td className="px-4 py-2">{item.type}</td>

                  <td className="px-4 py-2">{item._count.orderItems}</td>
                  <td className="px-4 py-2">{formatRupiah(item.price)}</td>
                  <td className="px-4 py-2">{formatDate(item.updatedAt)}</td>

                  <td className="px-4 py-2">
                    <Link href={`/coffee/${item.id}`}>
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

export default CoffeePage;
