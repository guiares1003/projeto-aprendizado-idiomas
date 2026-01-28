import clsx from "clsx";

type BadgeProps = {
  label: string;
  tone?: "neutral" | "info";
};

const Badge = ({ label, tone = "neutral" }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      tone === "info" ? "bg-indigo-500/20 text-indigo-200" : "bg-slate-800 text-slate-200",
    )}
  >
    {label}
  </span>
);

export default Badge;
