import { SubmitContentWorkspace } from "@/app/components/submit-content-workspace";

type SubmitContentPageProps = {
  searchParams?: Promise<{
    project?: string;
  }>;
};

export default async function SubmitContentPage({
  searchParams,
}: SubmitContentPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedProjectId = Number(resolvedSearchParams?.project);

  return (
    <SubmitContentWorkspace
      selectedProjectId={
        Number.isFinite(selectedProjectId) && selectedProjectId > 0
          ? selectedProjectId
          : undefined
      }
    />
  );
}
