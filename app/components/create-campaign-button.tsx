"use client";

import Link from "next/link";

type CreateCampaignButtonProps = {
  className?: string;
};

export default function CreateCampaignButton({
  className = "",
}: CreateCampaignButtonProps) {
  return (
    <Link
      href="/campaign-offers/create"
      className={`tap-press inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 ${className}`.trim()}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      Create Campaign
    </Link>
  );
}
