"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/brand/logo";
import {
  LayoutDashboard, Archive, Eye, ShoppingCart, Tag, Gem, Gavel, Store,
  GitCompare, Inbox, Settings, CreditCard, ShieldCheck, Search, Users, CalendarClock,
} from "lucide-react";

const NAV: { section: string; items: [string, string, any][] }[] = [
  {
    section: "Archive",
    items: [
      ["Dashboard", "/app", LayoutDashboard],
      ["Digital Garage", "/app/garage", Archive],
      ["Watchlist", "/app/watchlist", Eye],
      ["Compare", "/app/compare", GitCompare],
      ["Community", "/community", Users],
      ["Auction Radar", "/events", CalendarClock],
    ],
  },
  {
    section: "Modes",
    items: [
      ["Buy", "/app/buy", ShoppingCart],
      ["Sell", "/app/sell", Tag],
      ["Collector", "/app/collector", Gem],
      ["Auction prep", "/app/auction-prep", Gavel],
      ["Dealer", "/app/dealer", Store],
      ["Research", "/app/research", Search],
    ],
  },
  {
    section: "Account",
    items: [
      ["Leads", "/app/leads", Inbox],
      ["Billing", "/app/billing", CreditCard],
      ["Settings", "/app/settings", Settings],
      ["Quality", "/app/admin/quality", ShieldCheck],
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/30 lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-border px-5 py-4"><Wordmark href="/app" /></div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {NAV.map((group) => (
            <div key={group.section} className="mb-6">
              <div className="archive-label px-3 pb-2">{group.section}</div>
              <ul className="space-y-0.5">
                {group.items.map(([label, href, Icon]) => {
                  const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          active ? "bg-oxblood/10 font-medium text-oxblood" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
