import Link from "next/link";

export default function NextCreatorHandoffPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bd7c49]">
          Next Creator Handoff
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#2f3747]">
          Deliver the product to the next creator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667389]">
          Use these details to ship the product to the next creator after your content has been
          submitted. This keeps the traveling content campaign moving smoothly.
        </p>
      </section>

      <section className="reveal-enter grid gap-5 lg:grid-cols-[1.05fr_0.95fr]" style={{ animationDelay: "120ms" }}>
        <article className="rounded-[28px] border border-[#edf0f4] bg-white p-6 shadow-[0_10px_24px_rgba(16,24,40,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8d98ad]">
                Next Creator
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#2f3747]">Lina Costa</h2>
              <p className="mt-1 text-sm text-[#667389]">
                Instagram Stories creator based in Bali
              </p>
            </div>
            <span className="rounded-full bg-[#fff4ea] px-3 py-1 text-xs font-semibold text-[#c17140]">
              Awaiting shipment
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs text-[#8b97ab]">Shipping address</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#2f3747]">
                Lina Costa
                <br />
                Villa Sunset Studio
                <br />
                Jl. Pantai Batu Bolong No. 18
                <br />
                Canggu, Bali 80361
                <br />
                Indonesia
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-xs text-[#8b97ab]">Contact details</p>
              <div className="mt-2 space-y-3 text-sm text-[#2f3747]">
                <p>
                  <span className="font-semibold">Phone:</span> +62 812 4455 7788
                </p>
                <p>
                  <span className="font-semibold">Email:</span> lina@travelstories.co
                </p>
                <p>
                  <span className="font-semibold">Preferred courier:</span> DHL Express
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#f0e5d9] bg-[#fff9f4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#bd7c49]">
              Shipping notes
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#667389]">
              <li>1. Add the original product box and protective sleeve.</li>
              <li>2. Include the campaign card and tracking slip inside the parcel.</li>
              <li>3. Mark the parcel as fragile and confirm the tracking number after shipment.</li>
              <li>4. Ship no later than March 17, 2026.</li>
            </ul>
          </div>
        </article>

        <article className="rounded-[28px] border border-[#edf0f4] bg-white p-6 shadow-[0_10px_24px_rgba(16,24,40,0.04)]">
          <h2 className="text-xl font-semibold text-[#2f3747]">Handoff Summary</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-[#edf0f4] px-4 py-3">
              <p className="text-xs text-[#8b97ab]">Ship by</p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">March 17, 2026</p>
            </div>
            <div className="rounded-2xl border border-[#edf0f4] px-4 py-3">
              <p className="text-xs text-[#8b97ab]">Expected delivery</p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">March 18, 2026</p>
            </div>
            <div className="rounded-2xl border border-[#edf0f4] px-4 py-3">
              <p className="text-xs text-[#8b97ab]">Campaign product</p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                GlowCo Travel Serum Kit
              </p>
            </div>
            <div className="rounded-2xl border border-[#edf0f4] px-4 py-3">
              <p className="text-xs text-[#8b97ab]">Tracking state</p>
              <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                Waiting for your courier booking
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/available-campaigns?mode=travel"
              className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
            >
              Back to Campaigns
            </Link>
            <button
              type="button"
              className="tap-press rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Confirm Shipment Details
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
