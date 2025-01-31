export const APP_NAME = "Medical Transport System";
export const API_VERSION = "v1";
export const DEFAULT_PAGINATION_LIMIT = 10;

// Route constants
export const ROUTES = {
  HOME: "/",
  DISPATCH: "/dispatch",
  PATIENTS: "/patients",
  EMPLOYEES: "/employees",
  BILLING: "/billing",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  DISPATCH: "/api/dispatch",
  PATIENTS: "/api/patients",
  EMPLOYEES: "/api/employees",
  BILLING: "/api/billing",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "An error occurred. Please try again.",
  NOT_FOUND: "Resource not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION: "Please check your input and try again.",
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  PHONE_REGEX: /^\+?[\d\s-]{10,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;