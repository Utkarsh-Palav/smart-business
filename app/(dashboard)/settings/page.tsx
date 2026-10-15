import { PageSidebar } from "@/components/dashboard/PageSidebar";

export default function SettingsPage() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <PageSidebar title="Settings" section="settings" />
      <div className="flex flex-1 items-center justify-center">Settings</div>
    </section>
  );
}
