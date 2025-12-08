import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import I18nProvider from "../i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: "Ponse",
    description: "Info about postnumber zones",
};

export default function RootLayout({ children }) {

  return (
    <html lang="fi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
