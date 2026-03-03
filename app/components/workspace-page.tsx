type WorkspacePageProps = {
  title: string;
  description: string;
};

export default function WorkspacePage({ title, description }: WorkspacePageProps) {
  return (
    <section className="rounded-3xl border border-[#f2e9e3] bg-white p-7 shadow-sm">
      <h1 className="text-3xl font-semibold text-[#2f3747]">{title}</h1>
      <p className="mt-3 max-w-2xl text-base text-[#7c879b]">{description}</p>
    </section>
  );
}
