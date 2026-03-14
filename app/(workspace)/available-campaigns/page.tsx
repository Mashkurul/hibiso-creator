"use client";

import CreateCampaignButton from "@/app/components/create-campaign-button";
import CreatorCampaignList from "@/app/components/creator-campaign-list";
import DateRangePicker from "@/app/components/date-range-picker";
import FilterDropdown from "@/app/components/filter-dropdown";
import ProductCirculationSection from "@/app/components/product-circulation-section";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Campaign = {
  id: number;
  brand: string;
  title: string;
  budget: string;
  platform: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
};

type CampaignView = "classic" | "travel";

const campaigns: Campaign[] = [
  {
    id: 1,
    brand: "GlowCo",
    title: "Morning Skincare Reel",
    budget: "€450",
    platform: "Instagram",
    category: "Beauty",
    startDate: "Mar 10, 2026",
    endDate: "Mar 12, 2026",
    location: "Bali, Indonesia",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    brand: "Luxe Travel",
    title: "Luxury Stay Story Set",
    budget: "€680",
    platform: "Instagram",
    category: "Travel",
    startDate: "Mar 11, 2026",
    endDate: "Mar 14, 2026",
    location: "Santorini, Greece",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    brand: "EcoStay",
    title: "Resort Walkthrough Video",
    budget: "€520",
    platform: "UGC Ads",
    category: "Hospitality",
    startDate: "Mar 12, 2026",
    endDate: "Mar 16, 2026",
    location: "Tulum, Mexico",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    brand: "Brewline",
    title: "Coffee Bar Lifestyle Post",
    budget: "€310",
    platform: "TikTok",
    category: "Food",
    startDate: "Mar 09, 2026",
    endDate: "Mar 11, 2026",
    location: "Milan, Italy",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    brand: "FitNest",
    title: "At-Home Workout Challenge",
    budget: "€540",
    platform: "Instagram",
    category: "Fitness",
    startDate: "Mar 10, 2026",
    endDate: "Mar 15, 2026",
    location: "Lisbon, Portugal",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    brand: "TechFold",
    title: "Creator Desk Setup Demo",
    budget: "€760",
    platform: "YouTube",
    category: "Tech",
    startDate: "Mar 13, 2026",
    endDate: "Mar 17, 2026",
    location: "Berlin, Germany",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
];

const categoryOptions = [
  "All Categories",
  "Beauty",
  "Travel",
  "Hospitality",
  "Food",
  "Fitness",
  "Tech",
];
const budgetOptions = [
  "All Budgets",
  "Under €400",
  "€400-€599",
  "€600+",
];

function parseBudgetValue(value: string) {
  return Number(value.replace(/[^\d]/g, ""));
}

function parseCampaignDate(value: string) {
  return new Date(`${value} 00:00:00`);
}

export default function AvailableCampaignsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignView: CampaignView =
    searchParams.get("mode") === "travel" ? "travel" : "classic";
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [appliedCampaignIds, setAppliedCampaignIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("All Budgets");
  const [deadlineFilterStartDate, setDeadlineFilterStartDate] = useState("");
  const [deadlineFilterEndDate, setDeadlineFilterEndDate] = useState("");
  const [deadlinePickerOpen, setDeadlinePickerOpen] = useState(false);
  const [applicationMotivation, setApplicationMotivation] = useState("");
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [travelPickerOpen, setTravelPickerOpen] = useState(false);

  const setCampaignViewAndRoute = (nextView: CampaignView) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextView === "travel") {
      params.set("mode", "travel");
    } else {
      params.delete("mode");
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const handleApply = (campaignId: number) => {
    setAppliedCampaignIds((current) =>
      current.includes(campaignId) ? current : [...current, campaignId]
    );
  };

  const openCampaignModal = (campaign: Campaign) => {
    setApplicationMotivation("");
    setTravelStartDate("");
    setTravelEndDate("");
    setSelectedCampaign(campaign);
  };

  const closeCampaignModal = () => {
    setSelectedCampaign(null);
    setApplicationMotivation("");
    setTravelStartDate("");
    setTravelEndDate("");
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const budgetValue = parseBudgetValue(campaign.budget);
      const startDate = parseCampaignDate(campaign.startDate);
      const deadlineDate = parseCampaignDate(campaign.endDate);
      const filterStartDate = deadlineFilterStartDate
        ? parseCampaignDate(deadlineFilterStartDate)
        : null;
      const filterEndDate = deadlineFilterEndDate
        ? parseCampaignDate(deadlineFilterEndDate)
        : filterStartDate;

      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${campaign.brand} ${campaign.title} ${campaign.location}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === "All Categories" || campaign.category === selectedCategory;
      const matchesBudget =
        selectedBudgetRange === "All Budgets" ||
        (selectedBudgetRange === "Under €400" && budgetValue < 400) ||
        (selectedBudgetRange === "€400-€599" &&
          budgetValue >= 400 &&
          budgetValue <= 599) ||
        (selectedBudgetRange === "€600+" && budgetValue >= 600);
      const matchesDeadline =
        !filterStartDate ||
        (() => {
          const filterStart = filterStartDate.getTime();
          const filterEnd = (filterEndDate ?? filterStartDate).getTime();
          return startDate.getTime() <= filterEnd && deadlineDate.getTime() >= filterStart;
        })();

      return matchesQuery && matchesCategory && matchesBudget && matchesDeadline;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedBudgetRange,
    deadlineFilterStartDate,
    deadlineFilterEndDate,
  ]);

  useEffect(() => {
    if (!selectedCampaign) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCampaign(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedCampaign]);

  const campaignModal = selectedCampaign ? (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#0e1420]/55 px-4 py-6"
      onClick={closeCampaignModal}
    >
      <div
        className="pop-enter relative mx-auto my-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_24px_52px_rgba(15,23,42,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">
              {selectedCampaign.brand}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#2f3747]">
              {selectedCampaign.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCampaignModal}
            className="tap-press rounded-full p-2 text-[#7d889a] transition hover:bg-[#f2f5fb] hover:text-[#2f3747]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Budget</p>
            <p className="mt-1 text-xl font-semibold text-[#2f3747]">{selectedCampaign.budget}</p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Platform</p>
            <p className="mt-1 text-xl font-semibold text-[#2f3747]">{selectedCampaign.platform}</p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Category</p>
            <p className="mt-1 text-xl font-semibold text-[#2f3747]">{selectedCampaign.category}</p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Campaign Dates</p>
            <p className="mt-1 text-xl font-semibold text-[#2f3747]">
              {selectedCampaign.startDate} - {selectedCampaign.endDate}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
          <p className="text-xs text-[#8b97ab]">Campaign Brief</p>
          <p className="mt-1 text-sm leading-6 text-[#56627a]">
            Create one short-form video and one story set that highlights the brand value and
            natural usage flow. Keep tone authentic and creator-led. Include product visibility
            in the first 5 seconds and CTA in the final frame.
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
          <p className="text-xs text-[#8b97ab]">Why You&apos;re a Fit</p>
          <textarea
            rows={4}
            value={applicationMotivation}
            onChange={(event) => setApplicationMotivation(event.target.value)}
            placeholder="Write your motivation for applying, how you would approach the content, and why this campaign matches your trip or audience."
            className="mt-2 w-full rounded-2xl border border-[#d7dfea] bg-white px-4 py-3 text-sm text-[#3d4860] outline-none focus:border-[#b7c5df]"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4">
          <p className="text-xs text-[#8b97ab]">Travel Dates</p>
          <button
            type="button"
            onClick={() => setTravelPickerOpen(true)}
            className="tap-press mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] ring-1 ring-[#d7dfea] transition hover:bg-[#f7fafc]"
          >
            {travelStartDate && travelEndDate
              ? `${travelStartDate} to ${travelEndDate}`
              : "Pick Travel Dates"}
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeCampaignModal}
            className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => handleApply(selectedCampaign.id)}
            className={`tap-press inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              appliedCampaignIds.includes(selectedCampaign.id)
                ? "animate-[popIn_0.35s_ease-out] bg-[#30a46c]"
                : "bg-gradient-to-r from-[#de8b34] to-[#e36d58] hover:brightness-105"
            }`}
          >
            {appliedCampaignIds.includes(selectedCampaign.id) ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M6.5 12.5l3.1 3.1L17.5 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Applied
              </>
            ) : (
              "Apply Now"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Campaigns</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Switch between classic UGC brand briefs and traveling product campaigns from your
            creator offer workflow.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-[#eadfce] bg-white/90 p-1 shadow-[0_12px_28px_rgba(20,32,54,0.08)] backdrop-blur">
          {[
            {
              value: "classic" as const,
              label: "Classic UGC Campaigns",
            },
            {
              value: "travel" as const,
              label: "Traveling Product Campaigns",
            },
          ].map((option) => {
            const active = campaignView === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setCampaignViewAndRoute(option.value)}
                className={`tap-press rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-[#de8b34] to-[#e36d58] text-white shadow-[0_10px_18px_rgba(227,109,88,0.2)]"
                    : "text-[#5d6880] hover:bg-[#f7f1ea]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {campaignView === "classic" ? (
        <>
          <section
            className="reveal-enter relative z-30 rounded-2xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#95a2b5]"
                >
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                  <path
                    d="M16 16l4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by brand or campaign"
                  className="w-full rounded-xl bg-white py-2.5 pl-10 pr-4 text-sm text-[#3d4860] outline-none ring-1 ring-[#e6eaf1] focus:ring-[#b7c5df]"
                />
              </div>
              <FilterDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              <FilterDropdown
                options={budgetOptions}
                value={selectedBudgetRange}
                onChange={setSelectedBudgetRange}
              />
              <button
                type="button"
                onClick={() => setDeadlinePickerOpen(true)}
                className="ui-select-wrap tap-press min-w-[220px] text-left"
              >
                <span className="ui-select flex items-center justify-between">
                  <span>
                    {deadlineFilterStartDate && deadlineFilterEndDate
                      ? `${deadlineFilterStartDate} to ${deadlineFilterEndDate}`
                      : "Any Date"}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedBudgetRange("All Budgets");
                  setDeadlineFilterStartDate("");
                  setDeadlineFilterEndDate("");
                }}
                className="tap-press inline-flex items-center gap-2 rounded-xl bg-[#2f3747] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#252c39]"
              >
                Reset
              </button>
            </div>
          </section>

          <section
            className="reveal-enter relative z-0 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            style={{ animationDelay: "220ms" }}
          >
            {filteredCampaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="hover-lift rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              >
                <div
                  className="relative h-40 w-full overflow-hidden rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${campaign.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-2 left-2 rounded-full bg-black/35 px-2 py-1 text-[11px] text-white">
                    {campaign.location}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7e8ba0]">
                    {campaign.brand}
                  </p>
                  <span className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-xs font-medium text-[#516fbf]">
                    {campaign.platform}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-semibold text-[#2f3747]">{campaign.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-[#7c879b]">
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M8 9h8M8 12h8M8 15h5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    {campaign.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M12 8v4l2.5 1.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="inline-flex items-center gap-1 text-sm text-[#8b97ab]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path
                        d="M15.8 6.5H10a3.5 3.5 0 000 7h4.8m-4.8 4h5.8M7.2 10h9.4M7.2 14h8.6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    Budget
                  </p>
                  <p className="text-xl font-semibold text-[#2f3747]">{campaign.budget}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openCampaignModal(campaign)}
                    className="tap-press inline-flex items-center justify-center gap-1 rounded-xl border border-[#dde3f0] bg-white px-3 py-2 text-center text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply(campaign.id)}
                    className={`tap-press inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-center text-sm font-semibold text-white transition ${
                      appliedCampaignIds.includes(campaign.id)
                        ? "animate-[popIn_0.35s_ease-out] bg-[#30a46c]"
                        : "bg-gradient-to-r from-[#de8b34] to-[#e36d58] hover:brightness-105"
                    }`}
                  >
                    {appliedCampaignIds.includes(campaign.id) ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M6.5 12.5l3.1 3.1L17.5 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Applied
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                          <path
                            d="M12 16V5M8 9l4-4 4 4M5 16v2.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V16"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Apply Now
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}

            {filteredCampaigns.length === 0 && (
              <article className="md:col-span-2 xl:col-span-3 rounded-3xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <h2 className="text-xl font-semibold text-[#2f3747]">
                  No campaigns match these filters
                </h2>
                <p className="mt-2 text-sm text-[#7c879b]">
                  Adjust budget, category, or deadline to widen the campaign list.
                </p>
              </article>
            )}
          </section>
        </>
      ) : (
        <>
          <section
            className="reveal-enter hover-lift flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-[linear-gradient(135deg,#fff6ef_0%,#fffaf5_48%,#f8fbff_100%)] p-6 shadow-[0_10px_30px_rgba(27,39,64,0.08)]"
            style={{ animationDelay: "140ms" }}
          >
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bd7c49]">
                Travel Product Campaigns
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#2f3747]">
                Creator travel offers brands can discover
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#667389]">
                Manage the same travel-product offer campaigns from the existing campaign offers
                flow right here. Create, publish, draft, archive, and edit them from this tab.
              </p>
            </div>
            <CreateCampaignButton />
          </section>
          <ProductCirculationSection />
          <CreatorCampaignList />
        </>
      )}

      {campaignView === "classic" && campaignModal && createPortal(campaignModal, document.body)}
      <DateRangePicker
        key={`travel-${travelPickerOpen}-${travelStartDate}-${travelEndDate}`}
        isOpen={travelPickerOpen}
        initialStartDate={travelStartDate}
        initialEndDate={travelEndDate}
        onClose={() => setTravelPickerOpen(false)}
        onConfirm={({ startDate, endDate }) => {
          setTravelStartDate(startDate);
          setTravelEndDate(endDate);
          setTravelPickerOpen(false);
        }}
      />
      <DateRangePicker
        key={`deadline-${deadlinePickerOpen}-${deadlineFilterStartDate}-${deadlineFilterEndDate}`}
        isOpen={deadlinePickerOpen}
        initialStartDate={deadlineFilterStartDate}
        initialEndDate={deadlineFilterEndDate}
        onClose={() => setDeadlinePickerOpen(false)}
        onConfirm={({ startDate, endDate }) => {
          setDeadlineFilterStartDate(startDate);
          setDeadlineFilterEndDate(endDate);
          setDeadlinePickerOpen(false);
        }}
      />
    </div>
  );
}
