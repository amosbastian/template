import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function classnames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
