export type AppliedCampaignStatus =
  | "Applied"
  | "Accepted"
  | "Rejected"
  | "Completed";

export type AppliedCampaign = {
  id: number;
  campaign: string;
  brand: string;
  appliedOn: string;
  stage: AppliedCampaignStatus;
  budget: string;
  updateNote: string;
  platform: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  deliverables: string[];
  brief: string;
};

export const appliedCampaigns: AppliedCampaign[] = [
  {
    id: 20,
    campaign: "Creator Desk Setup Demo",
    brand: "TechFold",
    appliedOn: "Mar 01, 2026",
    stage: "Accepted",
    budget: "\u20AC760",
    updateNote: "Offer accepted. Production kickoff call booked for Mar 12, 2026.",
    platform: "YouTube",
    category: "Tech",
    location: "Berlin, Germany",
    startDate: "Mar 13, 2026",
    endDate: "Mar 17, 2026",
    deliverables: ["1 desk setup hero video", "4 product stills", "2 story frames"],
    brief:
      "Show how the foldable workstation fits into a premium creator desk setup with cable management, lighting, and productivity workflow moments.",
  },
  {
    id: 21,
    campaign: "Luxury Stay Story Set",
    brand: "Luxe Travel",
    appliedOn: "Feb 28, 2026",
    stage: "Applied",
    budget: "\u20AC680",
    updateNote: "Application submitted and waiting for brand review.",
    platform: "Instagram",
    category: "Travel",
    location: "Santorini, Greece",
    startDate: "Mar 11, 2026",
    endDate: "Mar 14, 2026",
    deliverables: ["1 reel", "5 story frames", "3 edited photos"],
    brief:
      "Capture a luxury check-in sequence, room reveal, and sunset terrace moments with a strong hospitality-first narrative.",
  },
  {
    id: 22,
    campaign: "City Weekend UGC Pack",
    brand: "UrbanNest",
    appliedOn: "Feb 24, 2026",
    stage: "Rejected",
    budget: "\u20AC390",
    updateNote: "Brand closed the shortlist and moved forward with another creator.",
    platform: "UGC Ads",
    category: "Lifestyle",
    location: "Kuala Lumpur, Malaysia",
    startDate: "Mar 08, 2026",
    endDate: "Mar 10, 2026",
    deliverables: ["2 ad-style hooks", "1 testimonial video", "3 raw vertical clips"],
    brief:
      "Create direct-response UGC for a home essentials launch focused on compact apartment living and quick product demonstrations.",
  },
  {
    id: 23,
    campaign: "Sunrise Resort Stories",
    brand: "Palm House",
    appliedOn: "Feb 15, 2026",
    stage: "Completed",
    budget: "\u20AC610",
    updateNote: "Campaign delivered successfully and marked complete on Mar 06, 2026.",
    platform: "Instagram",
    category: "Hospitality",
    location: "Phuket, Thailand",
    startDate: "Feb 28, 2026",
    endDate: "Mar 04, 2026",
    deliverables: ["1 recap reel", "6 story frames", "5 edited lifestyle photos"],
    brief:
      "Feature sunrise pool access, breakfast service, and room ambiance in a warm, aspirational resort story sequence.",
  },
];
