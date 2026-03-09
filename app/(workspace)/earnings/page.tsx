"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  currency,
  formatDate,
  getCommissionAmount,
  getNetAmount,
  monthlyTrend,
  transactionReports,
  transactions,
  type PaymentStatus,
  type Transaction,
} from "@/app/lib/earnings-data";

type RangeOption = "30D" | "90D" | "12M";

function StatusPill({ status }: { status: PaymentStatus }) {
  const cls: Record<PaymentStatus, string> = {
    Completed: "bg-[#e8f7ee] text-[#3d9a61]",
    Pending: "bg-[#fff5df] text-[#b98f27]",
    Processing: "bg-[#eaf1ff] text-[#4f6fd3]",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls[status]}`}>{status}</span>;
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return "";

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
    const d = new Date("2026-03-10");
    d.setDate(d.getDate() - daysBack);
    return d;
  }, [daysBack]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.transactionDate);
      const inRange = txDate >= cutoff;
      const byStatus = statusFilter === "All" ? true : tx.status === statusFilter;
      return inRange && byStatus;
    });
  }, [cutoff, statusFilter]);

  const totals = useMemo(() => {
    const grossTotal = filteredTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0);
    const commissionTotal = filteredTransactions.reduce((sum, tx) => sum + getCommissionAmount(tx), 0);
    const netTotal = filteredTransactions.reduce((sum, tx) => sum + getNetAmount(tx), 0);
    const completedPayments = filteredTransactions
      .filter((tx) => tx.status === "Completed")
      .reduce((sum, tx) => sum + getNetAmount(tx), 0);
    const pendingPayments = filteredTransactions
      .filter((tx) => tx.status === "Pending" || tx.status === "Processing")
      .reduce((sum, tx) => sum + getNetAmount(tx), 0);

    const nextPayout = filteredTransactions
      .filter((tx) => tx.status !== "Completed")
      .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())[0];

    return {
      grossTotal,
      commissionTotal,
      netTotal,
      completedPayments,
      pendingPayments,
      nextPayoutDate: nextPayout?.paymentDate,
      nextPayoutAmount: nextPayout ? getNetAmount(nextPayout) : 0,
    };
  }, [filteredTransactions]);

  useEffect(() => {
    if (!selectedTransaction) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTransaction(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [selectedTransaction]);

  const selectedReport =
    selectedTransaction
      ? transactionReports[selectedTransaction.id] ?? {
          deliverables: "Campaign deliverables",
          views: "N/A",
          engagementRate: "N/A",
          revisions: "N/A",
          history: [
            {
              date: selectedTransaction.transactionDate,
              title: "Transaction Recorded",
              detail: "This transaction was recorded in the creator earnings history.",
              actor: "Hibis'O",
            },
          ],
        }
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

  const reportModal =
    selectedTransaction && selectedReport
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
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">Transaction Detail</p>
                <h2 className="mt-1 text-2xl font-semibold text-[#2f3747]">{selectedTransaction.campaign}</h2>
                <p className="mt-1 text-sm text-[#7c879b]">
                  {selectedTransaction.brand} . {formatDate(selectedTransaction.transactionDate)} . {selectedTransaction.method}
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
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Gross</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{currency(selectedTransaction.grossAmount)}</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Hibis&apos;O Commission</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">
                  -{currency(getCommissionAmount(selectedTransaction))}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Net To Creator</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{currency(getNetAmount(selectedTransaction))}</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-xs text-[#8b97ab]">Payment Date</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{formatDate(selectedTransaction.paymentDate)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <h3 className="text-sm font-semibold text-[#2f3747]">Campaign Summary</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#4b5870]">
                  <li className="flex items-center justify-between"><span>Deliverables</span><span className="font-semibold">{selectedReport.deliverables}</span></li>
                  <li className="flex items-center justify-between"><span>Total Views</span><span className="font-semibold">{selectedReport.views}</span></li>
                  <li className="flex items-center justify-between"><span>Engagement Rate</span><span className="font-semibold">{selectedReport.engagementRate}</span></li>
                  <li className="flex items-center justify-between"><span>Revisions</span><span className="font-semibold">{selectedReport.revisions}</span></li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <h3 className="text-sm font-semibold text-[#2f3747]">Payout Status</h3>
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
              <h3 className="text-sm font-semibold text-[#2f3747]">Transaction History</h3>
              <ul className="mt-3 space-y-3">
                {selectedReport.history.map((item, idx) => (
                  <li key={`${item.date}-${item.title}-${idx}`} className="rounded-xl bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#2f3747]">{item.title}</p>
                        <p className="mt-1 text-xs text-[#7c879b]">{item.detail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-[#6f7c92]">{formatDate(item.date)}</p>
                        <p className="mt-1 text-[11px] text-[#8b97ab]">{item.actor}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
      : null;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Earnings</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Monitor total earnings, pending and completed payouts, commission deductions, and full transaction history.
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

      <section className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-5" style={{ animationDelay: "120ms" }}>
        {[
          { label: "Total Earnings", value: currency(totals.grossTotal), tone: "bg-[#eef3ff] text-[#5a74c6]" },
          { label: "Pending Payments", value: currency(totals.pendingPayments), tone: "bg-[#fff0e4] text-[#df8b37]" },
          { label: "Completed Payments", value: currency(totals.completedPayments), tone: "bg-[#eaf8f1] text-[#4f9a72]" },
          { label: "Hibis'O Commission", value: currency(totals.commissionTotal), tone: "bg-[#fdecef] text-[#d65778]" },
          { label: "Next Payment Date", value: totals.nextPayoutDate ? formatDate(totals.nextPayoutDate) : "None", tone: "bg-[#f4ecff] text-[#7a57b8]" },
        ].map((item) => (
          item.label === "Total Earnings" ? (
            <Link
              key={item.label}
              href="/earnings/transactions"
              className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition hover:bg-[#f8fbff]"
            >
              <div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">{item.label}</p>
                  <p className="mt-2 text-[24px] font-semibold leading-tight text-[#2f3747]">{item.value}</p>
                </div>
              </div>
            </Link>
          ) : (
          <article key={item.label} className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]">
            <div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">{item.label}</p>
                <p className="mt-2 text-[24px] font-semibold leading-tight text-[#2f3747]">{item.value}</p>
              </div>
            </div>
          </article>
          )
        ))}
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-[1.45fr_1fr]" style={{ animationDelay: "180ms" }}>
        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#2f3747]">Earnings Trend</h2>
            <p className="text-xs text-[#8b97ab]">Gross earnings by month</p>
          </div>
          <div className="relative rounded-2xl bg-white p-3" onMouseLeave={() => setActivePointIndex(null)}>
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-[240px] w-full">
              {[0, 1, 2, 3].map((step) => {
                const y = chart.padTop + ((chart.height - chart.padTop - chart.padBottom) * step) / 3;
                return <line key={step} x1={chart.padX} y1={y} x2={chart.width - chart.padX} y2={y} stroke="#edf2f8" strokeWidth="1" strokeDasharray={step === 3 ? "0" : "4 6"} />;
              })}
              <line x1={chart.padX} y1={chart.height - chart.padBottom} x2={chart.width - chart.padX} y2={chart.height - chart.padBottom} stroke="#dde4ef" strokeWidth="1.5" />
              <path d={chart.areaPath} fill="url(#earningsAreaBase)" />
              <path d={chart.linePath} fill="none" stroke="url(#earningsLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {chart.points.map((point, index) => (
                <g key={point.month}>
                  <circle cx={point.x} cy={point.y} r={activePointIndex === index ? "7.5" : "5.5"} fill="#fff" stroke="#de8b34" strokeWidth={activePointIndex === index ? "3" : "2.5"} />
                  <circle cx={point.x} cy={point.y} r="14" fill="transparent" onMouseEnter={() => setActivePointIndex(index)} onMouseMove={() => setActivePointIndex(index)} />
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7e8aa1]">{chart.points[activePointIndex].month}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#2f3747]">{currency(chart.points[activePointIndex].value)}</p>
              </div>
            )}
          </div>
        </article>

        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#2f3747]">Payout Overview</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Primary Method</p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">Bank Transfer</p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Next Scheduled Payout</p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                {totals.nextPayoutDate ? `${formatDate(totals.nextPayoutDate)} . ${currency(totals.nextPayoutAmount)}` : "No pending payouts"}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Commission Policy</p>
              <p className="mt-1 text-sm leading-6 text-[#56627a]">
                Hibis&apos;O deducts a visible platform commission from each campaign payout before the creator receives the net payment.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMessage(`Payout request sent for ${currency(totals.completedPayments)} available balance.`)}
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
          <div>
            <h2 className="text-xl font-semibold text-[#2f3747]">Transaction History</h2>
            <p className="mt-1 text-sm text-[#7c879b]">
              Review every campaign payment, the Hibis&apos;O commission, net payout, and payment dates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Completed", "Pending", "Processing"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`tap-press rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === status ? "bg-[#2f3747] text-white" : "bg-white text-[#5d6880] hover:bg-[#f0f4fb]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-[#8b97ab]">
                <th className="px-3 py-2 font-medium">Campaign</th>
                <th className="px-3 py-2 font-medium">Transaction Date</th>
                <th className="px-3 py-2 font-medium">Payment Date</th>
                <th className="px-3 py-2 font-medium">Gross</th>
                <th className="px-3 py-2 font-medium">Commission</th>
                <th className="px-3 py-2 font-medium">Net</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="cursor-pointer bg-white text-sm text-[#3e4a60] transition hover:bg-[#f8fbff]"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <td className="rounded-l-xl px-3 py-3">
                    <p className="font-medium text-[#2f3747]">{tx.campaign}</p>
                    <p className="mt-1 text-xs text-[#8b97ab]">{tx.brand}</p>
                  </td>
                  <td className="px-3 py-3 text-[#8894a8]">{formatDate(tx.transactionDate)}</td>
                  <td className="px-3 py-3 text-[#8894a8]">{formatDate(tx.paymentDate)}</td>
                  <td className="px-3 py-3 font-semibold text-[#2f3747]">{currency(tx.grossAmount)}</td>
                  <td className="px-3 py-3 font-semibold text-[#c04963]">-{currency(getCommissionAmount(tx))}</td>
                  <td className="px-3 py-3 font-semibold text-[#2f3747]">{currency(getNetAmount(tx))}</td>
                  <td className="px-3 py-3"><StatusPill status={tx.status} /></td>
                  <td className="rounded-r-xl px-3 py-3">{tx.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {reportModal && createPortal(reportModal, document.body)}
    </div>
  );
}
