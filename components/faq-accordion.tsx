"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg">{item.q}</span>
              {isOpen ? <Minus className="h-4 w-4 shrink-0 text-oxblood" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </button>
            {isOpen && <p className="-mt-1 max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
