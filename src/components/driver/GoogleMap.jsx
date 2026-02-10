/**
 * ParkHub - Google Maps Component
 * 
 * Interactive map with:
 * - Custom markers (color-coded by availability)
 * - Marker clustering
 * - Info windows
 * - User location
 * - Search target highlighting
 * - Hover/click synchronization with list
 * 
 * Note: This is a placeholder component. You'll need to:
 * 1. Install: npm install @react-google-maps/api
 * 2. Get Google Maps API key
 * 3. Enable: Maps JavaScript API, Places API, Geocoding API
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Navigation, MapPin, Plus, Minus, Locate } from 'lucide-react';
import './GoogleMap.css';

const GoogleMap = ({ 
  lots, 
  userLocation, 
  hoveredLotId, 
  selectedLotId,
  searchQuery,
  onMarkerClick 
}) => {
  
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  
  /* ==========================================================================
     HELPER: Get Marker Color by Availability
     ========================================================================== */
  
  const getMarkerColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#22c55e'; // Green
    if (percentage >= 25) return '#eab308'; // Amber
    return '#ef4444'; // Red
  };
  
  /* ==========================================================================
     RENDER PLACEHOLDER MAP (Until Google Maps API is integrated)
     ========================================================================== */
  
  return (
    <div className="google-map-container">
      {/* Map Controls */}
      <div className="map-controls">
        <button className="map-control-btn" title="Zoom in">
          <Plus size={20} />
        </button>
        <button className="map-control-btn" title="Zoom out">
          <Minus size={20} />
        </button>
        <button className="map-control-btn" title="Center on your location">
          <Locate size={20} />
        </button>
      </div>
      
      {/* Placeholder Map */}
      <div className="map-placeholder" ref={mapRef}>
        <div className="map-placeholder-content">
          <MapPin size={64} className="map-placeholder-icon" />
          <h3>Google Maps Integration</h3>
          <p>Map will be displayed here</p>
          <div className="map-placeholder-info">
            <p><strong>Setup Required:</strong></p>
            <ol>
              <li>Install: <code>npm install @react-google-maps/api</code></li>
              <li>Get Google Maps API key</li>
              <li>Enable APIs: Maps JavaScript, Places, Geocoding</li>
              <li>Add key to .env: <code>VITE_GOOGLE_MAPS_API_KEY</code></li>
            </ol>
          </div>
          
          {/* Mock Markers Visualization */}
          <div className="mock-markers">
            <p><strong>Parking Lots Found:</strong> {lots.length}</p>
            <div className="marker-legend">
              <div className="legend-item">
                <span className="legend-dot green"></span>
                <span>High Availability (&gt;50%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot amber"></span>
                <span>Medium Availability (25-50%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot red"></span>
                <span>Low Availability (&lt;25%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Window (appears when marker is clicked) */}
      {selectedMarker && (
        <div className="map-info-window">
          <button 
            className="info-close"
            onClick={() => setSelectedMarker(null)}
          >
            ×
          </button>
          <h4>{selectedMarker.name}</h4>
          <p>{selectedMarker.location}</p>
          <div className="info-stats">
            <span>🚗 {selectedMarker.available}/{selectedMarker.total}</span>
            <span>💰 KES {selectedMarker.hourlyRate}/hr</span>
          </div>
          <button 
            className="info-cta"
            onClick={() => onMarkerClick(selectedMarker.id)}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
  
  /* ==========================================================================
     ACTUAL IMPLEMENTATION (Uncomment when Google Maps API is ready)
     ========================================================================== */
  
  /*
  import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
  
  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };
  
  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };
  
  const onLoad = useCallback((map) => {
    setMap(map);
    
    // Fit bounds to show all markers
    if (lots.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      lots.forEach(lot => {
        bounds.extend(new window.google.maps.LatLng(
          lot.coordinates.lat,
          lot.coordinates.lng
        ));
      });
      if (userLocation) {
        bounds.extend(new window.google.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        ));
      }
      map.fitBounds(bounds);
    }
  }, [lots, userLocation]);
  
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  
  // Update map when hovered lot changes
  useEffect(() => {
    if (map && hoveredLotId) {
      const lot = lots.find(l => l.id === hoveredLotId);
      if (lot) {
        map.panTo(new window.google.maps.LatLng(
          lot.coordinates.lat,
          lot.coordinates.lng
        ));
      }
    }
  }, [hoveredLotId, map, lots]);
  
  return (
    <div className="google-map-container">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || { lat: -1.2921, lng: 36.8219 }}
          zoom={13}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* User Location Marker *\/}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          )}
          
          {/* Parking Lot Markers with Clustering *\/}
          <MarkerClusterer>
            {(clusterer) =>
              lots.map(lot => (
                <Marker
                  key={lot.id}
                  position={lot.coordinates}
                  clusterer={clusterer}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: lot.id === hoveredLotId ? 12 : 10,
                    fillColor: getMarkerColor(lot.available, lot.total),
                    fillOpacity: 1,
                    strokeColor: lot.id === selectedLotId ? '#3b82f6' : '#ffffff',
                    strokeWeight: lot.id === selectedLotId ? 3 : 2,
                  }}
                  onClick={() => {
                    setSelectedMarker(lot);
                    onMarkerClick(lot.id);
                  }}
                  animation={
                    lot.id === hoveredLotId 
                      ? window.google.maps.Animation.BOUNCE 
                      : null
                  }
                />
              ))
            }
          </MarkerClusterer>
          
          {/* Info Window *\/}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.coordinates}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="map-info-content">
                <h4>{selectedMarker.name}</h4>
                <p>{selectedMarker.location}</p>
                <div className="info-stats">
                  <span>🚗 {selectedMarker.available}/{selectedMarker.total}</span>
                  <span>💰 KES {selectedMarker.hourlyRate}/hr</span>
                  <span>⭐ {selectedMarker.rating}</span>
                </div>
                <button 
                  className="info-cta"
                  onClick={() => onMarkerClick(selectedMarker.id)}
                >
                  View Details
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
  */
};

export default GoogleMap;