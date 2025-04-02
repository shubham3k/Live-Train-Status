'use client'; // Required for hooks and Leaflet map

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';

// Dynamically import the Map component WITHOUT SSR
const TrainMap = dynamic(
  () => import('@/components/map/TrainMap').then((mod) => mod.TrainMap), // Adjust path if needed
  {
    ssr: false,
    loading: () => <p className="text-center mt-10 text-lg">Loading Map...</p>
  }
);

export default function TrackPage() {
  const params = useParams();
  const trainNumber = params?.trainNumber; // No type assertion needed

  const [trainData, setTrainData] = useState(null); // No type annotation
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // No type annotation

  useEffect(() => {
    if (trainNumber) {
      setIsLoading(true);
      setError(null);
      setTrainData(null);

      fetch(`/api/train/${trainNumber}`)
        .then(res => {
          if (!res.ok) {
             // Try to parse error message from API response body
            return res.json().then(err => { throw new Error(err.message || `Train ${trainNumber} not found or API error`) }).catch(() => {
                // Fallback if response body isn't JSON or has no message
                throw new Error(`API request failed with status ${res.status}`);
            });
          }
          return res.json();
        })
        .then((data) => { // No type annotation for data
          setTrainData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch train data:", err);
          setError(err.message || 'An unknown error occurred');
          setIsLoading(false);
        });
    } else {
        setIsLoading(false);
        setError("Train number not provided in URL.");
    }
  }, [trainNumber]);

  const pageTitle = trainData ? `Tracking ${trainData.trainName} (${trainNumber})` : `Tracking Train ${trainNumber || '...'}`;

  return (
    <>
      <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={`Live tracking for train ${trainNumber}`} />
      </Head>
      <div className="flex flex-col min-h-screen">
        <header className="p-4 bg-gray-800 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-semibold truncate">
               {isLoading ? 'Loading...' : trainData ? `${trainData.trainName} (${trainData.trainNumber})` : `Train ${trainNumber}`}
            </h1>
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-150 ease-in-out text-sm">
                ← Search Again
            </Link>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4">
          {isLoading && <p className="text-center mt-10 text-lg">Loading train details...</p>}
          {error && <p className="text-center mt-10 text-red-600 font-semibold">Error: {error}</p>}
          {!isLoading && !error && trainData && (
            <div className="border rounded-lg shadow-lg overflow-hidden">
              <TrainMap trainData={trainData} />
            </div>
          )}
           {!isLoading && !error && !trainData && trainNumber && !error &&(
                <p className="text-center mt-10 text-gray-600">No data could be loaded for train {trainNumber}.</p>
            )}
        </main>

        <footer className="p-4 bg-gray-200 text-center text-sm text-gray-600">
            Train Tracker © {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
}