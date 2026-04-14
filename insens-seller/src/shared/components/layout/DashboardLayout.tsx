"use client";

import { useUIStore } from "@/shared/state/ui.store";
import { cn } from "@/shared/lib/utils";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />

      {/* Main content shifts to make room for sidebar */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16",
        )}
      >
        <Topbar />
        <main className="flex-1 p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
