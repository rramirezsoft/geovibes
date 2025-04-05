import "./globals.css";

export const metadata = {
  title: "GeoVibes",
  description: "A platform to mark and share your experiences",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}

