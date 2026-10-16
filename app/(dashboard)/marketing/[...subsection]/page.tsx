import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function MarketingSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return (
    <DashboardSection
      section="Marketing"
      subsection={subsection[subsection.length - 1]}
    />
  );
}
