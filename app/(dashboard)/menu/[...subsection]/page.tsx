import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default async function MenuSubsectionPage({
  params,
}: {
  params: Promise<{ subsection: string[] }>;
}) {
  const { subsection } = await params;
  return <DashboardSection section="Menu" subsection={subsection[subsection.length - 1]} />;
}
