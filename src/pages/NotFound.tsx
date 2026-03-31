import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log security-relevant information
    console.error("404 Error: User attempted to access non-existent route:", {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-2">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="rounded-full px-6"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;