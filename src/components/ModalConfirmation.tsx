import Button from "./Button";

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  onSecondConfirm?: () => void;
  secondConfirmText?: string;
}

const ModalConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message = "Apakah anda yakin ingin menghapus data ini?",
  confirmText = "Hapus",
  onSecondConfirm = () => {},
  secondConfirmText,
}: ModalConfirmationProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto z-10">
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
          <p className="text-sm">{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          {secondConfirmText ? (
            <Button onClick={onSecondConfirm}>{secondConfirmText}</Button>
          ) : (
            <Button onClick={onClose}>Tutup</Button>
          )}
          <Button onClick={onConfirm} status="danger">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;
