import Link from "next/link";

type StatCard = {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  href: string;
};

type CampaignCard = {
  title: string;
  price: string;
  description: string;
  location: string;
  imageUrl: string;
};

const statCards: StatCard[] = [
  {
    label: "Active Campaigns",
    value: "4",
    icon: "gift",
    iconBg: "bg-[#f8efe2]",
    iconColor: "text-[#de8f35]",
    href: "/my-projects/current-campaigns",
  },
  {
    label: "Completed Campaigns",
    value: "12",
    icon: "clock",
    iconBg: "bg-[#edf1e8]",
    iconColor: "text-[#8da26f]",
    href: "/my-projects/finished-campaigns",
  },
  {
    label: "Pending Approvals",
    value: "3",
    icon: "check",
    iconBg: "bg-[#faeee8]",
    iconColor: "text-[#ea7e5c]",
    href: "/my-projects/current-campaigns",
  },
  {
    label: "Total Earnings",
    value: "\u20AC 4,250",
    icon: "euro",
    iconBg: "bg-[#f8e9ef]",
    iconColor: "text-[#e16388]",
    href: "/earnings/transactions",
  },
  {
    label: "Response Rate",
    value: "92%",
    icon: "message",
    iconBg: "bg-[#eef3ff]",
    iconColor: "text-[#5674ca]",
    href: "/messages",
  },
];

const campaignCards: CampaignCard[] = [
  {
    title: "GlowCo Skincare",
    price: "\u20AC450",
    description: "Capture the morning sun with our new SPF line.",
    location: "Bali, Indonesia",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Luxe Travel",
    price: "\u20AC680",
    description: "Showcase the blue domes and luxury villas.",
    location: "Santorini, Greece",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "EcoStay Resorts",
    price: "\u20AC520",
    description: "Eco-friendly resort lifestyle content needed.",
    location: "Tulum, Mexico",
    imageUrl:
      "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80",
  },
];

function StatIcon({ name, colorClass }: { name: string; colorClass: string }) {
  if (name === "gift") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${colorClass}`}>
        <path d="M4 10h16v10H4V10zM12 10v10M3 7h18v3H3V7z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9.5 7c-1.4 0-2.5-.9-2.5-2s1.1-2 2.5-2C11 3 12 4.2 12 6v1M14.5 7c1.4 0 2.5-.9 2.5-2s-1.1-2-2.5-2C13 3 12 4.2 12 6v1" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${colorClass}`}>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4.2l2.8 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "euro") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${colorClass}`}>
        <path d="M15.8 6.5H10a3.5 3.5 0 000 7h4.8m-4.8 4h5.8M7.2 10h9.4M7.2 14h8.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "message") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${colorClass}`}>
        <path
          d="M4 7h16v10H8l-4 3V7z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8 11h8M8 14h5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${colorClass}`}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 12.5l2.2 2.1L15.8 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-7">
      <section className="reveal-enter" style={{ animationDelay: "40ms" }}>
        <h1 className="text-[38px] font-semibold leading-tight text-[#2f3747]">
          Welcome back, Alex Rivera
        </h1>
        <p className="mt-1 text-sm text-[#7c879b]">Ready to create some magic today?</p>
      </section>

      <section
        className="reveal-enter grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
        style={{ animationDelay: "120ms" }}
      >
        {statCards.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="hover-lift tap-press rounded-2xl bg-[#fbfbfc] p-4 shadow-[0_2px_6px_rgba(0,0,0,0.03)] reveal-enter"
            style={{ animationDelay: `${180 + index * 60}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${stat.iconBg}`}>
                <StatIcon name={stat.icon} colorClass={stat.iconColor} />
              </span>
              <div>
                <p className="text-xs font-medium text-[#7f8a9d]">{stat.label}</p>
                <p className="mt-0.5 text-[31px] font-semibold leading-none text-[#2f3747]">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="reveal-enter space-y-4" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-[29px] font-semibold text-[#2f3747]">Recommended Campaigns</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          {campaignCards.slice(0, 2).map((campaign) => (
            <article key={campaign.title} className="hover-lift reveal-enter rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <div
                className="relative h-36 w-full overflow-hidden rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${campaign.imageUrl}')` }}
              >
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 via-black/10 to-transparent px-3 py-2 text-xs text-white">
                  <span>{campaign.location}</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] tracking-wide">
                    HIBISUN
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <h3 className="text-xl font-medium text-[#2f3747]">{campaign.title}</h3>
                <span className="text-2xl font-semibold text-[#2f3747]">{campaign.price}</span>
              </div>
              <p className="mt-1 text-sm text-[#7f8a9d]">{campaign.description}</p>
              <Link
                href="/available-campaigns"
                className="tap-press mt-4 block w-full rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-105"
              >
                Apply Now
              </Link>
            </article>
          ))}

          <aside className="hover-lift reveal-enter rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-[#7f8a9d]">This Month</p>
              <span className="text-[#de8a34]">$</span>
            </div>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl bg-white p-3">
                <p className="text-xs text-[#8b97ab]">Total Earnings</p>
                <p className="mt-1 text-xl font-semibold text-[#2f3747]">{"\u20AC"} 2,140</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-[#8b97ab]">Pending</p>
                  <p className="mt-1 text-sm font-semibold text-[#2f3747]">{"\u20AC"} 620</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-[#8b97ab]">Completed</p>
                  <p className="mt-1 text-sm font-semibold text-[#2f3747]">4 Projects</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-[#8b97ab]">Campaign Conversion</span>
                  <span className="font-semibold text-[#3e4a60]">68%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#eceef2]">
                  <div className="h-2 w-[68%] rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58]" />
                </div>
              </div>
            </div>
          </aside>

          <article className="hover-lift reveal-enter rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] lg:col-span-1">
            <div
              className="relative h-36 w-full overflow-hidden rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url('${campaignCards[2].imageUrl}')` }}
            >
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 via-black/10 to-transparent px-3 py-2 text-xs text-white">
                <span>{campaignCards[2].location}</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] tracking-wide">HIBISUN</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-xl font-medium text-[#2f3747]">{campaignCards[2].title}</h3>
              <span className="text-2xl font-semibold text-[#2f3747]">{campaignCards[2].price}</span>
            </div>
            <p className="mt-1 text-sm text-[#7f8a9d]">{campaignCards[2].description}</p>
            <Link
              href="/available-campaigns"
              className="tap-press mt-4 block w-full rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-105"
            >
              Apply Now
            </Link>
          </article>

          <aside className="hover-lift reveal-enter rounded-3xl bg-[#fbfbfc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] lg:col-start-3 lg:row-start-2">
            <h3 className="text-xl font-semibold text-[#2f3747]">Upcoming Deadlines</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#3e4a60]">EcoStay Draft</p>
                  <p className="text-xs text-[#8b97ab]">Tomorrow</p>
                </div>
                <span className="mt-1 h-2 w-2 rounded-full bg-[#dc4869]" />
              </li>
              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#3e4a60]">GlowCo Final</p>
                  <p className="text-xs text-[#8b97ab]">In 3 days</p>
                </div>
                <span className="mt-1 h-2 w-2 rounded-full bg-[#de8b34]" />
              </li>
              <li className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#3e4a60]">Contract Sign</p>
                  <p className="text-xs text-[#8b97ab]">In 5 days</p>
                </div>
                <span className="mt-1 h-2 w-2 rounded-full bg-[#7a9a64]" />
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="reveal-enter space-y-4 pb-4" style={{ animationDelay: "320ms" }}>
        <h2 className="text-[29px] font-semibold text-[#2f3747]">My Active Projects</h2>
        <div className="hover-lift overflow-x-auto rounded-3xl bg-[#fbfbfc] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-[#8b97ab]">
                <th className="px-3 py-2 font-medium">Project Name</th>
                <th className="px-3 py-2 font-medium">Brand</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Deadline</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="rounded-2xl bg-white text-sm text-[#3e4a60]">
                <td className="rounded-l-xl px-3 py-3">Summer Collection Launch</td>
                <td className="px-3 py-3">GlowCo</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-semibold text-[#5980e9]">
                    IN PROGRESS
                  </span>
                </td>
                <td className="px-3 py-3 text-[#8894a8]">Aug 15, 2024</td>
                <td className="rounded-r-xl px-3 py-3 text-sm font-medium text-[#65738b]">
                  <Link href="/my-projects" className="tap-press inline-block rounded-md px-2 py-1 transition hover:bg-[#eef3ff] hover:text-[#4f6fd3]">
                    View Details
                  </Link>
                </td>
              </tr>
              <tr className="rounded-2xl bg-white text-sm text-[#3e4a60]">
                <td className="rounded-l-xl px-3 py-3">Resort Walkthrough</td>
                <td className="px-3 py-3">EcoStay</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-[#fff5df] px-3 py-1 text-xs font-semibold text-[#b98f27]">
                    UNDER REVIEW
                  </span>
                </td>
                <td className="px-3 py-3 text-[#8894a8]">Aug 10, 2024</td>
                <td className="rounded-r-xl px-3 py-3 text-sm font-medium text-[#65738b]">
                  <Link href="/my-projects" className="tap-press inline-block rounded-md px-2 py-1 transition hover:bg-[#eef3ff] hover:text-[#4f6fd3]">
                    View Details
                  </Link>
                </td>
              </tr>
              <tr className="rounded-2xl bg-white text-sm text-[#3e4a60]">
                <td className="rounded-l-xl px-3 py-3">Travel Vlog Series</td>
                <td className="px-3 py-3">Wanderlust</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-[#e8f7ee] px-3 py-1 text-xs font-semibold text-[#3d9a61]">
                    COMPLETED
                  </span>
                </td>
                <td className="px-3 py-3 text-[#8894a8]">Jul 28, 2024</td>
                <td className="rounded-r-xl px-3 py-3 text-sm font-medium text-[#65738b]">
                  <Link href="/my-projects" className="tap-press inline-block rounded-md px-2 py-1 transition hover:bg-[#eef3ff] hover:text-[#4f6fd3]">
                    View Details
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
