export type PaymentStatus = "Completed" | "Pending" | "Processing";

export type Transaction = {
  id: number;
  campaign: string;
  brand: string;
  grossAmount: number;
  commissionPercent: number;
  transactionDate: string;
  paymentDate: string;
  status: PaymentStatus;
  method: "Bank Transfer" | "Payoneer" | "Wise";
};

export type MonthlyEarning = {
  month: string;
  value: number;
};

export type TransactionHistoryItem = {
  date: string;
  title: string;
  detail: string;
  actor: string;
};

export type TransactionReport = {
  deliverables: string;
  views: string;
  engagementRate: string;
  revisions: string;
  history: TransactionHistoryItem[];
};

export const transactions: Transaction[] = [
  {
    id: 1001,
    campaign: "Summer Collection Launch",
    brand: "GlowCo",
    grossAmount: 450,
    commissionPercent: 12,
    transactionDate: "2026-03-01",
    paymentDate: "2026-03-08",
    status: "Processing",
    method: "Bank Transfer",
  },
  {
    id: 1002,
    campaign: "Resort Walkthrough Reel",
    brand: "EcoStay",
    grossAmount: 520,
    commissionPercent: 12,
    transactionDate: "2026-02-26",
    paymentDate: "2026-03-10",
    status: "Pending",
    method: "Wise",
  },
  {
    id: 1003,
    campaign: "Travel Vlog Mini Series",
    brand: "Wanderlust",
    grossAmount: 700,
    commissionPercent: 12,
    transactionDate: "2026-02-18",
    paymentDate: "2026-02-21",
    status: "Completed",
    method: "Bank Transfer",
  },
  {
    id: 1004,
    campaign: "At-Home Workout Stories",
    brand: "FitNest",
    grossAmount: 540,
    commissionPercent: 12,
    transactionDate: "2026-02-02",
    paymentDate: "2026-02-05",
    status: "Completed",
    method: "Payoneer",
  },
  {
    id: 1005,
    campaign: "Night Repair Testimonial Reel",
    brand: "Bloom Skin",
    grossAmount: 530,
    commissionPercent: 12,
    transactionDate: "2026-01-28",
    paymentDate: "2026-02-01",
    status: "Completed",
    method: "Wise",
  },
  {
    id: 1006,
    campaign: "Hydration Habit Challenge",
    brand: "SolarSip",
    grossAmount: 480,
    commissionPercent: 12,
    transactionDate: "2026-01-17",
    paymentDate: "2026-01-20",
    status: "Completed",
    method: "Bank Transfer",
  },
  {
    id: 1007,
    campaign: "Coffee Bar Lifestyle Post",
    brand: "Brewline",
    grossAmount: 310,
    commissionPercent: 12,
    transactionDate: "2026-03-03",
    paymentDate: "2026-03-12",
    status: "Pending",
    method: "Bank Transfer",
  },
];

export const monthlyTrend: MonthlyEarning[] = [
  { month: "Oct", value: 1220 },
  { month: "Nov", value: 1680 },
  { month: "Dec", value: 1410 },
  { month: "Jan", value: 1960 },
  { month: "Feb", value: 1760 },
  { month: "Mar", value: 1280 },
];

export const transactionReports: Record<number, TransactionReport> = {
  1001: {
    deliverables: "1 reel + 5 photos",
    views: "84.2K",
    engagementRate: "4.8%",
    revisions: "1 round",
    history: [
      { date: "2026-02-20", title: "Contract Signed", detail: "Project terms and payout finalized.", actor: "GlowCo + Creator" },
      { date: "2026-02-24", title: "Content Submitted", detail: "Initial draft uploaded for review.", actor: "Creator" },
      { date: "2026-02-27", title: "Revision Requested", detail: "Minor CTA update requested by brand.", actor: "GlowCo" },
      { date: "2026-03-01", title: "Payout Processing", detail: "Hibis'O finance started the payout batch.", actor: "Hibis'O Finance" },
    ],
  },
  1002: {
    deliverables: "1 walkthrough reel",
    views: "63.7K",
    engagementRate: "4.1%",
    revisions: "2 rounds",
    history: [
      { date: "2026-02-10", title: "Campaign Accepted", detail: "Invitation accepted and scope confirmed.", actor: "Creator" },
      { date: "2026-02-18", title: "Draft Uploaded", detail: "First version shared with brand.", actor: "Creator" },
      { date: "2026-02-21", title: "Final Approval", detail: "Brand approved final cut.", actor: "EcoStay" },
      { date: "2026-02-26", title: "Queued for Payout", detail: "Payment is waiting for the next Hibis'O payout cycle.", actor: "Hibis'O Finance" },
    ],
  },
  1003: {
    deliverables: "3 vlog videos",
    views: "151.4K",
    engagementRate: "5.3%",
    revisions: "1 round",
    history: [
      { date: "2026-01-29", title: "Project Kickoff", detail: "Campaign milestones approved.", actor: "Wanderlust" },
      { date: "2026-02-09", title: "Assets Delivered", detail: "All deliverables uploaded successfully.", actor: "Creator" },
      { date: "2026-02-14", title: "Release Confirmed", detail: "Brand confirmed content publication.", actor: "Wanderlust" },
      { date: "2026-02-21", title: "Payment Completed", detail: "Net payout released to creator bank account.", actor: "Hibis'O Finance" },
    ],
  },
};

export function currency(amount: number) {
  return `\u20AC${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function getCommissionAmount(transaction: Transaction) {
  return (transaction.grossAmount * transaction.commissionPercent) / 100;
}

export function getNetAmount(transaction: Transaction) {
  return transaction.grossAmount - getCommissionAmount(transaction);
}
