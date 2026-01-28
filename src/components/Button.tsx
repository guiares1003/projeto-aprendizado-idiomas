import { ButtonHTMLAttributes, ReactElement, ReactNode, cloneElement, isValidElement } from "react";
import clsx from "clsx";

const variantClasses: Record<string, string> = {
  primary: "bg-brand text-white hover:bg-indigo-500",
  secondary: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-red-500 text-white hover:bg-red-400",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  asChild?: boolean;
  children?: ReactNode;
};

const Button = ({ variant = "primary", className, asChild, children, ...props }: ButtonProps) => {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    className,
  );
  if (asChild && children && !Array.isArray(children) && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      ...props,
      className: clsx(classes, (children as ReactElement).props.className),
    });
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
