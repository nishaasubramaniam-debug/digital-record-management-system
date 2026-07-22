import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Digital Record Management System",
  description: "DRMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {children}

      </body>
    </html>
  );
}