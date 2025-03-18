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
import { searchFlights, searchHotels, getWeather, getLocationInfo } from '../services/api';
import { toast } from '@/components/ui/use-toast';

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
        const locationInfo = await getLocationInfo(destination);
        if (!locationInfo.data || locationInfo.data.length === 0) {
          throw new Error('Destination not found');
        }
        const primaryLocation = locationInfo.data[0];
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

        const weatherData = await getWeather({ lat, lon });
        setWeather({
          temp: weatherData.main.temp,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          city: weatherData.name,
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
        });

        const flightResponse = await searchFlights({
          origin,
          destination,
          departureDate,
          returnDate,
          adults: 1,
          nonStop: false,
        });
        setFlights(
          flightResponse.data.map((flight: any) => ({
            id: flight.id,
            airline: flight.validatingAirlineCodes[0],
            flightNumber: flight.itineraries[0].segments[0].number,
            departure: flight.itineraries[0].segments[0].departure.at.split('T')[1].slice(0, 5),
            arrival: flight.itineraries[0].segments[0].arrival.at.split('T')[1].slice(0, 5),
            duration: flight.itineraries[0].duration.replace('PT', '').toLowerCase(),
            price: parseFloat(flight.price.total),
          }))
        );

        const hotelResponse = await searchHotels({ cityCode });
        setHotels(
          hotelResponse.data.map((hotel: any) => ({
            id: hotel.hotelId,
            name: hotel.name,
            rating: parseFloat(hotel.rating) || 0,
            price: hotel.offers ? parseFloat(hotel.offers[0].price.total) : 0,
            image: hotel.media?.[0]?.uri || 'https://via.placeholder.com/300',
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading travel data",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadData();
  }, [origin, destination, departureDate, returnDate]);

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
            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Plane className="h-5 w-5 mr-2 text-primary" />
                Flights
              </h2>
              {flights.length > 0 ? (
                flights.map((flight) => (
                  <Card key={flight.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex justify-between">
                        <span>{flight.airline}</span>
                        <span className="text-primary">${flight.price.toFixed(2)}</span>
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
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No flights found for the selected route and dates.
                </p>
              )}
            </section>

            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Hotel className="h-5 w-5 mr-2 text-primary" />
                Hotels
              </h2>
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
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
                      <div className="flex items-center">{renderRatingStars(hotel.rating)}</div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="font-medium text-primary">
                        ${hotel.price ? hotel.price.toFixed(2) : 'N/A'}{' '}
                        <span className="text-xs text-muted-foreground">per night</span>
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No hotels found in the selected destination.
                </p>
              )}
            </section>

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
                        <Popup>{weather.city}</Popup>
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

            <section>
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <CloudSun className="h-5 w-5 mr-2 text-primary" />
                Weather
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{weather?.city || destination}</CardTitle>
                </CardHeader>
                {weather ? (
                  <CardContent className="text-center py-4">
                    <CloudSun className="h-16 w-16 mx-auto text-yellow-400" />
                    <p className="text-3xl font-bold mt-2">{weather.temp}°C</p>
                    <p className="text-muted-foreground">{weather.description}</p>
                  </CardContent>
                ) : (
                  <CardContent className="text-center py-4">
                    <p className="text-muted-foreground">Unable to fetch weather data for {destination}.</p>
                  </CardContent>
                )}
              </Card>
            </section>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Results;