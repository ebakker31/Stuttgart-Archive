import { ModePage } from "@/components/app/mode-page";
export default function AuctionPrepPage() {
  return <ModePage label="Auction prep mode" title="Auction-grade, independent of any platform." description="Generate auction-style drafts, photo and video checklists, seller Q&A prep, and a claim verification report — thorough and honest." tools={["Auction readiness score", "Auction-style listing drafts", "Photo & video checklists", "Undercarriage & paint-meter checklists", "Service & maintenance summaries", "Known flaws disclosure", "Seller Q&A prep", "Comment response drafts", "Export-ready auction packet"]} filter={(s) => s.includes("Auction prep")} />;
}
