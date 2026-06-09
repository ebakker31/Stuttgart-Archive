import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ArchiveLabel } from "@/components/ui/misc";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex h-16 items-center"><Wordmark /></header>
      <main className="container flex flex-1 flex-col items-center justify-center py-20 text-center">
        <ArchiveLabel>File not found · No. 404</ArchiveLabel>
        <h1 className="mt-4 display text-5xl">This record isn't in the archive.</h1>
        <p className="mt-4 max-w-md text-muted-foreground">The page you're looking for may have been moved, made private, or never filed.</p>
        <div className="mt-8 flex gap-3">
          <Button href="/" variant="accent">Return home</Button>
          <Button href="/explore" variant="outline">Explore the archive</Button>
        </div>
      </main>
    </div>
  );
}
