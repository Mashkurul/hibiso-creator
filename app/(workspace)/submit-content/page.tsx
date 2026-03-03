"use client";

import { useMemo, useRef, useState } from "react";

type UploadStage = "Submitted" | "Under Review" | "Approved" | "Payment Released";

type UploadedVideo = {
  id: number;
  name: string;
  sizeMb: string;
  progress: number;
};

type GalleryPhoto = {
  id: number;
  name: string;
  url: string;
  fromUser: boolean;
};

const stages: UploadStage[] = ["Submitted", "Under Review", "Approved", "Payment Released"];

const requiredVideoCount = 1;
const requiredPhotoCount = 5;

const seedGallery: GalleryPhoto[] = [
  {
    id: 1,
    name: "sunset-beach",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    fromUser: false,
  },
  {
    id: 2,
    name: "skincare-product",
    url: "https://images.unsplash.com/photo-1526758097130-bab247274f58?auto=format&fit=crop&w=900&q=80",
    fromUser: false,
  },
  {
    id: 3,
    name: "lifestyle-shot",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    fromUser: false,
  },
];

function formatSize(sizeInBytes: number) {
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StageIcon({ stage }: { stage: UploadStage }) {
  if (stage === "Submitted") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M6.5 12.5l3 3L17.5 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (stage === "Under Review") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l2.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (stage === "Approved") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M8.5 12.5l2.2 2.1L15.8 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return <span className="text-xs font-bold">$</span>;
}

export default function SubmitContentPage() {
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const nextIdRef = useRef(1000);

  const [stageIndex, setStageIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [caption, setCaption] = useState("");
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(seedGallery);

  const uploadedPhotoCount = useMemo(
    () => galleryPhotos.filter((photo) => photo.fromUser).length,
    [galleryPhotos]
  );
  const canSubmit = uploadedVideos.length >= requiredVideoCount && uploadedPhotoCount >= requiredPhotoCount;
  const currentStage = stages[stageIndex];
  const stageProgressPercent = (stageIndex / (stages.length - 1)) * 100;

  const onAddVideos = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const validVideos = Array.from(files).filter((file) =>
      /\.(mp4|mov)$/i.test(file.name)
    );

    if (validVideos.length === 0) {
      setStatusMessage("Please upload MP4 or MOV video files.");
      return;
    }

    setUploadedVideos((current) => [
      ...current,
      ...validVideos.map((file) => ({
        id: nextIdRef.current++,
        name: file.name,
        sizeMb: formatSize(file.size),
        progress: 100,
      })),
    ]);
    setStatusMessage(`${validVideos.length} video file(s) added.`);
  };

  const onAddPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const validPhotos = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (validPhotos.length === 0) {
      setStatusMessage("Please upload image files for the gallery.");
      return;
    }

    setGalleryPhotos((current) => [
      ...current,
      ...validPhotos.map((file) => ({
        id: nextIdRef.current++,
        name: file.name,
        url: URL.createObjectURL(file),
        fromUser: true,
      })),
    ]);
    setStatusMessage(`${validPhotos.length} photo(s) added to gallery.`);
  };

  const onRemoveVideo = (id: number) => {
    setUploadedVideos((current) => current.filter((video) => video.id !== id));
  };

  const onRemovePhoto = (id: number) => {
    setGalleryPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target?.fromUser) {
        URL.revokeObjectURL(target.url);
      }
      return current.filter((photo) => photo.id !== id);
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      setStatusMessage(
        `You need at least ${requiredVideoCount} video and ${requiredPhotoCount} uploaded photos before submitting.`
      );
      return;
    }

    setStageIndex((current) => (current < stages.length - 1 ? current + 1 : current));
    setStatusMessage(`Submission updated. Current stage: ${stages[Math.min(stageIndex + 1, 3)]}.`);
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter text-center">
        <h1 className="text-4xl font-semibold text-[#2f3747]">Submit Content</h1>
        <p className="mt-2 text-base text-[#7c879b]">
          Upload your deliverables for the Summer Collection Launch.
        </p>
      </section>

      <section className="reveal-enter hover-lift overflow-x-auto px-2 pb-1" style={{ animationDelay: "80ms" }}>
        <div className="mx-auto min-w-[760px] px-2">
          <div className="relative pt-1">
            <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 -translate-y-1/2 rounded-full bg-[#d8dde6]" />
            <div
              className="absolute left-[12.5%] top-5 h-1 -translate-y-1/2 rounded-full bg-[#de8b34] transition-all duration-300"
              style={{ width: `${stageProgressPercent * 0.75}%` }}
            />

            <div className="relative grid grid-cols-4 gap-2">
              {stages.map((stage, index) => {
                const complete = index <= stageIndex;
                const isCurrent = index === stageIndex;
                return (
                  <div key={stage} className="text-center">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                        complete
                          ? isCurrent && stage === "Approved"
                            ? "border border-[#de8b34] bg-white text-[#de8b34]"
                            : "bg-[#de8b34] text-white"
                          : "bg-[#d8dde6] text-[#98a4b7]"
                      }`}
                    >
                      <StageIcon stage={stage} />
                    </span>
                    <p className={`mt-2 text-sm ${isCurrent ? "font-medium text-[#de8b34]" : "text-[#6d7a90]"}`}>
                      {stage}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-enter grid gap-5 lg:grid-cols-[2fr_1fr]" style={{ animationDelay: "140ms" }}>
        <div className="space-y-5">
          <article
            className={`hover-lift rounded-3xl border border-dashed p-8 text-center transition ${
              dragActive ? "border-[#de8b34] bg-[#fff6ec]" : "border-[#d8dde6] bg-[#f8f9fb]"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              onAddVideos(event.dataTransfer.files);
            }}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept=".mp4,.mov,video/mp4,video/quicktime"
              multiple
              className="hidden"
              onChange={(event) => onAddVideos(event.target.files)}
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="w-full"
            >
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#de8b34] shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                  <path
                    d="M12 15V4M8 8l4-4 4 4M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-[#2f3747]">Drag & drop your videos here</h2>
              <p className="mt-2 text-base text-[#7c879b]">or click to browse from your computer</p>
              <p className="mt-5 text-xs font-semibold tracking-wide text-[#4f6fd3]">MP4, MOV UP TO 500MB</p>
            </button>
          </article>

          <article className="reveal-enter" style={{ animationDelay: "200ms" }}>
            <h3 className="text-2xl font-semibold text-[#2f3747]">Uploaded Files</h3>
            <div className="mt-3 space-y-3">
              {uploadedVideos.length === 0 && (
                <p className="rounded-2xl bg-white p-4 text-sm text-[#7c879b] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  No videos uploaded yet.
                </p>
              )}
              {uploadedVideos.map((video) => (
                <div key={video.id} className="hover-lift rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#a8b99f] text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M8 3h6l4 4v14H8z" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M14 3v4h4M10 13h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-medium text-[#2f3747]">{video.name}</p>
                        <p className="text-[#8b97ab]">{video.sizeMb}</p>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-[#e3e8f0]">
                        <div className="h-1.5 rounded-full bg-[#8ea282]" style={{ width: `${video.progress}%` }} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveVideo(video.id)}
                      className="px-2 text-[#9aa5b7] transition hover:text-[#66758e]"
                      aria-label={`Remove ${video.name}`}
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="reveal-enter" style={{ animationDelay: "260ms" }}>
            <h3 className="text-2xl font-semibold text-[#2f3747]">Photo Gallery</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="group hover-lift relative h-28 overflow-hidden rounded-2xl">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${photo.url}')` }}
                    role="img"
                    aria-label={photo.name}
                  />
                  {photo.fromUser && (
                    <button
                      type="button"
                      onClick={() => onRemovePhoto(photo.id)}
                      className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => onAddPhotos(event.target.files)}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="h-28 tap-press rounded-2xl border border-dashed border-[#c8d0df] bg-white text-[#97a3b7] transition hover:bg-[#f7f9fc]"
              >
                <span className="mx-auto flex h-full w-full flex-col items-center justify-center gap-2 text-xs font-medium">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M8 13l2.2-2.2a1 1 0 011.4 0L16 15M14 11h.01M12 9v6M9 12h6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Photo
                </span>
              </button>
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <article className="reveal-enter hover-lift rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "220ms" }}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f7c92]">Submission Context</h3>
            <div className="mt-4 border-b border-[#edf1f6] pb-4">
              <p className="text-2xl font-semibold text-[#2f3747]">Summer Collection Launch</p>
              <p className="mt-1 text-sm text-[#7c879b]">GlowCo Skincare</p>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-[#7c879b]">Deliverables</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eaf1ff] px-2.5 py-1 text-xs font-semibold text-[#4f6fd3]">
                    {uploadedVideos.length} / {requiredVideoCount} VIDEO
                  </span>
                  <span className="rounded-full bg-[#eaf1ff] px-2.5 py-1 text-xs font-semibold text-[#4f6fd3]">
                    {uploadedPhotoCount} / {requiredPhotoCount} PHOTOS
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#7c879b]">Current Stage</p>
                <p className="mt-1 text-base font-semibold text-[#de8b34]">{currentStage}</p>
              </div>
              <div>
                <p className="text-sm text-[#7c879b]">Deadline</p>
                <p className="mt-1 text-base font-semibold text-[#dc4869]">Mar 15, 2026 (3 days left)</p>
              </div>
            </div>
          </article>

          <article className="reveal-enter hover-lift rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]" style={{ animationDelay: "280ms" }}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f7c92]">Add Details</h3>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#48556d]">Caption</span>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Write a caption for your content..."
                  className="w-full rounded-xl border border-[#d6dce7] bg-[#fafbfd] p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#48556d]">Notes to Brand</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Any additional notes..."
                  className="w-full rounded-xl border border-[#d6dce7] bg-[#fafbfd] p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
                />
              </label>
            </div>
          </article>

          {statusMessage && <p className="reveal-enter text-sm text-[#5f6d85]">{statusMessage}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            className="tap-press reveal-enter w-full rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-5 py-3 text-lg font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={stageIndex >= stages.length - 1}
            style={{ animationDelay: "340ms" }}
          >
            {stageIndex >= stages.length - 1 ? "Payment Released" : "Submit for Review"}
          </button>
        </aside>
      </section>
    </div>
  );
}
