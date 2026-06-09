import Link from "next/link";
import { AppSidebar } from "@/components/app/sidebar";
import { getAppSession } from "@/lib/app-data";
import { DemoDataBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getAppSession();

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {session.demo && (
          <div className="flex items-center justify-center gap-3 border-b border-oxblood/20 bg-oxblood/5 px-4 py-2 text-center text-sm text-oxblood">
            <DemoDataBadge />
            <span>You're exploring the sample archive. Connect Supabase to use your own data.</span>
            <Link href="/signup" className="font-medium underline">Start free</Link>
          </div>
        )}
        <header className="flex h-14 items-center justify-between border-b border-border px-5 lg:px-8">
          <div className="text-sm text-muted-foreground">
            {session.fullName ? `Welcome, ${session.fullName}` : "Your archive"} · <span className="capitalize">{session.mode} mode</span>
          </div>
          <div className="flex items-center gap-2">
            <Button href="/app/garage" variant="ghost" size="sm" className="lg:hidden">Garage</Button>
            <Button href="/explore" variant="outline" size="sm">View public explore</Button>
          </div>
        </header>
        <main className="flex-1 px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
