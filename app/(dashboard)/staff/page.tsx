import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function StaffPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Staff" section="staff" />
      <div className="flex flex-1 items-center justify-center">Staff</div>
    </section>
  );
}
