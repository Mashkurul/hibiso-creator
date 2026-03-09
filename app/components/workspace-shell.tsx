"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SideNav from "./side-nav";
import TopNav from "./top-nav";

type WorkspaceShellProps = {
  children: ReactNode;
};

export default function WorkspaceShell({ children }: WorkspaceShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8%] top-[-6%] h-72 w-72 rounded-full bg-[rgba(247,166,76,0.18)] blur-3xl" />
        <div className="absolute right-[-4%] top-[12%] h-80 w-80 rounded-full bg-[rgba(87,112,214,0.12)] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-72 w-72 rounded-full bg-[rgba(227,109,88,0.12)] blur-3xl" />
      </div>

      <SideNav
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-[#0e1420]/55 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="relative md:ml-[264px]">
        <TopNav
          mobileMenuOpen={mobileMenuOpen}
          onMenuToggle={() => setMobileMenuOpen((current) => !current)}
        />
        <div className="page-enter px-4 pb-6 pt-3 sm:px-5 md:px-8 md:pb-10 md:pt-4 xl:px-10">
          <div className="workspace-panel rounded-[34px] p-4 sm:p-5 md:p-7">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
