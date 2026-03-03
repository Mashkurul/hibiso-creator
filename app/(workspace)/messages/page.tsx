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

  const activeThread = useMemo(
    () => threads.find((item) => item.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  );

  const openThread = (id: number) => {
    setActiveThreadId(id);
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
        <h1 className="text-[44px] font-semibold leading-none text-[#1f2c44]">Messages</h1>
 
      </section>

      <section className="reveal-enter hover-lift overflow-hidden rounded-3xl border border-[#e6e1d9] bg-[#f7f5f0] shadow-[0_4px_14px_rgba(20,30,60,0.06)]" style={{ animationDelay: "100ms" }}>
        <div className="grid min-h-[760px] grid-cols-[300px_1fr]">
          <aside className="reveal-enter border-r border-[#e7e2d8] p-3" style={{ animationDelay: "160ms" }}>
            <input
              placeholder="Search creator, group, campaign..."
              className="w-full rounded-xl border border-[#d8d2c7] bg-[#f9f7f2] px-3 py-2 text-sm text-[#3b495f] outline-none focus:border-[#c7bfb1]"
            />
            <button className="tap-press mt-2 w-full rounded-xl border border-[#d8d2c7] bg-[#f9f7f2] py-2 text-sm font-semibold text-[#4f5c72] transition hover:bg-[#f0ece4]">
              New Group
            </button>

            <div className="mt-3 space-y-2">
              {threads.map((thread) => {
                const active = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => openThread(thread.id)}
                    className={`tap-press hover-lift w-full rounded-xl border px-2.5 py-2 text-left transition ${
                      active
                        ? "border-[#d8c8ad] bg-[#efe7d8]"
                        : "border-transparent hover:border-[#ded8cd] hover:bg-[#f4f0e8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className="h-10 w-10 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${thread.avatar}')` }}
                          role="img"
                          aria-label={thread.name}
                        />
                        <div>
                          <p className="text-[18px] font-semibold leading-none text-[#1f2c44]">{thread.name}</p>
                          <p className="mt-1 text-[11px] text-[#7b879b]">{thread.campaign}</p>
                          {thread.isGroup && (
                            <span className="mt-1 inline-block rounded-full bg-[#e8eefb] px-2 py-0.5 text-[9px] font-semibold text-[#4d6cb8]">
                              GROUP
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#8d98ad]">{thread.lastSeen}</p>
                    </div>
                    {thread.unread > 0 && (
                      <span className="mt-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#de8b34] px-1 text-[10px] font-semibold text-white">
                        {thread.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="reveal-enter flex min-h-0 flex-col" style={{ animationDelay: "220ms" }}>
            <header className="reveal-enter flex items-center justify-between border-b border-[#e7e2d8] px-4 py-2.5" style={{ animationDelay: "260ms" }}>
              <div className="flex items-center gap-3">
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

            <div className="reveal-enter flex-1 space-y-2 overflow-y-auto px-4 py-3" style={{ animationDelay: "300ms" }}>
              {activeThread.messages.map((message) => {
                const mine = message.sender === "You";
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[58%] rounded-2xl border px-3 py-2 text-sm ${
                        mine
                          ? "border-[#d8813f] bg-[#de8b34] text-white"
                          : "border-[#d7d2c9] bg-[#f8f6f1] text-[#2f3a50]"
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
              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  className="w-full rounded-xl border border-[#d6d0c3] bg-[#f8f6f1] px-3 py-2 text-sm text-[#3c4a60] outline-none focus:border-[#c7bfae]"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="tap-press rounded-xl bg-[#de8b34] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
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
