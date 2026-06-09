"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import type { Comment } from "@/lib/community";

/**
 * Client-side community interactions. In demo mode these update optimistically
 * in local state; with Supabase connected they would POST to follow/like/comment
 * endpoints. Following + commenting are user actions — the platform never
 * messages or posts on a member's behalf automatically.
 */

export function FollowButton({ handle, initialFollowing = false }: { handle: string; initialFollowing?: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  return (
    <button
      onClick={() => setFollowing((f) => !f)}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
        following ? "border border-border bg-muted text-foreground" : "bg-oxblood text-white hover:bg-oxblood-deep"
      )}
      aria-pressed={following}
    >
      {following ? <><UserCheck className="h-4 w-4" /> Following</> : <><UserPlus className="h-4 w-4" /> Follow {handle ? `@${handle}` : ""}</>}
    </button>
  );
}

export function FeedReactions({ likes, comments }: { likes: number; comments: Comment[] }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Comment[]>(comments);
  const [draft, setDraft] = useState("");

  function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setList((l) => [...l, { author: "you", body: draft.trim(), date: new Date().toISOString().slice(0, 10) }]);
    setDraft("");
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-5 text-sm">
        <button onClick={() => { setLiked((v) => !v); setCount((c) => c + (liked ? -1 : 1)); }} className={cn("inline-flex items-center gap-1.5", liked ? "text-oxblood" : "text-muted-foreground hover:text-foreground")}>
          <Heart className={cn("h-4 w-4", liked && "fill-oxblood")} /> {count}
        </button>
        <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
          <MessageCircle className="h-4 w-4" /> {list.length}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-l border-border pl-4">
          {list.map((c, i) => (
            <div key={i} className="text-sm"><span className="font-medium">@{c.author}</span> <span className="text-muted-foreground">{c.body}</span></div>
          ))}
          <form onSubmit={addComment} className="flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment…" className="flex h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm" />
            <button type="submit" className="h-9 shrink-0 rounded-md bg-graphite px-4 text-sm text-parchment dark:bg-parchment dark:text-graphite">Post</button>
          </form>
        </div>
      )}
    </div>
  );
}
