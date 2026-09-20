export namespace Validation {
  // Regular expressions
  export const USER_ID_REGEX = /^\d+$/;
  export const YEAR_REGEX = /^(1[0-9]{3}|20[0-2][0-9]|2030)$/;
  export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  export function isNotEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  }

  export function isNumeric(value: string): boolean {
    return /^\d+$/.test(value.trim());
  }

  export function isValidUserId(id: string): boolean {
    const trimmed = id.trim();
    return isNotEmpty(trimmed) && USER_ID_REGEX.test(trimmed);
  }

  export function isValidYear(year: string | number): boolean {
    const str = String(year).trim();
    if (!YEAR_REGEX.test(str)) return false;
    const num = parseInt(str, 10);
    const currentYear = new Date().getFullYear() + 1; // allow upcoming year publications
    return num >= 1000 && num <= currentYear;
  }

  export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email.trim());
  }

  export interface BookValidationErrors {
    title?: string;
    author?: string;
    year?: string;
  }

  export function validateBook(
    title: string,
    author: string,
    year: string
  ): BookValidationErrors {
    const errors: BookValidationErrors = {};

    if (!isNotEmpty(title)) {
      errors.title = "Це поле є обов'язковим";
    }

    if (!isNotEmpty(author)) {
      errors.author = "Це поле є обов'язковим";
    }

    if (!isNotEmpty(year)) {
      errors.year = "Це поле є обов'язковим";
    } else if (!isNumeric(year)) {
      errors.year = "Поле повинно містити тільки цифри";
    } else if (!isValidYear(year)) {
      errors.year = "Введіть коректний рік видання (наприклад, 2024)";
    }

    return errors;
  }

  export interface UserValidationErrors {
    id?: string;
    name?: string;
    email?: string;
  }

  export function validateUser(
    name: string,
    email: string,
    id?: string
  ): UserValidationErrors {
    const errors: UserValidationErrors = {};

    if (id !== undefined && id !== '') {
      if (!isValidUserId(id)) {
        errors.id = "ID користувача повинен містити тільки цифри";
      }
    }

    if (!isNotEmpty(name)) {
      errors.name = "Це поле є обов'язковим";
    }

    if (!isNotEmpty(email)) {
      errors.email = "Це поле є обов'язковим";
    } else if (!isValidEmail(email)) {
      errors.email = "Введіть коректний email";
    }

    return errors;
  }
}
