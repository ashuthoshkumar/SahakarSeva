/**
 * SahakarSeva Strict Validation Utilities
 * Validates Phone Numbers, Passwords, Full Names, Emails, and Aadhaar IDs
 */

/**
 * Validates and normalizes Indian 10-digit mobile phone numbers
 * @param {string} phone 
 * @returns {{ isValid: boolean, normalizedPhone: string, error?: string }}
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, normalizedPhone: '', error: 'Phone number is required.' };
  }

  // Strip non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Handle leading +91 or 91 or 0
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return {
      isValid: false,
      normalizedPhone: digits,
      error: 'Phone number must be exactly 10 digits.'
    };
  }

  if (!/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      normalizedPhone: digits,
      error: 'Invalid mobile number. Must start with 6, 7, 8, or 9.'
    };
  }

  return {
    isValid: true,
    normalizedPhone: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  };
};

/**
 * Validates strict password requirements:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (!@#$%^&*...)
 * @param {string} password 
 * @returns {{ isValid: boolean, score: number, checks: { minLength: boolean, hasUpper: boolean, hasLower: boolean, hasNumber: boolean, hasSpecial: boolean }, error?: string }}
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      checks: { minLength: false, hasUpper: false, hasLower: false, hasNumber: false, hasSpecial: false },
      error: 'Password is required.'
    };
  }

  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const passedCount = Object.values(checks).filter(Boolean).length;
  const isValid = passedCount === 5;

  let error = null;
  if (!checks.minLength) error = 'Password must be at least 8 characters long.';
  else if (!checks.hasUpper) error = 'Password must contain at least one uppercase letter (A-Z).';
  else if (!checks.hasLower) error = 'Password must contain at least one lowercase letter (a-z).';
  else if (!checks.hasNumber) error = 'Password must contain at least one number (0-9).';
  else if (!checks.hasSpecial) error = 'Password must contain at least one special character (!@#$%^&*).';

  return {
    isValid,
    score: passedCount,
    checks,
    error
  };
};

/**
 * Validates standard email addresses
 * @param {string} email 
 * @returns {{ isValid: boolean, normalizedEmail: string, error?: string }}
 */
export const validateEmail = (email) => {
  if (!email) return { isValid: true, normalizedEmail: '' }; // Optional in registration
  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, normalizedEmail: clean, error: 'Please enter a valid email address (e.g. name@domain.com).' };
  }
  return { isValid: true, normalizedEmail: clean };
};

/**
 * Validates Full Name
 * @param {string} name 
 * @returns {{ isValid: boolean, normalizedName: string, error?: string }}
 */
export const validateFullName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, normalizedName: '', error: 'Full Name is required.' };
  }
  const clean = name.trim();
  if (clean.length < 3) {
    return { isValid: false, normalizedName: clean, error: 'Full Name must be at least 3 characters long.' };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(clean)) {
    return { isValid: false, normalizedName: clean, error: 'Full Name can only contain alphabets and spaces.' };
  }
  return { isValid: true, normalizedName: clean };
};

/**
 * Validates 12-digit Indian Aadhaar Number
 * @param {string} aadhaar 
 * @returns {{ isValid: boolean, normalizedAadhaar: string, error?: string }}
 */
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar || typeof aadhaar !== 'string') {
    return { isValid: false, normalizedAadhaar: '', error: 'Aadhaar Number is required for Worker KYC.' };
  }
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length !== 12) {
    return { isValid: false, normalizedAadhaar: digits, error: 'Aadhaar Number must be exactly 12 numeric digits.' };
  }
  // Check for repeated trivial patterns like 000000000000
  if (/^(\d)\1{11}$/.test(digits)) {
    return { isValid: false, normalizedAadhaar: digits, error: 'Invalid Aadhaar Number pattern.' };
  }

  return {
    isValid: true,
    normalizedAadhaar: `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`
  };
};

/**
 * Validates Worker Hourly Rate
 * @param {number|string} rate 
 * @returns {{ isValid: boolean, rateNumber: number, error?: string }}
 */
export const validateHourlyRate = (rate) => {
  const num = Number(rate);
  if (isNaN(num) || num < 300) {
    return { isValid: false, rateNumber: 350, error: 'Minimum wage floor is ₹300/hr as per cooperative standards.' };
  }
  if (num > 5000) {
    return { isValid: false, rateNumber: num, error: 'Hourly rate cannot exceed ₹5,000/hr.' };
  }
  return { isValid: true, rateNumber: num };
};
