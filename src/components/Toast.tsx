import { useEffect } from "react";

type ToastProps = {
  message: string | null;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed w-[320px] max-w-[90vw] rounded-[20px] top-[50%] left-1/2 -translate-x-1/2 z-200  bg-[rgb(239,228,215)] text-[rgb(96,45,20)] px-5 py-2.5 text-sm font-medium shadow-[0_4px_18px_rgba(0,0,0,0.25)]"
    >
      {message}
    </div>
  );
}
