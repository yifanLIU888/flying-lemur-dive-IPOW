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

// Client-side rate limiting (for UX only - NOT for security)
// IMPORTANT: Real rate limiting MUST be implemented server-side
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  console.warn('Client-side rate limiting is not secure. Implement server-side rate limiting for production.');

  // This is only for UX feedback, not security
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');

  // Filter requests within the time window
  const recentRequests = requests.filter((time: number) => now - time < windowMs);

  if (recentRequests.length >= limit) {
    return false;
  }

  // Add current request
  recentRequests.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentRequests));

  return true;
};

// Clear old rate limit entries periodically (cleanup only)
export const cleanupRateLimits = () => {
  const now = Date.now();
  Object.keys(localStorage)
    .filter(key => key.startsWith('rate_limit_'))
    .forEach(key => {
      const requests = JSON.parse(localStorage.getItem(key) || '[]');
      const validRequests = requests.filter((time: number) => now - time < 3600000); // 1 hour
      if (validRequests.length === 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(validRequests));
      }
    });
};

// Run cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimits, 300000);
}

// Server-side validation function (to be implemented on backend)
export const validateServerSide = (data: any): boolean => {
  // Check for common attack patterns
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(JSON.stringify(data))) {
      return false;
    }
  }

  return true;
};

// API key security utilities
export const isApiKeyValid = (apiKey: string): boolean => {
  // Check if API key is in a valid format (example: 32-character hex string)
  const apiKeyRegex = /^[a-f0-9]{32}$/i;
  return apiKeyRegex.test(apiKey);
};

// IMPORTANT: Never store API keys in client-side code
// Always use environment variables and a backend proxy
export const getApiKey = (): string => {
  // This should be implemented on the server-side only
  throw new Error('API keys must be stored server-side. Use a backend proxy to access AI services.');
};

// AI service security utilities
export const validateAIServiceRequest = (data: any): boolean => {
  // Check for potentially malicious AI requests
  const forbiddenRequests = [
    'delete database',
    'drop table',
    'shutdown system',
    'execute malicious code',
    'hack into',
    'phishing',
    'spam',
    'malware',
    'ransomware'
  ];

  const requestString = JSON.stringify(data).toLowerCase();

  for (const forbidden of forbiddenRequests) {
    if (requestString.includes(forbidden)) {
      return false;
    }
  }

  return true;
};

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