import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      "w-full rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400",
      className,
    )}
    {...props}
  />
);

export const Textarea = ({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={clsx(
      "w-full rounded-lg border border-panel-border bg-panel-light px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400",
      className,
    )}
    {...props}
  />
);
