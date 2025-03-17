
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TravelContextProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  originCity: string;
  destinationCity: string;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setOriginCity: (city: string) => void;
  setDestinationCity: (city: string) => void;
}

const TravelContext = createContext<TravelContextProps | undefined>(undefined);

export const TravelProvider = ({ children }: { children: ReactNode }) => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [originCity, setOriginCity] = useState<string>('');
  const [destinationCity, setDestinationCity] = useState<string>('');

  return (
    <TravelContext.Provider 
      value={{ 
        origin, 
        destination, 
        departureDate, 
        returnDate, 
        originCity,
        destinationCity,
        setOrigin, 
        setDestination, 
        setDepartureDate, 
        setReturnDate,
        setOriginCity,
        setDestinationCity
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
};
