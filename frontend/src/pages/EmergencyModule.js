import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const EmergencyModule = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation) loadEmergencyFacilities();
  }, [userLocation]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 12.9716, lng: 77.5946 }),
      { timeout: 5000 }
    );
  };

  const loadEmergencyFacilities = async () => {
    try {
      const response = await axios.get(`/facilities/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=100`);
      const emergency = (response.data.data || []).filter(f => f.emergency_available);
      setFacilities(emergency);
    } catch (error) {
      console.error('Failed to load emergency facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Emergency Header */}
      <div className="emergency-gradient rounded-2xl p-6 text-white text-center">
        <div className="text-5xl mb-3">🚨</div>
        <h1 className="text-3xl font-bold mb-2">Emergency Assistance</h1>
        <p className="text-red-100">Quick access to emergency services and facilities</p>
      </div>

      {/* Emergency Call Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <a
          href="tel:108"
          className="bg-red-600 text-white rounded-2xl p-6 text-center hover:bg-red-700 pulse-emergency"
        >
          <div className="text-4xl mb-2">📞</div>
          <div className="text-2xl font-bold">108</div>
          <div className="text-sm">Ambulance Service</div>
        </a>
        <a
          href="tel:112"
          className="bg-red-600 text-white rounded-2xl p-6 text-center hover:bg-red-700"
        >
          <div className="text-4xl mb-2">🚨</div>
          <div className="text-2xl font-bold">112</div>
          <div className="text-sm">Emergency Services</div>
        </a>
      </div>

      {/* First Aid Guidance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3">⛑️ First Aid Quick Reference</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-800">Bleeding</h3>
            <p className="text-sm text-red-700">Apply firm pressure with clean cloth. Elevate the wound if possible.</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-800">Unconsciousness</h3>
            <p className="text-sm text-red-700">Place in recovery position. Check breathing. Do not give food/water.</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-800">Burns</h3>
            <p className="text-sm text-red-700">Cool with running water for 10-20 minutes. Cover with clean cloth.</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-800">Choking</h3>
            <p className="text-sm text-red-700">5 back blows, 5 abdominal thrusts. Call emergency if severe.</p>
          </div>
        </div>
      </div>

      {/* Nearest Emergency Facilities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🏥 Nearest Emergency Facilities</h2>
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin text-4xl">🔄</div>
          </div>
        ) : facilities.length > 0 ? (
          <div className="space-y-3">
            {facilities.map(facility => (
              <div key={facility.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{facility.name}</h3>
                  <span className="status-badge status-emergency">EMERGENCY</span>
                </div>
                <p className="text-sm text-gray-600">{facility.address}</p>
                <p className="text-sm text-gray-500 mt-1">📍 {facility.distance?.toFixed(1)} km away</p>
                <div className="mt-3 flex space-x-2">
                  <a
                    href={`tel:${facility.phone}`}
                    className="flex-1 bg-red-500 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                  >
                    🗺️ Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No emergency facilities found nearby</p>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Important:</strong> This application does not provide medical diagnosis. In case of emergency, call 108/112 or visit the nearest hospital immediately.
        </p>
      </div>
    </div>
  );
};

export default EmergencyModule;