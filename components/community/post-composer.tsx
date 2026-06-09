"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArchiveLabel } from "@/components/ui/misc";
import { Tag, Wrench, FolderArchive } from "lucide-react";

type PostType = "archive_update" | "modification" | "for_sale";

const TYPES: { id: PostType; label: string; icon: any }[] = [
  { id: "archive_update", label: "Update", icon: FolderArchive },
  { id: "modification", label: "Modification", icon: Wrench },
  { id: "for_sale", label: "List for sale", icon: Tag },
];

interface LocalPost { id: number; type: PostType; body: string; price?: string }

/**
 * Demo post composer. Optimistically adds posts to a local list. With Supabase
 * connected, this would insert into community_posts (and respect publish/privacy
 * settings). Posting is always an explicit user action.
 */
export function PostComposer() {
  const [type, setType] = useState<PostType>("archive_update");
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [posts, setPosts] = useState<LocalPost[]>([]);
  const [id, setId] = useState(1);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosts((p) => [{ id, type, body: body.trim(), price: type === "for_sale" ? price : undefined }, ...p]);
    setId((i) => i + 1);
    setBody(""); setPrice("");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t.id} onClick={() => setType(t.id)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${type === t.id ? "border-oxblood/40 bg-oxblood/5 text-oxblood" : "border-border text-muted-foreground hover:text-foreground"}`}>
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-3">
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)} rows={2}
              placeholder={type === "for_sale" ? "Describe the car you're listing…" : type === "modification" ? "What did you change? Keep it factual." : "Share an archive update…"}
              className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex items-center gap-2">
              {type === "for_sale" && (
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Asking price (optional)" className="h-9 w-44 rounded-md border border-input bg-background/60 px-3 text-sm" />
              )}
              <Button type="submit" variant="accent" size="sm" className="ml-auto">Post to The Paddock</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {posts.map((p) => (
        <Card key={p.id} className="border-oxblood/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <ArchiveLabel className="text-oxblood">You · just now</ArchiveLabel>
              <Badge variant="accent">{TYPES.find((t) => t.id === p.type)?.label}</Badge>
            </div>
            <p className="mt-3 text-sm">{p.body}</p>
            {p.price && <p className="mt-2 font-serif text-oxblood">{p.price.startsWith("$") ? p.price : `$${p.price}`}</p>}
            <p className="mt-2 text-xs text-muted-foreground">Draft posted in demo mode — connect your account to publish for real.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
