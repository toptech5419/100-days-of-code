import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import TravelHeader from '@/components/TravelHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plane, Search, Loader2 } from 'lucide-react';
import { getLocationInfo } from '../services/api';

interface LocationSuggestion {
  iataCode: string;
  name: string;
  type: string; // CITY or AIRPORT
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedOriginIata, setSelectedOriginIata] = useState<string | null>(null);
  const [selectedDestinationIata, setSelectedDestinationIata] = useState<string | null>(null);
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [originError, setOriginError] = useState<string | null>(null);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [isOriginLoading, setIsOriginLoading] = useState(false);
  const [isDestinationLoading, setIsDestinationLoading] = useState(false);
  const [isDeparturePopoverOpen, setIsDeparturePopoverOpen] = useState(false);
  const [isReturnPopoverOpen, setIsReturnPopoverOpen] = useState(false);

  const fetchSuggestions = useCallback(
    async (query: string, isOrigin: boolean) => {
      if (query.length < 2) {
        if (isOrigin) {
          setOriginSuggestions([]);
          setOriginError(null);
          setIsOriginLoading(false);
        } else {
          setDestinationSuggestions([]);
          setDestinationError(null);
          setIsDestinationLoading(false);
        }
        return;
      }

      try {
        if (isOrigin) setIsOriginLoading(true);
        else setIsDestinationLoading(true);

        const response = await getLocationInfo(query);
        const suggestions = response.data
          .filter((loc: any) => loc.subType === 'CITY' || loc.subType === 'AIRPORT')
          .map((loc: any) => ({
            iataCode: loc.iataCode,
            name: loc.subType === 'CITY' ? loc.name : `${loc.name} (${loc.address.cityName})`,
            type: loc.subType,
          }));

        if (isOrigin) {
          setOriginSuggestions(suggestions);
          setOriginError(null);
          setIsOriginLoading(false);
        } else {
          setDestinationSuggestions(suggestions);
          setDestinationError(null);
          setIsDestinationLoading(false);
        }
      } catch (error) {
        console.error(`Error fetching ${isOrigin ? 'origin' : 'destination'} suggestions:`, error);
        if (isOrigin) {
          setOriginSuggestions([]);
          setOriginError('Unable to fetch origin suggestions. Please try again.');
          setIsOriginLoading(false);
        } else {
          setDestinationSuggestions([]);
          setDestinationError('Unable to fetch destination suggestions. Please try again.');
          setIsDestinationLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedOriginIata) {
      const timer = setTimeout(() => fetchSuggestions(origin, true), 300);
      return () => clearTimeout(timer);
    }
  }, [origin, fetchSuggestions, selectedOriginIata]);

  useEffect(() => {
    if (!selectedDestinationIata) {
      const timer = setTimeout(() => fetchSuggestions(destination, false), 300);
      return () => clearTimeout(timer);
    }
  }, [destination, fetchSuggestions, selectedDestinationIata]);

  const handleSuggestionSelect = (suggestion: LocationSuggestion, isOrigin: boolean) => {
    if (isOrigin) {
      setOrigin(suggestion.name);
      setSelectedOriginIata(suggestion.iataCode);
      setOriginSuggestions([]);
      setIsOriginFocused(false);
      setOriginError(null);
    } else {
      setDestination(suggestion.name);
      setSelectedDestinationIata(suggestion.iataCode);
      setDestinationSuggestions([]);
      setIsDestinationFocused(false);
      setDestinationError(null);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedOriginIata) newErrors.origin = 'Please select a valid origin city or airport';
    if (!selectedDestinationIata) newErrors.destination = 'Please select a valid destination city or airport';
    if (!departureDate) newErrors.departureDate = 'Departure date is required';
    if (!returnDate) newErrors.returnDate = 'Return date is required';
    else if (departureDate && returnDate && returnDate < departureDate)
      newErrors.returnDate = 'Return date must be after departure date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const params = new URLSearchParams();
      params.append('origin', selectedOriginIata!);
      params.append('destination', selectedDestinationIata!);
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
                Enter a city or airport name (e.g., Sydney, Sydney Kingsford Smith Airport). Select from suggestions to proceed.
                Dates must be in YYYY-MM-DD format. Return date must be after departure date.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Plane className="h-4 w-4 rotate-45 text-muted-foreground" />
                  <label htmlFor="origin" className="text-sm font-medium">Origin</label>
                </div>
                <div className="relative">
                  <Input
                    id="origin"
                    placeholder="Enter origin city or airport (e.g., Sydney)"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setSelectedOriginIata(null);
                    }}
                    onFocus={() => setIsOriginFocused(true)}
                    onBlur={() => setTimeout(() => setIsOriginFocused(false), 200)}
                    className={errors.origin ? 'border-red-300' : ''}
                  />
                  {isOriginLoading && (
                    <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {isOriginFocused && originSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-md">
                    {originSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.iataCode}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(suggestion, true)}
                      >
                        {suggestion.name} [{suggestion.iataCode}] - {suggestion.type}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
                {originError && <p className="text-xs text-red-500 mt-1">{originError}</p>}
              </div>

              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Plane className="h-4 w-4 -rotate-45 text-muted-foreground" />
                  <label htmlFor="destination" className="text-sm font-medium">Destination</label>
                </div>
                <div className="relative">
                  <Input
                    id="destination"
                    placeholder="Enter destination city or airport (e.g., Bangkok)"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setSelectedDestinationIata(null);
                    }}
                    onFocus={() => setIsDestinationFocused(true)}
                    onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
                    className={errors.destination ? 'border-red-300' : ''}
                  />
                  {isDestinationLoading && (
                    <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {isDestinationFocused && destinationSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-md">
                    {destinationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.iataCode}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(suggestion, false)}
                      >
                        {suggestion.name} [{suggestion.iataCode}] - {suggestion.type}
                      </li>
                    ))}
                  </ul>
                )}
                {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
                {destinationError && <p className="text-xs text-red-500 mt-1">{destinationError}</p>}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="departureDate" className="text-sm font-medium">Departure Date</label>
                </div>
                <Popover open={isDeparturePopoverOpen} onOpenChange={setIsDeparturePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !departureDate ? 'text-muted-foreground' : ''
                      } ${errors.departureDate ? 'border-red-300' : ''}`}
                    >
                      {departureDate ? format(departureDate, 'yyyy-MM-dd') : <span>Select departure date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => {
                        setDepartureDate(date);
                        setIsDeparturePopoverOpen(false); // Close on selection
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.departureDate && <p className="text-xs text-red-500 mt-1">{errors.departureDate}</p>}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="returnDate" className="text-sm font-medium">Return Date</label>
                </div>
                <Popover open={isReturnPopoverOpen} onOpenChange={setIsReturnPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !returnDate ? 'text-muted-foreground' : ''
                      } ${errors.returnDate ? 'border-red-300' : ''}`}
                    >
                      {returnDate ? format(returnDate, 'yyyy-MM-dd') : <span>Select return date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => {
                        setReturnDate(date);
                        setIsReturnPopoverOpen(false); // Close on selection
                      }}
                      disabled={(date) => date < new Date() || (departureDate && date < departureDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.returnDate && <p className="text-xs text-red-500 mt-1">{errors.returnDate}</p>}
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