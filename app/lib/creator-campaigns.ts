export type CreatorCampaignStatus = "Draft" | "Published" | "Archived";

export type CreatorCampaign = {
  id: string;
  title: string;
  shortDescription: string;
  destination: string;
  startDate: string;
  endDate: string;
  contentTypes: string[];
  numberOfDeliverables: number;
  audienceDetails: string;
  platformDetails: string;
  productCategoryPreferences: string;
  collaborationTerms: string;
  usageRights: string;
  priceExpectation: string;
  applicationDeadline: string;
  coverImage: string;
  status: CreatorCampaignStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreatorCampaignInput = Omit<
  CreatorCampaign,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export const CREATOR_CAMPAIGN_STORAGE_KEY = "hibiso.creatorCampaigns";

export const contentTypeOptions = [
  "Photo",
  "Video",
  "Reels",
  "Stories",
  "UGC",
  "TikTok",
  "YouTube Short",
];

export const emptyCreatorCampaignInput: CreatorCampaignInput = {
  title: "",
  shortDescription: "",
  destination: "",
  startDate: "",
  endDate: "",
  contentTypes: [],
  numberOfDeliverables: 1,
  audienceDetails: "",
  platformDetails: "",
  productCategoryPreferences: "",
  collaborationTerms: "",
  usageRights: "",
  priceExpectation: "",
  applicationDeadline: "",
  coverImage: "",
};

export const defaultCreatorCampaigns: CreatorCampaign[] = [
  {
    id: "creator-campaign-trip-asia",
    title: "Bangkok City Travel Product Placement",
    shortDescription:
      "I am traveling through Bangkok and can feature a brand product in destination-first travel reels, hotel content, and street-style photo sets.",
    destination: "Bangkok, Thailand",
    startDate: "2026-03-21",
    endDate: "2026-03-27",
    contentTypes: ["Reels", "Stories", "Photo", "UGC"],
    numberOfDeliverables: 8,
    audienceDetails:
      "Primary audience is women 21-34 interested in travel, beauty, and lifestyle content.",
    platformDetails: "Instagram 142K followers, TikTok 48K followers, 5.8% average engagement.",
    productCategoryPreferences: "Travel accessories, skincare, fashion basics, beverage brands.",
    collaborationTerms:
      "Brand ships product before departure. Two concept revisions included. Creator-led scripting and styling.",
    usageRights: "Organic usage for 90 days, paid usage negotiable.",
    priceExpectation: "$1,400 package",
    applicationDeadline: "2026-03-15",
    coverImage:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    status: "Published",
    createdAt: "2026-03-05T09:00:00.000Z",
    updatedAt: "2026-03-06T08:30:00.000Z",
  },
  {
    id: "creator-campaign-draft-resort",
    title: "Resort Poolside UGC Package",
    shortDescription:
      "Draft offer for an upcoming resort stay with room-tour video, poolside stills, and vertical UGC product inserts.",
    destination: "Cox's Bazar, Bangladesh",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    contentTypes: ["Video", "Stories", "UGC"],
    numberOfDeliverables: 5,
    audienceDetails:
      "Audience index skews toward Gen Z and young millennial travelers planning short-haul lifestyle trips.",
    platformDetails: "Instagram 142K followers, story completion rate 61%.",
    productCategoryPreferences: "Hospitality, swimwear, skincare, travel tech.",
    collaborationTerms: "One live story sequence during trip and final edited assets within 7 days.",
    usageRights: "Brand organic repost rights only until final contract is signed.",
    priceExpectation: "$950 starting package",
    applicationDeadline: "2026-04-01",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "Draft",
    createdAt: "2026-03-04T11:00:00.000Z",
    updatedAt: "2026-03-04T11:00:00.000Z",
  },
];

export function readCreatorCampaigns(): CreatorCampaign[] {
  if (typeof window === "undefined") {
    return defaultCreatorCampaigns;
  }

  const storedValue = window.localStorage.getItem(CREATOR_CAMPAIGN_STORAGE_KEY);

  if (!storedValue) {
    return defaultCreatorCampaigns;
  }

  try {
    const parsed = JSON.parse(storedValue) as CreatorCampaign[];
    return parsed.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  } catch {
    return defaultCreatorCampaigns;
  }
}

export function writeCreatorCampaigns(campaigns: CreatorCampaign[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CREATOR_CAMPAIGN_STORAGE_KEY, JSON.stringify(campaigns));
}

export function upsertCreatorCampaign(
  input: CreatorCampaignInput,
  status: CreatorCampaignStatus,
  campaignId?: string
) {
  const now = new Date().toISOString();
  const existingCampaigns = readCreatorCampaigns();
  const existingCampaign = campaignId
    ? existingCampaigns.find((campaign) => campaign.id === campaignId)
    : undefined;

  const nextCampaign: CreatorCampaign = {
    ...input,
    id: campaignId ?? `creator-campaign-${Date.now()}`,
    status,
    createdAt: existingCampaign?.createdAt ?? now,
    updatedAt: now,
  };

  const nextCampaigns = existingCampaign
    ? existingCampaigns.map((campaign) =>
        campaign.id === existingCampaign.id ? nextCampaign : campaign
      )
    : [nextCampaign, ...existingCampaigns];

  writeCreatorCampaigns(nextCampaigns);
  return nextCampaign;
}

export function updateCreatorCampaignStatus(
  campaignId: string,
  status: CreatorCampaignStatus
) {
  const existingCampaigns = readCreatorCampaigns();
  const nextCampaigns = existingCampaigns.map((campaign) =>
    campaign.id === campaignId
      ? { ...campaign, status, updatedAt: new Date().toISOString() }
      : campaign
  );

  writeCreatorCampaigns(nextCampaigns);
  return nextCampaigns;
}

export function findCreatorCampaign(campaignId: string) {
  return readCreatorCampaigns().find((campaign) => campaign.id === campaignId) ?? null;
}
