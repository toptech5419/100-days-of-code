import { toast } from "@/components/ui/use-toast";

// API Base URLs
const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_BASE_URL = "https://test.api.amadeus.com";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

// API Keys from environment variables
const AMADEUS_CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID as string;
const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET as string;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;

// Types
export interface FlightQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  nonStop?: boolean;
}

export interface HotelQuery {
  cityCode: string;
  radius?: number;
  radiusUnit?: string;
}

export interface WeatherQuery {
  lat: number;
  lon: number;
  units?: string;
}

// Token management
let amadeusToken: string | null = null;
let tokenExpiry: number | null = null;

const getAmadeusToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (amadeusToken && tokenExpiry && Date.now() < tokenExpiry) {
    return amadeusToken;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", AMADEUS_CLIENT_ID);
    params.append("client_secret", AMADEUS_CLIENT_SECRET);

    const response = await fetch(AMADEUS_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error("Failed to get Amadeus token");
    }

    const data = await response.json();
    amadeusToken = data.access_token;
    // Set expiry time (subtract 5 minutes to be safe)
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 300000;
    return amadeusToken;
  } catch (error) {
    console.error("Error getting Amadeus token:", error);
    throw error;
  }
};

// API Functions
export const searchFlights = async (query: FlightQuery) => {
  try {
    const token = await getAmadeusToken();
    const { origin, destination, departureDate, returnDate, adults = 1, nonStop = false } = query;

    const params = new URLSearchParams({
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      adults: adults.toString(),
      nonStop: nonStop.toString(),
      max: "20",
    });

    if (returnDate) {
      params.append("returnDate", returnDate);
    }

    const response = await fetch(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch flights");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching flights:", error);
    toast({
      title: "Error fetching flights",
      description: "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};

export const searchHotels = async (query: HotelQuery) => {
  try {
    const token = await getAmadeusToken();
    const { cityCode, radius = 5, radiusUnit = "KM" } = query;

    const params = new URLSearchParams({
      cityCode: cityCode.toUpperCase(),
      radius: radius.toString(),
      radiusUnit,
      hotelSource: "ALL",
    });

    const response = await fetch(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching hotels:", error);
    toast({
      title: "Error fetching hotels",
      description: "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};

export const getWeather = async (query: WeatherQuery) => {
  try {
    const { lat, lon, units = "metric" } = query;
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      units,
      appid: WEATHER_API_KEY,
    });

    const response = await fetch(`${WEATHER_BASE_URL}/weather?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    toast({
      title: "Error fetching weather data",
      description: "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};

// For airport/city information lookup
export const getLocationInfo = async (query: string) => {
  try {
    const token = await getAmadeusToken();
    const params = new URLSearchParams({
      keyword: query.toUpperCase(),
      subType: "CITY,AIRPORT",
    });

    const response = await fetch(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location information");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching location info:", error);
    toast({
      title: "Error fetching location information",
      description: "Please try again later",
      variant: "destructive",
    });
    throw error;
  }
};