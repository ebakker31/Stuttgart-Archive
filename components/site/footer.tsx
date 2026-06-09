import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { DiamondRule } from "@/components/ui/misc";
import { BRAND, FOOTER_DISCLAIMER } from "@/lib/brand";

const COLS = [
  { title: "Product", links: [["Digital Garage", "/#garage"], ["Community", "/community"], ["Auction Radar", "/events"], ["Pricing", "/pricing"], ["Demo Archive", "/demo"], ["Explore", "/explore"]] },
  { title: "Trust", links: [["Buying & selling", "/selling"], ["Privacy", "/privacy"], ["Terms & Disclaimer", "/terms"], ["Real-data-only AI", "/#real-data"]] },
  { title: "Company", links: [["Founding members", "/join"], ["Brand studio", "/brand"], ["Book a demo", "/book-demo"], ["Sign in", "/login"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs font-serif text-sm italic text-muted-foreground">{BRAND.tagline}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              <a className="hover:text-oxblood" href={`mailto:${BRAND.emails.hello}`}>{BRAND.emails.hello}</a>
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="archive-label">{col.title}</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DiamondRule className="mt-12" />
        <div className="mt-6">
          <p className="text-xs leading-relaxed text-muted-foreground/90">{FOOTER_DISCLAIMER}</p>
          <p className="mt-4 text-xs text-muted-foreground/70">© {new Date().getFullYear()} {BRAND.name}. An independent platform.</p>
        </div>
      </div>
    </footer>
  );
}
