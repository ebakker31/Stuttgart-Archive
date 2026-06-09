import { ModePage } from "@/components/app/mode-page";
export default function SellPage() {
  return <ModePage label="Seller mode" title="A buyer-ready presentation, honestly assembled." description="Generate a seller packet, listing copy, buyer FAQ, photo checklist, and a secure shareable page — with unsupported claims flagged before you publish." tools={["Premium public vehicle page", "Seller packet PDF", "Listing description & FAQ", "Photo & walkaround checklists", "Known flaws & disclosure", "Service & modification highlights", "Lead capture form", "Buyer message drafts", "Listing readiness checklist"]} filter={(s) => s.includes("For sale")} />;
}
