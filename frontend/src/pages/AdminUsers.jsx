import React, { useEffect, useMemo, useState } from 'react';
import axios from '../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================================================
  // LOAD USERS
  // ============================================================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/admin/users');

      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load users'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FILTER USERS
  // ============================================================

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchText ||
        user.name?.toLowerCase().includes(searchText) ||
        user.phone?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesRole =
        !roleFilter ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ============================================================
  // ROLE LABEL
  // ============================================================

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';

      case 'health_worker':
        return 'Health Worker';

      case 'citizen':
        return 'Citizen';

      default:
        return role || 'Unknown';
    }
  };

  // ============================================================
  // ROLE STYLE
  // ============================================================

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';

      case 'health_worker':
        return 'bg-blue-100 text-blue-700';

      case 'citizen':
        return 'bg-green-100 text-green-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // ============================================================
  // DEACTIVATE
  // ============================================================

  const confirmDeactivate = (user) => {
    setSelectedUser(user);
  };

  const cancelDeactivate = () => {
    if (deactivating) return;

    setSelectedUser(null);
  };

  const deactivateUser = async () => {
    if (!selectedUser) return;

    try {
      setDeactivating(true);

      await axios.delete(
        `/admin/users/${selectedUser.id}`
      );

      toast.success(
        `${selectedUser.name} has been deactivated`
      );

      setSelectedUser(null);

      await loadUsers();
    } catch (error) {
      console.error(
        'Failed to deactivate user:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to deactivate user'
      );
    } finally {
      setDeactivating(false);
    }
  };

  // ============================================================
  // STATS
  // ============================================================

  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) => user.role === 'admin'
  ).length;

  const healthWorkerCount = users.filter(
    (user) => user.role === 'health_worker'
  ).length;

  const citizenCount = users.filter(
    (user) => user.role === 'citizen'
  ).length;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-7 bg-white/20 rounded w-56 mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-80"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse"
            >
              <div className="h-10 bg-gray-200 rounded-xl w-10 mb-3"></div>
              <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}

        </div>

        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
          <div className="text-4xl mb-3 animate-pulse">
            👥
          </div>

          <p className="text-gray-500">
            Loading users...
          </p>
        </div>

      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              👥
            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold">
                User Management
              </h1>

              <p className="text-purple-100 text-sm">
                View and manage SwasthyaSetu users
              </p>

            </div>

          </div>

          <button
            onClick={loadUsers}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl font-medium transition"
          >
            🔄 Refresh
          </button>

        </div>

      </div>


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <UserStat
          icon="👥"
          value={totalUsers}
          label="Total Users"
          color="blue"
        />

        <UserStat
          icon="🛡️"
          value={adminCount}
          label="Administrators"
          color="purple"
        />

        <UserStat
          icon="👷"
          value={healthWorkerCount}
          label="Health Workers"
          color="orange"
        />

        <UserStat
          icon="🧑"
          value={citizenCount}
          label="Citizens"
          color="green"
        />

      </div>


      {/* ======================================================
          SEARCH & FILTER
      ====================================================== */}

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, phone or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 outline-none"
          >

            <option value="">
              All Roles
            </option>

            <option value="admin">
              Administrators
            </option>

            <option value="health_worker">
              Health Workers
            </option>

            <option value="citizen">
              Citizens
            </option>

          </select>

        </div>

      </div>


      {/* ======================================================
          USER TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-200">

          <h2 className="text-lg font-bold text-gray-800">
            Registered Users
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredUsers.length} of {totalUsers} users
          </p>

        </div>


        {filteredUsers.length === 0 ? (

          <div className="py-16 text-center">

            <div className="text-5xl mb-3">
              🔍
            </div>

            <h3 className="font-semibold text-gray-700">
              No users found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or role filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    User
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Language
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Joined
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* User */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">

                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || 'U'}

                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {user.name || 'Unknown User'}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {user.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Phone */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-700">
                        {user.phone || '—'}
                      </span>

                    </td>


                    {/* Email */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-600">
                        {user.email || '—'}
                      </span>

                    </td>


                    {/* Role */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>

                    </td>


                    {/* Language */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-600 uppercase">
                        {user.language || 'EN'}
                      </span>

                    </td>


                    {/* Joined */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-600">

                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString()
                          : '—'}

                      </span>

                    </td>


                    {/* Action */}

                    <td className="px-5 py-4 text-right">

                      {user.role === 'admin' ? (

                        <span className="text-xs text-gray-400">
                          Protected
                        </span>

                      ) : (

                        <button
                          onClick={() =>
                            confirmDeactivate(user)
                          }
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        >
                          Deactivate
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ======================================================
          DEACTIVATE MODAL
      ====================================================== */}

      {selectedUser && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            <div className="p-6">

              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
                ⚠️
              </div>

              <h2 className="text-xl font-bold text-gray-800 text-center">
                Deactivate User?
              </h2>

              <p className="text-sm text-gray-500 text-center mt-2">
                You are about to deactivate
                <strong className="text-gray-700">
                  {' '}{selectedUser.name}
                </strong>.
              </p>

              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-5">

                <p className="text-sm text-red-700">
                  This will remove the user account from the
                  active user list. This action cannot be undone
                  from this page.
                </p>

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={cancelDeactivate}
                  disabled={deactivating}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={deactivateUser}
                  disabled={deactivating}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {deactivating
                    ? 'Deactivating...'
                    : 'Yes, Deactivate'}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


// ============================================================
// USER STAT
// ============================================================

const UserStat = ({
  icon,
  value,
  label,
  color
}) => {

  const styles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100',
      text: 'text-blue-600'
    },

    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100',
      text: 'text-purple-600'
    },

    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100',
      text: 'text-orange-600'
    },

    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100',
      text: 'text-green-600'
    }
  };

  const style = styles[color] || styles.blue;

  return (
    <div
      className={`${style.bg} rounded-xl p-5 border border-gray-100 hover:shadow-md transition`}
    >

      <div
        className={`w-11 h-11 ${style.icon} rounded-xl flex items-center justify-center text-xl mb-3`}
      >
        {icon}
      </div>

      <p className="text-2xl font-bold text-gray-800">
        {value}
      </p>

      <p className={`text-sm font-medium ${style.text} mt-1`}>
        {label}
      </p>

    </div>
  );
};


export default AdminUsers;