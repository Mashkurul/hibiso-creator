"use client";

import { useRef, useState } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;
const MIN_DIMENSION = 400;

type ProfileForm = {
  fullName: string;
  creatorName: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  languages: string;
  niches: string;
  industries: string;
  bio: string;
  instagramFollowers: string;
  tiktokFollowers: string;
  ugcAdsStats: string;
  engagementRate: string;
};

type PortfolioItem = {
  id: number;
  title: string;
  format: "Video" | "Image" | "Case Study";
  brand: string;
  summary: string;
  cover: string;
  metrics: string;
};

type CollaborationItem = {
  id: number;
  brand: string;
  industry: string;
  project: string;
  result: string;
};

const initialForm: ProfileForm = {
  fullName: "Alex Rivera",
  creatorName: "@alexcreates",
  email: "alex.rivera@example.com",
  phone: "+880 1712-123456",
  location: "Dhaka, Bangladesh",
  availability: "Available for travel campaigns in April 2026",
  languages: "English, Bangla, Hindi",
  niches: "Beauty, Lifestyle, Travel, Hospitality",
  industries: "Skincare, Wellness, Hotels, Fashion, Food & Beverage",
  bio: "I create premium lifestyle and travel content for brands that need polished reels, stills, and ad-ready UGC with strong product storytelling.",
  instagramFollowers: "142K",
  tiktokFollowers: "48K",
  ugcAdsStats: "23 ad creatives delivered in the last 90 days",
  engagementRate: "5.8%",
};

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "GlowCo Summer Routine Reel",
    format: "Video",
    brand: "GlowCo",
    summary: "Short-form skincare reel shot on location with first-frame product visibility and morning routine storytelling.",
    cover: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    metrics: "182K views . 6.2% engagement",
  },
  {
    id: 2,
    title: "Palm House Resort Photo Set",
    format: "Image",
    brand: "Palm House",
    summary: "Aspirational sunrise hospitality stills used for campaign recap and landing page assets.",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    metrics: "12 delivered stills . 4 selected for paid usage",
  },
  {
    id: 3,
    title: "EcoStay Walkthrough Case Study",
    format: "Case Study",
    brand: "EcoStay",
    summary: "Premium room-tour concept with organic reel, story cutdowns, and repost-ready hospitality content package.",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    metrics: "520K reach . 37 direct booking inquiries",
  },
];

const collaborations: CollaborationItem[] = [
  {
    id: 1,
    brand: "GlowCo",
    industry: "Skincare",
    project: "Summer Collection Launch",
    result: "Delivered 1 reel, 5 photos, and 3 stories with paid usage rights.",
  },
  {
    id: 2,
    brand: "EcoStay",
    industry: "Hospitality",
    project: "Resort Walkthrough Reel",
    result: "Created a full room-tour reel and travel stills for both organic and booking campaigns.",
  },
  {
    id: 3,
    brand: "Brewline",
    industry: "Food & Beverage",
    project: "Coffee Bar Lifestyle Post",
    result: "Shot cozy static visuals and a short-form vertical ad pack for launch week.",
  },
];

const bestWork = [
  {
    title: "Best Performing Reel",
    detail: "GlowCo product demo with strong retention and paid ad reuse.",
    value: "182K views",
  },
  {
    title: "Best Hospitality Campaign",
    detail: "Palm House sunrise story package with room reveal sequence.",
    value: "6 story frames + 1 recap reel",
  },
  {
    title: "Best UGC Outcome",
    detail: "Direct-response wellness ad assets with testimonial-led hooks.",
    value: "3.4x CTR benchmark",
  },
];

function TagList({ items }: { items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#4f6fd3]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [pictureError, setPictureError] = useState("");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  );

  const updateForm = (key: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validateDimensions = (file: File) =>
    new Promise<boolean>((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve(image.width >= MIN_DIMENSION && image.height >= MIN_DIMENSION);
      };
      image.onerror = () => resolve(false);
      image.src = URL.createObjectURL(file);
    });

  const onUploadPicture = async (files: FileList | null) => {
    setPictureError("");
    setStatus("");

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!ALLOWED_TYPES.includes(file.type)) {
      setPictureError("Invalid format. Use JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setPictureError(`Image is too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    const validDimensions = await validateDimensions(file);
    if (!validDimensions) {
      setPictureError(`Image must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px.`);
      return;
    }

    setAvatar(URL.createObjectURL(file));
    setStatus("Profile picture updated successfully.");
  };

  const onSaveProfile = () => {
    setStatus("Creator profile updated.");
  };

  const nicheTags = form.niches.split(",").map((item) => item.trim()).filter(Boolean);
  const industryTags = form.industries.split(",").map((item) => item.trim()).filter(Boolean);
  const languageTags = form.languages.split(",").map((item) => item.trim()).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#fff3e7_0%,#ffffff_48%,#f5f8ff_100%)] p-6 shadow-[0_16px_40px_rgba(18,31,53,0.08)]">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex gap-4">
            <div
              className="h-28 w-28 shrink-0 rounded-[28px] bg-cover bg-center shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
              style={{ backgroundImage: `url('${avatar}')` }}
              role="img"
              aria-label="Creator profile picture"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#de8b34]">Creator Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#2f3747]">{form.fullName}</h1>
              <p className="mt-1 text-base text-[#69758b]">{form.creatorName}</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#56627a]">{form.bio}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Instagram", value: form.instagramFollowers },
              { label: "TikTok", value: form.tiktokFollowers },
              { label: "Engagement", value: form.engagementRate },
              { label: "Availability", value: "Open" },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur"
              >
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#2f3747]">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-[1.1fr_1.3fr]" style={{ animationDelay: "80ms" }}>
        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#2f3747]">Profile Picture</h2>
          <div className="mt-4 flex flex-col items-center rounded-2xl bg-white p-5">
            <div
              className="h-36 w-36 rounded-full bg-cover bg-center shadow-[0_6px_18px_rgba(15,23,42,0.18)]"
              style={{ backgroundImage: `url('${avatar}')` }}
              role="img"
              aria-label="Creator profile picture"
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => onUploadPicture(event.target.files)}
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white"
              >
                Upload New
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvatar("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80");
                  setPictureError("");
                  setStatus("Profile picture reset.");
                }}
                className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4">
            <h3 className="text-sm font-semibold text-[#2f3747]">Profile Overview</h3>
            <div className="mt-3 space-y-3 text-sm text-[#5d6a80]">
              <p><span className="font-semibold text-[#2f3747]">Location:</span> {form.location}</p>
              <p><span className="font-semibold text-[#2f3747]">Availability:</span> {form.availability}</p>
              <p><span className="font-semibold text-[#2f3747]">Languages:</span> {form.languages}</p>
            </div>
          </div>

          {pictureError && <p className="mt-3 text-sm font-medium text-[#c04963]">{pictureError}</p>}
        </article>

        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#2f3747]">Creator Details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Full Name</span>
              <input value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Creator Name</span>
              <input value={form.creatorName} onChange={(event) => updateForm("creatorName", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Email</span>
              <input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Phone</span>
              <input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Location</span>
              <input value={form.location} onChange={(event) => updateForm("location", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Availability</span>
              <input value={form.availability} onChange={(event) => updateForm("availability", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Languages Spoken</span>
              <input value={form.languages} onChange={(event) => updateForm("languages", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Niches</span>
              <input value={form.niches} onChange={(event) => updateForm("niches", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Industries</span>
              <input value={form.industries} onChange={(event) => updateForm("industries", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-[#48556d]">Bio</span>
            <textarea rows={4} value={form.bio} onChange={(event) => updateForm("bio", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Instagram Followers</span>
              <input value={form.instagramFollowers} onChange={(event) => updateForm("instagramFollowers", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">TikTok Followers</span>
              <input value={form.tiktokFollowers} onChange={(event) => updateForm("tiktokFollowers", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Engagement Rate</span>
              <input value={form.engagementRate} onChange={(event) => updateForm("engagementRate", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">UGC Ads / Delivery Stats</span>
              <input value={form.ugcAdsStats} onChange={(event) => updateForm("ugcAdsStats", event.target.value)} className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]" />
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setStatus("Profile form reset.");
              }}
              className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={onSaveProfile}
              className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </article>
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-3" style={{ animationDelay: "140ms" }}>
        <article className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg font-semibold text-[#2f3747]">Niches</h2>
          <TagList items={nicheTags} />
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg font-semibold text-[#2f3747]">Industries</h2>
          <TagList items={industryTags} />
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-lg font-semibold text-[#2f3747]">Languages</h2>
          <TagList items={languageTags} />
        </article>
      </section>

      <section className="reveal-enter space-y-4" style={{ animationDelay: "200ms" }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2f3747]">Portfolio</h2>
            <p className="mt-1 text-sm text-[#7c879b]">
              Showcase videos, images, and case studies so brands can quickly review your best work.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(18,31,53,0.08)]"
            >
              <div className="relative h-52 bg-cover bg-center" style={{ backgroundImage: `url('${item.cover}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2f3747]">
                  {item.format}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{item.brand}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <p className="text-sm leading-6 text-[#56627a]">{item.summary}</p>
                <p className="text-sm font-semibold text-[#de8b34]">{item.metrics}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" style={{ animationDelay: "260ms" }}>
        <article className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-semibold text-[#2f3747]">Previous Collaborations</h2>
          <div className="mt-4 space-y-3">
            {collaborations.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#fbfbfc] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-[#2f3747]">{item.project}</p>
                    <p className="mt-1 text-sm text-[#7c879b]">{item.brand} . {item.industry}</p>
                  </div>
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#4f6fd3]">
                    Previous Collaboration
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#56627a]">{item.result}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-semibold text-[#2f3747]">Best Work Highlights</h2>
          <div className="mt-4 space-y-3">
            {bestWork.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#fbfbfc] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#8d98ad]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#56627a]">{item.detail}</p>
                <p className="mt-3 text-lg font-semibold text-[#de8b34]">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {status && (
        <section className="reveal-enter rounded-2xl bg-white p-4 text-sm text-[#5f6d85] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          {status}
        </section>
      )}
    </div>
  );
}
