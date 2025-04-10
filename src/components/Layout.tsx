import { Outlet, Link, useLocation } from "react-router-dom";
import { Music, MessageSquare, History, Heart } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-0">
          <Link to="/" className="font-cursive text-xl md:text-2xl italic">
            Ode To The Song
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/submit" className={`nav-link ${location.pathname === '/submit' ? 'text-ode-burgundy' : ''}`}>
              Submit
            </Link>
            <Link to="/browse" className={`nav-link ${location.pathname === '/browse' ? 'text-ode-burgundy' : ''}`}>
              Browse
            </Link>
            <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'text-ode-burgundy' : ''}`}>
              History
            </Link>
            <Link to="/support" className={`nav-link ${location.pathname === '/support' ? 'text-ode-burgundy' : ''}`}>
              Support
            </Link>
          </nav>
          <div className="md:hidden flex space-x-4">
            <Link to="/submit" className={`${location.pathname === '/submit' ? 'text-ode-burgundy' : 'text-gray-600'}`}>
              <MessageSquare size={20} />
            </Link>
            <Link to="/browse" className={`${location.pathname === '/browse' ? 'text-ode-burgundy' : 'text-gray-600'}`}>
              <Music size={20} />
            </Link>
            <Link to="/history" className={`${location.pathname === '/history' ? 'text-ode-burgundy' : 'text-gray-600'}`}>
              <History size={20} />
            </Link>
            <Link to="/support" className={`${location.pathname === '/support' ? 'text-ode-burgundy' : 'text-gray-600'}`}>
              <Heart size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-center md:text-left text-gray-500 text-sm">
                © {year} Ode To The Song. All Rights Reserved
              </p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-ode-burgundy text-sm">
                Tiktok
              </a>
              <a href="#" className="text-gray-500 hover:text-ode-burgundy text-sm">
                Feedback
              </a>
              <Link to="/support" className="text-gray-500 hover:text-ode-burgundy text-sm">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
