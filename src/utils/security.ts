/**
 * Security utilities for input validation and sanitization
 */

// Email validation with comprehensive regex
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const trimmedEmail = email.trim();
  if (trimmedEmail.length > 254) return false; // RFC 5321 limit
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(trimmedEmail);
};

// Sanitize string input (basic XSS prevention)
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
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

// Rate limiting utility (client-side)
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
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

// Clear old rate limit entries periodically
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