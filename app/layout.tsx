import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindMap AI - Turn Any Document Into an Intelligent Visual Mind Map",
  description: "Upload a PDF, PowerPoint, Word document, or research paper and let AI transform complex information into a clear, interactive knowledge map.",
  keywords: ["mind map", "ai mind map", "document visualization", "pdf to mindmap", "knowledge graph", "study tool"],
  authors: [{ name: "MindMap AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
