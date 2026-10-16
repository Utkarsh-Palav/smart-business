import { SettingsSection } from "@/components/settings/SettingsSection";

export default function LocationsPage() {
  return (
    <SettingsSection
      title="Locations"
      description="Manage your business locations, hours, and operating status."
    >
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">Your locations</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add and manage the places where your business operates.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Add location
          </button>
        </div>
        <div className="mt-5 rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
          No additional locations have been configured yet.
        </div>
      </div>
    </SettingsSection>
  );
}
