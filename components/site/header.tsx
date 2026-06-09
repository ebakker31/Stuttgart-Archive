import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const NAV = [
  ["For owners", "/#owner"],
  ["For buyers", "/#buyer"],
  ["For sellers", "/#seller"],
  ["Auction prep", "/#auction"],
  ["Pricing", "/pricing"],
  ["Explore", "/explore"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Wordmark />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map(([label, href]) => (
            <Link key={label} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
          <Button href="/signup" variant="accent" size="sm">Start your archive</Button>
        </div>
      </div>
    </header>
  );
}
