
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Clock, Upload, Calendar, Shield } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] animate-fade-in">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Visual Time Capsule
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/80 max-w-3xl mx-auto">
            Upload, schedule, and manage your media with precise control over when content appears and disappears.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="scale-hover">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="scale-hover">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="scale-hover">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background/50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Upload size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-foreground/70">
                Upload images, videos, and PDFs up to 5MB with our intuitive interface.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Calendar size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-foreground/70">
                Set precise start and end dates for when your content should be visible.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Clock size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Display Duration</h3>
              <p className="text-foreground/70">
                Control exactly how long each piece of content should be displayed in seconds.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Shield size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-foreground/70">
                Robust user authentication and admin controls to manage your content securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-8 text-xl text-foreground/80">
            Create your account now and start uploading your media with scheduled visibility.
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" className="scale-hover">
                Create Your Account
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
