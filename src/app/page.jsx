'use client'; // Needs client hooks for state and navigation

import Head from 'next/head'; // Still useful for page-specific head tags within client components
import { Meteors } from "@/components/ui/meteors";
import { SearchForm } from '@/components/SearchForm';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Live Train Status</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/map-2.jpg')`,
        }}
      >
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Indian Train Tracker
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Enter a train number to see its live location and route.
          </p>
          <SearchForm />
        </div>
        {/* <Meteors number={90} /> */}
      </div>
    </>
  );
}