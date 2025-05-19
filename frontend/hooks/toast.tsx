import { useState } from "react";
import Toast from "../ui/toast";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const showToast = (message: string, type?: "success" | "error") => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}
