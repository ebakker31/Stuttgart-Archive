"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface C { author: string; body: string; hoursAgo: number; isSeller?: boolean }

/** Auction comment thread. Optimistic in demo; posting needs an account for real. */
export function CommentThread({ initial }: { initial: C[] }) {
  const [list, setList] = useState<C[]>(initial);
  const [draft, setDraft] = useState("");

  function post(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setList((l) => [{ author: "you", body: draft.trim(), hoursAgo: 0 }, ...l]);
    setDraft("");
  }

  return (
    <div>
      <form onSubmit={post} className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment or question…" className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <Button type="submit" variant="accent" className="shrink-0">Comment</Button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">Comments are public. Be respectful — sellers answer here, and bidders verify everything.</p>

      <div className="mt-6 space-y-5">
        {list.map((c, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-graphite text-xs font-medium text-parchment dark:bg-parchment dark:text-graphite">
              {c.author.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">@{c.author}</span>
                {c.isSeller && <Badge variant="accent">Seller</Badge>}
                <span className="text-xs text-muted-foreground">{c.hoursAgo === 0 ? "just now" : `${c.hoursAgo}h ago`}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/85">{c.body}</p>
            </div>
          </div>
        ))}
        {!list.length && <p className="text-sm text-muted-foreground">No comments yet. Ask the seller a question.</p>}
      </div>
    </div>
  );
}
