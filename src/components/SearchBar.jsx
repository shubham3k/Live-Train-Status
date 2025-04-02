'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [trainNumber, setTrainNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!trainNumber.trim()) return;
    
    setIsLoading(true);
    // Redirect to the train tracking page
    router.push(`/track/${trainNumber}`);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            placeholder="Enter train number..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 
                     text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40
                     transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isLoading || !trainNumber.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md
                     bg-white/20 hover:bg-white/30 text-white font-medium
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 