import SettingsForm from "../components/settingsForm";

export default function Page() {
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full px-6">
      <h1 className="pt-5 pb-1 text-2xl text-text-secondary">
        Account Settings
      </h1>
      <div className="border-b border-0.5 border-text-muted" />
      <SettingsForm />
    </div>
  );
}
