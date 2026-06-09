import { ArchiveLabel } from "@/components/ui/misc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleSetting } from "@/components/app/toggle-setting";

export default function PrivacySettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <ArchiveLabel>Settings · Privacy</ArchiveLabel>
        <h1 className="mt-2 display text-4xl">Privacy controls.</h1>
        <p className="mt-2 text-muted-foreground">Your data is private by default. Choose exactly what becomes visible.</p>
      </div>

      <Card><CardContent className="divide-y divide-border p-5">
        <ArchiveLabel>Visibility defaults</ArchiveLabel>
        <ToggleSetting label="New vehicles are private by default" defaultOn locked />
        <ToggleSetting label="Show full VIN publicly" description="Default: off. Public pages hide the VIN unless you opt in." defaultOn={false} />
        <ToggleSetting label="Documents are private by default" defaultOn locked />
        <ToggleSetting label="Allow marketing emails" description="Opt-in. Required for product tips and weekly summaries." defaultOn={false} />
        <ToggleSetting label="Use my data to improve models" description="Off unless you opt in." defaultOn={false} />
      </CardContent></Card>

      <Card><CardContent className="p-5">
        <ArchiveLabel>Your data</ArchiveLabel>
        <p className="mt-2 text-sm text-muted-foreground">You own your archive. Export everything, or delete it entirely, at any time.</p>
        <div className="mt-4 flex gap-2"><Button variant="outline">Export my data</Button><Button variant="outline" className="text-oxblood">Delete my account</Button></div>
      </CardContent></Card>
    </div>
  );
}
