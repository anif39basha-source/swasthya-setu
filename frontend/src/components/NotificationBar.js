import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const NotificationBar = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, fetchNotifications, markNotificationRead } = useStore();

  // Only show on desktop view (aside from mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // Close on route change
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  if (unreadCount === 0 && notifications.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h2a2 2 0 002-2V9a2 2 0 00-2-2h-2m-3 9v1a3 3 0 01-3 3H6a3 3 0 01-3-3V8a3 3 0 013-3h3.879a2 2 0 011.414.586l3.121 3.121a2 2 0 011.414.586H21a2 2 0 002-2V9a2 2 0 00-2-2h-2M7 21v-4a2 2 0 012-2h6a2 2 0 012 2v4" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => !notification.is_read && markNotificationRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-1 ${!notification.is_read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{notification.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => markNotificationRead('all')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;