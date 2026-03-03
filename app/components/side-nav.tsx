"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

function IconWrapper({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center text-current">
      {children}
    </span>
  );
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    label: "Available Campaigns",
    href: "/available-campaigns",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect x="3" y="6" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 6V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V6" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 11h18" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    label: "My Projects",
    href: "/my-projects",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M4 7.5A2.5 2.5 0 016.5 5H10l2 2h5.5A2.5 2.5 0 0120 9.5v7A2.5 2.5 0 0117.5 19h-11A2.5 2.5 0 014 16.5v-9z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    label: "Submit Content",
    href: "/submit-content",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M12 16V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 16v2.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    label: "Earnings",
    href: "/earnings",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M14.5 5.5H10a2.5 2.5 0 000 5h4a2.5 2.5 0 010 5H9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 3v2.5M12 18.5V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    label: "Contracts",
    href: "/contracts",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect x="5" y="3" width="14" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <IconWrapper>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5.5 19a6.5 6.5 0 0113 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </IconWrapper>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="nav-enter flex min-h-screen w-full flex-col border-r border-white/10 bg-[#2a2725] text-[#b7b4bf] md:fixed md:left-0 md:top-0 md:h-screen md:w-[264px] md:min-w-[264px] md:overflow-hidden">
      <div className="px-5 pb-7 pt-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3ea5] via-[#ff6c56] to-[#ffb44f]">
            <span className="text-xs font-bold text-white">hb</span>
          </div>
          <span className="text-[24px] font-semibold leading-none text-white">Hibis&apos;o</span>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6f7488]">
            Creator Workspace
          </p>
          <div className="mt-2 h-px w-full bg-white/10" />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`tap-press flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#f7a334] to-[#ee6a53] text-white"
                    : "hover:bg-white/5 hover:pl-5 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 px-5 py-7">
        <Link
          href="/sign-out"
          className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <IconWrapper>
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M10 7V5.5A1.5 1.5 0 0111.5 4h6A1.5 1.5 0 0119 5.5v13a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 0110 18.5V17" stroke="currentColor" strokeWidth="1.8" />
              <path d="M14 12H5m0 0l3 3m-3-3l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconWrapper>
          <span>Sign Out</span>
        </Link>
        <p className="mt-5 text-center text-[10px] text-[#646b81]">Solar Powered Creativity</p>
      </div>
    </aside>
  );
}
