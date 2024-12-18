import Button from "@/components/Button";
import ModalAction from "@/components/ModalAction";
import ModalConfirmation from "@/components/ModalConfirmation";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import toast from "@/helper/toast";
import { ResErr, ResOk } from "@/models/Api";
import {
  FormAddEngineer,
  initFormAddEngineer,
} from "@/models/request/Engineer";
import { Engineer } from "@prisma/client";
import { useEffect, useState } from "react";

interface ResEngineer extends Engineer {
  _count: { orders: number };
}

const EngineerPage = () => {
  const [data, setData] = useState<ResEngineer[]>([]);
  const [selected, setSelected] = useState<ResEngineer>();
  const [selectedEdit, setSelectedEdit] = useState<ResEngineer>();
  const [formAdd, setFormAdd] = useState<FormAddEngineer>(initFormAddEngineer);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.field.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase())
  );

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<ResEngineer[]>>("/engineers");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading();
      await axiosInstance.delete(`/engineers/${selected?.id}`);
      toast.success("Berhasil menghapus teknisi");
      fetchData();
      setSelected(undefined);
    } catch (error) {
      console.log(error);
      const err = error as ResErr;
      toast.error(err.response?.data.message);
    }
  };

  const handleEdit = async () => {
    try {
      toast.loading();
      await axiosInstance.put(`/engineers/${selectedEdit?.id}`, selectedEdit);
      toast.success("Berhasil mengedit teknisi");
      fetchData();
      setSelectedEdit(undefined);
    } catch (error) {
      console.log(error);
      const err = error as ResErr;
      toast.error(err.response?.data.message);
    }
  };

  const handleAdd = async () => {
    try {
      toast.loading();
      await axiosInstance.post(`/engineers`, formAdd);
      toast.success("Berhasil mendaftarkan teknisi");
      fetchData();
      setFormAdd(initFormAddEngineer);
      setIsAddOpen(false);
    } catch (error) {
      console.log(error);
      const err = error as ResErr;
      toast.error(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navigation title="Teknisi">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Cari teknisi..."
            className="w-full md:w-1/2 lg:w-1/3 p-2 rounded-md border border-gray-300 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button>
            <span onClick={() => setIsAddOpen(true)}>Daftar Teknisi</span>
          </Button>
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          {filteredData.map((item) => (
            <div
              className="w-full flex flex-col bg-white rounded-lg p-4 gap-2"
              key={item.id}
            >
              <div className="text-sm font-semibold text-neutral-400 tracking-wider">
                #{item.id}
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="text-lg font-semibold text-secondary flex flex-row items-center gap-2">
                  {item.name}
                </div>
                <div className="font-semibold text-white bg-primary rounded-lg w-fit px-2 py-1 text-xs flex flex-row items-center">
                  {item.field}
                </div>
                <div className="text-secondary flex flex-row items-center gap-2">
                  No Hp:{" "}
                  <span className="font-normal text-base">{item.phone}</span>{" "}
                </div>
                <div className="text-sm font-semibold text-secondary flex flex-row items-center gap-2">
                  Total Pengerjaan:{" "}
                  <span className="font-normal text-sm">
                    {item._count.orders}
                  </span>{" "}
                </div>
              </div>
              <div className="flex flex-row gap-2 self-end">
                <button
                  className="bg-red-500 text-white w-fit h-fit rounded-md px-2 py-1 font-semibold"
                  onClick={() => setSelected(item)}
                >
                  Hapus
                </button>
                <button
                  className="bg-primary text-white w-fit h-fit rounded-md px-2 py-1 font-semibold"
                  onClick={() => setSelectedEdit(item)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalConfirmation
        isOpen={!!selected}
        onClose={() => setSelected(undefined)}
        onConfirm={handleDelete}
      />
      <ModalAction
        isOpen={!!selectedEdit}
        onClose={() => setSelectedEdit(undefined)}
        title="Edit Teknisi"
        onConfirm={handleEdit}
      >
        <div className="w-full flex flex-col gap-2">
          <p className="text-sm font-semibold text-black tracking-wider">
            Nama
          </p>
          <input
            type="text"
            placeholder="Nama"
            className="w-full p-2 rounded-md border border-gray-300 bg-white mb-2"
            value={selectedEdit?.name}
            onChange={(e) => {
              if (selectedEdit) {
                setSelectedEdit({ ...selectedEdit, name: e.target.value });
              }
            }}
          />
          <p className="text-sm font-semibold text-black tracking-wider">
            Bidang
          </p>
          <input
            type="text"
            placeholder="Bidang"
            className="w-full p-2 rounded-md border border-gray-300 bg-white mb-2"
            value={selectedEdit?.field}
            onChange={(e) => {
              if (selectedEdit) {
                setSelectedEdit({ ...selectedEdit, field: e.target.value });
              }
            }}
          />
          <p className="text-sm font-semibold text-black tracking-wider">
            No Telepon
          </p>
          <input
            inputMode="tel"
            type="tel"
            placeholder="62812345678"
            className="w-full p-2 rounded-md border border-gray-300 bg-white mb-2"
            value={selectedEdit?.phone}
            onChange={(e) => {
              if (selectedEdit) {
                setSelectedEdit({ ...selectedEdit, phone: e.target.value });
              }
            }}
          />
        </div>
      </ModalAction>
      <ModalAction
        isOpen={isAddOpen}
        onClose={() => {
          setFormAdd(initFormAddEngineer);
          setIsAddOpen(false);
        }}
        title="Daftar Teknisi"
        onConfirm={handleAdd}
      >
        <div className="w-full flex flex-col gap-2">
          <p className="text-sm font-semibold text-black tracking-wider">
            Nama
          </p>
          <input
            type="text"
            placeholder="Nama"
            className="w-full p-2 rounded-md border border-gray-300 bg-white mb-2"
            value={formAdd.name}
            onChange={(e) => setFormAdd({ ...formAdd, name: e.target.value })}
          />
          <p className="text-sm font-semibold text-black tracking-wider">
            Bidang
          </p>
          <input
            type="text"
            placeholder="Bidang"
            className="w-full p-2 rounded-md border border-gray-300 bg-white mb-2"
            value={formAdd?.field}
            onChange={(e) => setFormAdd({ ...formAdd, field: e.target.value })}
          />
          <p className="text-sm font-semibold text-black tracking-wider">
            No Telepon
          </p>
          <input
            inputMode="tel"
            type="tel"
            placeholder="62812345678"
            className="w-full p-2 rounded-md border border-gray-300 bg-white mb-2"
            value={formAdd?.phone}
            onChange={(e) => setFormAdd({ ...formAdd, phone: e.target.value })}
          />
        </div>
      </ModalAction>
      <Toaster />
    </Navigation>
  );
};

export default EngineerPage;
