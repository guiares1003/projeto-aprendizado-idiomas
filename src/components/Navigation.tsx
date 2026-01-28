import { NavLink } from "react-router-dom";
import clsx from "clsx";

export const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Decks", to: "/decks" },
  { label: "Study", to: "/study" },
  { label: "Settings", to: "/settings" },
];

export const NavigationLinks = ({ orientation }: { orientation?: "horizontal" | "vertical" }) => (
  <nav className={clsx("flex gap-3", orientation === "vertical" ? "flex-col" : "justify-around")}>
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          clsx(
            "rounded-lg px-3 py-2 text-sm font-semibold transition",
            isActive ? "bg-brand text-white" : "text-slate-300 hover:bg-slate-800",
          )
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);
