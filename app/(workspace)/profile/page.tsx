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
  niche: string;
  bio: string;
};

const initialForm: ProfileForm = {
  fullName: "Alex Rivera",
  creatorName: "@alexcreates",
  email: "alex.rivera@example.com",
  phone: "+880 1712-123456",
  location: "Dhaka, Bangladesh",
  niche: "Beauty & Lifestyle",
  bio: "I create authentic short-form lifestyle content focused on beauty, routines, and travel moments.",
};

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
    setStatus("Profile details saved.");
  };

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6">
      <section className="reveal-enter">
        <h1 className="text-3xl font-semibold text-[#2f3747]">Profile</h1>
        <p className="mt-1 text-sm text-[#7c879b]">
          Manage your creator identity, profile picture, and account details.
        </p>
      </section>

      <section className="reveal-enter grid gap-4 lg:grid-cols-[1.2fr_2fr]" style={{ animationDelay: "80ms" }}>
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
            <h3 className="text-sm font-semibold text-[#2f3747]">Picture Requirements</h3>
            <ul className="mt-2 space-y-2 text-sm text-[#5d6a80]">
              <li>Minimum size: 400 x 400 px</li>
              <li>Format: JPG, PNG, WEBP</li>
              <li>Maximum file size: 5MB</li>
              <li>Use a clear face shot with good lighting</li>
            </ul>
          </div>

          {pictureError && <p className="mt-3 text-sm font-medium text-[#c04963]">{pictureError}</p>}
        </article>

        <article className="hover-lift rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#2f3747]">Profile Details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Full Name</span>
              <input
                value={form.fullName}
                onChange={(event) => updateForm("fullName", event.target.value)}
                className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Creator Name</span>
              <input
                value={form.creatorName}
                onChange={(event) => updateForm("creatorName", event.target.value)}
                className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Phone</span>
              <input
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Location</span>
              <input
                value={form.location}
                onChange={(event) => updateForm("location", event.target.value)}
                className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#48556d]">Primary Niche</span>
              <input
                value={form.niche}
                onChange={(event) => updateForm("niche", event.target.value)}
                className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
              />
            </label>
          </div>

          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-[#48556d]">Bio</span>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(event) => updateForm("bio", event.target.value)}
              className="w-full rounded-xl border border-[#d6dce7] bg-white p-3 text-sm text-[#3d4860] outline-none focus:border-[#b8c5dd]"
            />
          </label>

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

      {status && (
        <section className="reveal-enter rounded-2xl bg-white p-4 text-sm text-[#5f6d85] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          {status}
        </section>
      )}
    </div>
  );
}
