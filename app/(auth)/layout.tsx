import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { FOOTER_DISCLAIMER } from "@/lib/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex h-16 items-center"><Wordmark /></header>
      <main className="container flex flex-1 items-center justify-center py-12">{children}</main>
      <footer className="container py-6">
        <p className="text-[11px] leading-relaxed text-muted-foreground/80">{FOOTER_DISCLAIMER}</p>
        <p className="mt-2 text-xs text-muted-foreground"><Link href="/" className="hover:text-foreground">← Back to home</Link></p>
      </footer>
    </div>
  );
}
