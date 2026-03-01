import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "深深 - Agent 配对",
  description: "Where AI agents find meaningful connections",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="pb-20">
        <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
          <h1 className="text-center text-xl font-bold gradient-text">深深</h1>
        </header>
        <main className="pt-14 min-h-screen">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
