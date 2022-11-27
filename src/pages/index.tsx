import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "../utils/trpc";

interface City {
  id: number;
  name: string;
  state?: string;
  country: string;
  coord: Location;
}

const WeatherMap = {
  Clear: "/clear.jpg",
  Clouds: "/cloudy.jpg",
  Rain: "/rain.jpg",
  Snow: "/snow.jpg",
  Thunderstorm: "/storm.jpg",
  Drizzle: "/rain.jpg",
  Mist: "/rain.jpg",
} as const;

const getImageUrlFromWeather = (weather?: keyof typeof WeatherMap) => {
  if (!weather) return "/default.jpg";

  const url = WeatherMap[weather];
  if (!url) return "/default.jpg";

  return url;
};

interface Location {
  lon: number;
  lat: number;
}

const getCurrentLocation = async () =>
  new Promise<Location | null>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else {
      reject(null);
    }
  });

const Home: NextPage = () => {
  // const { data } = trpc.location.getAll.useQuery();

  const createLocation = trpc.location.create.useMutation();

  const [location, setLocation] = useState<Location | null>(null);
  const [weatherImageUrl, setWeatherImageUrl] = useState<string | null>(null);

  const { data: currentWeather } = trpc.temperature.get.useQuery({
    lat: location?.lat,
    lon: location?.lon,
  });

  const handleToggleLocation = async () => {
    if (location) {
      return setLocation(null);
    }

    const currentLocation = await getCurrentLocation();
    if (!currentLocation) return console.log("Location not found");

    setLocation(currentLocation);
  };

  useEffect(() => {
    if (!currentWeather || !location || !currentWeather.weather[0]) return;
    createLocation.mutateAsync({
      lat: location.lat,
      lon: location.lon,
      temp: currentWeather.main.temp,
      description: currentWeather.weather[0].description,
    });
  }, [currentWeather, location]);

  useEffect(() => {
    if (!currentWeather) return setWeatherImageUrl(null);

    const weatherUrl = getImageUrlFromWeather(
      currentWeather.weather[0]?.main as keyof typeof WeatherMap
    );

    setWeatherImageUrl(weatherUrl);
  }, [currentWeather]);

  const celsiusTemperature = useMemo(() => {
    return currentWeather?.main.temp ? currentWeather.main.temp - 273.15 : null;
  }, [currentWeather]);

  return (
    <>
      <Head>
        <title>WeatherApp-t3</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <main className="absolute inset-0 flex flex-col">
        <Image
          src={weatherImageUrl || "/default.jpg"}
          objectFit="cover"
          layout="fill"
          alt="background weather image"
          className="absolute inset-0 -z-10"
        />
        <div className="flex justify-between p-2">
          <Link href="/admin" className="underline hover:text-red-700">
            Admin Page
          </Link>
          <button
            className="rounded-full bg-purple-500 py-2 px-4 font-bold text-white duration-75 hover:bg-purple-700"
            onClick={handleToggleLocation}
          >
            {location ? "Hide location" : "Location weather"}
          </button>
        </div>
        {celsiusTemperature && (
          <div className="flex grow items-center justify-center">
            <div className="h-32 rounded-3xl bg-gray-300 p-4 shadow-lg duration-75">
              <h1 className="mb-8 text-center text-4xl font-extrabold">
                {celsiusTemperature && `${celsiusTemperature.toFixed(2)}°C`}
              </h1>
              <h2 className="mb-8 text-center text-2xl font-bold">
                {currentWeather?.weather[0]?.description}
              </h2>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
