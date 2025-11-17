import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Upload, 
  User,
  LogOut,
  MonitorCheck
} from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
              aria-label="Visual Time Capsule Home"
            >
              Visual Time Capsule
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/screens" 
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                >
                  <MonitorCheck size={16} />
                  Screens
                </Link>
                <Link 
                  to="/upload" 
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Upload size={16} />
                  Upload Media
                </Link>
                {user?.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium flex items-center">
                    <User size={16} className="mr-1" /> {user?.username}
                  </span>
                  <Button size="sm" variant="ghost" onClick={handleLogout}>
                    <LogOut size={16} className="mr-1" /> Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="ml-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </nav>

          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="mr-2"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden ${
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        } overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3 bg-background/95 backdrop-blur-sm border-t border-border">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 bg-accent/50 rounded-md mb-2">
                <div className="flex items-center text-sm font-medium">
                  <User size={16} className="mr-1" /> {user?.username}
                </div>
              </div>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/screens"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MonitorCheck size={16} className="mr-1" /> Screens
              </Link>
              <Link
                to="/upload"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Upload size={16} className="mr-1" /> Upload Media
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Button
                variant="ghost"
                className="flex w-full justify-start px-3 py-2 rounded-md text-base font-medium hover:text-destructive transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium btn-primary w-full flex justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
