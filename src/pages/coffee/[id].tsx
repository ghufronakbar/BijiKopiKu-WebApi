import Button from "@/components/Button";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import toast from "@/helper/toast";
import { ResErr, ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import { $Enums, Coffee, OrderItem, Order } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ResOrderItem extends OrderItem {
  order: Order;
}

interface ResCoffee extends Coffee {
  orderItems: ResOrderItem[];
}

const DetailCoffeePage = () => {
  const [item, setItem] = useState<ResCoffee | null>(null);
  const router = useRouter();
  const { id } = router.query as { id: string };

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResCoffee>>(`/coffee/${id}`);
      setItem(res.data.data);
    } catch (error) {
      router.push("/coffee");
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  const colorStatus = (status: $Enums.OrderStatus) => {
    switch (status) {
      case "Dipesan":
        return "bg-orange-100 text-orange-600";
      case "Dibayar":
        return "bg-green-100 text-teal-600";
      case "Dibatalkan":
        return "bg-red-100 text-red-600";
      case "Ditolak":
        return "bg-yellow-100 text-yellow-600";
      case "Diterima":
        return "bg-blue-100 text-blue-600";
      case "Selesai":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const clickUpload = () => {
    document.getElementById("file")?.click();
  };

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      toast.loading();
      const formData = new FormData();
      formData.append("picture", e.target.files[0]);
      try {
        await axiosInstance.put<ResOk<ResCoffee>>(
          `/coffee/${id}/picture`,
          formData
        );
        fetchData();
        toast.success("Gambar berhasil diubah");
      } catch (error) {
        const err = error as ResErr;
        toast.error(err?.response?.data?.message);
        console.log(error);
      }
    }
  };

  if (!item) {
    return (
      <div className="w-full h-screen bg-accent text-primary flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Navigation
      title={item.name}
      childredHeader={<Button onClick={clickUpload}>Ubah Gambar</Button>}
    >
      <div className="w-full flex flex-col gap-2">
        <input
          type="file"
          className="hidden"
          id="file"
          onChange={onChangeFile}
        />
        {/* Tabel untuk Menampilkan Detail Kopi */}
        <div className="w-full bg-white rounded-lg p-4 shadow-lg">
          <Image
            src={item.picture || "/placeholder.jpg"}
            alt={item.name}
            width={400}
            height={400}
            className="w-80 h-auto object-cover rounded-lg mx-auto my-4"
          />
          <table className="min-w-full table-auto">
            <thead className="text-white">
              <tr className="rounded-lg bg-primary">
                <th className="px-4 py-2 text-left">Atribut</th>
                <th className="px-4 py-2 text-left">Nilai</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              <tr>
                <td className="px-4 py-2 font-semibold">Nama Kopi</td>
                <td className="px-4 py-2">{item.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Harga</td>
                <td className="px-4 py-2">Rp. {item.price}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Jenis Kopi</td>
                <td className="px-4 py-2">{item.type}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Tingkat Rasa</td>
                <td className="px-4 py-2">{item.taste}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Flavour</td>
                <td className="px-4 py-2">{item.flavor}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Untuk Pecinta Kopi</td>
                <td className="px-4 py-2">
                  {item.isForCoffeeEnthusiast ? "Ya" : "Tidak"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">
                  Cocok dikonsumsi dengan Gula
                </td>
                <td className="px-4 py-2">
                  {item.isItForSweet ? "Ya" : "Tidak"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Deskripsi:</td>
              </tr>
              <tr>
                <td className="px-4 py-2">{item.desc}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full bg-white rounded-lg p-4 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Riwayat Pemesanan
          </h2>
          <table className="min-w-full table-auto">
            <thead className="text-white">
              <tr className="rounded-lg bg-primary">
                <th className="px-4 py-2 text-left">#Pesanan</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Jumlah</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {item.orderItems.map((orderItem) => (
                <tr key={orderItem.id}>
                  <td className="px-4 py-2">{orderItem.order.id}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <span
                        className={
                          "font-semibold px-2 py-1 rounded-md " +
                          colorStatus(orderItem.order.status)
                        }
                      >
                        {orderItem.order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{orderItem.quantity}</td>
                  <td className="px-4 py-2">Rp. {orderItem.total}</td>
                  <td className="px-4 py-2">
                    {formatDate(orderItem.order.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <Link href={`/order/${orderItem.order.id}`}>
                      <button className="bg-white text-primary px-2 rounded-sm">
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

export default DetailCoffeePage;
