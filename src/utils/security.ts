/**
 * Security utilities for input validation and sanitization
 */

import DOMPurify from 'dompurify';

// Email validation with comprehensive regex
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const trimmedEmail = email.trim();
  if (trimmedEmail.length > 254) return false; // RFC 5321 limit

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(trimmedEmail);
};

// Sanitize string input using DOMPurify
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  // Use DOMPurify to sanitize HTML/Script tags
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Sanitize HTML content (for rich text)
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return '';

  // Allow only safe HTML tags and attributes
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

// Validate URL to prevent open redirects
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// IMPORTANT: Client-side rate limiting is NOT secure and should only be used for UX purposes.
// Real rate limiting MUST be implemented server-side using distributed stores like Redis.
// The function below has been removed to avoid false sense of security.
// When you implement a backend, use the middleware in src/server/middleware/security.ts

// File upload validation
export const validateFile = (file: File, allowedTypes: string[], maxSize: number): boolean => {
  if (!file.type.match(allowedTypes.join('|'))) {
    return false;
  }
  if (file.size > maxSize) {
    return false;
  }
  return true;
};

// Sanitize filename
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-z0-9._-]/gi, '_').substring(0, 255);
};

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};