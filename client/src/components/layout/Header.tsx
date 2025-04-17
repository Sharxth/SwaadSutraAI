import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Extract the tab from the location
    const currentPath = location === '/' ? 'home' : location.substring(1);
    setActiveTab(currentPath);
  }, [location]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(tab === 'home' ? '/' : `/${tab}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center" onClick={() => handleTabClick('home')} style={{ cursor: 'pointer' }}>
          <svg
            className="w-10 h-10 text-primary mr-3"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0V7zm4 3a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zm-8 2a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0v-3z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-2xl font-bold text-primary font-playfair">SwaadSutra</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button
            className={`px-1 py-2 font-poppins ${
              activeTab === 'home' ? 'text-primary border-b-3 border-primary font-semibold' : 'text-gray-700 hover:text-primary'
            }`}
            onClick={() => handleTabClick('home')}
          >
            Home
          </button>
          <button
            className={`px-1 py-2 font-poppins ${
              activeTab === 'vault' ? 'text-primary border-b-3 border-primary font-semibold' : 'text-gray-700 hover:text-primary'
            }`}
            onClick={() => handleTabClick('vault')}
          >
            Recipe Vault
          </button>
          <button
            className={`px-1 py-2 font-poppins ${
              activeTab === 'maker' ? 'text-primary border-b-3 border-primary font-semibold' : 'text-gray-700 hover:text-primary'
            }`}
            onClick={() => handleTabClick('maker')}
          >
            Recipe Maker
          </button>
          <button
            className={`px-1 py-2 font-poppins ${
              activeTab === 'enhancer' ? 'text-primary border-b-3 border-primary font-semibold' : 'text-gray-700 hover:text-primary'
            }`}
            onClick={() => handleTabClick('enhancer')}
          >
            Recipe Enhancer
          </button>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu />
        </Button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-inner">
          <div className="flex flex-col p-4 space-y-3">
            <button
              className={`px-1 py-2 text-left font-poppins ${
                activeTab === 'home' ? 'text-primary font-semibold' : 'text-gray-700'
              }`}
              onClick={() => handleTabClick('home')}
            >
              Home
            </button>
            <button
              className={`px-1 py-2 text-left font-poppins ${
                activeTab === 'vault' ? 'text-primary font-semibold' : 'text-gray-700'
              }`}
              onClick={() => handleTabClick('vault')}
            >
              Recipe Vault
            </button>
            <button
              className={`px-1 py-2 text-left font-poppins ${
                activeTab === 'maker' ? 'text-primary font-semibold' : 'text-gray-700'
              }`}
              onClick={() => handleTabClick('maker')}
            >
              Recipe Maker
            </button>
            <button
              className={`px-1 py-2 text-left font-poppins ${
                activeTab === 'enhancer' ? 'text-primary font-semibold' : 'text-gray-700'
              }`}
              onClick={() => handleTabClick('enhancer')}
            >
              Recipe Enhancer
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
