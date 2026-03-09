import Link from "next/link";
import {
  activeProjects,
  type ManagedProjectAsset,
  type ManagedProjectAssetStatus,
} from "@/app/lib/managed-projects";

function StatusPill({ value }: { value: ManagedProjectAssetStatus | string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-[#e8f7ee] text-[#2f8a5a]",
    "Needs Approval": "bg-[#eef3ff] text-[#4f6fd3]",
    Rejected: "bg-[#fdecef] text-[#c04963]",
    Resubmit: "bg-[#fff0e4] text-[#df8b37]",
    "In Progress": "bg-[#eaf1ff] text-[#4f6fd3]",
    "Under Review": "bg-[#fff5df] text-[#b98f27]",
    "Waiting Assets": "bg-[#f4ecff] text-[#7a57b8]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[value] ?? "bg-[#eef0f5] text-[#58647a]"}`}>
      {value}
    </span>
  );
}

function assetActionLabel(status: ManagedProjectAsset["status"]) {
  if (status === "Rejected" || status === "Resubmit") {
    return "Resubmit";
  }

  if (status === "Needs Approval") {
    return "Awaiting Review";
  }

  return "Delivered";
}

type CurrentCampaignsPageProps = {
  searchParams?: Promise<{
    project?: string;
  }>;
};

export default async function CurrentCampaignsPage({
  searchParams,
}: CurrentCampaignsPageProps) {
  return <CurrentCampaignsContent searchParams={searchParams} />;
}

async function CurrentCampaignsContent({
  searchParams,
}: CurrentCampaignsPageProps = {}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedProjectId = Number(resolvedSearchParams?.project);
  const visibleProjects =
    Number.isFinite(selectedProjectId) && selectedProjectId > 0
      ? activeProjects.filter((project) => project.id === selectedProjectId)
      : activeProjects;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#2f3747]">Current Campaigns</h1>
          <p className="mt-1 text-sm text-[#7c879b]">
            Track the campaigns you are actively working on, the assets you have delivered, and what still needs approval or resubmission.
          </p>
        </div>
        <Link
          href="/my-projects"
          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
        >
          Back to My Projects
        </Link>
      </section>

      <section className="reveal-enter hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: "80ms" }}>
        {[
          { label: "Working Campaigns", value: activeProjects.length, tone: "bg-[#eef3ff] text-[#5a74c6]" },
          {
            label: "Delivered Assets",
            value: activeProjects.flatMap((project) => project.assets).filter((asset) => asset.status === "Delivered").length,
            tone: "bg-[#eaf8f1] text-[#4f9a72]",
          },
          {
            label: "Needs Approval",
            value: activeProjects.flatMap((project) => project.assets).filter((asset) => asset.status === "Needs Approval").length,
            tone: "bg-[#fff5df] text-[#b98f27]",
          },
          {
            label: "Need Resubmit",
            value: activeProjects.flatMap((project) => project.assets).filter((asset) => asset.status === "Rejected" || asset.status === "Resubmit").length,
            tone: "bg-[#fdecef] text-[#d65778]",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">{item.label}</p>
                <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{item.value}</p>
              </div>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${item.tone}`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M4 7h16v10H8l-4 3V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="reveal-enter space-y-4" style={{ animationDelay: "140ms" }}>
        {visibleProjects.map((project, index) => (
          <article
            key={project.id}
            className="reveal-enter rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            style={{ animationDelay: `${180 + index * 40}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill value={project.status} />
                  <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-medium text-[#4f6fd3]">
                    Manager: {project.manager}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-[#2f3747]">{project.title}</h2>
                <p className="mt-1 text-sm text-[#7c879b]">{project.brand} . Due {project.due}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.08em] text-[#8d98ad]">Payout</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{project.payout}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Photos</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                  {project.uploadedPhotos} / {project.requiredPhotos} delivered
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Videos</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                  {project.uploadedVideos} / {project.requiredVideos} delivered
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs text-[#8b97ab]">Stories</p>
                <p className="mt-1 text-sm font-semibold text-[#2f3747]">
                  {project.uploadedStories} / {project.requiredStories} delivered
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-xs text-[#8b97ab]">Campaign Brief</p>
              <p className="mt-2 text-sm leading-6 text-[#56627a]">{project.brief}</p>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[#2f3747]">Delivered Assets</h3>
                <Link
                  href="/submit-content"
                  className="tap-press rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Submit Content
                </Link>
              </div>

              <div className="mt-4 grid gap-3">
                {project.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-[#ebeff6] bg-[#fbfbfc] p-4"
                  >
                    <div className="flex flex-1 flex-wrap items-start gap-4">
                      <div
                        className="relative h-28 w-full max-w-[172px] overflow-hidden rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url('${asset.previewImage}')` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[#2f3747]">
                          {asset.type}
                        </div>
                        {asset.type === "Video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#2f3747]">
                              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                <path
                                  d="M10 8.5l5 3.5-5 3.5v-7z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-[220px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#68748a]">
                          {asset.type}
                        </span>
                        <StatusPill value={asset.status} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#2f3747]">{asset.label}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f6b81]">{asset.note}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                          asset.status === "Rejected" || asset.status === "Resubmit"
                            ? "bg-[#fff0e4] text-[#b96d20]"
                            : asset.status === "Needs Approval"
                              ? "bg-[#eef3ff] text-[#4f6fd3]"
                              : "bg-[#e8f7ee] text-[#2f8a5a]"
                        }`}
                      >
                        {assetActionLabel(asset.status)}
                      </button>
                      {(asset.status === "Rejected" || asset.status === "Resubmit") && (
                        <Link
                          href="/submit-content"
                          className="tap-press rounded-full border border-[#dde3f0] bg-white px-4 py-2 text-sm font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
                        >
                          Upload Revision
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}

        {visibleProjects.length === 0 && (
          <article className="rounded-3xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold text-[#2f3747]">Project not found</h2>
            <p className="mt-2 text-sm text-[#7c879b]">
              The requested current project could not be loaded from this workspace.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}
