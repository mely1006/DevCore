declare module "@/lib/utils" {
  import type { ClassValue } from "clsx";
  /** Tailwind classnames merger */
  export function cn(...inputs: ClassValue[]): string;
}
