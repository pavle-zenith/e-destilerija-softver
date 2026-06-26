import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Spaja Tailwind klase (shadcn/ui konvencija). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
