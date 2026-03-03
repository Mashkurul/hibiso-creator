"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type RangeOption = "30D" | "90D" | "12M";
type PaymentStatus = "Paid" | "Pending" | "Processing";

type Transaction = {
  id: number;
  campaign: string;
  brand: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: "Bank Transfer" | "Payoneer" | "Wise";
};

type MonthlyEarning = {
  month: string;
  value: number;
};

type TransactionHistoryItem = {
  date: string;
  title: string;
  detail: string;
  actor: string;
};

type TransactionReport = {
  deliverables: string;
  views: string;
  engagementRate: string;
  revisions: string;
  serviceFeePercent: number;
  taxPercent: number;
  history: TransactionHistoryItem[];
};

const transactions: Transaction[] = [
  { id: 1001, campaign: "Summer Collection Launch", brand: "GlowCo", amount: 450, date: "2026-03-01", status: "Processing", method: "Bank Transfer" },
  { id: 1002, campaign: "Resort Walkthrough Reel", brand: "EcoStay", amount: 520, date: "2026-02-26", status: "Pending", method: "Wise" },
  { id: 1003, campaign: "Travel Vlog Mini Series", brand: "Wanderlust", amount: 700, date: "2026-02-18", status: "Paid", method: "Bank Transfer" },
  { id: 1004, campaign: "At-Home Workout Stories", brand: "FitNest", amount: 540, date: "2026-02-02", status: "Paid", method: "Payoneer" },
  { id: 1005, campaign: "Night Repair Testimonial Reel", brand: "Bloom Skin", amount: 530, date: "2026-01-28", status: "Paid", method: "Wise" },
  { id: 1006, campaign: "Hydration Habit Challenge", brand: "SolarSip", amount: 480, date: "2026-01-17", status: "Paid", method: "Bank Transfer" },
  { id: 1007, campaign: "Coffee Bar Lifestyle Post", brand: "Brewline", amount: 310, date: "2026-03-03", status: "Pending", method: "Bank Transfer" },
];

const monthlyTrend: MonthlyEarning[] = [
  { month: "Oct", value: 1220 },
  { month: "Nov", value: 1680 },
  { month: "Dec", value: 1410 },
  { month: "Jan", value: 1960 },
  { month: "Feb", value: 1760 },
  { month: "Mar", value: 1280 },
];

const transactionReports: Record<number, TransactionReport> = {
  1001: {
    deliverables: "1 reel + 5 photos",
    views: "84.2K",
    engagementRate: "4.8%",
    revisions: "1 round",
    serviceFeePercent: 5,
    taxPercent: 10,
    history: [
      { date: "2026-02-20", title: "Contract Signed", detail: "Project terms and payout finalized.", actor: "GlowCo + Creator" },
      { date: "2026-02-24", title: "Content Submitted", detail: "Initial draft uploaded for review.", actor: "Creator" },
      { date: "2026-02-27", title: "Revision Requested", detail: "Minor CTA update requested by brand.", actor: "GlowCo" },
      { date: "2026-03-01", title: "Payment Processing", detail: "Finance team initiated payout batch.", actor: "Platform Finance" },
    ],
  },
  1002: {
    deliverables: "1 walkthrough reel",
    views: "63.7K",
    engagementRate: "4.1%",
    revisions: "2 rounds",
    serviceFeePercent: 5,
    taxPercent: 10,
    history: [
      { date: "2026-02-10", title: "Campaign Accepted", detail: "Invitation accepted and scope confirmed.", actor: "Creator" },
      { date: "2026-02-18", title: "Draft Uploaded", detail: "First version shared with brand.", actor: "Creator" },
      { date: "2026-02-21", title: "Final Approval", detail: "Brand approved final cut.", actor: "EcoStay" },
      { date: "2026-02-26", title: "Awaiting Payout", detail: "Queued for next payout cycle.", actor: "Platform Finance" },
    ],
  },
  1003: {
    deliverables: "3 vlog videos",
    views: "151.4K",
    engagementRate: "5.3%",
    revisions: "1 round",
    serviceFeePercent: 5,
    taxPercent: 10,
    history: [
      { date: "2026-01-29", title: "Project Kickoff", detail: "Campaign milestones approved.", actor: "Wanderlust" },
      { date: "2026-02-09", title: "Assets Delivered", detail: "All deliverables uploaded successfully.", actor: "Creator" },
      { date: "2026-02-14", title: "Release Confirmed", detail: "Brand confirmed content publication.", actor: "Wanderlust" },
      { date: "2026-02-18", title: "Payment Completed", detail: "Payout released to bank account.", actor: "Platform Finance" },
    ],
  },
};

function currency(amount: number) {
  return `\u20AC${amount.toLocaleString("en-US")}`;
}

function StatusPill({ status }: { status: PaymentStatus }) {
  const cls: Record<PaymentStatus, string> = {
    Paid: "bg-[#e8f7ee] text-[#3d9a61]",
    Pending: "bg-[#fff5df] text-[#b98f27]",
    Processing: "bg-[#eaf1ff] text-[#4f6fd3]",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls[status]}`}>{status}</span>;
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) {
    return "";
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export default function EarningsPage() {
  const [range, setRange] = useState<RangeOption>("90D");
  const [statusFilter, setStatusFilter] = useState<"All" | PaymentStatus>("All");
  const [message, setMessage] = useState("");
  const [activePointIndex, setActivePointIndex] = useState<number | null>(monthlyTrend.length - 1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const daysBack = useMemo(() => {
    if (range === "30D") return 30;
    if (range === "90D") return 90;
    return 365;
  }, [range]);

  const cutoff = useMemo(() => {
    const d = new Date("2026-03-03");
    d.setDate(d.getDate() - daysBack);
    return d;
  }, [daysBack]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const inRange = txDate >= cutoff;
      const byStatus = statusFilter === "All" ? true : tx.status === statusFilter;
      return inRange && byStatus;
    });
  }, [cutoff, statusFilter]);

  const totals = useMemo(() => {
    const paid = filteredTransactions
      .filter((tx) => tx.status === "Paid")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const pending = filteredTransactions
      .filter((tx) => tx.status === "Pending")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const processing = filteredTransactions
      .filter((tx) => tx.status === "Processing")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      total: paid + pending + processing,
      paid,
      pending,
      available: paid,
      processing,
    };
  }, [filteredTransactions]);

  useEffect(() => {
    if (!selectedTransaction) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTransaction(null);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [selectedTransaction]);

  const selectedReport = selectedTransaction
    ? transactionReports[selectedTransaction.id] ?? {
        deliverables: "Campaign deliverables",
        views: "N/A",
        engagementRate: "N/A",
        revisions: "N/A",
        serviceFeePercent: 5,
        taxPercent: 10,
        history: [
          {
            date: selectedTransaction.date,
            title: "Transaction Recorded",
            detail: "This payout entry was recorded in earnings history.",
            actor: "Platform",
          },
        ],
      }
    : null;

  const selectedBreakdown = selectedTransaction && selectedReport
    ? (() => {
        const gross = selectedTransaction.amount;
        const fee = (gross * selectedReport.serviceFeePercent) / 100;
        const tax = (gross * selectedReport.taxPercent) / 100;
        const net = gross - fee - tax;
        return { gross, fee, tax, net };
      })()
    : null;

  const reportModal =
    selectedTransaction && selectedReport && selectedBreakdown
      ? (
        <div
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#0e1420]/55 px-4 py-6"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="pop-enter relative mx-auto my-4 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-[0_24px_52px_rgba(15,23,42,0.25)] max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">
                  Transaction Report
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#2f3747]">
                  {selectedTransaction.campaign}
                </h2>
                <p className="mt-1 text-sm text-[#7c879b]">
                  {selectedTransaction.brand} . {selectedTransaction.date} . {selectedTransaction.method}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="tap-press rounded-full p-2 text-[#7d889a] transition hover:bg-[#f2f5fb] hover:text-[#2f3747]"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Gross</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{currency(selectedBreakdown.gross)}</p>
              </div>
              <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Platform Fee</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">-{currency(selectedBreakdown.fee)}</p>
              </div>
              <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Tax</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">-{currency(selectedBreakdown.tax)}</p>
              </div>
              <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Net Paid</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{currency(selectedBreakdown.net)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
                <h3 className="text-sm font-semibold text-[#2f3747]">Performance Summary</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#4b5870]">
                  <li className="flex items-center justify-between"><span>Deliverables</span><span className="font-semibold">{selectedReport.deliverables}</span></li>
                  <li className="flex items-center justify-between"><span>Total Views</span><span className="font-semibold">{selectedReport.views}</span></li>
                  <li className="flex items-center justify-between"><span>Engagement Rate</span><span className="font-semibold">{selectedReport.engagementRate}</span></li>
                  <li className="flex items-center justify-between"><span>Revisions</span><span className="font-semibold">{selectedReport.revisions}</span></li>
                </ul>
              </div>

              <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
                <h3 className="text-sm font-semibold text-[#2f3747]">Payment Status</h3>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-[#7c879b]">Current Status</p>
                  <StatusPill status={selectedTransaction.status} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-[#7c879b]">Method</p>
                  <p className="text-sm font-semibold text-[#2f3747]">{selectedTransaction.method}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-[#7c879b]">Reference</p>
                  <p className="text-sm font-semibold text-[#2f3747]">TX-{selectedTransaction.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
              <h3 className="text-sm font-semibold text-[#2f3747]">Transaction History Timeline</h3>
              <ul className="mt-3 space-y-3">
                {selectedReport.history.map((item, idx) => (
                  <li key={`${item.date}-${item.title}-${idx}`} className="rounded-xl bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#2f3747]">{item.title}</p>
                        <p className="mt-1 text-xs text-[#7c879b]">{item.detail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-[#6f7c92]">{item.date}</p>
                        <p className="mt-1 text-[11px] text-[#8b97ab]">{item.actor}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
              >
                Print Report
              </button>
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )
      : null;

  const chart = useMemo(() => {
    const width = 640;
    const height = 240;
    const padX = 36;
    const padTop = 20;
    const padBottom = 40;
    const minValue = Math.min(...monthlyTrend.map((m) => m.value));
    const maxValue = Math.max(...monthlyTrend.map((m) => m.value));
    const rangeValue = Math.max(maxValue - minValue, 1);

    const points = monthlyTrend.map((item, index) => {
      const ratioX = monthlyTrend.length === 1 ? 0 : index / (monthlyTrend.length - 1);
      const x = padX + ratioX * (width - padX * 2);
      const yRatio = (item.value - minValue) / rangeValue;
      const y = height - padBottom - yRatio * (height - padTop - padBottom);
      return { ...item, x, y };
    });

    const linePath = buildSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z`;

    return { width, height, padX, padTop, padBottom, points, linePath, areaPath };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Earnings</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Track revenue, payout status, and campaign-level payment history.
          </p>
        </div>

        <div className="reveal-enter flex items-center gap-2 rounded-2xl bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "80ms" }}>
          {(["30D", "90D", "12M"] as RangeOption[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`tap-press rounded-xl px-3 py-2 text-xs font-semibold transition ${
                range === item ? "bg-[#2f3747] text-white" : "text-[#5c697f] hover:bg-[#f1f4f9]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: "120ms" }}>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Total (Range)</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{currency(totals.total)}</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3ff] text-[#5a74c6]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 11h8M8 14h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </article>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Paid Out</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{currency(totals.paid)}</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#4f9a72]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.5 12.5l2.2 2.1L15.8 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </article>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Pending</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{currency(totals.pending)}</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e4] text-[#df8b37]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </article>
        <article className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Processing</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{currency(totals.processing)}</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fdecef] text-[#d65778]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M5 12h5l2-4 2 8 2-4h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </article>
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-[1.5fr_1fr]" style={{ animationDelay: "180ms" }}>
        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-[#2f3747]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0e4] text-[#df8b37]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M5 16l4-4 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Monthly Earnings Trend
            </h2>
            <p className="text-xs text-[#8b97ab]">Last 6 months</p>
          </div>
          <div
            className="relative rounded-2xl bg-white p-3"
            onMouseLeave={() => setActivePointIndex(null)}
          >
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-[240px] w-full">
              {[0, 1, 2, 3].map((step) => {
                const y = chart.padTop + ((chart.height - chart.padTop - chart.padBottom) * step) / 3;
                return (
                  <line
                    key={step}
                    x1={chart.padX}
                    y1={y}
                    x2={chart.width - chart.padX}
                    y2={y}
                    stroke="#edf2f8"
                    strokeWidth="1"
                    strokeDasharray={step === 3 ? "0" : "4 6"}
                  />
                );
              })}
              <line
                x1={chart.padX}
                y1={chart.height - chart.padBottom}
                x2={chart.width - chart.padX}
                y2={chart.height - chart.padBottom}
                stroke="#dde4ef"
                strokeWidth="1.5"
              />
              <line
                x1={chart.padX}
                y1={chart.padTop}
                x2={chart.padX}
                y2={chart.height - chart.padBottom}
                stroke="#eef2f7"
                strokeWidth="1.5"
              />

              <path d={chart.areaPath} fill="url(#earningsAreaBase)" className="earnings-area-reveal" />
              <path d={chart.areaPath} fill="url(#earningsAreaGlow)" className="earnings-area-reveal-soft" />
              <path
                d={chart.linePath}
                fill="none"
                stroke="url(#earningsLine)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="earnings-line-reveal"
              />

              {chart.points.map((point, index) => (
                <g key={point.month}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={activePointIndex === index ? "7.5" : "5.5"}
                    fill="#fff"
                    stroke="#de8b34"
                    strokeWidth={activePointIndex === index ? "3" : "2.5"}
                    className="earnings-point-reveal transition-all"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="14"
                    fill="transparent"
                    onMouseEnter={() => setActivePointIndex(index)}
                    onMouseMove={() => setActivePointIndex(index)}
                  />
                  <text x={point.x} y={chart.height - 14} textAnchor="middle" className="fill-[#6b7790] text-[12px] font-semibold">
                    {point.month}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="earningsLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#de8b34" />
                  <stop offset="100%" stopColor="#e36d58" />
                </linearGradient>
                <linearGradient id="earningsAreaBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#de8b34" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#de8b34" stopOpacity="0.01" />
                </linearGradient>
                <linearGradient id="earningsAreaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e36d58" stopOpacity="0.16" />
                  <stop offset="65%" stopColor="#f0a24e" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {activePointIndex !== null && (
              <div
                className="pointer-events-none absolute z-10 rounded-xl border border-[#e6eaf2] bg-white/95 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.14)] backdrop-blur-sm"
                style={{
                  left: `${(chart.points[activePointIndex].x / chart.width) * 100}%`,
                  top: `${(chart.points[activePointIndex].y / chart.height) * 100}%`,
                  transform: "translate(-50%, -120%)",
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7e8aa1]">
                  {chart.points[activePointIndex].month}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#2f3747]">
                  {currency(chart.points[activePointIndex].value)}
                </p>
              </div>
            )}
          </div>
        </article>

        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-[#2f3747]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf1ff] text-[#4f6fd3]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            Payout Account
          </h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white p-3">
              <p className="inline-flex items-center gap-1 text-xs text-[#8b97ab]">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Primary Method
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">Bank Transfer</p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="inline-flex items-center gap-1 text-xs text-[#8b97ab]">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 3.5V7M16 3.5V7M4 9.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Next Payout Date
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">March 08, 2026</p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="inline-flex items-center gap-1 text-xs text-[#8b97ab]">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path d="M15.8 6.5H10a3.5 3.5 0 000 7h4.8m-4.8 4h5.8M7.2 10h9.4M7.2 14h8.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Available to Withdraw
              </p>
              <p className="mt-1 text-lg font-semibold text-[#2f3747]">{currency(totals.available)}</p>
            </div>
            <button
              type="button"
              onClick={() => setMessage(`Payout request sent for ${currency(totals.available)}.`)}
              className="tap-press w-full rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Request Payout
            </button>
            {message && <p className="text-xs text-[#5f6d85]">{message}</p>}
          </div>
        </article>
      </section>

      <section className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "240ms" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-[#2f3747]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef3ff] text-[#5a74c6]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            Transactions
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Paid", "Pending", "Processing"] as const).map((status) => (
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
          <table className="w-full min-w-[820px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-[#8b97ab]">
                <th className="px-3 py-2 font-medium">Campaign</th>
                <th className="px-3 py-2 font-medium">Brand</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="cursor-pointer bg-white text-sm text-[#3e4a60] transition hover:bg-[#f8fbff]"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <td className="rounded-l-xl px-3 py-3 font-medium text-[#2f3747]">{tx.campaign}</td>
                  <td className="px-3 py-3">{tx.brand}</td>
                  <td className="px-3 py-3 text-[#8894a8]">{tx.date}</td>
                  <td className="px-3 py-3">{tx.method}</td>
                  <td className="px-3 py-3"><StatusPill status={tx.status} /></td>
                  <td className="rounded-r-xl px-3 py-3 text-right font-semibold text-[#2f3747]">
                    <span className="inline-flex items-center gap-2">
                      {currency(tx.amount)}
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#8a97ab]">
                        <path d="M9 6h9m0 0v9m0-9L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {reportModal && createPortal(reportModal, document.body)}

      <style jsx>{`
        .earnings-line-reveal {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: earningsLineDraw 1s ease-out forwards;
        }

        .earnings-area-reveal {
          opacity: 0;
          animation: earningsAreaFade 0.8s ease-out 0.2s forwards;
        }

        .earnings-area-reveal-soft {
          opacity: 0;
          animation: earningsAreaFade 1s ease-out 0.35s forwards;
        }

        .earnings-point-reveal {
          opacity: 0;
          transform-origin: center;
          animation: earningsPointPop 0.35s ease-out forwards;
        }

        @keyframes earningsLineDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes earningsAreaFade {
          to {
            opacity: 1;
          }
        }

        @keyframes earningsPointPop {
          from {
            opacity: 0;
            transform: scale(0.75);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
