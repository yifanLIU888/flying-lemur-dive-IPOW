/**
 * Security utilities for input validation and sanitization
 */

// Email validation with comprehensive regex
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const trimmedEmail = email.trim();
  if (trimmedEmail.length > 254) return false; // RFC 5321 limit

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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

// Rate limiting utility (server-side implementation)
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

export const rateLimitApiKey = (apiKey: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem(`api_rate_limit_${apiKey}`) || '[]');

  // Filter requests within the time window
  const recentRequests = requests.filter((time: number) => now - time < windowMs);

  if (recentRequests.length >= limit) {
    return false;
  }

  // Add current request
  recentRequests.push(now);
  localStorage.setItem(`api_rate_limit_${apiKey}`, JSON.stringify(recentRequests));

  return true;
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

// Clear old API rate limit entries periodically
export const cleanupAPIRateLimits = () => {
  const now = Date.now();
  Object.keys(localStorage)
    .filter(key => key.startsWith('api_rate_limit_'))
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
  setInterval(cleanupAPIRateLimits, 300000);
}