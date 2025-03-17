
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

interface TravelHeaderProps {
  minimal?: boolean;
}

const TravelHeader: React.FC<TravelHeaderProps> = ({ minimal = false }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/home" 
          className="flex items-center space-x-2 group"
        >
          <Plane 
            size={28} 
            className="text-primary transition-transform group-hover:translate-x-1" 
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">TravelPlanner</h1>
            {!minimal && <p className="text-xs text-muted-foreground">Plan Your Next Adventure</p>}
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/home" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Search
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Destinations
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Tips
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Support
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default TravelHeader;
