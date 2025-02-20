
export const extractSubdomain = (hostname: string): string | null => {
  // Handle localhost development
  if (hostname.includes('localhost')) return null;
  
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Split hostname into parts
  const parts = host.split('.');
  
  // If we have enough parts for a subdomain
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};

export const isValidSubdomain = (subdomain: string): boolean => {
  // Only allow lowercase letters, numbers, and hyphens
  const subdomainRegex = /^[a-z0-9-]+$/;
  return subdomainRegex.test(subdomain);
};
