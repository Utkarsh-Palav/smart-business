import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function ReportsSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return (
    <DashboardSection
      section="Reports"
      subsection={subsection[subsection.length - 1]}
    />
  );
}
