"use client";

import { useEffect } from "react";
import { captureUtmFromLocation } from "@/lib/utm";

/** Runs once per session load to persist first-touch UTMs before navigation. */
export function UtmCapture() {
  useEffect(() => {
    captureUtmFromLocation(window.location, document.referrer || undefined);
  }, []);

  return null;
}
