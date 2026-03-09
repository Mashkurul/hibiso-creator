"use client";

import { useMemo, useState } from "react";
import {
  appliedCampaigns,
  type AppliedCampaignStatus,
} from "@/app/lib/applied-campaigns";

type StatusFilter = "All" | AppliedCampaignStatus;

function StatusPill({ value }: { value: AppliedCampaignStatus }) {
  const styles: Record<AppliedCampaignStatus, string> = {
    Applied: "bg-[#eaf1ff] text-[#4f6fd3]",
    Accepted: "bg-[#e6f8ef] text-[#2f8a5a]",
    Rejected: "bg-[#fdecef] text-[#c04963]",
    Completed: "bg-[#e8f7ee] text-[#3d9a61]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[value]}`}>
      {value}
    </span>
  );
}

export function AppliedCampaignsContent({
  selectedCampaignId,
}: {
  selectedCampaignId?: number;
}) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

  const baseCampaigns = useMemo(() => {
    if (!selectedCampaignId || selectedCampaignId <= 0) {
      return appliedCampaigns;
    }

    return appliedCampaigns.filter((campaign) => campaign.id === selectedCampaignId);
  }, [selectedCampaignId]);

  const filteredCampaigns = useMemo(() => {
    if (activeFilter === "All") {
      return baseCampaigns;
    }

    return baseCampaigns.filter((campaign) => campaign.stage === activeFilter);
  }, [activeFilter, baseCampaigns]);

  const filterCards: Array<{
    label: StatusFilter;
    value: number;
    tone: string;
  }> = [
    {
      label: "All",
      value: baseCampaigns.length,
      tone: "bg-[#eef0f5] text-[#58647a]",
    },
    {
      label: "Applied",
      value: baseCampaigns.filter((campaign) => campaign.stage === "Applied").length,
      tone: "bg-[#eef3ff] text-[#5a74c6]",
    },
    {
      label: "Accepted",
      value: baseCampaigns.filter((campaign) => campaign.stage === "Accepted").length,
      tone: "bg-[#eaf8f1] text-[#4f9a72]",
    },
    {
      label: "Rejected",
      value: baseCampaigns.filter((campaign) => campaign.stage === "Rejected").length,
      tone: "bg-[#fdecef] text-[#d65778]",
    },
    {
      label: "Completed",
      value: baseCampaigns.filter((campaign) => campaign.stage === "Completed").length,
      tone: "bg-[#fff0e4] text-[#df8b37]",
    },
  ];

  return (
    <>
      <section
        className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
        style={{ animationDelay: "80ms" }}
      >
        {filterCards.map((item) => {
          const active = activeFilter === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveFilter(item.label)}
              className={`text-left rounded-2xl border p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition ${
                active
                  ? "border-transparent bg-gradient-to-r from-[#de8b34] to-[#e36d58] text-white"
                  : "border-[#e8ebf1] bg-white hover:bg-[#fffaf4]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.08em] ${
                      active ? "text-white/70" : "text-[#8d98ad]"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className={`mt-2 text-[28px] font-semibold leading-none ${active ? "text-white" : "text-[#2f3747]"}`}>
                    {item.value}
                  </p>
                </div>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                    active ? "bg-white/15 text-white" : item.tone
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M12 16V5M8 9l4-4 4 4M5 16v2.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="reveal-enter flex items-center justify-between" style={{ animationDelay: "120ms" }}>
        <p className="text-sm text-[#7c879b]">
          {activeFilter === "All"
            ? `Showing all ${filteredCampaigns.length} applied campaigns`
            : `Showing ${filteredCampaigns.length} ${activeFilter.toLowerCase()} campaign${filteredCampaigns.length === 1 ? "" : "s"}`}
        </p>
        {activeFilter !== "All" && (
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className="tap-press text-sm font-medium text-[#4f6fd3] transition hover:text-[#3f5ec3]"
          >
            Clear filter
          </button>
        )}
      </section>

      <section className="reveal-enter space-y-4" style={{ animationDelay: "140ms" }}>
        {filteredCampaigns.map((campaign, index) => (
          <article
            key={campaign.id}
            className="reveal-enter rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            style={{ animationDelay: `${180 + index * 40}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill value={campaign.stage} />
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#4f6fd3]">
                    {campaign.platform}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6b7487]">
                    {campaign.category}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f3747]">{campaign.campaign}</h2>
                <p className="mt-1 text-sm text-[#7c879b]">
                  {campaign.brand} . {campaign.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Budget</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{campaign.budget}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Applied On</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.appliedOn}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Campaign Dates</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                  {campaign.startDate} - {campaign.endDate}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Platform</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.platform}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Status Update</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.stage}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Campaign Brief</p>
                <p className="mt-2 text-sm leading-6 text-[#56627a]">{campaign.brief}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">
                  Latest Update
                </p>
                <p className="mt-2 text-sm leading-6 text-[#56627a]">{campaign.updateNote}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Deliverables</p>
                <ul className="mt-3 space-y-2 text-sm text-[#445066]">
                  {campaign.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#de8b34]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}

        {filteredCampaigns.length === 0 && (
          <article className="rounded-3xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">
              {baseCampaigns.length === 0 ? "Campaign not found" : "No campaigns found"}
            </h2>
            <p className="mt-2 text-sm text-[#7c879b]">
              {baseCampaigns.length === 0
                ? "The selected applied campaign could not be loaded from this workspace."
                : "Try another status filter or return to My Projects to choose a different application."}
            </p>
          </article>
        )}
      </section>
    </>
  );
}
