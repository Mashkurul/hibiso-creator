export type ProjectStatus = "In Progress" | "Under Review" | "Waiting Assets" | "Completed";

export type ManagedProjectAssetStatus =
  | "Delivered"
  | "Needs Approval"
  | "Rejected"
  | "Resubmit";

export type ManagedProjectAsset = {
  id: string;
  label: string;
  type: "Photo" | "Video" | "Story";
  status: ManagedProjectAssetStatus;
  note: string;
  previewImage: string;
};

export type ManagedProject = {
  id: number;
  title: string;
  brand: string;
  status: ProjectStatus;
  due: string;
  payout: string;
  manager: string;
  brief: string;
  requiredPhotos: number;
  uploadedPhotos: number;
  requiredVideos: number;
  uploadedVideos: number;
  requiredStories: number;
  uploadedStories: number;
  hashtagList: string[];
  checklist: string[];
  assets: ManagedProjectAsset[];
};

export const activeProjects: ManagedProject[] = [
  {
    id: 1,
    title: "Summer Collection Launch",
    brand: "GlowCo",
    status: "In Progress",
    due: "Mar 09, 2026",
    payout: "\u20AC450",
    manager: "Mia Carter",
    brief:
      "Produce bright, creator-led content for GlowCo summer products. Focus on natural light and first 3-second product visibility.",
    requiredPhotos: 8,
    uploadedPhotos: 5,
    requiredVideos: 2,
    uploadedVideos: 1,
    requiredStories: 4,
    uploadedStories: 3,
    hashtagList: ["#GlowCoSummer", "#SkincareRoutine", "#Ad"],
    checklist: [
      "Submit first cut for approval",
      "Include product close-up shot",
      "Add CTA in final frame",
      "Upload caption draft",
    ],
    assets: [
      {
        id: "glowco-video-1",
        label: "Hero Reel Cut V1",
        type: "Video",
        status: "Needs Approval",
        note: "Brand reviewing CTA timing and first-frame product visibility.",
        previewImage:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "glowco-photo-1",
        label: "Beach Flatlay Set",
        type: "Photo",
        status: "Delivered",
        note: "Approved for organic posting and campaign recap.",
        previewImage:
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "glowco-photo-2",
        label: "Sunlight Product Close-up",
        type: "Photo",
        status: "Rejected",
        note: "Need tighter crop and stronger product logo visibility.",
        previewImage:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "glowco-story-1",
        label: "Morning Routine Story Sequence",
        type: "Story",
        status: "Resubmit",
        note: "Please resubmit with revised CTA sticker placement.",
        previewImage:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: 2,
    title: "Resort Walkthrough Reel",
    brand: "EcoStay",
    status: "Under Review",
    due: "Mar 05, 2026",
    payout: "\u20AC520",
    manager: "Noah Greene",
    brief:
      "Create a cinematic walkthrough reel showing room, pool, and sunrise experience. Keep tone premium and calm.",
    requiredPhotos: 6,
    uploadedPhotos: 6,
    requiredVideos: 1,
    uploadedVideos: 1,
    requiredStories: 3,
    uploadedStories: 2,
    hashtagList: ["#EcoStay", "#TravelCreator", "#PaidPartnership"],
    checklist: [
      "Brand legal review pending",
      "Confirm music licensing",
      "Add location tag",
      "Deliver final SRT subtitles",
    ],
    assets: [
      {
        id: "ecostay-video-1",
        label: "Room Tour Master Reel",
        type: "Video",
        status: "Needs Approval",
        note: "Legal and hotel operations team are reviewing the final cut.",
        previewImage:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "ecostay-photo-1",
        label: "Poolside Sunrise Still",
        type: "Photo",
        status: "Delivered",
        note: "Approved for campaign recap and listing page.",
        previewImage:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "ecostay-story-1",
        label: "Check-in Story Frame",
        type: "Story",
        status: "Resubmit",
        note: "Resubmit with corrected room rate sticker removal.",
        previewImage:
          "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  {
    id: 3,
    title: "Coffee Bar Lifestyle Post",
    brand: "Brewline",
    status: "Waiting Assets",
    due: "Mar 12, 2026",
    payout: "\u20AC310",
    manager: "Lena Park",
    brief:
      "Shoot cozy coffee-bar lifestyle photos and a short vertical clip highlighting morning routine and product placement.",
    requiredPhotos: 10,
    uploadedPhotos: 2,
    requiredVideos: 1,
    uploadedVideos: 0,
    requiredStories: 2,
    uploadedStories: 0,
    hashtagList: ["#BrewlineMoments", "#CoffeeLovers", "#Collab"],
    checklist: [
      "Receive product shipment",
      "Finalize shot list with brand",
      "Capture before/after sequence",
      "Submit draft cover frame",
    ],
    assets: [
      {
        id: "brewline-photo-1",
        label: "Coffee Counter Hero Shot",
        type: "Photo",
        status: "Delivered",
        note: "Approved as the anchor still for the static post.",
        previewImage:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "brewline-photo-2",
        label: "Latte Pour Close-up",
        type: "Photo",
        status: "Needs Approval",
        note: "Awaiting visual review from the brand stylist.",
        previewImage:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "brewline-video-1",
        label: "Morning Routine Clip",
        type: "Video",
        status: "Resubmit",
        note: "Need a brighter opening shot and clearer product handling.",
        previewImage:
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
];
