"use client";

import DateRangePicker from "@/app/components/date-range-picker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  contentTypeOptions,
  emptyCreatorCampaignInput,
  findCreatorCampaign,
  type CreatorCampaignInput,
  upsertCreatorCampaign,
} from "@/app/lib/creator-campaigns";

type CreatorCampaignFormProps = {
  campaignId?: string;
};

function formatPageCopy(campaignId?: string) {
  if (campaignId) {
    return {
      eyebrow: "Update Campaign Offer",
      title: "Edit creator campaign",
      description:
        "Adjust deliverables, dates, pricing, and terms before publishing or archiving the offer.",
    };
  }

  return {
    eyebrow: "New Campaign Offer",
    title: "Create a campaign brands can discover",
    description:
      "Publish a creator-side offer for an upcoming trip, event, or content opportunity and manage it from your workspace.",
  };
}

export default function CreatorCampaignForm({
  campaignId,
}: CreatorCampaignFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<CreatorCampaignInput>(
    emptyCreatorCampaignInput
  );
  const [loading, setLoading] = useState(Boolean(campaignId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [campaignDatePickerOpen, setCampaignDatePickerOpen] = useState(false);
  const [applicationDeadlinePickerOpen, setApplicationDeadlinePickerOpen] =
    useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    const campaign = findCreatorCampaign(campaignId);

    if (!campaign) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setFormState({
      title: campaign.title,
      shortDescription: campaign.shortDescription,
      destination: campaign.destination,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      contentTypes: campaign.contentTypes,
      numberOfDeliverables: campaign.numberOfDeliverables,
      audienceDetails: campaign.audienceDetails,
      platformDetails: campaign.platformDetails,
      productCategoryPreferences: campaign.productCategoryPreferences,
      collaborationTerms: campaign.collaborationTerms,
      usageRights: campaign.usageRights,
      priceExpectation: campaign.priceExpectation,
      applicationDeadline: campaign.applicationDeadline,
      coverImage: campaign.coverImage,
    });
    setLoading(false);
  }, [campaignId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const copy = formatPageCopy(campaignId);

  const updateField = <Key extends keyof CreatorCampaignInput>(
    field: Key,
    value: CreatorCampaignInput[Key]
  ) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleContentTypeToggle = (value: string) => {
    setFormState((current) => ({
      ...current,
      contentTypes: current.contentTypes.includes(value)
        ? current.contentTypes.filter((item) => item !== value)
        : [...current.contentTypes, value],
    }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === "string" ? reader.result : "";
      updateField("coverImage", nextValue);
    };
    reader.readAsDataURL(file);
  };

  const validate = (intent: "Draft" | "Published") => {
    if (!formState.title.trim()) {
      return "Campaign title is required.";
    }

    if (intent === "Published") {
      if (!formState.shortDescription.trim()) {
        return "A short description is required before publishing.";
      }

      if (!formState.destination.trim()) {
        return "Destination or location is required before publishing.";
      }

      if (!formState.startDate || !formState.endDate) {
        return "Campaign dates are required before publishing.";
      }

      if (formState.contentTypes.length === 0) {
        return "Select at least one offered content type before publishing.";
      }

      if (!formState.priceExpectation.trim()) {
        return "Price or budget expectation is required before publishing.";
      }
    }

    return "";
  };

  const persistCampaign = (intent: "Draft" | "Published") => {
    const validationError = validate(intent);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSaving(true);
    upsertCreatorCampaign(formState, intent, campaignId);
    router.push("/campaign-offers");
    router.refresh();
  };

  const handleDraftSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    persistCampaign("Draft");
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1080px]">
        <section className="rounded-3xl bg-white p-7 shadow-sm">
          <p className="text-sm text-[#7c879b]">Loading campaign...</p>
        </section>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-[1080px]">
        <section className="rounded-3xl bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#2f3747]">Campaign not found</h1>
          <p className="mt-2 text-sm text-[#7c879b]">
            This creator campaign does not exist in the current workspace.
          </p>
          <Link
            href="/campaign-offers"
            className="mt-5 inline-flex rounded-full bg-[#2f3747] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Campaign Offers
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8d98ad]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2f3747]">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#7c879b]">{copy.description}</p>
        </div>
        <Link
          href="/campaign-offers"
          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
        >
          View Campaign Offers
        </Link>
      </section>

      <form onSubmit={handleDraftSubmit} className="space-y-6">
        <section className="reveal-enter grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-3xl bg-white p-6 shadow-[0_4px_14px_rgba(27,39,64,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">Campaign details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-sm font-medium text-[#445066]">Campaign title</span>
                <input
                  value={formState.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Tokyo spring trip product showcase"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-sm font-medium text-[#445066]">Short description</span>
                <textarea
                  value={formState.shortDescription}
                  onChange={(event) => updateField("shortDescription", event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Describe the trip, placement opportunity, and the type of creator-led content you can deliver."
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Destination / location</span>
                <input
                  value={formState.destination}
                  onChange={(event) => updateField("destination", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Kyoto, Japan"
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Deliverables count</span>
                <input
                  type="number"
                  min="1"
                  value={formState.numberOfDeliverables}
                  onChange={(event) =>
                    updateField(
                      "numberOfDeliverables",
                      Number(event.target.value) || 1
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Campaign dates</span>
                <button
                  type="button"
                  onClick={() => setCampaignDatePickerOpen(true)}
                  className="mt-2 flex w-full items-center justify-between rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-left text-sm text-[#2f3747] outline-none transition hover:border-[#cad4e4] focus:border-[#bdcadf]"
                >
                  <span>
                    {formState.startDate && formState.endDate
                      ? `${formState.startDate} to ${formState.endDate}`
                      : "Pick campaign dates"}
                  </span>
                  <span className="text-[#8f99ad]">{"\u25BE"}</span>
                </button>
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Price / budget expectation</span>
                <input
                  value={formState.priceExpectation}
                  onChange={(event) => updateField("priceExpectation", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="$1,500 package"
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Application deadline</span>
                <button
                  type="button"
                  onClick={() => setApplicationDeadlinePickerOpen(true)}
                  className="mt-2 flex w-full items-center justify-between rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-left text-sm text-[#2f3747] outline-none transition hover:border-[#cad4e4] focus:border-[#bdcadf]"
                >
                  <span>
                    {formState.applicationDeadline || "Pick application deadline"}
                  </span>
                  <span className="text-[#8f99ad]">{"\u25BE"}</span>
                </button>
              </label>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-[0_4px_14px_rgba(27,39,64,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">Cover media</h2>
            <div className="mt-5 space-y-4">
              <div className="overflow-hidden rounded-3xl bg-[#f3f5f9]">
                {formState.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formState.coverImage}
                    alt="Campaign cover preview"
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-[#8b97ab]">
                    Add a cover image URL or upload a file to preview how the offer will appear.
                  </div>
                )}
              </div>

              <label>
                <span className="text-sm font-medium text-[#445066]">Cover image URL</span>
                <input
                  value={formState.coverImage}
                  onChange={(event) => updateField("coverImage", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="https://..."
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[#445066]">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 block w-full text-sm text-[#58647a] file:mr-4 file:rounded-full file:border-0 file:bg-[#eef3ff] file:px-4 file:py-2 file:font-medium file:text-[#4f6fd3]"
                />
              </label>
            </div>
          </article>
        </section>

        <section className="reveal-enter rounded-3xl bg-white p-6 shadow-[0_4px_14px_rgba(27,39,64,0.05)]">
          <h2 className="text-xl font-semibold text-[#2f3747]">Offer structure</h2>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-medium text-[#445066]">Content type offered</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contentTypeOptions.map((option) => {
                  const active = formState.contentTypes.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleContentTypeToggle(option)}
                      className={`tap-press rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[#2f3747] text-white"
                          : "border border-[#dde3f0] bg-white text-[#4c5b76] hover:bg-[#f2f5fb]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="text-sm font-medium text-[#445066]">Audience details</span>
                <textarea
                  value={formState.audienceDetails}
                  onChange={(event) => updateField("audienceDetails", event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Audience demographics, interests, buying signals..."
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Platform details</span>
                <textarea
                  value={formState.platformDetails}
                  onChange={(event) => updateField("platformDetails", event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Instagram 120K, TikTok 60K, average views..."
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Product category preferences</span>
                <textarea
                  value={formState.productCategoryPreferences}
                  onChange={(event) =>
                    updateField("productCategoryPreferences", event.target.value)
                  }
                  className="mt-2 min-h-28 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Travel gear, beauty, fashion, hospitality..."
                />
              </label>

              <label>
                <span className="text-sm font-medium text-[#445066]">Collaboration terms</span>
                <textarea
                  value={formState.collaborationTerms}
                  onChange={(event) => updateField("collaborationTerms", event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Revisions, shipment expectations, turnaround, exclusions..."
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-sm font-medium text-[#445066]">Usage rights</span>
                <textarea
                  value={formState.usageRights}
                  onChange={(event) => updateField("usageRights", event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-2xl border border-[#e5e9f1] bg-[#fbfbfc] px-4 py-3 text-sm text-[#2f3747] outline-none transition focus:border-[#bdcadf]"
                  placeholder="Organic repost rights, paid usage windows, whitelist permissions..."
                />
              </label>
            </div>
          </div>
        </section>

        {error && (
          <section className="rounded-2xl border border-[#f2c7d1] bg-[#fdecef] px-4 py-3 text-sm text-[#9c3d57]">
            {error}
          </section>
        )}

        <section className="reveal-enter flex flex-wrap items-center justify-end gap-3 pb-4">
          <Link
            href="/campaign-offers"
            className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-semibold text-[#4c5b76] transition hover:bg-[#f2f5fb] disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => persistCampaign("Published")}
            disabled={saving}
            className="tap-press rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            Publish Campaign
          </button>
        </section>
      </form>
      <DateRangePicker
        key={`campaign-${campaignDatePickerOpen}-${formState.startDate}-${formState.endDate}`}
        isOpen={campaignDatePickerOpen}
        initialStartDate={formState.startDate}
        initialEndDate={formState.endDate}
        onClose={() => setCampaignDatePickerOpen(false)}
        onConfirm={({ startDate, endDate }) => {
          updateField("startDate", startDate);
          updateField("endDate", endDate);
          setCampaignDatePickerOpen(false);
        }}
      />
      <DateRangePicker
        key={`deadline-${applicationDeadlinePickerOpen}-${formState.applicationDeadline}`}
        isOpen={applicationDeadlinePickerOpen}
        initialStartDate={formState.applicationDeadline}
        initialEndDate={formState.applicationDeadline}
        selectionMode="single"
        onClose={() => setApplicationDeadlinePickerOpen(false)}
        onConfirm={({ startDate }) => {
          updateField("applicationDeadline", startDate);
          setApplicationDeadlinePickerOpen(false);
        }}
      />
    </div>
  );
}


