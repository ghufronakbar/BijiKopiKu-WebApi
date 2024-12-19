import Button from "@/components/Button";
import ModalAction from "@/components/ModalAction";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import formatRupiah from "@/utils/format/formatRupiah";
import { $Enums, Coffee, Order, OrderItem, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { FaRegImages } from "react-icons/fa";

interface ResOrder extends Order {
  user: User;
  orderItems: ResOrderItem[];
}

interface ResOrderItem extends OrderItem {
  coffee: Coffee;
}

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

const setStatusText = (status: $Enums.OrderStatus) => {
  switch (status) {
    case "Dipesan":
      return "Menunggu Pembayaran Dari Pembeli";
    case "Diterima":
      return "Tandai sebagai selesai";
    case "Ditolak":
      return "";
    case "Dibatalkan":
      return "";
    case "Selesai":
      return "";
    case "Dibayar":
      return "Konfirmasi Pembayaran Pengguna";
    default:
      return "";
  }
};

const DetailOrderPage = () => {
  const [item, setItem] = useState<ResOrder>();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const router = useRouter();
  const { id } = router.query as { id: string };

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResOrder>>(`/orders/${id}`);
      setItem(res.data.data);
    } catch (error) {
      router.push("/order");
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  const handleUpdateStatus = async () => {
    try {
      setIsOpen(false);
      await axiosInstance.patch(`/orders/${id}`, { confirmed });      
      fetchData();
    } catch (error) {
      console.log(error);
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
    <Navigation title="Pesanan">
      <div className="w-full flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/2 lg:w-2/3 bg-white rounded-lg p-4 shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="text-white">
              <tr className="rounded-lg bg-primary">
                <th className="px-4 py-2 text-left">#{item.id}</th>
                <th className="px-4 py-2 text-left">
                  {formatDate(item.createdAt)}
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              <tr>
                <td className="px-4 py-2 font-semibold">Status</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      "font-semibold px-2 py-1 rounded-md " +
                      colorStatus(item.status)
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Nama</td>
                <td className="px-4 py-2">{item.user.name}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Email</td>
                <td className="px-4 py-2">{item.user.email}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Total</td>
                <td className="px-4 py-2">{formatRupiah(item.total)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Bukti Pembayaran</td>
                <td className="px-4 py-2">
                  {!item.paymentProof ? (
                    "Tidak Ada"
                  ) : (
                    <div className="flex flex-row gap-2 items-center">
                      Lihat <FaRegImages />
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {setStatusText(item.status) && (
            <Button
              className="my-4"
              status={
                item.status === "Dipesan"
                  ? "gray"
                  : item.status === "Diterima"
                  ? "success"
                  : "info"
              }
              disabled={item.status === "Dipesan"}
              onClick={() => setIsOpen(true)}
            >
              {setStatusText(item.status)}
            </Button>
          )}
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg p-4 shadow-lg flex flex-col gap-4">
          {item.orderItems.map((orderItem, idx) => (
            <table className="min-w-full table-auto" key={orderItem.id}>
              <thead className="text-white">
                <tr className="rounded-lg bg-primary">
                  <th className="px-4 py-2 text-left">{idx + 1}</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                <tr>
                  <td className="px-4 py-2 font-semibold">Kopi</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-row gap-2 items-center">
                      {orderItem.coffee.name} ({orderItem.coffee.type}){" "}
                      <Link href={`/coffee/${orderItem.coffee.id}`}>
                        <BiLinkExternal />
                      </Link>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Kuantitas</td>
                  <td className="px-4 py-2">{orderItem.quantity}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">SubTotal</td>
                  <td className="px-4 py-2">{formatRupiah(orderItem.total)}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
      <ModalAction
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={setStatusText(item.status)}
        confirmText="Ya"
        onConfirm={handleUpdateStatus}
      >
        <p>
          {item.status === "Dibayar"
            ? "Apakah bukti pembayaran tersebut valid?"
            : "Tandai pesanan jika sudah selesai"}
        </p>
        {item.status === "Dibayar" && (
          <div className="my-4">
            <div className="flex flex-row gap-2">
              <select
                className="w-full p-2 rounded-md border border-gray-300 bg-white"
                value={confirmed ? "true" : "false"}
                onChange={(e) => setConfirmed(e.target.value === "true")}
              >
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>
          </div>
        )}
      </ModalAction>
      <Toaster />
    </Navigation>
  );
};

export default DetailOrderPage;
