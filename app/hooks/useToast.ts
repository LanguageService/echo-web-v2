import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<string[]>([]);

  const toast = (message: string) => {
    setToasts((prev) => [...prev, message]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2000);
  };

  return { toast, toasts };
}
