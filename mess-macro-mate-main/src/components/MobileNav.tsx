import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  UtensilsCrossed,
  User,
} from "lucide-react";
const links = [
  {
    to: "/",
    label: "Plan",
    icon: Home,
  },
  {
    to: "/menu",
    label: "Menu",
    icon: UtensilsCrossed,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
];
export default function MobileNav() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-3xl border border-border/50 bg-background/90 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around py-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 rounded-xl px-5 py-2 transition-all duration-300 ${
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}