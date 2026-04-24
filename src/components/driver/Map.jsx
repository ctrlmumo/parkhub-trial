import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Enforce CSS at the component level
import './map.css';

// Fix for missing default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Custom Hook to safely move the map and fix the "Gray Tile" loading bug
 */
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  // Safely extract coordinates
  const lat = center?.[0];
  const lng = center?.[1];

  useEffect(() => {
    // 1. Force Leaflet to recalculate container size (Fixes the incomplete loading)
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // 2. Safely pan the camera only if valid coordinates exist
    if (typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng)) {
      // setView is much more stable than flyTo and prevents the "floating" bug
      map.setView([lat, lng], zoom, { animate: true });
    }
  }, [lat, lng, zoom, map]); 
  
  return null;
};

const ParkingMap = ({ lots = [], userLocation, hoveredLotId, selectedLotId, onMarkerClick }) => {
  const defaultCenter = [-1.2921, 36.8219]; // Nairobi CBD
  
  let activeCenter = defaultCenter;
  let activeZoom = 13;

  // Prioritize clicked lot, then hovered lot, then user location
  const focusLotId = selectedLotId;

  if (focusLotId) {
    const focusLot = lots.find(l => l.id === focusLotId);
    if (focusLot?.coordinates?.lat && focusLot?.coordinates?.lng) {
      activeCenter = [focusLot.coordinates.lat, focusLot.coordinates.lng];
      activeZoom = 16; // Zoom in close when examining a specific lot
    }
  } else if (userLocation?.lat && userLocation?.lng) {
    activeCenter = [userLocation.lat, userLocation.lng];
    activeZoom = 14;
  }

  return (
    <div className="leaflet-wrapper">
      <MapContainer 
        center={activeCenter} 
        zoom={activeZoom} 
        scrollWheelZoom={true}
      >
        <MapUpdater center={activeCenter} zoom={activeZoom} />
        
        {/* OpenStreetMap Free Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Parking Lot Markers */}
        {lots.map((lot) => {
          const isHoveredOrSelected = lot.id === hoveredLotId || lot.id === selectedLotId;
          
          // Color based on availability
          const percentage = (lot.available / lot.total) * 100;
          let color = '#ef4444'; // Red
          if (percentage > 50) color = '#22c55e'; // Green
          else if (percentage >= 25) color = '#eab308'; // Amber

          return (
            <Marker
              key={lot.id}
              position={[lot.coordinates.lat, lot.coordinates.lng]}
              eventHandlers={{
                click: () => onMarkerClick(lot.id),
              }}
              icon={L.divIcon({
                className: 'custom-lot-marker',
                html: `
                  <div style="
                    background-color: ${color}; 
                    width: ${isHoveredOrSelected ? '24px' : '16px'}; 
                    height: ${isHoveredOrSelected ? '24px' : '16px'}; 
                    border-radius: 50%; 
                    border: 2px solid white; 
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    transition: all 0.2s ease;
                  "></div>
                `,
                iconSize: isHoveredOrSelected ? [24, 24] : [16, 16],
                iconAnchor: isHoveredOrSelected ? [12, 12] : [8, 8]
              })}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{lot.name}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>{lot.location}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>🚗 {lot.available}/{lot.total}</span>
                    <span style={{ fontWeight: 'bold' }}>KES {lot.hourlyRate}/hr</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;