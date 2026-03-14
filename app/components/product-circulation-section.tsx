"use client";

import Link from "next/link";
import { useState } from "react";

type Asset = {
  id: string;
  title: string;
  type: string;
  status: "Submitted" | "Approved" | "In Review";
  thumbnail: string;
};

const submittedAssets: Asset[] = [
  {
    id: "asset-1",
    title: "Night Market Product Reel",
    type: "Reel",
    status: "Approved",
    thumbnail:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "asset-2",
    title: "Unboxing Hook Video",
    type: "UGC Video",
    status: "In Review",
    thumbnail:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "asset-3",
    title: "Cafe Table Product Photo",
    type: "Photo",
    status: "Submitted",
    thumbnail:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "asset-4",
    title: "Hotel Mirror Story Set",
    type: "Story Set",
    status: "Approved",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },
];

function assetStatusClass(status: Asset["status"]) {
  if (status === "Approved") {
    return "bg-[#e8f7ee] text-[#2f8a5a]";
  }

  if (status === "In Review") {
    return "bg-[#eef3ff] text-[#4f6fd3]";
  }

  return "bg-[#fff5df] text-[#b98f27]";
}

export default function ProductCirculationSection() {
  const [receivedConfirmed, setReceivedConfirmed] = useState(false);

  return (
    <section className="reveal-enter hover-lift space-y-5 rounded-[30px] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfd_100%)] p-6 shadow-[0_18px_44px_rgba(24,37,64,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bd7c49]">
            Your Traveling Content Invitation
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[#2f3747]">
            See where the product is, create your content, then hand it to the next creator
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#667389]">
            When a brand accepts your invitation, this view helps you track the product location,
            confirm that you received it, submit the content you created, and deliver the product
            to the next creator in the sequence.
          </p>
        </div>

        <div className="grid min-w-[240px] gap-3 sm:grid-cols-3">
          <div className="hover-lift rounded-2xl border border-[#e3ebf8] bg-[#f6f9ff] px-4 py-3">
            <p className="text-xs text-[#7183a3]">Current product holder</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">You</p>
          </div>
          <div className="hover-lift rounded-2xl border border-[#f0e3d5] bg-[#fff8f2] px-4 py-3">
            <p className="text-xs text-[#a27c58]">Delivery status</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">Delivered on Mar 14</p>
          </div>
          <div className="hover-lift rounded-2xl border border-[#e7e9ef] bg-[#fafbfc] px-4 py-3">
            <p className="text-xs text-[#7c879b]">Next creator ETA</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">Mar 18, 2026</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="reveal-enter hover-lift rounded-[28px] border border-[#edf0f4] bg-white p-5 shadow-[0_10px_24px_rgba(16,24,40,0.04)]" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#2f3747]">Your Current Task</p>
              <p className="mt-1 text-xs text-[#7c879b]">
                What you need to do now for this accepted traveling content campaign.
              </p>
            </div>
            <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#4f6fd3]">
              Active creator
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs text-[#8b97ab]">Where is the product now?</p>
              <p className="mt-1 text-lg font-semibold text-[#2f3747]">
                With you in Chiang Mai
              </p>
              <p className="mt-2 text-sm text-[#667389]">
                The previous creator shipped it via DHL. Delivery was confirmed on Mar 14,
                2026 and your content window is now open.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="hover-lift rounded-2xl border border-[#edf0f4] px-4 py-3">
                <p className="text-xs text-[#8b97ab]">Received date</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">Mar 14, 2026</p>
              </div>
              <div className="hover-lift rounded-2xl border border-[#edf0f4] px-4 py-3">
                <p className="text-xs text-[#8b97ab]">Ship to next creator</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">Mar 17, 2026</p>
              </div>
              <div className="hover-lift rounded-2xl border border-[#edf0f4] px-4 py-3">
                <p className="text-xs text-[#8b97ab]">Next creator</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">Lina Costa</p>
              </div>
              <div className="hover-lift rounded-2xl border border-[#edf0f4] px-4 py-3">
                <p className="text-xs text-[#8b97ab]">Tracking state</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                  Awaiting your shipment update
                </p>
              </div>
            </div>

            <div className="hover-lift rounded-2xl border border-[#f0e5d9] bg-[#fff9f4] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#bd7c49]">
                Workflow
              </p>
              <ol className="mt-3 space-y-2 text-sm text-[#667389]">
                <li>1. Confirm that you received the product.</li>
                <li>2. Create the requested travel content while the product is with you.</li>
                <li>3. Submit the content to the brand for review.</li>
                <li>4. Ship the product to the next creator and mark it as handed off.</li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              {!receivedConfirmed ? (
                <button
                  type="button"
                  onClick={() => setReceivedConfirmed(true)}
                  className="tap-press rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Confirm Received
                </button>
              ) : (
                <div className="rounded-full bg-[#e8f7ee] px-4 py-2.5 text-sm font-semibold text-[#2f8a5a]">
                  Your workflow has started.
                </div>
              )}
              <Link
                href="/submit-content?project=1"
                className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
              >
                Submit Content
              </Link>
              <Link
                href="/available-campaigns/next-creator-handoff"
                className="tap-press rounded-full border border-[#f2d8cc] bg-[#fff8f4] px-4 py-2.5 text-sm font-medium text-[#c16e45] transition hover:bg-[#fff1e8]"
              >
                Deliver to Next Creator
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="reveal-enter hover-lift rounded-[28px] border border-[#edf0f4] bg-white p-5 shadow-[0_10px_24px_rgba(16,24,40,0.04)]" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#2f3747]">Your Content From This Product</p>
            <p className="mt-1 text-xs text-[#7c879b]">
              Assets created from the same traveling product while it is with you.
            </p>
          </div>
          <span className="rounded-full bg-[#fff4ea] px-3 py-1 text-xs font-semibold text-[#c17140]">
            4 assets tracked
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {submittedAssets.map((asset) => (
            <article
              key={asset.id}
              className="hover-lift overflow-hidden rounded-[24px] border border-[#edf0f4] bg-[#fbfbfc]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.thumbnail}
                alt={asset.title}
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2f3747]">{asset.title}</p>
                    <p className="mt-1 text-xs text-[#7c879b]">{asset.type}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${assetStatusClass(asset.status)}`}
                  >
                    {asset.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
