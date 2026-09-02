import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const MyReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/referrals');

      setReferrals(response.data.data || []);
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReferralStatus = async (id, status) => {
    const actionText =
      status === 'accepted'
        ? 'accept'
        : status === 'completed'
        ? 'complete'
        : 'reject';

    if (!window.confirm(`Are you sure you want to ${actionText} this referral?`)) {
      return;
    }

    try {
      setUpdating(id);

      await axios.put(`/referrals/${id}/status`, {
        status
      });

      alert(`Referral ${status} successfully!`);

      await loadReferrals();
    } catch (error) {
      console.error('Failed to update referral:', error);

      alert(
        'Failed to update referral: ' +
          (error.response?.data?.message || 'Please try again.')
      );
    } finally {
      setUpdating(null);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';

      case 'accepted':
        return 'bg-blue-100 text-blue-800 border border-blue-200';

      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';

      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';

      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const priorityBadge = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border border-red-200';

      case 'urgent':
        return 'bg-orange-100 text-orange-800 border border-orange-200';

      case 'normal':
        return 'bg-blue-100 text-blue-800 border border-blue-200';

      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const filteredReferrals =
    filter === 'all'
      ? referrals
      : referrals.filter((ref) => ref.status === filter);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📋 Referral Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and track patient healthcare referrals
            </p>
          </div>

          <button
            onClick={loadReferrals}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            🔄 Refresh
          </button>

        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-5">

          {['all', 'pending', 'accepted', 'completed', 'rejected'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm capitalize ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            )
          )}

        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <div className="animate-spin text-4xl mb-2">
            🔄
          </div>

          <p className="text-gray-500">
            Loading referrals...
          </p>
        </div>
      ) : filteredReferrals.length > 0 ? (

        /* Referral Cards */
        <div className="space-y-3">

          {filteredReferrals.map((ref) => (

            <div
              key={ref.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
            >

              {/* Top Section */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">

                <div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${priorityBadge(
                        ref.priority
                      )}`}
                    >
                      {ref.priority || 'normal'} priority
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(
                        ref.status
                      )}`}
                    >
                      {ref.status}
                    </span>

                  </div>

                  {/* Facility */}
                  <h3 className="font-bold text-gray-800 text-lg">
                    {ref.from_facility_name || 'Source Facility'}
                    <span className="mx-2 text-gray-400">
                      →
                    </span>
                    {ref.to_facility_name || 'Pending Facility'}
                  </h3>

                  {/* Reason */}
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Reason:</strong>{' '}
                    {ref.reason || 'No reason provided'}
                  </p>

                </div>

              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">

                <div>
                  <span className="text-xs text-gray-500">
                    Patient
                  </span>

                  <p className="font-medium text-gray-800">
                    {ref.patient_name || 'Patient'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">
                    Required Service
                  </span>

                  <p className="font-medium text-gray-800">
                    {ref.required_service || 'N/A'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">
                    Symptoms
                  </span>

                  <p className="font-medium text-gray-800">
                    {ref.symptoms || 'N/A'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">
                    Doctor
                  </span>

                  <p className="font-medium text-gray-800">
                    Dr. {ref.doctor_name || 'TBD'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">
                    Referral Date
                  </span>

                  <p className="font-medium text-gray-800">
                    {ref.referral_date
                      ? new Date(
                          ref.referral_date
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">
                    Referral ID
                  </span>

                  <p className="font-medium text-gray-800">
                    {ref.id}
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">

                {ref.status === 'pending' && (
                  <>
                    <button
                      onClick={() =>
                        updateReferralStatus(
                          ref.id,
                          'accepted'
                        )
                      }
                      disabled={updating === ref.id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                    >
                      {updating === ref.id
                        ? 'Updating...'
                        : '✓ Accept Referral'}
                    </button>

                    <button
                      onClick={() =>
                        updateReferralStatus(
                          ref.id,
                          'rejected'
                        )
                      }
                      disabled={updating === ref.id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}

                {ref.status === 'accepted' && (
                  <button
                    onClick={() =>
                      updateReferralStatus(
                        ref.id,
                        'completed'
                      )
                    }
                    disabled={updating === ref.id}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                  >
                    {updating === ref.id
                      ? 'Updating...'
                      : '✓ Mark Completed'}
                  </button>
                )}

                {ref.status === 'completed' && (
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                    ✓ Referral Completed
                  </span>
                )}

                {ref.status === 'rejected' && (
                  <span className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                    ✕ Referral Rejected
                  </span>
                )}

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* Empty State */
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">

          <div className="text-5xl mb-3">
            📋
          </div>

          <p className="text-gray-600 font-medium">
            No referrals found
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {filter === 'all'
              ? 'There are currently no referrals.'
              : `There are no ${filter} referrals.`}
          </p>

        </div>
      )}

    </div>
  );
};

export default MyReferrals;