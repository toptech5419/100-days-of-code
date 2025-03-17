import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/home');
  };

  return (
    <PageTransition>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 p-4">
        <div className="flex flex-col items-center text-center">
          <Plane 
            size={64} 
            className="text-primary mb-8 animate-bounce" 
          />
          <h1 className="text-3xl font-bold mb-6 text-primary">TravelPlanner</h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md">
            TravelPlanner helps you plan your trips by providing the best flight options, hotel recommendations, weather forecasts, and an interactive map for your destination. Start your journey with us!
          </p>
          <Button 
            onClick={handleProceed} 
            className="bg-primary text-white px-6 py-2 rounded-md shadow-md hover:bg-primary-dark transition-colors"
          >
            Get Started
          </Button>
        </div>
        
        <footer className="fixed bottom-4 text-xs text-gray-400">
          Built by Toptech
        </footer>
      </div>
    </PageTransition>
  );
};

export default Welcome;