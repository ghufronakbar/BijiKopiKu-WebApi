import Button from "./Button";

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  confirmText?: string;
  children?: React.ReactNode;
}

const ModalAction = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "Simpan",
  children,
}: ModalConfirmationProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg mx-auto z-10 w-[90%] md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm">{children}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button onClick={onClose} status="gray">
            Batal
          </Button>
          <Button onClick={onConfirm} status="info">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalAction;
