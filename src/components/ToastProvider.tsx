import { ReactNode } from "react";
import { create } from "zustand";
import clsx from "clsx";

export type ToastTone = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastStore = {
  toasts: Toast[];
  addToast: (message: string, tone?: ToastTone) => void;
  removeToast: (id: string) => void;
};

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, tone = "info") => {
    const id = `toast_${Math.random().toString(36).slice(2, 10)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, tone }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3200);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export const useToast = () => useToastStore();

const toneStyles: Record<ToastTone, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-500 text-white",
  info: "bg-slate-900 text-white",
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toasts, removeToast } = useToastStore();
  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" aria-live="polite">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            className={clsx(
              "rounded-lg px-4 py-3 text-left text-sm shadow-lg transition",
              toneStyles[toast.tone],
            )}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </button>
        ))}
      </div>
    </>
  );
};

export default ToastProvider;
