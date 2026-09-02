import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../services/api';

const FacilityDetails = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadFacility();
  }, [id]);

  const loadFacility = async () => {
    try {
      const response = await axios.get(`/facilities/${id}`);
      setFacility(response.data.data);
    } catch (error) {
      console.error('Failed to load facility:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">🔄</div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Facility Not Found</h2>
        <p className="text-gray-500">The facility you're looking for doesn't exist.</p>
        <Link to="/healthcare" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
          Back to Facilities →
        </Link>
      </div>
    );
  }

  const statusBadge = facility.emergency_available ? (
    <span className="status-badge status-open">Open</span>
  ) : (
    <span className="status-badge status-limited">Limited Service</span>
  );

  const hours = `${facility.opening_time || '08:00'} - ${facility.closing_time || '20:00'}`;

  return (
    <div className="space-y-4">
      <Link to="/healthcare" className="inline-block text-sm text-gray-500 hover:text-gray-700">← Back to Facilities</Link>

      {/* Header Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{facility.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{facility.type.replace('_', ' ')}</p>
          </div>
          {statusBadge}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">📍 Distance</p>
            <p className="font-medium text-gray-800">{facility.distance?.toFixed(1) || 'N/A'} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">👨‍⚕️ Doctors</p>
            <p className="font-medium text-gray-800">{facility.available_doctors || 0} Available</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">🕐 Hours</p>
            <p className="font-medium text-gray-800">{hours}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">📞 Phone</p>
            <p className="font-medium text-gray-800">{facility.phone || 'N/A'}</p>
          </div>
        </div>

        <p className="text-gray-600">{facility.address}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Link to={`/book-appointment?facility=${facility.id}`} className="bg-primary-500 text-white py-3 rounded-lg text-center font-medium hover:bg-primary-600">
          Book Appointment
        </Link>
        <button className="bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600">
          Get Directions
        </button>
        <a href={`tel:${facility.phone}`} className="bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600">
          Call Facility
        </a>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {['details', 'doctors', 'services', 'medicines'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Facility Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>📍 <strong>Address:</strong> {facility.address}</p>
                <p>📞 <strong>Phone:</strong> {facility.phone}</p>
                <p>📧 <strong>Email:</strong> {facility.email || 'Not provided'}</p>
                <p>🕐 <strong>Hours:</strong> {hours}</p>
                <p>🚑 <strong>Emergency:</strong> {facility.emergency_available ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Available Doctors</h3>
              {facility.doctors?.length > 0 ? (
                <div className="space-y-3">
                  {facility.doctors.map(doctor => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Dr. {doctor.name}</h4>
                        <p className="text-sm text-gray-500">{doctor.department}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${doctor.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {doctor.is_available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No doctors listed</p>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {facility.services?.map((service, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'medicines' && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Medicine Availability</h3>
              {facility.medicines?.length > 0 ? (
                <div className="space-y-2">
                  {facility.medicines.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{med.medicine_name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        med.status === 'available' ? 'bg-green-100 text-green-700' :
                        med.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {med.status === 'available' ? 'Available' : med.status === 'low_stock' ? 'Limited' : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medicine data available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;