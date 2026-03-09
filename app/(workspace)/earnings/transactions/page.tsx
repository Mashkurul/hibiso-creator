"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import {
  currency,
  formatDate,
  getCommissionAmount,
  getNetAmount,
  transactionReports,
  transactions,
  type PaymentStatus,
  type Transaction,
} from "@/app/lib/earnings-data";

export default function EarningsTransactionsPage() {
  const [statusFilter, setStatusFilter] = useState<"All" | PaymentStatus>("All");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    if (statusFilter === "All") {
      return transactions;
    }

    return transactions.filter((transaction) => transaction.status === statusFilter);
  }, [statusFilter]);

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

  const downloadPdf = (transaction: Transaction) => {
    const report = transactionReports[transaction.id] ?? {
      deliverables: "Campaign deliverables",
      views: "N/A",
      engagementRate: "N/A",
      revisions: "N/A",
      history: [],
    };

    const lines = [
      "Hibis'O Transaction Report",
      "",
      `Campaign: ${transaction.campaign}`,
      `Brand: ${transaction.brand}`,
      `Transaction ID: TX-${transaction.id}`,
      `Status: ${transaction.status}`,
      `Method: ${transaction.method}`,
      `Transaction Date: ${formatDate(transaction.transactionDate)}`,
      `Payment Date: ${formatDate(transaction.paymentDate)}`,
      `Gross Amount: ${currency(transaction.grossAmount)}`,
      `Hibis'O Commission (${transaction.commissionPercent}%): -${currency(getCommissionAmount(transaction))}`,
      `Net To Creator: ${currency(getNetAmount(transaction))}`,
      "",
      `Deliverables: ${report.deliverables}`,
      `Views: ${report.views}`,
      `Engagement Rate: ${report.engagementRate}`,
      `Revisions: ${report.revisions}`,
      "",
      "Timeline:",
      ...report.history.map(
        (item) => `${formatDate(item.date)} | ${item.title} | ${item.actor} | ${item.detail}`
      ),
    ];

    const escapedLines = lines.map((line) =>
      line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
    );

    let y = 780;
    const content: string[] = ["BT", "/F1 11 Tf", "50 810 Td"];
    escapedLines.forEach((line, index) => {
      if (index === 0) {
        content.push(`(${line}) Tj`);
        y -= 20;
        return;
      }
      content.push(`1 0 0 1 50 ${y} Tm`);
      content.push(`(${line}) Tj`);
      y -= 16;
      if (y < 60) {
        y = 780;
      }
    });
    content.push("ET");

    const stream = content.join("\n");
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transaction-${transaction.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const detailModal =
    selectedTransaction && selectedReport
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] overflow-y-auto bg-[#0e1420]/55 px-4 py-6"
            onClick={() => setSelectedTransaction(null)}
          >
            <div
              className="pop-enter relative mx-auto my-4 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-[0_24px_52px_rgba(15,23,42,0.25)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">
                    Transaction Detail
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[#2f3747]">
                    {selectedTransaction.campaign}
                  </h2>
                  <p className="mt-1 text-sm text-[#7c879b]">
                    {selectedTransaction.brand} . TX-{selectedTransaction.id}
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
                  <p className="text-xs text-[#8b97ab]">Gross Amount</p>
                  <p className="mt-1 text-xl font-semibold text-[#2f3747]">{currency(selectedTransaction.grossAmount)}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-xs text-[#8b97ab]">Hibis&apos;O Commission</p>
                  <p className="mt-1 text-xl font-semibold text-[#c04963]">
                    -{currency(getCommissionAmount(selectedTransaction))}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-xs text-[#8b97ab]">Net To Creator</p>
                  <p className="mt-1 text-xl font-semibold text-[#2f3747]">{currency(getNetAmount(selectedTransaction))}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-xs text-[#8b97ab]">Status</p>
                  <p className="mt-1 text-xl font-semibold text-[#2f3747]">{selectedTransaction.status}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <h3 className="text-sm font-semibold text-[#2f3747]">Payment Details</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[#4b5870]">
                    <li className="flex items-center justify-between"><span>Transaction Date</span><span className="font-semibold">{formatDate(selectedTransaction.transactionDate)}</span></li>
                    <li className="flex items-center justify-between"><span>Payment Date</span><span className="font-semibold">{formatDate(selectedTransaction.paymentDate)}</span></li>
                    <li className="flex items-center justify-between"><span>Method</span><span className="font-semibold">{selectedTransaction.method}</span></li>
                    <li className="flex items-center justify-between"><span>Commission Rate</span><span className="font-semibold">{selectedTransaction.commissionPercent}%</span></li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <h3 className="text-sm font-semibold text-[#2f3747]">Campaign Metrics</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[#4b5870]">
                    <li className="flex items-center justify-between"><span>Deliverables</span><span className="font-semibold">{selectedReport.deliverables}</span></li>
                    <li className="flex items-center justify-between"><span>Views</span><span className="font-semibold">{selectedReport.views}</span></li>
                    <li className="flex items-center justify-between"><span>Engagement</span><span className="font-semibold">{selectedReport.engagementRate}</span></li>
                    <li className="flex items-center justify-between"><span>Revisions</span><span className="font-semibold">{selectedReport.revisions}</span></li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
                <h3 className="text-sm font-semibold text-[#2f3747]">Transaction Timeline</h3>
                <ul className="mt-3 space-y-3">
                  {selectedReport.history.map((item, index) => (
                    <li key={`${item.date}-${item.title}-${index}`} className="rounded-xl bg-white p-3">
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

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => downloadPdf(selectedTransaction)}
                  className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
                >
                  Download PDF
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
          </div>,
          document.body
        )
      : null;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Transaction History</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            View every transaction the creator has completed, including payment dates, commissions, and net payouts.
          </p>
        </div>
        <Link
          href="/earnings"
          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
        >
          Back to Earnings
        </Link>
      </section>

      <section className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: "80ms" }}>
        {[
          { label: "All Transactions", value: transactions.length },
          { label: "Completed", value: transactions.filter((transaction) => transaction.status === "Completed").length },
          { label: "Pending", value: transactions.filter((transaction) => transaction.status === "Pending").length },
          { label: "Processing", value: transactions.filter((transaction) => transaction.status === "Processing").length },
        ].map((item) => {
          const isActive = statusFilter === "All" ? item.label === "All Transactions" : item.label === statusFilter;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setStatusFilter(item.label === "All Transactions" ? "All" : (item.label as PaymentStatus))}
              className={`text-left rounded-2xl border p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-[#de8b34] to-[#e36d58] text-white"
                  : "border-[#e8ebf1] bg-white hover:bg-[#fffaf4]"
              }`}
            >
              <p className={`text-xs font-medium uppercase tracking-[0.08em] ${isActive ? "text-white/70" : "text-[#8d98ad]"}`}>
                {item.label}
              </p>
              <p className={`mt-2 text-[28px] font-semibold leading-none ${isActive ? "text-white" : "text-[#2f3747]"}`}>
                {item.value}
              </p>
            </button>
          );
        })}
      </section>

      <section className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "140ms" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-[#2f3747]">All Transactions</h2>
            <p className="mt-1 text-sm text-[#7c879b]">
              Full creator transaction list with gross amount, Hibis&apos;O commission, and final net earnings.
            </p>
          </div>
          <p className="text-sm text-[#7c879b]">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length === 1 ? "" : "s"}
          </p>
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
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="cursor-pointer bg-white text-sm text-[#3e4a60] transition hover:bg-[#f8fbff]"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <td className="rounded-l-xl px-3 py-3">
                    <p className="font-medium text-[#2f3747]">{transaction.campaign}</p>
                    <p className="mt-1 text-xs text-[#8b97ab]">{transaction.brand}</p>
                  </td>
                  <td className="px-3 py-3 text-[#8894a8]">{formatDate(transaction.transactionDate)}</td>
                  <td className="px-3 py-3 text-[#8894a8]">{formatDate(transaction.paymentDate)}</td>
                  <td className="px-3 py-3 font-semibold text-[#2f3747]">{currency(transaction.grossAmount)}</td>
                  <td className="px-3 py-3 font-semibold text-[#c04963]">-{currency(getCommissionAmount(transaction))}</td>
                  <td className="px-3 py-3 font-semibold text-[#2f3747]">{currency(getNetAmount(transaction))}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-[#eef0f5] px-3 py-1 text-xs font-semibold text-[#58647a]">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3">{transaction.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detailModal}
    </div>
  );
}
