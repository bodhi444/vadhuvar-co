import React from "react";
import { ToastProvider } from "@/components/admin/Toast";

export const metadata = {
  title: "FRAME / MOTION — Studio Admin CMS",
  robots: "noindex, nofollow",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
