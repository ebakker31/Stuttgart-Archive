import { CarPlate, colorToHex, bodyForModel } from "@/components/brand/car-art";
import { SmartPhoto } from "@/components/smart-photo";
import { ArchiveLabel } from "@/components/ui/misc";
import { carPhotos, stockPhotosEnabled } from "@/lib/integrations/stock-photos";
import { cn } from "@/lib/utils";

interface VehicleLike {
  year: number;
  model: string;
  generation?: string;
  exteriorColor: string;
  photo?: string; // explicit path/URL wins over stock lookup
}

/**
 * Lead image for a vehicle. Resolution order:
 *   1. an explicit `photo` on the vehicle (your own/licensed image)
 *   2. a real stock photo (Pexels/Unsplash/LoremFlickr) when configured
 *   3. original blueprint illustration (always works, never breaks)
 * Any real photo that fails to load falls back to the illustration via SmartPhoto.
 */
export async function VehicleImage({
  v,
  className,
  showLabels = true,
  rounded = true,
  seed = 1,
}: {
  v: VehicleLike;
  className?: string;
  showLabels?: boolean;
  rounded?: boolean;
  seed?: number;
}) {
  const tint = colorToHex(v.exteriorColor);
  const body = bodyForModel(v.model, v.year);

  let photo = v.photo;
  if (!photo && stockPhotosEnabled()) {
    const found = await carPhotos(`Porsche ${v.model}`, 1, seed);
    photo = found[0];
  }

  return (
    <div className={cn("relative overflow-hidden border border-border bg-parchment-card paper-grain dark:bg-graphite-soft", rounded && "rounded-md", className)}>
      {photo ? (
        <SmartPhoto src={photo} alt={`${v.year} Porsche ${v.model}`} body={body} color={tint} />
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
          {!photo && (
            <div className="absolute bottom-2.5 left-3">
              <span className="archive-label text-muted-foreground/70">Illustration</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
