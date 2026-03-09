"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";

type ContractStatus = "Pending Signature" | "Signed" | "In Review" | "Expired";

type ContractItem = {
  id: number;
  campaign: string;
  brand: string;
  value: number;
  status: ContractStatus;
  issuedOn: string;
  dueBy: string;
  paymentTerms: string;
  usageRights: string;
  deliverables: string[];
  clauses: string[];
};

const contracts: ContractItem[] = [
  {
    id: 301,
    campaign: "Summer Collection Launch",
    brand: "GlowCo",
    value: 450,
    status: "Pending Signature",
    issuedOn: "2026-03-02",
    dueBy: "2026-03-06",
    paymentTerms: "50% on approval, 50% on publish",
    usageRights: "Organic social usage for 90 days",
    deliverables: ["1 reel", "5 edited photos", "2 story frames"],
    clauses: ["One revision included", "Disclosure tag required", "Raw files optional add-on"],
  },
  {
    id: 302,
    campaign: "Resort Walkthrough Reel",
    brand: "EcoStay",
    value: 520,
    status: "In Review",
    issuedOn: "2026-02-25",
    dueBy: "2026-03-05",
    paymentTerms: "Net 15 after invoice",
    usageRights: "Paid social whitelisting for 30 days",
    deliverables: ["1 walkthrough reel", "1 caption draft"],
    clauses: ["Music licensing by creator", "One re-shoot not included", "Brand credit mandatory"],
  },
  {
    id: 303,
    campaign: "Travel Vlog Mini Series",
    brand: "Wanderlust",
    value: 700,
    status: "Signed",
    issuedOn: "2026-02-01",
    dueBy: "2026-02-28",
    paymentTerms: "100% on final approval",
    usageRights: "Organic and web usage for 6 months",
    deliverables: ["3 short videos", "3 thumbnails"],
    clauses: ["Two revisions included", "English subtitles required"],
  },
  {
    id: 304,
    campaign: "City Weekend UGC Pack",
    brand: "UrbanNest",
    value: 390,
    status: "Expired",
    issuedOn: "2026-01-12",
    dueBy: "2026-01-19",
    paymentTerms: "Net 30",
    usageRights: "Organic social usage for 30 days",
    deliverables: ["1 UGC video", "3 product photos"],
    clauses: ["Contract void after deadline", "No auto-renew"],
  },
];

function money(value: number) {
  return `\u20AC${value.toLocaleString("en-US")}`;
}

function StatusPill({ status }: { status: ContractStatus }) {
  const cls: Record<ContractStatus, string> = {
    "Pending Signature": "bg-[#fff5df] text-[#b98f27]",
    Signed: "bg-[#e8f7ee] text-[#3d9a61]",
    "In Review": "bg-[#eaf1ff] text-[#4f6fd3]",
    Expired: "bg-[#fdecef] text-[#c04963]",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls[status]}`}>{status}</span>;
}

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | ContractStatus>("All");
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const [message, setMessage] = useState("");

  const filteredContracts = useMemo(
    () => contracts.filter((item) => (statusFilter === "All" ? true : item.status === statusFilter)),
    [statusFilter]
  );

  const stats = useMemo(() => {
    const pending = contracts.filter((c) => c.status === "Pending Signature").length;
    const signed = contracts.filter((c) => c.status === "Signed").length;
    const reviewing = contracts.filter((c) => c.status === "In Review").length;
    const totalValue = contracts
      .filter((c) => c.status !== "Expired")
      .reduce((sum, c) => sum + c.value, 0);
    return { pending, signed, reviewing, totalValue };
  }, []);

  useEffect(() => {
    if (!selectedContract) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedContract(null);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [selectedContract]);

  const contractModal = selectedContract ? (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#0e1420]/55 px-4 py-6"
      onClick={() => setSelectedContract(null)}
    >
      <div
        className="pop-enter relative mx-auto my-4 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-[0_24px_52px_rgba(15,23,42,0.25)] max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">Contract Details</p>
            <h2 className="mt-1 text-2xl font-semibold text-[#2f3747]">{selectedContract.campaign}</h2>
            <p className="mt-1 text-sm text-[#7c879b]">{selectedContract.brand}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedContract(null)}
            className="tap-press rounded-full p-2 text-[#7d889a] transition hover:bg-[#f2f5fb] hover:text-[#2f3747]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Contract Value</p>
            <p className="mt-1 text-xl font-semibold text-[#2f3747]">{money(selectedContract.value)}</p>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Status</p>
            <div className="mt-2"><StatusPill status={selectedContract.status} /></div>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Issued On</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">{selectedContract.issuedOn}</p>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Sign By</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">{selectedContract.dueBy}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <h3 className="text-sm font-semibold text-[#2f3747]">Terms</h3>
            <div className="mt-3 space-y-2 text-sm text-[#4b5870]">
              <p><span className="font-semibold text-[#2f3747]">Payment:</span> {selectedContract.paymentTerms}</p>
              <p><span className="font-semibold text-[#2f3747]">Usage Rights:</span> {selectedContract.usageRights}</p>
            </div>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <h3 className="text-sm font-semibold text-[#2f3747]">Deliverables</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#4b5870]">
              {selectedContract.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#de8b34]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
          <h3 className="text-sm font-semibold text-[#2f3747]">Important Clauses</h3>
          <ul className="mt-3 space-y-2 text-sm text-[#4b5870]">
            {selectedContract.clauses.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#4f6fd3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setMessage(`Contract ${selectedContract.id} was downloaded.`);
              setSelectedContract(null);
            }}
            className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setMessage(`Contract ${selectedContract.id} marked as signed.`);
              setSelectedContract(null);
            }}
            className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white"
          >
            Sign Contract
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter">
        <h1 className="text-3xl font-semibold text-[#2f3747]">Contracts</h1>
        <p className="mt-1 text-sm text-[#7c879b]">
          Review agreements, monitor signature status, and manage brand contract terms.
        </p>
      </section>

      <section className="reveal-enter hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: "80ms" }}>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Pending Signature</p>
          <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{stats.pending}</p>
        </article>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Signed</p>
          <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{stats.signed}</p>
        </article>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">In Review</p>
          <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{stats.reviewing}</p>
        </article>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Active Value</p>
          <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{money(stats.totalValue)}</p>
        </article>
      </section>

      <section className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "140ms" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-[#2f3747]">Contract List</h2>
          <div className="flex flex-wrap gap-2">
            {(["All", "Pending Signature", "In Review", "Signed", "Expired"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`tap-press rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === status
                    ? "bg-[#2f3747] text-white"
                    : "bg-white text-[#5d6880] hover:bg-[#f0f4fb]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-[#8b97ab]">
                <th className="px-3 py-2 font-medium">Campaign</th>
                <th className="px-3 py-2 font-medium">Brand</th>
                <th className="px-3 py-2 font-medium">Issued</th>
                <th className="px-3 py-2 font-medium">Due</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer bg-white text-sm text-[#3e4a60] transition hover:bg-[#f8fbff]"
                  onClick={() => setSelectedContract(item)}
                >
                  <td className="rounded-l-xl px-3 py-3 font-medium text-[#2f3747]">{item.campaign}</td>
                  <td className="px-3 py-3">{item.brand}</td>
                  <td className="px-3 py-3 text-[#8894a8]">{item.issuedOn}</td>
                  <td className="px-3 py-3 text-[#8894a8]">{item.dueBy}</td>
                  <td className="px-3 py-3"><StatusPill status={item.status} /></td>
                  <td className="rounded-r-xl px-3 py-3 text-right font-semibold text-[#2f3747]">{money(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {message && (
        <section className="reveal-enter rounded-2xl bg-white p-4 text-sm text-[#5f6d85] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          {message}
        </section>
      )}

      {contractModal && createPortal(contractModal, document.body)}
    </div>
  );
}
