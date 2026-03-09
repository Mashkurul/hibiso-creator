export type BrandInvite = {
  id: number;
  brand: string;
  campaign: string;
  invitedOn: string;
  responseBy: string;
  budget: string;
  platform: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  deliverables: string[];
  brief: string;
};

export const brandInvites: BrandInvite[] = [
  {
    id: 30,
    brand: "SolarSip",
    campaign: "Hydration Habit Challenge",
    invitedOn: "Mar 02, 2026",
    responseBy: "Mar 05, 2026",
    budget: "\u20AC480",
    platform: "Instagram",
    category: "Lifestyle",
    location: "Dubai, UAE",
    startDate: "Mar 12, 2026",
    endDate: "Mar 16, 2026",
    deliverables: ["1 challenge reel", "4 story frames", "3 product photos"],
    brief:
      "Create a travel-friendly hydration challenge featuring the bottle in morning routines, gym transitions, and location-based lifestyle content.",
  },
  {
    id: 31,
    brand: "Bloom Skin",
    campaign: "Night Repair Testimonial Reel",
    invitedOn: "Mar 01, 2026",
    responseBy: "Mar 04, 2026",
    budget: "\u20AC530",
    platform: "UGC Ads",
    category: "Beauty",
    location: "Bangkok, Thailand",
    startDate: "Mar 14, 2026",
    endDate: "Mar 18, 2026",
    deliverables: ["2 UGC hooks", "1 testimonial reel", "3 close-up product stills"],
    brief:
      "Film a nighttime skincare testimonial with before-after framing, clean bathroom visuals, and direct-response messaging for paid usage.",
  },
];
