import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function FinanceSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return (
    <DashboardSection
      section="Finance"
      subsection={subsection[subsection.length - 1]}
    />
  );
}
