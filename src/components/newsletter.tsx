"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { showSuccess, showError } from "@/utils/toast";
import { useState } from "react";
import { validateEmail, sanitizeString, checkRateLimit } from "@/utils/security";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsletterSignup = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize input
    const sanitizedEmail = sanitizeString(email);

    if (!sanitizedEmail) {
      showError(t("toast.emailRequired"));
      return;
    }

    // Validate email
    if (!validateEmail(sanitizedEmail)) {
      showError(t("toast.emailInvalid"));
      return;
    }

    // Rate limiting (5 submissions per 30 minutes per IP/session)
    const rateLimitKey = `newsletter_${sanitizedEmail}`;
    if (!checkRateLimit(rateLimitKey, 5, 30 * 60 * 1000)) {
      showError(t("toast.rateLimit"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess(t("toast.subscribeSuccess"));
      setEmail("");
    } catch (error) {
      showError(t("toast.subscribeError"));
      console.error("Newsletter subscription error:", {
        error,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {t("newsletter.title")}
      </h3>
      <p className="text-lg text-gray-600 mb-6">
        {t("newsletter.description")}
      </p>
      <div className="flex items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.placeholder")}
          required
          autoComplete="email"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Email address"
          maxLength={254}
        />
        <Button
          size="sm"
          type="submit"
          disabled={isSubmitting}
          className="ml-3"
        >
          {isSubmitting ? t("newsletter.subscribing") : t("newsletter.subscribe")}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {t("newsletter.privacy")}
      </p>
    </form>
  );
};

export default NewsletterSignup;