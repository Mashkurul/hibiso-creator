import Link from "next/link";
import { AppliedCampaignsContent } from "@/app/components/applied-campaigns-content";

type AppliedCampaignsPageProps = {
  searchParams?: Promise<{
    campaign?: string;
  }>;
};

export default async function AppliedCampaignsPage({
  searchParams,
}: AppliedCampaignsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCampaignId = Number(resolvedSearchParams?.campaign);

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Applied Campaigns</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Review every campaign you applied to, see the current status, and inspect the full brief details.
          </p>
        </div>
        <Link
          href="/my-projects"
          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
        >
          Back to My Projects
        </Link>
      </section>
      <AppliedCampaignsContent
        selectedCampaignId={
          Number.isFinite(selectedCampaignId) && selectedCampaignId > 0
            ? selectedCampaignId
            : undefined
        }
      />
    </div>
  );
}
