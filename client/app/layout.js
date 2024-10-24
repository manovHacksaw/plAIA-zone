import localFont from "next/font/local";
import "./globals.css";
import { GamerCrowdLendingProvider } from "@/context/CrowdLending";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-rem p-10 mx-20 bg-gray-800`}
      >
        <GamerCrowdLendingProvider>
        {children}
        </GamerCrowdLendingProvider>
     
      </body>
    </html>
  );
}