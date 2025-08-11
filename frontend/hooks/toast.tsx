import { useState } from "react";
import Toast from "../ui/toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type?: ToastType;
    duration?: number;
  } | null>(null);

  const showToast = (
    message: string,
    type: ToastType = "success",
    duration: number = 3000
  ) => {
    setToast({ message, type, duration });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      duration={toast.duration}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}
