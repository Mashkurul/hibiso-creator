"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type NotificationItem = {
  id: number;
  title: string;
  time: string;
  unread: boolean;
};

type TopNavProps = {
  mobileMenuOpen: boolean;
  onMenuToggle: () => void;
};

const initialNotifications: NotificationItem[] = [
  { id: 1, title: "New campaign invite from GlowCo", time: "2m ago", unread: true },
  { id: 2, title: "Payment of \u20AC850 is pending", time: "1h ago", unread: true },
  { id: 3, title: "Contract signed by EcoStay", time: "Yesterday", unread: false },
];

export default function TopNav({ mobileMenuOpen, onMenuToggle }: TopNavProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="nav-enter sticky top-0 z-30 bg-[#f8f8fa] px-4 md:px-6">
      <div className="flex min-h-[78px] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={onMenuToggle}
            className="tap-press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#4d5f7a] transition hover:bg-white md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              {mobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>

          <label className="hidden w-full max-w-[500px] items-center gap-3 rounded-full border border-[rgba(132,144,165,0.12)] bg-white/75 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition focus-within:border-[rgba(222,139,52,0.24)] focus-within:bg-white md:flex">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#8d98ad]">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search campaigns, creators..."
              className="w-full bg-transparent text-base text-[#4b5c75] placeholder:text-[#97a5ba] focus:outline-none"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              setMobileSearchOpen((current) => !current);
              setNotificationsOpen(false);
              setProfileOpen(false);
            }}
            className="tap-press inline-flex h-10 w-10 items-center justify-center rounded-full text-[#4d5f7a] transition hover:bg-white md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              className="tap-press relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#4d5f7a] transition hover:bg-white"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((current) => !current);
                setProfileOpen(false);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M15 17H5.5l1.2-1.6c.5-.7.8-1.6.8-2.5v-2.1A4.5 4.5 0 0112 6.3a4.5 4.5 0 014.5 4.5V13c0 .9.3 1.8.8 2.5L18.5 17H17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2 19a1.8 1.8 0 003.6 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-[#ef2f45] px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="pop-enter absolute right-0 top-12 z-10 w-[300px] rounded-2xl border border-[rgba(132,144,165,0.14)] bg-white/96 p-3 shadow-[0_18px_40px_rgba(16,24,40,0.14)] backdrop-blur sm:w-80">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1f2430]">Notifications</p>
                  <button
                    onClick={markAllRead}
                    className="text-xs font-medium text-[#5b78d6] hover:text-[#3f5ec3]"
                  >
                    Mark all read
                  </button>
                </div>
                <ul className="space-y-2">
                  {notifications.map((item) => (
                    <li key={item.id} className="rounded-lg border border-[#eef0f3] px-3 py-2">
                      <p className="text-sm text-[#2c3445]">{item.title}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-[#8893a7]">{item.time}</p>
                        {item.unread && <span className="h-2 w-2 rounded-full bg-[#ef2f45]" />}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen((current) => !current);
                setNotificationsOpen(false);
              }}
              className="tap-press flex items-center gap-2 rounded-2xl px-1 py-1 transition hover:bg-white sm:px-2"
              aria-expanded={profileOpen}
              aria-label="Profile menu"
            >
              <div className="hidden text-right lg:block">
                <p className="text-sm font-semibold leading-none text-[#1f2430]">Alex Rivera</p>
                <p className="mt-1 text-xs font-medium leading-none text-[#778194]">Content Creator</p>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Creator profile"
                className="h-9 w-9 rounded-full object-cover"
                width={36}
                height={36}
              />
            </button>

            {profileOpen && (
              <div className="pop-enter absolute right-0 top-12 z-10 w-56 rounded-2xl border border-[rgba(132,144,165,0.14)] bg-white/96 p-2 shadow-[0_18px_40px_rgba(16,24,40,0.14)] backdrop-blur">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#2f3747] transition hover:bg-[#f3f5fa]"
                >
                  View Profile
                </Link>
                <Link
                  href="/my-projects"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#2f3747] transition hover:bg-[#f3f5fa]"
                >
                  My Projects
                </Link>
                <Link
                  href="/contracts"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#2f3747] transition hover:bg-[#f3f5fa]"
                >
                  Contracts
                </Link>
                <div className="my-1 h-px bg-[#edf1f6]" />
                <Link
                  href="/sign-out"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#c04963] transition hover:bg-[#fdecef]"
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="pb-3 md:hidden">
          <label className="flex w-full items-center gap-3 rounded-full border border-[rgba(132,144,165,0.12)] bg-white/78 px-4 py-2.5 transition focus-within:border-[rgba(222,139,52,0.24)] focus-within:bg-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#8d98ad]">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search campaigns, creators..."
              className="w-full bg-transparent text-base text-[#4b5c75] placeholder:text-[#97a5ba] focus:outline-none"
            />
          </label>
        </div>
      )}

    </header>
  );
}
