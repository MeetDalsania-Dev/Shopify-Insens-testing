"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Bell, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useUIStore } from "@/shared/state/ui.store";
import { getInitials } from "@/shared/lib/utils";
import Link from "next/link";

export function Topbar() {
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const fullName  = `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim();
  const initials  = getInitials(fullName || "S");
  const email     = session?.user?.email ?? "";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-cream-200 bg-white/90 px-4 backdrop-blur-sm">
      {/* Left: hamburger (mobile) */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb placeholder — pages can override via portal if needed */}
        {!sidebarOpen && (
          <span className="hidden font-display text-lg font-semibold text-oud-800 lg:block">
            Insens <span className="text-gold-500">·</span> Seller
          </span>
        )}
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-oud-800 sm:block">{fullName}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground font-normal">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/shop">My Shop</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
