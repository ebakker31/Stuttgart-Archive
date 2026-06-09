import { CarPlate, colorToHex, bodyForModel } from "@/components/brand/car-art";
import { ArchiveLabel } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

interface VehicleLike {
  year: number;
  model: string;
  generation?: string;
  exteriorColor: string;
  photo?: string; // optional path under /public, e.g. /demo-cars/2007-911-turbo.jpg
}

/**
 * Renders a vehicle's lead image. Prefers a real licensed photograph when the
 * vehicle has a `photo` set; otherwise falls back to original blueprint artwork.
 * The framing (archive labels, paper grain, color block) is consistent either way.
 */
export function VehicleImage({
  v,
  className,
  showLabels = true,
  rounded = true,
}: {
  v: VehicleLike;
  className?: string;
  showLabels?: boolean;
  rounded?: boolean;
}) {
  const tint = colorToHex(v.exteriorColor);
  const body = bodyForModel(v.model, v.year);

  return (
    <div className={cn("relative overflow-hidden border border-border bg-parchment-card paper-grain dark:bg-graphite-soft", rounded && "rounded-md", className)}>
      {v.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v.photo} alt={`${v.year} Porsche ${v.model}`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-4 py-3">
          <CarPlate body={body} color={tint} />
        </div>
      )}

      {showLabels && (
        <>
          <div className="absolute left-3 top-3"><ArchiveLabel>Plate · {v.generation ?? v.model}</ArchiveLabel></div>
          <div className="absolute bottom-2.5 right-3 text-right">
            <div className="archive-label">{v.exteriorColor}</div>
          </div>
          {!v.photo && (
            <div className="absolute bottom-2.5 left-3">
              <span className="archive-label text-muted-foreground/70">Illustration</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
