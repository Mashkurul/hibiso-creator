"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CreateCampaignButton from "@/app/components/create-campaign-button";
import {
  readCreatorCampaigns,
  type CreatorCampaign,
  updateCreatorCampaignStatus,
} from "@/app/lib/creator-campaigns";

function StatusPill({ status }: { status: CreatorCampaign["status"] }) {
  const className =
    status === "Published"
      ? "bg-[#e8f7ee] text-[#2f8a5a]"
      : status === "Archived"
        ? "bg-[#eef0f5] text-[#58647a]"
        : "bg-[#fff5df] text-[#b98f27]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}

export default function CreatorCampaignList() {
  const [campaigns, setCampaigns] = useState<CreatorCampaign[]>([]);

  useEffect(() => {
    const syncCampaigns = () => {
      setCampaigns(readCreatorCampaigns());
    };

    syncCampaigns();
    window.addEventListener("storage", syncCampaigns);

    return () => {
      window.removeEventListener("storage", syncCampaigns);
    };
  }, []);

  const handleStatusChange = (
    campaignId: string,
    status: CreatorCampaign["status"]
  ) => {
    setCampaigns(updateCreatorCampaignStatus(campaignId, status));
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter space-y-4" style={{ animationDelay: "140ms" }}>
        {campaigns.length === 0 ? (
          <article className="rounded-3xl bg-white p-8 text-center shadow-[0_4px_14px_rgba(27,39,64,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">No creator campaigns yet</h2>
            <p className="mt-2 text-sm text-[#7c879b]">
              Start with a trip, location-based shoot, or seasonal content package.
            </p>
            <div className="mt-5 flex justify-center">
              <CreateCampaignButton />
            </div>
          </article>
        ) : (
          campaigns.map((campaign, index) => (
            <article
              key={campaign.id}
              className="reveal-enter hover-lift overflow-hidden rounded-3xl bg-[#fbfbfc] shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              style={{ animationDelay: `${180 + index * 50}ms` }}
            >
              <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                <div
                  className="min-h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: campaign.coverImage
                      ? `linear-gradient(rgba(14,20,32,0.15), rgba(14,20,32,0.25)), url('${campaign.coverImage}')`
                      : "linear-gradient(135deg, #e8edf5 0%, #f7f3ef 100%)",
                  }}
                />

                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={campaign.status} />
                        <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#4f6fd3]">
                          {campaign.destination || "Location pending"}
                        </span>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold text-[#2f3747]">
                        {campaign.title}
                      </h2>
                    </div>
                    <p className="text-right text-lg font-semibold text-[#2f3747]">
                      {campaign.priceExpectation || "Budget pending"}
                    </p>
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5b667d]">
                    {campaign.shortDescription || "No short description added yet."}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs text-[#8b97ab]">Dates</p>
                      <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                        {campaign.startDate || "TBD"} to {campaign.endDate || "TBD"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs text-[#8b97ab]">Deliverables</p>
                      <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                        {campaign.numberOfDeliverables} items
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs text-[#8b97ab]">Content types</p>
                      <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                        {campaign.contentTypes.join(", ") || "Not set"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs text-[#8b97ab]">Deadline</p>
                      <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                        {campaign.applicationDeadline || "Open"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/campaign-offers/${campaign.id}/edit`}
                      className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
                    >
                      Edit Campaign
                    </Link>

                    {campaign.status !== "Published" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(campaign.id, "Published")}
                        className="tap-press rounded-full bg-[#2f3747] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#252c39]"
                      >
                        Publish
                      </button>
                    )}

                    {campaign.status !== "Draft" && campaign.status !== "Archived" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(campaign.id, "Draft")}
                        className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
                      >
                        Move to Draft
                      </button>
                    )}

                    {campaign.status !== "Archived" ? (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(campaign.id, "Archived")}
                        className="tap-press rounded-full border border-[#f3d5dc] bg-[#fff7f9] px-4 py-2 text-sm font-medium text-[#be4d6f] transition hover:bg-[#fdecef]"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(campaign.id, "Draft")}
                        className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
