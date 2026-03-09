import Link from "next/link";
import { brandInvites } from "@/app/lib/brand-invites";

type BrandInvitesPageProps = {
  searchParams?: Promise<{
    invite?: string;
  }>;
};

export default async function BrandInvitesPage({
  searchParams,
}: BrandInvitesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedInviteId = Number(resolvedSearchParams?.invite);
  const visibleInvites =
    Number.isFinite(selectedInviteId) && selectedInviteId > 0
      ? brandInvites.filter((invite) => invite.id === selectedInviteId)
      : brandInvites;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Brand Invites</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Review the campaign invites brands have sent you and inspect each campaign brief before you respond.
          </p>
        </div>
        <Link
          href="/my-projects"
          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
        >
          Back to My Projects
        </Link>
      </section>

      <section
        className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        style={{ animationDelay: "80ms" }}
      >
        {[
          { label: "Open Invites", value: brandInvites.length, tone: "bg-[#fdecef] text-[#d65778]" },
          {
            label: "Avg Budget",
            value: "\u20AC505",
            tone: "bg-[#fff0e4] text-[#df8b37]",
          },
          {
            label: "Platforms",
            value: new Set(brandInvites.map((invite) => invite.platform)).size,
            tone: "bg-[#eef3ff] text-[#5a74c6]",
          },
          {
            label: "Need Response",
            value: "2",
            tone: "bg-[#eaf8f1] text-[#4f9a72]",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">
                  {item.label}
                </p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">
                  {item.value}
                </p>
              </div>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${item.tone}`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="reveal-enter space-y-4" style={{ animationDelay: "140ms" }}>
        {visibleInvites.map((invite, index) => (
          <article
            key={invite.id}
            className="reveal-enter rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            style={{ animationDelay: `${180 + index * 40}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#fdecef] px-3 py-1 text-xs font-semibold text-[#c04963]">
                    Invite
                  </span>
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#4f6fd3]">
                    {invite.platform}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6b7487]">
                    {invite.category}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f3747]">{invite.campaign}</h2>
                <p className="mt-1 text-sm text-[#7c879b]">
                  {invite.brand} . {invite.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Budget</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{invite.budget}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Invited On</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{invite.invitedOn}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Respond By</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{invite.responseBy}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Campaign Dates</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                  {invite.startDate} - {invite.endDate}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Platform</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">{invite.platform}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Campaign Brief</p>
                <p className="mt-2 text-sm leading-6 text-[#56627a]">{invite.brief}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Requested Deliverables</p>
                <ul className="mt-3 space-y-2 text-sm text-[#445066]">
                  {invite.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#de8b34]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button className="tap-press rounded-xl border border-[#dde3f0] bg-white px-4 py-2 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]">
                Decline
              </button>
              <button className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105">
                Accept Invite
              </button>
            </div>
          </article>
        ))}

        {visibleInvites.length === 0 && (
          <article className="rounded-3xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">Invite not found</h2>
            <p className="mt-2 text-sm text-[#7c879b]">
              The selected invite could not be loaded from this workspace.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}
