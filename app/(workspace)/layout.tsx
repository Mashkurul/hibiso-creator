import SideNav from "../components/side-nav";
import TopNav from "../components/top-nav";
import type { ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f3ef]">
      <SideNav />
      <main className="md:ml-[264px]">
        <TopNav />
        <div className="page-enter p-5 md:p-10">{children}</div>
      </main>
    </div>
  );
}
