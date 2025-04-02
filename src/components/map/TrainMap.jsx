'use client'; // Must be a client component

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library

// --- Leaflet Icon Fix ---
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported

if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl; // No TS error to ignore now
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
}
// --- End Icon Fix ---

// --- Custom Train Icon ---
const trainIcon = new L.Icon({
    iconUrl: '/train-icon.png', // Ensure this exists in /public
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// --- Helper Component to Adjust Map View ---
function ChangeView({ center, zoom, bounds }) { // Removed type annotations
    const map = useMap();
    useEffect(() => {
        if (bounds) {
             map.fitBounds(bounds, { padding: [50, 50] }); // Add padding
        } else {
            map.setView(center, zoom || 13);
        }
    }, [center, zoom, bounds, map]);
    return null;
}

// --- Main Map Component ---
export function TrainMap({ trainData }) { // Removed prop type annotation
    const [currentPosition, setCurrentPosition] = useState([ // No type annotation
        trainData.currentLocation.lat,
        trainData.currentLocation.lng
    ]);
    const [lastUpdated, setLastUpdated] = useState(trainData.lastUpdated); // No type annotation
    const [mapBounds, setMapBounds] = useState(undefined); // No type annotation

    const routeCoordinates = trainData.route.map(station => [station.lat, station.lng]); // No type annotation

    // Calculate bounds on initial load or when route changes
    useEffect(() => {
      if (routeCoordinates && routeCoordinates.length > 0) {
          const bounds = L.latLngBounds(routeCoordinates);
          setMapBounds(bounds);
      } else {
          setMapBounds(undefined);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainData.route]); // Dependencies might need eslint comment if routeCoordinates isn't stable


    // --- Polling for Live Location ---
    useEffect(() => {
        if (!trainData?.trainNumber) return;

        const intervalId = setInterval(async () => {
          try {
            console.log(`Polling for location: ${trainData.trainNumber}`);
            const response = await fetch(`/api/train/${trainData.trainNumber}?locationOnly=true`);
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({message: 'Failed to fetch location'}));
                throw new Error(errorData.message || 'Failed to fetch location');
            }
            const newLocationData = await response.json(); // No type annotation
            console.log("Fetched new location:", newLocationData);

            if (newLocationData && typeof newLocationData.lat === 'number' && typeof newLocationData.lng === 'number') {
                setCurrentPosition([newLocationData.lat, newLocationData.lng]);
                setLastUpdated(newLocationData.lastUpdated);
            } else {
                 console.warn("Received invalid location data:", newLocationData);
            }

          } catch (error) {
            console.error("Error fetching live location:", error);
          }
        }, 7000); // Poll every 7 seconds

        return () => {
            console.log(`Clearing interval for ${trainData.trainNumber}`);
            clearInterval(intervalId);
        };

    }, [trainData?.trainNumber]);
    // --- End Polling ---

    const railwayTrackStyle = {
        color: '#4A5568',
        weight: 4,
        opacity: 0.8,
    };

    const startPoint = routeCoordinates.length > 0 ? routeCoordinates[0] : undefined;
    const endPoint = routeCoordinates.length > 1 ? routeCoordinates[routeCoordinates.length - 1] : undefined;

    return (
        <MapContainer
          center={currentPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="h-[75vh] md:h-[80vh] w-full z-0"
        >
          <ChangeView center={currentPosition} bounds={mapBounds} />

          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routeCoordinates.length > 0 && (
            <Polyline
              pathOptions={railwayTrackStyle}
              positions={routeCoordinates}
            />
          )}

           {startPoint && (
              <Marker position={startPoint}>
                <Popup>{`Start: ${trainData.route[0].name}`}</Popup>
              </Marker>
            )}
            {endPoint && (
                <Marker position={endPoint}>
                    <Popup>{`End: ${trainData.route[trainData.route.length - 1].name}`}</Popup>
                </Marker>
            )}

          <Marker
            position={currentPosition}
            icon={trainIcon}
          >
            <Popup>
              <div className="text-sm">
                <span className="font-bold">{trainData.trainName} ({trainData.trainNumber})</span><br />
                Lat: {Array.isArray(currentPosition) ? currentPosition[0].toFixed(4) : 'N/A'}, Lng: {Array.isArray(currentPosition) ? currentPosition[1].toFixed(4) : 'N/A'} <br />
                <span className="text-xs text-gray-500">Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      );
}