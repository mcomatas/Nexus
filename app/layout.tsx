import Navbar from "./components/navbar";
import "./ui/global.css";
import { openSans, inter, rowdies } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="min-h-full" lang="en">
      <body
        className="min-h-full bg-gradient-to-t from-background-start to-background-end to-40% text-text-primary"
        style={openSans.style}
      >
        {/*<body className="min-h-screen bg-test">*/}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
