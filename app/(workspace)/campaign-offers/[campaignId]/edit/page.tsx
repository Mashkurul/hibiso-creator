import CreatorCampaignForm from "@/app/components/creator-campaign-form";

type CreatorCampaignEditPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function CreatorCampaignEditPage({
  params,
}: CreatorCampaignEditPageProps) {
  const { campaignId } = await params;

  return <CreatorCampaignForm campaignId={campaignId} />;
}
