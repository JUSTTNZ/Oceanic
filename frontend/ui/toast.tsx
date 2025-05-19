"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => prev - 1);
    }, 20);

    const timeout = setTimeout(() => {
      if (onClose) onClose();
      clearInterval(interval);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [onClose]);

  const colors =
    type === "success"
      ? { bg: "bg-green-100", text: "text-green-800", border: "border-green-500", fill: "bg-green-500" }
      : { bg: "bg-red-100", text: "text-red-800", border: "border-red-500", fill: "bg-red-500" };

  return (
    <div className={`fixed top-5 right-5 z-50 w-full max-w-sm ${colors.bg} ${colors.text} border-l-4 ${colors.border} px-4 py-3 rounded shadow-lg`}>
      <div className="text-sm">{message}</div>
      <div className="h-1 mt-2 rounded bg-gray-200 overflow-hidden">
        <div
          className={`${colors.fill} h-full transition-all duration-100`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
