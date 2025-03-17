
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import TravelHeader from '@/components/TravelHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plane, Search } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!origin.trim()) {
      newErrors.origin = 'Origin is required';
    } else if (!/^[A-Z]{3}$/.test(origin)) {
      newErrors.origin = 'Must be a 3-letter airport code';
    }
    
    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
    } else if (!/^[A-Z]{3}$/.test(destination)) {
      newErrors.destination = 'Must be a 3-letter airport code';
    }
    
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }
    
    if (!returnDate) {
      newErrors.returnDate = 'Return date is required';
    } else if (departureDate && returnDate && returnDate < departureDate) {
      newErrors.returnDate = 'Return date must be after departure date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const params = new URLSearchParams();
      params.append('origin', origin);
      params.append('destination', destination);
      params.append('departureDate', departureDate ? format(departureDate, 'yyyy-MM-dd') : '');
      params.append('returnDate', returnDate ? format(returnDate, 'yyyy-MM-dd') : '');
      
      navigate(`/results?${params.toString()}`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-sky-100">
        <TravelHeader />
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Find Your Perfect Trip</h2>
            
            <div className="mb-4 px-1">
              <p className="text-xs text-muted-foreground mb-4">
                Please use 3-letter airport codes (e.g., SYD for Sydney, BKK for Bangkok).
                Dates must be in YYYY-MM-DD format. Return date must be after departure date.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Plane className="h-4 w-4 rotate-45 text-muted-foreground" />
                  <label htmlFor="origin" className="text-sm font-medium">Origin</label>
                </div>
                <Input
                  id="origin"
                  placeholder="Enter origin airport code (e.g., SYD)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  maxLength={3}
                  className={errors.origin ? "border-red-300" : ""}
                />
                {errors.origin && (
                  <p className="text-xs text-red-500 mt-1">{errors.origin}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Plane className="h-4 w-4 -rotate-45 text-muted-foreground" />
                  <label htmlFor="destination" className="text-sm font-medium">Destination</label>
                </div>
                <Input
                  id="destination"
                  placeholder="Enter destination airport code (e.g., BKK)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  maxLength={3}
                  className={errors.destination ? "border-red-300" : ""}
                />
                {errors.destination && (
                  <p className="text-xs text-red-500 mt-1">{errors.destination}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="departureDate" className="text-sm font-medium">Departure Date</label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !departureDate ? "text-muted-foreground" : ""
                      } ${errors.departureDate ? "border-red-300" : ""}`}
                    >
                      {departureDate ? (
                        format(departureDate, "yyyy-MM-dd")
                      ) : (
                        <span>Select departure date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.departureDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.departureDate}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="returnDate" className="text-sm font-medium">Return Date</label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !returnDate ? "text-muted-foreground" : ""
                      } ${errors.returnDate ? "border-red-300" : ""}`}
                    >
                      {returnDate ? (
                        format(returnDate, "yyyy-MM-dd")
                      ) : (
                        <span>Select return date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => date < new Date() || (departureDate && date < departureDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.returnDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.returnDate}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search Flights
              </Button>
            </form>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Home;
