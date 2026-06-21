import "./globals.css";
import NavBar from "@/components/navbar";
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
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar user={user}/>
        <main>{children}</main>
      </body>
    </html>
  );
}
