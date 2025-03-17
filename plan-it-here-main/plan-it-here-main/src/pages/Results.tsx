import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import TravelHeader from '@/components/TravelHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowLeft, Plane, Hotel, CloudSun, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getLocationInfo, getWeather } from '../services/api';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
}

interface HotelInfo {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
  lat: number;
  lon: number;
}

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<HotelInfo[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';

  useEffect(() => {
    const loadData = async () => {
      try {
        // Step 1: Fetch location info for the destination IATA code
        const locationInfo = await getLocationInfo(destination);
        if (!locationInfo.data || locationInfo.data.length === 0) {
          throw new Error('Destination not found');
        }
        const primaryLocation = locationInfo.data[0];

        // Step 2: Extract coordinates and city code based on location type
        let lat: number;
        let lon: number;
        let cityCode: string;

        if (primaryLocation.subType === 'CITY') {
          lat = primaryLocation.geoCode.latitude;
          lon = primaryLocation.geoCode.longitude;
          cityCode = primaryLocation.iataCode;
        } else if (primaryLocation.subType === 'AIRPORT') {
          lat = primaryLocation.geoCode.latitude;
          lon = primaryLocation.geoCode.longitude;
          cityCode = primaryLocation.address.cityCode;
        } else {
          throw new Error('Unsupported location type');
        }

        // Step 3: Fetch weather data using coordinates
        const weatherData = await getWeather({ lat, lon });
        setWeather({
          temp: weatherData.main.temp,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          city: weatherData.name, // City name from OpenWeatherMap
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
        });

        // Mock flights data (replace with real API call later)
        setFlights([
          {
            id: '1',
            airline: 'Air Pacific',
            flightNumber: 'AP284',
            departure: '08:45',
            arrival: '14:20',
            duration: '5h 35m',
            price: 450,
          },
          {
            id: '2',
            airline: 'JetStream',
            flightNumber: 'JS105',
            departure: '10:15',
            arrival: '16:00',
            duration: '5h 45m',
            price: 389,
          },
          {
            id: '3',
            airline: 'Global Airways',
            flightNumber: 'GA512',
            departure: '14:30',
            arrival: '20:05',
            duration: '5h 35m',
            price: 520,
          },
        ]);

        // Mock hotels data (replace with real API call later using cityCode)
        setHotels([
          {
            id: '1',
            name: 'Grand Plaza Hotel',
            rating: 4.5,
            price: 220,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300',
          },
          {
            id: '2',
            name: 'Sunset Resort & Spa',
            rating: 5,
            price: 350,
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=300',
          },
          {
            id: '3',
            name: 'City Center Inn',
            rating: 3.5,
            price: 120,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=300',
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [destination]);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  // Fix Leaflet default marker icon issue
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <LoadingSpinner size="lg" message="Searching for the best travel options..." />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <TravelHeader minimal />

        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => navigate('/home')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <h1 className="text-2xl font-bold">
                Trip to {destination} from {origin}
              </h1>
              <p className="text-muted-foreground">{departureDate} - {returnDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Flights Section */}
            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Plane className="h-5 w-5 mr-2 text-primary" />
                Flights
              </h2>
              <div className="space-y-4">
                {flights.map((flight) => (
                  <Card key={flight.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex justify-between">
                        <span>{flight.airline}</span>
                        <span className="text-primary">${flight.price}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground mb-1">Flight {flight.flightNumber}</p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{flight.departure}</p>
                          <p className="text-xs text-muted-foreground">{origin}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">{flight.duration}</p>
                          <div className="relative w-20 h-px bg-gray-300 my-1">
                            <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{flight.arrival}</p>
                          <p className="text-xs text-muted-foreground">{destination}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Hotels Section */}
            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Hotel className="h-5 w-5 mr-2 text-primary" />
                Hotels
              </h2>
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <Card key={hotel.id}>
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{hotel.name}</CardTitle>
                      <div className="flex items-center">
                        {renderRatingStars(hotel.rating)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="font-medium text-primary">${hotel.price} <span className="text-xs text-muted-foreground">per night</span></p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Map Section */}
            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Map
              </h2>
              <Card>
                <CardContent className="p-0">
                  {weather && weather.lat && weather.lon ? (
                    <MapContainer
                      center={[weather.lat, weather.lon]}
                      zoom={10}
                      style={{ height: '300px', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[weather.lat, weather.lon]}>
                        <Popup>{weather.city}</Popup> {/* Display city name */}
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <p className="text-center text-muted-foreground p-4">
                        Unable to load map for {destination}.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Weather Section */}
            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <CloudSun className="h-5 w-5 mr-2 text-primary" />
                Weather
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{weather?.city}</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-4">
                  <CloudSun className="h-16 w-16 mx-auto text-yellow-400" />
                  <p className="text-3xl font-bold mt-2">{weather?.temp}°C</p>
                  <p className="text-muted-foreground">{weather?.description}</p>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Results;