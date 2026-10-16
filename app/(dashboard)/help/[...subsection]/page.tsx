import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function HelpSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return (
    <DashboardSection
      section="Help"
      subsection={subsection[subsection.length - 1]}
    />
  );
}
