"use client";

declare global {
  interface Window {
    clarity?: (command: string, eventName: string, payload?: Record<string, unknown>) => void;
  }
}

export function trackEvent(eventName: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.clarity?.("event", eventName, payload);
}
