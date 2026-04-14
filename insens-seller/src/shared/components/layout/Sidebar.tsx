"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Store, Package, UserCircle, LogOut, Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { useUIStore } from "@/shared/state/ui.store";
import { useAuthStore } from "@/shared/state/auth.store";
import type { ShopStatus } from "@/shared/types/common.types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/shop",      label: "My Shop",   icon: Store },
  { href: "/products",  label: "Products",  icon: Package },
  { href: "/profile",   label: "Profile",   icon: UserCircle },
];

function shopStatusVariant(status: ShopStatus | null) {
  if (status === "APPROVED")  return "approved";
  if (status === "SUSPENDED") return "suspended";
  return "pending";
}

export function Sidebar() {
  const pathname   = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const shopStatus = useAuthStore((s) => s.shopStatus);

  const firstName = session?.user?.firstName ?? "Seller";

  return (
    <>
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-cream-200 bg-oud-950 text-cream-100 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden lg:w-16",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 py-3">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-semibold tracking-wide text-cream-50">
                Insens
              </span>
              <div className="gold-divider h-4 w-px" />
              <span className="text-xs font-light uppercase tracking-widest text-gold-400">
                Seller
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto text-cream-300 hover:bg-oud-800 hover:text-cream-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-oud-800" />

        {/* Greeting */}
        {sidebarOpen && (
          <div className="px-4 py-3">
            <p className="text-xs text-cream-400">Welcome back,</p>
            <p className="text-sm font-medium text-cream-100">{firstName}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-oud-700 text-cream-50 shadow-sm"
                    : "text-cream-300 hover:bg-oud-800 hover:text-cream-100",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-oud-800" />

        {/* Bottom section: status + logout */}
        <div className="space-y-2 p-3">
          {sidebarOpen && shopStatus && (
            <div className="rounded-lg bg-oud-900 px-3 py-2">
              <p className="mb-1 text-xs text-cream-500">Shop Status</p>
              <Badge variant={shopStatusVariant(shopStatus)} className="capitalize">
                {shopStatus.toLowerCase()}
              </Badge>
            </div>
          )}

          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            className="w-full justify-start gap-3 text-cream-400 hover:bg-oud-800 hover:text-red-400"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
