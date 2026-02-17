import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "MockTest Pro — Online Mock Test Platform",
  description:
    "Prepare for your exams with timed MCQ mock tests, detailed results, leaderboards, and curated learning materials.",
  keywords: "mock test, online exam, MCQ, practice test, exam preparation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-text-primary`}>
        {children}
      </body>
    </html>
  );
}
