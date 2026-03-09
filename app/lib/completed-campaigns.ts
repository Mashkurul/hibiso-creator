export type CompletedCampaignAsset = {
  id: string;
  label: string;
  type: "Photo" | "Video" | "Story";
  note: string;
  previewImage: string;
};

export type CompletedCampaign = {
  id: number;
  title: string;
  brand: string;
  status: "Completed";
  due: string;
  payout: string;
  location: string;
  platform: string;
  category: string;
  completedOn: string;
  brief: string;
  outcome: string;
  deliverablesSummary: string;
  assets: CompletedCampaignAsset[];
};

export const completedCampaigns: CompletedCampaign[] = [
  {
    id: 10,
    title: "Travel Vlog Mini Series",
    brand: "Wanderlust",
    status: "Completed",
    due: "Feb 18, 2026",
    payout: "\u20AC700",
    location: "Tulum, Mexico",
    platform: "YouTube",
    category: "Travel",
    completedOn: "Feb 18, 2026",
    brief:
      "Produce a mini-series around boutique travel moments, local food discoveries, and creator-first storytelling across a three-part vlog format.",
    outcome:
      "Campaign closed successfully with all deliverables approved and repurposed by the brand for organic social and newsletter use.",
    deliverablesSummary: "3 vlog episodes, 6 short clips, 12 travel stills",
    assets: [
      {
        id: "wanderlust-video-1",
        label: "Episode 1 Opening Sequence",
        type: "Video",
        note: "Approved hero edit used in the main campaign launch.",
        previewImage:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "wanderlust-video-2",
        label: "Sunset Rooftop Clip",
        type: "Video",
        note: "Repurposed into a short-form teaser on brand socials.",
        previewImage:
          "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "wanderlust-photo-1",
        label: "Beachfront Story Still",
        type: "Photo",
        note: "Selected for the recap carousel and destination guide.",
        previewImage:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: 11,
    title: "At-Home Workout Stories",
    brand: "FitNest",
    status: "Completed",
    due: "Feb 02, 2026",
    payout: "\u20AC540",
    location: "Lisbon, Portugal",
    platform: "Instagram",
    category: "Fitness",
    completedOn: "Feb 02, 2026",
    brief:
      "Create a home workout story pack that demonstrates short routines, product integration, and a simple challenge structure.",
    outcome:
      "Brand approved all assets. Completion rate on the creator story set outperformed the prior benchmark campaign.",
    deliverablesSummary: "8 story frames, 1 recap reel, 5 lifestyle stills",
    assets: [
      {
        id: "fitnest-story-1",
        label: "Warm-up Story Frame",
        type: "Story",
        note: "Used as the first challenge prompt and highlight cover.",
        previewImage:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "fitnest-video-1",
        label: "Workout Recap Reel",
        type: "Video",
        note: "Approved final cut with CTA and product feature overlay.",
        previewImage:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "fitnest-photo-1",
        label: "Mat and Product Hero Shot",
        type: "Photo",
        note: "Featured in the final campaign recap post.",
        previewImage:
          "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];
