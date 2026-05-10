import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a color class pair (foreground, track) based on a percentage threshold.
 * Used by progress rings and dimension bars for consistent color coding.
 */
export function getProgressColors(percentage: number) {
  if (percentage < 25) return { fg: "text-red-400", track: "text-red-100", bar: "bg-red-400", barTrack: "bg-red-100" };
  if (percentage <= 75) return { fg: "text-amber-500", track: "text-amber-100", bar: "bg-amber-500", barTrack: "bg-amber-100" };
  return { fg: "text-emerald-500", track: "text-emerald-100", bar: "bg-emerald-500", barTrack: "bg-emerald-100" };
}
