"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { appliedCampaigns } from "@/app/lib/applied-campaigns";
import { brandInvites } from "@/app/lib/brand-invites";
import { completedCampaigns } from "@/app/lib/completed-campaigns";
import { activeProjects, type ManagedProject } from "@/app/lib/managed-projects";

function StatusPill({ value }: { value: string }) {
  const styles: Record<string, string> = {
    "In Progress": "bg-[#eaf1ff] text-[#4f6fd3]",
    "Under Review": "bg-[#fff5df] text-[#b98f27]",
    "Waiting Assets": "bg-[#f4ecff] text-[#7a57b8]",
    Completed: "bg-[#e8f7ee] text-[#3d9a61]",
    Applied: "bg-[#eaf1ff] text-[#4f6fd3]",
    Accepted: "bg-[#e6f8ef] text-[#2f8a5a]",
    Rejected: "bg-[#fdecef] text-[#c04963]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[value] ?? "bg-[#eef0f5] text-[#58647a]"}`}>
      {value}
    </span>
  );
}

export default function MyProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const totalRequiredAssets = useMemo(() => {
    if (!selectedProject) {
      return 0;
    }

    return (
      selectedProject.requiredPhotos +
      selectedProject.requiredVideos +
      selectedProject.requiredStories
    );
  }, [selectedProject]);

  const totalUploadedAssets = useMemo(() => {
    if (!selectedProject) {
      return 0;
    }

    return (
      selectedProject.uploadedPhotos +
      selectedProject.uploadedVideos +
      selectedProject.uploadedStories
    );
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEscape);
    };
  }, [selectedProject]);

  const projectModal = selectedProject ? (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#0e1420]/55 px-4 py-6"
      onClick={() => setSelectedProject(null)}
    >
      <div
        className="pop-enter relative mx-auto my-4 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-[0_24px_52px_rgba(15,23,42,0.25)] max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b97ab]">
              {selectedProject.brand}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#2f3747]">{selectedProject.title}</h2>
            <p className="mt-1 text-sm text-[#7c879b]">Managed by {selectedProject.manager}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="tap-press rounded-full p-2 text-[#7d889a] transition hover:bg-[#f2f5fb] hover:text-[#2f3747]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Status</p>
            <div className="mt-1"><StatusPill value={selectedProject.status} /></div>
            <p className="mt-3 text-xs text-[#8b97ab]">Deadline</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">{selectedProject.due}</p>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Payout</p>
            <p className="mt-1 text-xl font-semibold text-[#2f3747]">{selectedProject.payout}</p>
            <p className="mt-3 text-xs text-[#8b97ab]">Total Assets</p>
            <p className="mt-1 text-sm font-semibold text-[#2f3747]">
              {totalUploadedAssets} / {totalRequiredAssets} uploaded
            </p>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Required Deliverables</p>
            <ul className="mt-2 space-y-1 text-sm text-[#445066]">
              <li>Photos: {selectedProject.requiredPhotos}</li>
              <li>Videos: {selectedProject.requiredVideos}</li>
              <li>Stories: {selectedProject.requiredStories}</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 hover-lift rounded-2xl bg-[#f8fafc] p-4">
          <p className="text-xs text-[#8b97ab]">Project Brief</p>
          <p className="mt-1 text-sm leading-6 text-[#56627a]">{selectedProject.brief}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="hover-lift rounded-2xl border border-[#ebeff6] bg-white p-4">
            <p className="text-xs text-[#8b97ab]">Photos</p>
            <p className="mt-1 text-lg font-semibold text-[#2f3747]">
              {selectedProject.uploadedPhotos} / {selectedProject.requiredPhotos}
            </p>
          </div>
          <div className="hover-lift rounded-2xl border border-[#ebeff6] bg-white p-4">
            <p className="text-xs text-[#8b97ab]">Videos</p>
            <p className="mt-1 text-lg font-semibold text-[#2f3747]">
              {selectedProject.uploadedVideos} / {selectedProject.requiredVideos}
            </p>
          </div>
          <div className="hover-lift rounded-2xl border border-[#ebeff6] bg-white p-4">
            <p className="text-xs text-[#8b97ab]">Stories</p>
            <p className="mt-1 text-lg font-semibold text-[#2f3747]">
              {selectedProject.uploadedStories} / {selectedProject.requiredStories}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Checklist</p>
            <ul className="mt-2 space-y-2 text-sm text-[#4c5870]">
              {selectedProject.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#de8b34]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hover-lift rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-xs text-[#8b97ab]">Required Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedProject.hashtagList.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-xs font-medium text-[#4f6fd3]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="tap-press rounded-xl border border-[#dce3f0] bg-white px-4 py-2 text-sm font-medium text-[#4d5c78] transition hover:bg-[#f2f5fb]"
          >
            Close
          </button>
          <Link
            href="/submit-content"
            className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-2 text-sm font-semibold text-white"
          >
            Upload Deliverables
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter">
        <h1 className="text-3xl font-semibold text-[#2f3747]">My Projects</h1>
        <p className="mt-1 text-sm text-[#7c879b]">
          Manage active deliveries, track campaign applications, review outcomes, and respond to invites.
        </p>
      </section>

      <section className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: "80ms" }}>
        <Link
          href="/my-projects/current-campaigns"
          className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition hover:bg-[#f7fbff]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Current Projects</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{activeProjects.length}</p>
              <p className="mt-2 text-xs text-[#8d98ad]">Manage live work</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3ff] text-[#5a74c6]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </Link>
        <Link
          href="/my-projects/finished-campaigns"
          className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition hover:bg-[#f7fbff]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Finished Projects</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{completedCampaigns.length}</p>
              <p className="mt-2 text-xs text-[#8d98ad]">Review delivered work</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#4f9a72]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.5 12.5l2.2 2.1L15.8 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
        <Link
          href="/my-projects/applied-campaigns"
          className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition hover:bg-[#fffaf4]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Applied Campaigns</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{appliedCampaigns.length}</p>
              <p className="mt-2 text-xs text-[#8d98ad]">Open full application details</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0e4] text-[#df8b37]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M12 16V5M8 9l4-4 4 4M5 16v2.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
        <Link
          href="/my-projects/brand-invites"
          className="hover-lift rounded-2xl border border-[#e8ebf1] bg-white p-4 shadow-[0_4px_12px_rgba(27,39,64,0.05)] transition hover:bg-[#fff8fa]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#8d98ad]">Brand Invites</p>
              <p className="mt-2 text-[28px] font-semibold leading-none text-[#2f3747]">{brandInvites.length}</p>
              <p className="mt-2 text-xs text-[#8d98ad]">See open invite sources</p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fdecef] text-[#d65778]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
      </section>

      <section className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "140ms" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2f3747]">Current Projects</h2>
          <Link href="/submit-content" className="tap-press text-sm font-medium text-[#4f6fd3] transition hover:text-[#3f5ec3]">
            Submit Content
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-[#8b97ab]">
                <th className="px-3 py-2 font-medium">Project</th>
                <th className="px-3 py-2 font-medium">Brand</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Due</th>
                <th className="px-3 py-2 font-medium">Payout</th>
                <th className="px-3 py-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {activeProjects.map((project) => (
                <tr key={project.id} className="bg-white text-sm text-[#3e4a60] transition hover:bg-[#f8fbff]">
                  <td className="rounded-l-xl px-3 py-3">
                    <Link
                      href={`/my-projects/current-campaigns?project=${project.id}`}
                      className="font-medium text-[#2f3747] transition hover:text-[#4f6fd3]"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{project.brand}</td>
                  <td className="px-3 py-3"><StatusPill value={project.status} /></td>
                  <td className="px-3 py-3 text-[#8894a8]">{project.due}</td>
                  <td className="px-3 py-3 font-semibold text-[#2f3747]">{project.payout}</td>
                  <td className="rounded-r-xl px-3 py-3">
                    <Link
                      href={`/my-projects/current-campaigns?project=${project.id}`}
                      className="tap-press rounded-lg border border-[#dde3f0] bg-white px-3 py-1.5 text-xs font-medium text-[#4c5b76] transition hover:bg-[#f2f5fb]"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-2" style={{ animationDelay: "200ms" }}>
        <article className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "240ms" }}>
          <h2 className="text-xl font-semibold text-[#2f3747]">Finished Projects</h2>
          <ul className="mt-4 space-y-3">
            {completedCampaigns.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/my-projects/finished-campaigns?campaign=${project.id}`}
                  className="hover-lift block rounded-2xl bg-white p-3 transition hover:bg-[#f8fbff]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#2f3747] transition hover:text-[#4f6fd3]">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs text-[#8b97ab]">{project.brand} . Finished {project.due}</p>
                    </div>
                    <div className="text-right">
                      <StatusPill value={project.status} />
                      <p className="mt-2 text-sm font-semibold text-[#2f3747]">{project.payout}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "280ms" }}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#2f3747]">My Campaign Applications</h2>
            <p className="text-xs uppercase tracking-[0.08em] text-[#8b97ab]">
              Applied, accepted, rejected, completed
            </p>
          </div>
          <ul className="mt-4 space-y-3">
            {appliedCampaigns.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/my-projects/applied-campaigns?campaign=${project.id}`}
                  className="hover-lift block rounded-2xl bg-white p-3 transition hover:bg-[#fffaf4]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#2f3747] transition hover:text-[#4f6fd3]">
                        {project.campaign}
                      </p>
                      <p className="mt-1 text-xs text-[#8b97ab]">
                        {project.brand} . Applied {project.appliedOn}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#68748a]">{project.updateNote}</p>
                    </div>
                    <div className="text-right">
                      <StatusPill value={project.stage} />
                      <p className="mt-2 text-sm font-semibold text-[#2f3747]">{project.budget}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="reveal-enter hover-lift rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "340ms" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2f3747]">Brand Invites</h2>
          <Link href="/available-campaigns" className="tap-press text-sm font-medium text-[#4f6fd3] transition hover:text-[#3f5ec3]">
            Browse More Campaigns
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {brandInvites.map((invite) => (
            <Link
              key={invite.id}
              href={`/my-projects/brand-invites?invite=${invite.id}`}
              className="hover-lift block rounded-2xl bg-white p-4 transition hover:bg-[#fff8fa]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8b97ab]">{invite.brand}</p>
              <p className="mt-1 block text-base font-semibold text-[#2f3747] transition hover:text-[#4f6fd3]">
                {invite.campaign}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#7c879b]">
                <p>Invited: {invite.invitedOn}</p>
                <p>Respond by: {invite.responseBy}</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#2f3747]">Budget: {invite.budget}</p>
              <div className="mt-3 flex gap-2">
                <span className="tap-press rounded-xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-3 py-2 text-xs font-semibold text-white">
                  Accept Invite
                </span>
                <span className="tap-press rounded-xl border border-[#dde3f0] bg-white px-3 py-2 text-xs font-medium text-[#4c5b76]">
                  Decline
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {projectModal && createPortal(projectModal, document.body)}
    </div>
  );
}
