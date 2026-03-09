"use client";

import { useMemo, useState } from "react";

type Message = {
  id: number;
  sender: "You" | "Brand";
  text: string;
  time: string;
};

type Thread = {
  id: number;
  name: string;
  handle: string;
  campaign: string;
  avatar: string;
  unread: number;
  lastSeen: string;
  isGroup?: boolean;
  online?: boolean;
  messages: Message[];
};

const initialThreads: Thread[] = [
  {
    id: 1,
    name: "Maya Stone",
    handle: "@maya.travels",
    campaign: "Summer Collection Launch",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    unread: 2,
    lastSeen: "Now",
    online: true,
    messages: [
      { id: 101, sender: "Brand", text: "I uploaded the latest reel cut for review. Can you confirm the CTA text?", time: "10:12" },
      { id: 102, sender: "You", text: "Looks great. Use: Discover your summer glow with GlowCo.", time: "10:14" },
      { id: 103, sender: "Brand", text: "Perfect. I will deliver the final by tonight.", time: "10:15" },
    ],
  },
  {
    id: 2,
    name: "Sara Bloom",
    handle: "@sara.bloom",
    campaign: "SPF 50 Product Demo",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    unread: 0,
    lastSeen: "2h ago",
    online: false,
    messages: [
      { id: 201, sender: "Brand", text: "Can you include one close-up texture shot?", time: "08:24" },
      { id: 202, sender: "You", text: "Yes, I will add that in the next draft.", time: "08:31" },
    ],
  },
  {
    id: 3,
    name: "Liam North",
    handle: "@liamnorth",
    campaign: "Beachwear Creator Sprint",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    unread: 1,
    lastSeen: "Now",
    online: true,
    messages: [
      { id: 301, sender: "Brand", text: "Reminder: final files due by tomorrow noon.", time: "09:54" },
    ],
  },
  {
    id: 4,
    name: "Summer Launch Team",
    handle: "@group",
    campaign: "Group Coordination",
    avatar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80",
    unread: 0,
    lastSeen: "Now",
    isGroup: true,
    messages: [
      { id: 401, sender: "Brand", text: "Please share timeline updates in this thread.", time: "07:42" },
    ],
  },
];

export default function MessagesPage() {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [text, setText] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const activeThread = useMemo(
    () => threads.find((item) => item.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  );

  const openThread = (id: number) => {
    setActiveThreadId(id);
    setMobileView("chat");
    setThreads((current) => current.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  const sendMessage = () => {
    const value = text.trim();
    if (!value) {
      return;
    }

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              lastSeen: "Now",
              messages: [
                ...thread.messages,
                {
                  id: Date.now(),
                  sender: "You",
                  text: value,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
                },
              ],
            }
          : thread
      )
    );
    setText("");
  };

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-4">
      <section className="reveal-enter" style={{ animationDelay: "40ms" }}>
        <h1 className="text-3xl font-semibold leading-none text-[#1f2c44] sm:text-[44px]">Messages</h1>
 
      </section>

      <section className="reveal-enter hover-lift overflow-hidden rounded-3xl border border-[#e6e1d9] bg-[#f7f5f0] shadow-[0_4px_14px_rgba(20,30,60,0.06)]" style={{ animationDelay: "100ms" }}>
        <div className="grid min-h-[620px] grid-cols-1 md:min-h-[760px] md:grid-cols-[280px_1fr]">
          <aside
            className={`reveal-enter border-b border-[#e7e2d8] p-3 md:block md:border-b-0 md:border-r ${
              mobileView === "chat" ? "hidden" : "block"
            }`}
            style={{ animationDelay: "160ms" }}
          >
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#fff4e7_0%,#f7f5f0_55%,#f1f5ff_100%)] p-3">
              <input
                placeholder="Search creator, group, campaign..."
                className="w-full rounded-2xl border border-[#d8d2c7] bg-white px-4 py-3 text-sm text-[#3b495f] outline-none focus:border-[#c7bfb1]"
              />
              <button className="tap-press mt-3 w-full rounded-2xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] py-3 text-sm font-semibold text-white transition hover:brightness-105">
                New Group
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {threads.map((thread) => {
                const active = thread.id === activeThreadId;
                const lastMessage = thread.messages[thread.messages.length - 1];

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => openThread(thread.id)}
                    className={`tap-press w-full rounded-[24px] border px-3 py-3 text-left transition ${
                      active
                        ? "border-[#d8c8ad] bg-[#efe7d8]"
                        : "border-transparent bg-white hover:border-[#ded8cd] hover:bg-[#f4f0e8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="relative">
                          <div
                            className="h-12 w-12 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${thread.avatar}')` }}
                            role="img"
                            aria-label={thread.name}
                          />
                          {thread.online && (
                            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#30a46c]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-base font-semibold leading-none text-[#1f2c44]">{thread.name}</p>
                            {thread.isGroup && (
                              <span className="rounded-full bg-[#e8eefb] px-2 py-0.5 text-[9px] font-semibold text-[#4d6cb8]">
                                GROUP
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-[11px] text-[#7b879b]">{thread.campaign}</p>
                          <p className="mt-2 truncate text-xs text-[#5b687f]">{lastMessage?.text}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] text-[#8d98ad]">{thread.lastSeen}</p>
                        {thread.unread > 0 && (
                          <span className="mt-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#de8b34] px-1 text-[10px] font-semibold text-white">
                            {thread.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <article
            className={`reveal-enter min-h-0 flex-col md:flex ${
              mobileView === "chat" ? "flex" : "hidden md:flex"
            }`}
            style={{ animationDelay: "220ms" }}
          >
            <header className="reveal-enter flex items-center justify-between border-b border-[#e7e2d8] px-4 py-3" style={{ animationDelay: "260ms" }}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="tap-press inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4d5f7a] transition hover:bg-[#eceef4] md:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="h-11 w-11 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${activeThread.avatar}')` }}
                  role="img"
                  aria-label={activeThread.name}
                />
                <div>
                  <p className="text-[22px] font-semibold leading-none text-[#1f2c44]">{activeThread.name}</p>
                  <p className="mt-1 text-[11px] text-[#7b879b]">
                    {activeThread.handle} | {activeThread.campaign}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#e8f7ee] px-2 py-0.5 text-[10px] font-semibold text-[#2f8a5a]">
                  {activeThread.online ? "Online" : "Offline"}
                </span>
              </div>
            </header>

            <div className="reveal-enter flex-1 space-y-2 overflow-y-auto bg-[linear-gradient(180deg,#f9f6ef_0%,#f4f0e8_100%)] px-3 py-3 sm:px-4" style={{ animationDelay: "300ms" }}>
              {activeThread.messages.map((message) => {
                const mine = message.sender === "You";
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[88%] rounded-[22px] border px-3 py-2.5 text-sm shadow-[0_6px_18px_rgba(20,30,60,0.05)] sm:max-w-[72%] lg:max-w-[58%] ${
                        mine
                          ? "border-[#d8813f] bg-gradient-to-r from-[#de8b34] to-[#e36d58] text-white"
                          : "border-[#e7dfd2] bg-[#fffdf9] text-[#2f3a50]"
                      } pop-enter`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-1 text-[10px] ${mine ? "text-white/85" : "text-[#8a97ab]"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="reveal-enter border-t border-[#e7e2d8] bg-[#f3f0e8] p-3" style={{ animationDelay: "340ms" }}>
              <div className="flex items-center gap-2 rounded-[24px] bg-white p-2 shadow-[0_8px_20px_rgba(20,30,60,0.06)]">
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  className="w-full rounded-2xl border border-[#ede6d9] bg-[#f8f6f1] px-4 py-3 text-sm text-[#3c4a60] outline-none focus:border-[#c7bfae]"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="tap-press rounded-2xl bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Send
                </button>
              </div>
            </footer>
          </article>
        </div>
      </section>
    </div>
  );
}
