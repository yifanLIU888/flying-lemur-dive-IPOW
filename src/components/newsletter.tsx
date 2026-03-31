import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NewsletterSignup = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual newsletter signup logic
    toast.success("Thank you for subscribing!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Subscribe to our newsletter
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Get the latest updates, features, and special offers
      </p>
      <div className="flex items-center">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Button size="sm" className="ml-3">
          Subscribe
        </Button>
      </div>
    </form>
  );
};

export default NewsletterSignup;