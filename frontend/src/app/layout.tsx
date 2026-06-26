import "./globals.css";
import { NavBar } from "@/components/navbar";
import { getCurrentUser } from "@/lib/session";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`min-h-full antialiased`}
    >
      <body className="min-h-dvh bg-fixed bg-linear-to-t from-background-start to-background-end to-40% text-text-primary font-body">
        <NavBar user={user}/>
        <main>{children}</main>
      </body>
    </html>
  );
}
