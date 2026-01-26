import SettingsForm from "../components/settingsForm";

export default function Page() {
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full px-4">
      <h1 className="p-5 text-xl text-text-secondary">Account Settings</h1>
      <div className="border-b border-0.5 border-text-muted" />
      <SettingsForm />
    </div>
  );
}
