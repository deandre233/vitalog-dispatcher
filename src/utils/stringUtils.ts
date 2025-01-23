/**
 * Validates an email address
 * @param email The email address to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats a phone number as (XXX) XXX-XXXX
 * @param phone The phone number to format
 * @returns formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length >= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  // Return partially formatted number
  if (cleaned.length > 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length > 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  }
  if (cleaned.length > 0) {
    return `(${cleaned}`;
  }
  
  return '';
};

/**
 * Sanitizes a string to prevent XSS attacks
 * @param input The string to sanitize
 * @returns sanitized string
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str The string to truncate
 * @param maxLength Maximum length before truncation
 * @returns truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
};

/**
 * Formats a full name from first and last name components
 * @param firstName First name
 * @param lastName Last name
 * @returns formatted full name
 */
export const formatFullName = (firstName?: string, lastName?: string): string => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ') || 'N/A';
};

/**
 * Case-insensitive string search
 * @param searchTerm The term to search for
 * @param searchIn The string to search within
 * @returns boolean indicating if searchTerm was found
 */
export const searchString = (searchTerm: string, searchIn: string): boolean => {
  if (!searchTerm || !searchIn) return false;
  return searchIn.toLowerCase().includes(searchTerm.toLowerCase());
};