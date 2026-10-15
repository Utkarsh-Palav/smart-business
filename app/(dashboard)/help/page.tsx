import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function HelpPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Help" section="help" />
      <div className="flex flex-1 items-center justify-center">Help</div>
    </section>
  );
}
