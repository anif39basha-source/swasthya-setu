import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const HealthWorkerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/appointments');

      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const messages = {
      confirmed: 'Confirm this appointment?',
      cancelled: 'Cancel this appointment?',
      completed: 'Mark this appointment as completed?'
    };

    if (!window.confirm(messages[status])) {
      return;
    }

    try {
      setUpdating(id);

      await axios.put(`/appointments/${id}/status`, {
        status
      });

      await loadAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);

      alert(
        error.response?.data?.message ||
        'Failed to update appointment'
      );
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter(
          appointment => appointment.status === filter
        );

  const getStatusClass = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';

      case 'confirmed':
        return 'bg-green-100 text-green-800';

      case 'cancelled':
        return 'bg-red-100 text-red-800';

      case 'completed':
        return 'bg-blue-100 text-blue-800';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = status => {
    if (!status) return 'Unknown';

    return status
      .replace('_', ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  const formatDate = date => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📅 Patient Appointments
            </h1>

            <p className="text-gray-500 mt-1">
              Manage appointments assigned to you
            </p>
          </div>

          <button
            onClick={loadAppointments}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
          >
            🔄 Refresh
          </button>

        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-6">

          {[
            'all',
            'pending',
            'confirmed',
            'completed',
            'cancelled'
          ].map(status => (

            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all'
                ? 'All'
                : formatStatus(status)}
            </button>

          ))}

        </div>

      </div>


      {/* Loading */}
      {loading && (

        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">

          <div className="animate-spin text-4xl mb-3">
            🔄
          </div>

          <p className="text-gray-500">
            Loading patient appointments...
          </p>

        </div>

      )}


      {/* Appointment List */}
      {!loading && filteredAppointments.length > 0 && (

        <div className="space-y-4">

          {filteredAppointments.map(appointment => (

            <div
              key={appointment.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
            >

              {/* Top */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">
                      👤
                    </span>
                  </div>

                  <div>

                    <h2 className="font-bold text-lg text-gray-800">
                      {appointment.patient_name || 'Patient'}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      📅 {formatDate(appointment.appointment_date)}
                      {' '}at{' '}
                      {appointment.appointment_time || 'N/A'}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      🏥 {appointment.facility_name || 'Facility'}
                    </p>

                  <p className="text-sm text-gray-500 mt-1">
  👨‍⚕️ {appointment.doctor_name || 'Any Available'}
</p>

                    <p className="text-sm text-gray-500 mt-1">
                      🩺 {appointment.department || 'General Medicine'}
                    </p>

                  </div>

                </div>


                {/* Status */}
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                    appointment.status
                  )}`}
                >
                  {formatStatus(appointment.status)}
                </span>

              </div>


              {/* Appointment ID */}
              <div className="mt-4 pt-4 border-t border-gray-100">

                <p className="text-xs text-gray-400">
                  Appointment ID:
                  <span className="ml-1 font-medium text-gray-600">
                    {appointment.appointment_id || appointment.id}
                  </span>
                </p>

              </div>


              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">

                {appointment.status === 'pending' && (

                  <>
                    <button
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          'confirmed'
                        )
                      }
                      disabled={updating === appointment.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {updating === appointment.id
                        ? 'Updating...'
                        : '✓ Confirm'}
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          'cancelled'
                        )
                      }
                      disabled={updating === appointment.id}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                    >
                      ✕ Cancel
                    </button>
                  </>

                )}


                {appointment.status === 'confirmed' && (

                  <>
                    <button
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          'completed'
                        )
                      }
                      disabled={updating === appointment.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating === appointment.id
                        ? 'Updating...'
                        : '✓ Mark Completed'}
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          'cancelled'
                        )
                      }
                      disabled={updating === appointment.id}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                    >
                      ✕ Cancel
                    </button>
                  </>

                )}


                {appointment.status === 'completed' && (

                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    ✓ Appointment Completed
                  </span>

                )}


                {appointment.status === 'cancelled' && (

                  <span className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                    Appointment Cancelled
                  </span>

                )}

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Empty */}
      {!loading && filteredAppointments.length === 0 && (

        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">

          <div className="text-5xl mb-4">
            📅
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No appointments found
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            {filter === 'all'
              ? 'There are currently no patient appointments.'
              : `There are no ${formatStatus(filter).toLowerCase()} appointments.`}
          </p>

        </div>

      )}

    </div>
  );
};

export default HealthWorkerAppointments;