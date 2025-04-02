'use client'; // <--- ADD THIS LINE AT THE VERY TOP

import { useEffect } from 'react';
import Link from 'next/link';

// Error components must be Client Components

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-red-50">
      <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong!</h2>
      <p className="text-red-600 mb-6">
        {/* Display a generic message or specific details from error if safe */}
        {error.message || 'An unexpected error occurred while loading train data.'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150"
        >
          Try again
        </button>
        <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-150">
          Go Home
        </Link>
      </div>
    </div>
  );
}