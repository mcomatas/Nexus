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
        className="min-h-full bg-gradient-to-t from-background-start via-background-mid via-40% to-background-end to-80% text-text-primary"
        style={openSans.style}
      >
        {/*<body className="min-h-screen bg-test">*/}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
