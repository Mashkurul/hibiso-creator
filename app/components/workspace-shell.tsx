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
    <div className="min-h-screen bg-[#f7f3ef]">
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

      <main className="md:ml-[264px]">
        <TopNav
          mobileMenuOpen={mobileMenuOpen}
          onMenuToggle={() => setMobileMenuOpen((current) => !current)}
        />
        <div className="page-enter p-4 sm:p-5 md:p-10">{children}</div>
      </main>
    </div>
  );
}
