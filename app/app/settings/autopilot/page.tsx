import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleSetting } from "@/components/app/toggle-setting";
import { GuardrailNotice } from "@/components/guardrails";

export default function AutopilotPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <ArchiveLabel>Settings · Autopilot</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Autopilot.</h1>
        <p className="mt-2 text-muted-foreground">Control what the AI may do on its own. External actions are disabled by default and always require your approval.</p>
      </div>

      <GuardrailNotice items={["draftOnly", "approvedFields"]} />

      <Card><CardContent className="divide-y divide-border p-5">
        <ArchiveLabel>Drafting & internal work (safe)</ArchiveLabel>
        <ToggleSetting label="Allow AI to draft content automatically" defaultOn />
        <ToggleSetting label="Allow AI to queue content for review" defaultOn />
        <ToggleSetting label="Allow AI to create internal tasks" defaultOn />
        <ToggleSetting label="Allow AI to generate public pages (publishing still requires approval)" defaultOn />
        <ToggleSetting label="Allow AI to suggest paid ads" defaultOn />
      </CardContent></Card>

      <Card><CardContent className="divide-y divide-border p-5">
        <ArchiveLabel>External actions (off by default)</ArchiveLabel>
        <ToggleSetting label="Allow AI to publish public pages" description="When off, you confirm every publish." defaultOn={false} />
        <ToggleSetting label="Allow AI to publish Instagram content" description="Never auto-posts in this MVP." defaultOn={false} locked />
        <ToggleSetting label="Allow AI to launch ads" description="Never auto-launches in this MVP." defaultOn={false} locked />
        <ToggleSetting label="Allow AI to send buyer messages" defaultOn={false} />
        <ToggleSetting label="Allow AI to access a connected Instagram account" description="Only after you connect it." defaultOn={false} locked />
        <ToggleSetting label="Use uploaded vehicle photos in marketing content" description="Off until approved per vehicle." defaultOn={false} />
      </CardContent></Card>

      <Card><CardContent className="divide-y divide-border p-5">
        <ArchiveLabel>Operator agents</ArchiveLabel>
        <ToggleSetting label="Founder Copilot may suggest actions" defaultOn />
        <ToggleSetting label="Growth Agent may create drafts" defaultOn />
        <ToggleSetting label="Research Agent may create reports" defaultOn />
        <ToggleSetting label="QA Agent may create bug tickets" defaultOn />
        <ToggleSetting label="Error Repair Agent may suggest fixes" defaultOn />
        <ToggleSetting label="Brand Guardian may block risky public copy" defaultOn />
      </CardContent></Card>
    </div>
  );
}
