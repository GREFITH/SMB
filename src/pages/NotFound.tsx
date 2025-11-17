
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          404
        </h1>
        <p className="text-xl text-foreground/80 mb-6">
          Oops! The page you're looking for cannot be found.
        </p>
        <Link to="/">
          <Button className="scale-hover">
            <ArrowLeft size={16} className="mr-2" /> Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
