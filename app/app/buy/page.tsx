import { ModePage } from "@/components/app/mode-page";
export default function BuyPage() {
  return <ModePage label="Buyer mode" title="Verify before you buy." description="Track candidates, compare them side by side, and run due-diligence checklists that flag missing high-impact records and the right questions to ask." tools={["Watchlist & vehicle notes", "Compare vehicles", "Buyer due-diligence checklist", "Questions to ask the seller", "Verified vs. unverified claims", "Missing-document warnings", "PPI & inspection reminders", "Risk flag summary", "What to verify next"]} />;
}
