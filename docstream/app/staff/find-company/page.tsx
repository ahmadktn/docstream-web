"use client";

import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function FindCompany() {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();
  const [stationName, setStationName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && (!accessToken || !user)) {
      router.push('/login');
    }
  }, [accessToken, user, isLoading, router]);

  const handleSearch = async () => {
    if (!stationName.trim()) {
      alert("Please enter a station name");
      return;
    }

    if (!accessToken || !user) {
      alert("Please login to search for stations");
      router.push('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Here you would make your API call to search for stations
      // Example:
      // const response = await fetch(`http://127.0.0.1:8000/api/v1/stations/?search=${stationName}`, {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`
      //   }
      // });
      
      // For now, simulate API call
      setTimeout(() => {
        alert(`Searching for station: ${stationName}\n\nThis would make an authenticated API call with your token.`);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Search error:', error);
      alert("Failed to search. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] px-4">
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!accessToken || !user) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* User Info Header */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Station Finder</h2>
            <p className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-green-700">{user.staff_id}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Role: {user.role} | Dept: {user.department}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="station-search" className="block text-sm font-medium text-gray-700 mb-2 text-left">
              Station Name
            </label>
            <input
              id="station-search"
              type="text"
              placeholder="Enter station name..."
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-[15px] outline-none focus:border-green-700 focus:bg-white focus:ring-2 focus:ring-green-100 transition-colors"
              disabled={loading}
            />
          </div>

          <button 
            onClick={handleSearch}
            disabled={loading || !stationName.trim()}
            className="w-full bg-green-700 text-white p-3 rounded-md text-[15px] font-medium cursor-pointer flex items-center justify-center gap-2 transition hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                Search <Search size={18} />
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            Search for stations by name. You must be logged in to use this feature.
          </p>
        </div>
      </div>
    </div>
  );
}