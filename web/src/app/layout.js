import './styles/globals.css';

import { Baloo_2, Inter } from 'next/font/google';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-baloo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'GeoVibes',
  description: 'A platform to mark and share your experiences',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baloo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}
