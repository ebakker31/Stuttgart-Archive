"use client";

import { useState } from "react";
import { CarPlate, type CarBody } from "@/components/brand/car-art";

/**
 * Renders a real photo, but gracefully falls back to the original car
 * illustration if the image fails to load (offline, blocked, or 404). This
 * means the demo always looks intentional — never a broken image.
 */
export function SmartPhoto({
  src,
  alt,
  body,
  color,
}: {
  src: string;
  alt: string;
  body: CarBody;
  color: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4 py-3">
        <CarPlate body={body} color={color} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}
