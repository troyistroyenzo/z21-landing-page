// Utility function to interpolate environment variables in strings
export function interpolateEnv(str: string): string {
  if (typeof str !== 'string') return str;
  
  // Replace {{NEXT_PUBLIC_*}} with actual env values
  return str.replace(/\{\{(NEXT_PUBLIC_[A-Z_]+)\}\}/g, (match, envVar) => {
    return process.env[envVar] || '#';
  });
}

// Class name helper
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}
