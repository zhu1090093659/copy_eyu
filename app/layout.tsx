import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "鳄鱼派 - 专业投资分析平台",
  description: "鳄鱼派提供专业的财经研报，覆盖军工、交通运输、有色金属、化工等多个行业的深度分析",
  keywords: "鳄鱼派,财经研报,投资分析,行业分析,股票分析,宏观经济",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 