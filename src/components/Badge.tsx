import clsx from "clsx";

type BadgeProps = {
  label: string;
  tone?: "neutral" | "info";
};

const Badge = ({ label, tone = "neutral" }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      tone === "info" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600",
    )}
  >
    {label}
  </span>
);

export default Badge;
