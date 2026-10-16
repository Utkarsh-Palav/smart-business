import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function CustomersSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return (
    <DashboardSection
      section="Customers"
      subsection={subsection[subsection.length - 1]}
    />
  );
}
