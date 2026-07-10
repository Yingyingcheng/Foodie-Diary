type ConfirmDialogProps = {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-150 flex items-center justify-center bg-[rgba(0,0,0,0.4)] backdrop-blur-[1px]"
      onClick={onCancel}
    >
      <div
        className="w-[320px] max-w-[90vw] rounded-[20px] bg-[rgb(239,228,215)] p-6 text-center shadow-[0_4px_18px_rgba(120,60,30,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[15px] font-bold text-olive-dark mb-5">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="appearance-none h-9 px-5 rounded-lg border border-[rgb(96,45,20)] bg-transparent cursor-pointer text-[13px] font-medium text-brown-btn transition-all duration-250 hover:bg-white hover:transition-none"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="appearance-none h-9 px-5 rounded-lg border border-transparent bg-[rgb(255,215,217)] cursor-pointer text-[13px] font-medium text-brown-btn transition-all duration-250 hover:bg-brown-darkest hover:text-cream hover:font-bold hover:transition-none"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
