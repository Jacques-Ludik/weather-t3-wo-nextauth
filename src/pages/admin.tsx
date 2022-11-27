import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Admin = () => {
  const { data } = trpc.location.getAll.useQuery();
  return (
    <>
      <Head>
        <title>WeatherApp-t3-wo-nextAuth</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>
      <main className="mx-auto max-w-7xl p-6">
        <div className="flex justify-between p-2">
          <Link href="/" className="underline hover:text-red-700">
            Main Page
          </Link>
        </div>
        {/*table to display all locations*/}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Longitude</th>
              <th className="px-4 py-2">Latitude</th>
              <th className="px-4 py-2">Temperature</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((location) => (
              <tr key={location.id}>
                <td className="border px-4 py-2">{location.lon.toFixed(2)}</td>
                <td className="border px-4 py-2">{location.lat.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  {(location.temp - 273.15).toFixed(2)}
                </td>
                <td className="border px-4 py-2">{location.description}</td>
                <td className="border px-4 py-2">
                  {/* format date to display day and time */}
                  {location.createdAt.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default Admin;
