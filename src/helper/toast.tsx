import { toaster } from "@/components/ui/toaster";

const toast = {
  loading: () => {
    toaster.create({
      title: "Mohon Tunggu",
      type: "info",
    });
  },
  success: (message?: string | null) => {
    toaster.create({
      title: message || "Berhasil",
      type: "success",
    });
  },
  undo: (callback: () => void) => {
    toaster.create({
      title: "Urungkan perubahan?",
      type: "info",
      action: {
        label: "OK",
        onClick: callback,
      },
      duration: 10000,
    });
  },
  error: (message?: string | null) => {
    toaster.create({
      title: message || "Terjadi Kesalahan",
      type: "error",
    });
  },
};

export default toast;
