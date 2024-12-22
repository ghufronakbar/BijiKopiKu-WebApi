import Button from "@/components/Button";
import ModalAction from "@/components/ModalAction";
import ModalConfirmation from "@/components/ModalConfirmation";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import toast from "@/helper/toast";
import { ResErr, ResOk } from "@/models/Api";
import formatDate from "@/utils/format/formatDate";
import formatRupiah from "@/utils/format/formatRupiah";
import { Coffee } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResCoffee extends Coffee {
  _count: {
    orderItems: number;
  };
}

interface CoffeeDTO {
  id: string;
  name: string;
  price: number;
  isForCoffeeEnthusiast: boolean;
  type: string;
  taste: string;
  isItForSweet: boolean;
  flavor: string;
  desc: string;
}

const initCoffeeDTO: CoffeeDTO = {
  id: "",
  name: "",
  price: 0,
  isForCoffeeEnthusiast: false,
  type: "Arabica",
  taste: "Light",
  isItForSweet: false,
  flavor: "Asam",
  desc: "",
};

const CoffeePage = () => {
  const [data, setData] = useState<ResCoffee[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CoffeeDTO>(initCoffeeDTO);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [picture, setPicture] = useState<File | null>(null);
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

  const handleCreate = async () => {
    try {
      if (picture === null) return toast.error("Harap upload gambar");
      setIsOpen(false);
      const res = await axiosInstance.post<ResOk<ResCoffee>>("/coffee", form);
      const formData = new FormData();
      formData.append("picture", picture);
      await axiosInstance.put(`/coffee/${res.data.data.id}/picture`, formData);
      fetchData();
      setForm(initCoffeeDTO);
      toast.success("Produk berhasil ditambahkan");
    } catch (error) {
      console.log(error);
      const err = error as ResErr;
      toast.error(err?.response?.data?.message);
    }
  };

  const handleEdit = async () => {
    try {
      setIsOpen(false);
      await axiosInstance.put(`/coffee/${form.id}`, form);
      fetchData();
      setForm(initCoffeeDTO);
      toast.success("Produk berhasil diedit");
    } catch (error) {
      console.log(error);
      const err = error as ResErr;
      toast.error(err?.response?.data?.message);
    }
  };

  const handleDelete = async () => {
    try {
      setSelectedId(undefined);
      await axiosInstance.delete(`/coffee/${selectedId}`);
      toast.success("Produk berhasil dihapus");
      fetchData();
    } catch (error) {
      const err = error as ResErr;
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navigation title="Produk">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full md:w-1/2 lg:w-1/3 p-2 rounded-md border border-gray-300 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button onClick={() => setIsOpen(true)}>Tambah Produk</Button>
        </div>

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
                  <td className="px-4 py-2">
                    <Image
                      src={item?.picture || "/placeholder.jpg"}
                      alt=""
                      width={400}
                      height={400}
                      className="min-w-12 min-h-12 w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
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
                    <button
                      className="bg-white text-red-500 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100"
                      onClick={() => setSelectedId(item.id)}
                    >
                      Hapus
                    </button>
                    <button
                      className="bg-white text-teal-500 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100"
                      onClick={() => {
                        setForm(item);
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </button>
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
      <ModalAction
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setForm(initCoffeeDTO);
        }}
        title={form.id ? "Edit Produk" : "Tambah Produk"}
        confirmText="Simpan"
        onConfirm={form.id ? handleEdit : handleCreate}
      >
        <div className="flex flex-col w-full gap-2 overflow-auto max-h-96">
          <label className="text-black">Nama</label>
          <input
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label className="text-black">Foto</label>
          <Image
            src={picture ? URL.createObjectURL(picture) : "/placeholder.jpg"}
            alt=""
            width={400}
            height={400}
            className="min-w-12 min-h-12 w-12 h-12 object-cover rounded-lg"
          />
          <input
            type="file"
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            onChange={(e) => {
              if (e.target.files) {
                setPicture(e.target.files[0]);
              }
            }}
          />
          <label className="text-black">Harga</label>
          <input
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
          <label className="text-black">Deskripsi</label>
          <textarea
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          <label className="text-black">Cocok untuk Pecinta Kopi</label>
          <select
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.isForCoffeeEnthusiast ? "Iya" : "Tidak"}
            onChange={(e) =>
              setForm({
                ...form,
                isForCoffeeEnthusiast: e.target.value === "Iya",
              })
            }
          >
            <option value="Iya">Iya</option>
            <option value="Tidak">Tidak</option>
          </select>
          <label className="text-black">Jenis Kopi</label>
          <select
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Arabica">Arabica</option>
            <option value="Robusta">Robusta</option>
          </select>
          <label className="text-black">Tipe Rasa Kopi</label>
          <select
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.taste}
            onChange={(e) => setForm({ ...form, taste: e.target.value })}
          >
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Strong">Strong</option>
          </select>
          <label className="text-black">Cocok untuk Manis</label>
          <select
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.isItForSweet ? "Iya" : "Tidak"}
            onChange={(e) =>
              setForm({ ...form, isItForSweet: e.target.value === "Iya" })
            }
          >
            <option value="Iya">Iya</option>
            <option value="Tidak">Tidak</option>
          </select>
          <label className="text-black">Rasa Kopi</label>
          <select
            className="bg-neutral-100 px-2 rounded-md py-2 mb-2"
            value={form.flavor}
            onChange={(e) => setForm({ ...form, flavor: e.target.value })}
          >
            <option value="Asam">Asam</option>
            <option value="Pahit">Pahit</option>
            <option value="Karamel">Karamel</option>
            <option value="Coklat">Coklat</option>
            <option value="Buah">Buah</option>
            <option value="Kacang">Kacang</option>
          </select>
        </div>
      </ModalAction>
      <ModalConfirmation
        title="Apakah anda yakin ingin menghapus produk ini?"
        isOpen={!!selectedId}
        onClose={() => setSelectedId(undefined)}
        onConfirm={handleDelete}
      />
      <Toaster />
    </Navigation>
  );
};

export default CoffeePage;
