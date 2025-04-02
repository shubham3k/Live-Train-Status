import { NextRequest, NextResponse } from 'next/server';

// --- MOCK DATA ---
// (Same mock data as before)
const mockTrainDataStore = {
    '12345': { // Example Train 1
        trainNumber: '12345',
        trainName: 'Example Express',
        route: [
          { name: 'Start City', lat: 28.6139, lng: 77.2090 }, // Delhi (example)
          { name: 'Mid Junction', lat: 22.5726, lng: 88.3639 }, // Kolkata (example)
          { name: 'End City', lat: 19.0760, lng: 72.8777 }   // Mumbai (example)
        ],
        currentLocation: { lat: 25.5941, lng: 85.1376 }, // Somewhere in between (Patna example)
        lastUpdated: new Date().toISOString(),
      },
      '54321': { // Example Train 2
        trainNumber: '54321',
        trainName: 'Another Train',
        route: [
           { name: 'South Station', lat: 13.0827, lng: 80.2707 }, // Chennai
           { name: 'North Hub', lat: 28.6139, lng: 77.2090 }, // Delhi
        ],
        currentLocation: { lat: 20.9517, lng: 85.0985 }, // Somewhere else
        lastUpdated: new Date().toISOString(),
      }
};
// --- END MOCK DATA ---

// Function to simulate getting the latest location
const getMockCurrentLocation = (trainNumber) => {
   const train = mockTrainDataStore[trainNumber];
   if (!train) return null;

   const newLat = train.currentLocation.lat + (Math.random() - 0.5) * 0.05;
   const newLng = train.currentLocation.lng + (Math.random() - 0.5) * 0.05;

   mockTrainDataStore[trainNumber].currentLocation = { lat: newLat, lng: newLng };
   mockTrainDataStore[trainNumber].lastUpdated = new Date().toISOString();

   return {
       lat: mockTrainDataStore[trainNumber].currentLocation.lat,
       lng: mockTrainDataStore[trainNumber].currentLocation.lng,
       lastUpdated: mockTrainDataStore[trainNumber].lastUpdated
    };
}

// Handler for GET requests
export async function GET(request, { params }) { // Removed type annotations
  const trainNumber = await params.trainNumber;
  const searchParams = request.nextUrl.searchParams;
  const locationOnly = searchParams.get('locationOnly') === 'true';

  if (locationOnly) {
    const currentLocationData = getMockCurrentLocation(trainNumber);
    if (currentLocationData) {
      return NextResponse.json(currentLocationData);
    } else {
      return NextResponse.json({ message: 'Train location not found' }, { status: 404 });
    }
  } else {
    const trainDetails = mockTrainDataStore[trainNumber];
    if (trainDetails) {
       getMockCurrentLocation(trainNumber); // Update location state
       return NextResponse.json({ ...mockTrainDataStore[trainNumber] });
    } else {
       return NextResponse.json({ message: 'Train details not found' }, { status: 404 });
    }
  }
}