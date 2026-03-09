import Link from "next/link";
import { completedCampaigns } from "@/app/lib/completed-campaigns";

function StatusPill({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-xs font-semibold text-[#2f8a5a]">
      {value}
    </span>
  );
}

type FinishedCampaignsPageProps = {
  searchParams?: Promise<{
    campaign?: string;
  }>;
};

export default async function FinishedCampaignsPage({
  searchParams,
}: FinishedCampaignsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCampaignId = Number(resolvedSearchParams?.campaign);
  const visibleCampaigns =
    Number.isFinite(selectedCampaignId) && selectedCampaignId > 0
      ? completedCampaigns.filter((campaign) => campaign.id === selectedCampaignId)
      : completedCampaigns;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Finished Campaigns</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Review every completed campaign, inspect the final media, and see the finished delivery summary.
          </p>
        </div>
        <Link
          href="/my-projects"
          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
        >
          Back to My Projects
        </Link>
      </section>

      <section
        className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        style={{ animationDelay: "80ms" }}
      >
        {[
          {
            label: "Finished Campaigns",
            value: completedCampaigns.length,
            tone: "bg-[#eaf8f1] text-[#4f9a72]",
          },
          {
            label: "Total Media",
            value: completedCampaigns.flatMap((campaign) => campaign.assets).length,
            tone: "bg-[#eef3ff] text-[#5a74c6]",
          },
          {
            label: "Platforms",
            value: new Set(completedCampaigns.map((campaign) => campaign.platform)).size,
            tone: "bg-[#fff0e4] text-[#df8b37]",
          },
          {
            label: "Completed Value",
            value: "\u20AC1,240",
            tone: "bg-[#f8e9ef] text-[#e16388]",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">
                  {item.label}
                </p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">
                  {item.value}
                </p>
              </div>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${item.tone}`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="M8.5 12.5l2.2 2.1L15.8 9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="reveal-enter space-y-4" style={{ animationDelay: "140ms" }}>
        {visibleCampaigns.map((campaign, index) => (
          <article
            key={campaign.id}
            className="reveal-enter rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            style={{ animationDelay: `${180 + index * 40}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill value={campaign.status} />
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#4f6fd3]">
                    {campaign.platform}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6b7487]">
                    {campaign.category}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f3747]">{campaign.title}</h2>
                <p className="mt-1 text-sm text-[#7c879b]">
                  {campaign.brand} . {campaign.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Payout</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{campaign.payout}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Completed On</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.completedOn}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Deadline</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.due}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Deliverables</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.deliverablesSummary}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Outcome</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{campaign.status}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Campaign Brief</p>
                <p className="mt-2 text-sm leading-6 text-[#56627a]">{campaign.brief}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">
                  Completion Summary
                </p>
                <p className="mt-2 text-sm leading-6 text-[#56627a]">{campaign.outcome}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">All Media</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {campaign.assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="overflow-hidden rounded-2xl border border-[#ebeff6] bg-[#fbfbfc]"
                    >
                      <div
                        className="relative h-36 bg-cover bg-center"
                        style={{ backgroundImage: `url('${asset.previewImage}')` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[#2f3747]">
                          {asset.type}
                        </div>
                        {asset.type === "Video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#2f3747]">
                              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                <path d="M10 8.5l5 3.5-5 3.5v-7z" fill="currentColor" />
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-[#2f3747]">{asset.label}</p>
                        <p className="mt-2 text-sm leading-6 text-[#5f6b81]">{asset.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

        {visibleCampaigns.length === 0 && (
          <article className="rounded-3xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">Campaign not found</h2>
            <p className="mt-2 text-sm text-[#7c879b]">
              The selected finished campaign could not be loaded from this workspace.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}
