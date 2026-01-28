import { ReactNode } from "react";
import Button from "./Button";

type ModalProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

const Modal = ({
  title,
  description,
  children,
  open,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-panel-border bg-panel p-6 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-slate-300">{description}</p>}
        </div>
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
