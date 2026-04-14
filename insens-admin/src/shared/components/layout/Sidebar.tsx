'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Users, UserCircle, X, Gem } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useUiStore } from '@/shared/state/ui.store';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Shops', href: '/shops', icon: Store },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Profile', href: '/profile', icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full bg-card border-r border-border transition-transform duration-300 flex flex-col',
          'w-[var(--sidebar-width)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Gem className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wider text-foreground uppercase">Insens</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Admin</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={toggleSidebar}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Navigation
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Separator className="mb-4" />
          <p className="text-[10px] text-muted-foreground text-center tracking-wider">
            © 2026 Insens Platform
          </p>
        </div>
      </aside>
    </>
  );
}
