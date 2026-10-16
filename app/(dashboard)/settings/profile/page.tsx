import {
  SettingCard,
  SettingsSection,
} from "@/components/settings/SettingsSection";

export default function BusinessProfilePage() {
  return (
    <SettingsSection
      title="Business profile"
      description="Manage the details customers and your team see about your business."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SettingCard label="Business name" value="Munchy Krunchy" />
        <SettingCard label="Business status" value="Active" />
        <SettingCard label="Business type" value="Restaurant" />
        <SettingCard label="Public slug" value="munchy-krunchy" />
      </div>
    </SettingsSection>
  );
}
