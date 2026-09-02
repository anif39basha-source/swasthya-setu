import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LeafletMap = ({ facilities = [], userLocation = null, height = '500px' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const center = userLocation || (facilities[0] ? { lat: parseFloat(facilities[0].latitude), lng: parseFloat(facilities[0].longitude) } : { lat: 12.9716, lng: 77.5946 });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView([center.lat, center.lng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>',
          className: 'user-marker',
          iconSize: [16, 16]
        })
      }).addTo(map).bindPopup('Your Location');
    }

    // Add facility markers
    const bounds = [];
    if (userLocation) bounds.push([userLocation.lat, userLocation.lng]);

    facilities.forEach(facility => {
      if (facility.latitude && facility.longitude) {
        const color = facility.emergency_available ? '#dc2626' :
                     facility.type === 'DISTRICT_HOSPITAL' ? '#7c3aed' :
                     facility.type === 'CHC' ? '#16a34a' : '#0ea5e9';

        const icon = L.divIcon({
          html: `<div style="background: ${color}; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${facility.type === 'DISTRICT_HOSPITAL' ? 'DH' : facility.type === 'CHC' ? 'CH' : 'P'}</div>`,
          className: 'facility-marker',
          iconSize: [24, 24]
        });

        L.marker([parseFloat(facility.latitude), parseFloat(facility.longitude)], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="padding: 4px;">
              <strong>${facility.name}</strong><br>
              <small>${facility.type.replace('_', ' ')}</small><br>
              ${facility.distance ? `<small>📍 ${facility.distance.toFixed(1)} km</small><br>` : ''}
              <small>${facility.address || ''}</small>
            </div>
          `);

        bounds.push([parseFloat(facility.latitude), parseFloat(facility.longitude)]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [facilities, userLocation]);

  return <div ref={mapRef} style={{ height, width: '100%', borderRadius: '0.5rem' }} />;
};

export default LeafletMap;