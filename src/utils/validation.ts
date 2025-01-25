import { VALIDATION } from "@/config/constants";

export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

export const validateName = (name: string): boolean => {
  return name.length > 0 && name.length <= VALIDATION.MAX_NAME_LENGTH;
};