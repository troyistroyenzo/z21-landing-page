import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to interpolate environment variables in strings
export function interpolateEnv(str: string): string {
  if (typeof str !== 'string') return str;
  
  // Replace {{NEXT_PUBLIC_*}} with actual env values
  return str.replace(/\{\{(NEXT_PUBLIC_[A-Z_]+)\}\}/g, (match, envVar) => {
    return process.env[envVar] || '#';
  });
}

// Modern class name helper with tailwind-merge support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
