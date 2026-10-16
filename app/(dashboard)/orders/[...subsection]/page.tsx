import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function OrdersSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return <DashboardSection section="Orders" subsection={subsection[subsection.length - 1]} />;
}
