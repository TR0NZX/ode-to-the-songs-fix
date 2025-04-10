
import { Heart } from "lucide-react";

const SupportPage = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-0 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-2">
            Support <span className="font-cursive italic text-ode-burgundy">Ode To The Song</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ode To The Song is and will always be completely free to use! However, if you'd
            like to support the development and server costs, you can make a voluntary
            contribution. Any amount is deeply appreciated and helps keep this service
            running smoothly for everyone!
          </p>
        </div>

        <div className="text-center mb-16">
          <button className="bg-ode-burgundy text-white px-8 py-3 rounded-md hover:bg-ode-darkBurgundy transition-colors flex items-center mx-auto">
            <Heart size={20} className="mr-2" />
            Support Ode To The Song [Saweria]
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions, feedback, or need assistance? We'd love to hear from you!
            </p>
            <a 
              href="mailto:support@odetothesong.com" 
              className="text-ode-burgundy hover:underline"
            >
              support@odetothesong.com
            </a>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <p className="text-gray-600 mb-4">
              Stay connected with us on social media for updates and announcements.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-ode-burgundy hover:underline"
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="text-ode-burgundy hover:underline"
              >
                Twitter
              </a>
              <a 
                href="#" 
                className="text-ode-burgundy hover:underline"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
