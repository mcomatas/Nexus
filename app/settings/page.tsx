import { SessionProvider } from 'next-auth/react';
import SettingsForm from '../components/settingsForm';

export default function Page() {
    return (
        <div>
            Settings page
            <SessionProvider>
                <SettingsForm />
            </SessionProvider>
        </div>
    )
}