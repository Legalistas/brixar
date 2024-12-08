import type { Metadata } from "next";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Providers } from "./Providers";
import { Inter, Ubuntu } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })
const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

export const metadata: Metadata = {
  title: '',
  description: '',
  keywords: [],
  authors: [],
  openGraph: {
    type: 'website',
    title: '',
    description: '',
    url: '',
    images: [''], // Ajusta el nombre del archivo
    siteName: '',
  },
  icons: {
    icon: [],
    apple: [],
    shortcut: [],
  },
  manifest: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#F1F5F9]`}
      >
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
