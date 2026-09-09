"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "หน้าหลัก", labelEn: "Home" },
  { href: "/status", icon: Activity, label: "สถานะ", labelEn: "Status" },
  { href: "/admin", icon: ShieldCheck, label: "ระบบ", labelEn: "Admin" },
];

export default function NavbarMobile() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[100] md:hidden">
      {/* Frosted-glass background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200/60 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]" />

      <div className="relative flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] h-[68px]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center gap-0.5 
                w-20 py-1.5 rounded-2xl transition-all duration-300 active:scale-90
                ${
                  isActive
                    ? "text-emerald-700"
                    : "text-slate-400 hover:text-slate-600"
                }
              `}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-fade-up" />
              )}

              {/* Icon container */}
              <span
                className={`
                  flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-emerald-100/80 shadow-sm shadow-emerald-200/50 scale-110"
                      : "bg-transparent"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"
                  }`}
                />
              </span>

              {/* Label */}
              <span
                className={`text-[10px] font-black leading-none tracking-wide transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
