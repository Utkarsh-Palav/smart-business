import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function InventorySubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return (
    <DashboardSection
      section="Inventory"
      subsection={subsection[subsection.length - 1]}
    />
  );
}
