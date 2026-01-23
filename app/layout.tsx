import Navbar from "./components/navbar";
import "./ui/global.css";
import { outfit, inter } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`min-h-full ${outfit.variable} ${inter.variable}`}
      lang="en"
    >
      <body className="min-h-full bg-gradient-to-t from-background-start to-background-end to-40% text-text-primary font-body">
        {/*<body className="min-h-screen bg-test">*/}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
