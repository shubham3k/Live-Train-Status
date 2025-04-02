'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchForm() {
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
      <div className="relative p-6 backdrop-blur-xl bg-white/10 rounded-xl border border-white/30 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl z-0"></div>
        <form onSubmit={handleSubmit} className="relative z-10">
          <h2 className="text-xl font-medium text-white mb-4">Find Your Train</h2>
          <div className="relative">
            <input
              type="text"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="Enter train number..."
              className="w-full px-5 py-4 rounded-lg bg-white/20 backdrop-blur-sm 
                      border border-white/30 text-white placeholder-white/70 
                      focus:outline-none focus:ring-2 focus:ring-white/50
                      transition-all duration-300 text-lg"
            />
            <button
              type="submit"
              disabled={isLoading || !trainNumber.trim()}
              className="mt-4 w-full px-5 py-3 rounded-lg
                      bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600/90 hover:to-indigo-600/90
                      text-white font-medium text-lg shadow-lg
                      transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:from-blue-600/50 disabled:to-indigo-600/50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                "Find Train"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}