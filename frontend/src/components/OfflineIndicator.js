import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const OfflineIndicator = () => {
  const { isOnline } = useStore((state) => state);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
    } else {
      // Show for 2 seconds when coming back online
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium ${!isOnline ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-white'}`}>
      {!isOnline ? (
        <span>📵 Offline Mode - Using cached data. Changes will sync when online.</span>
      ) : (
        <span>✅ Online - Syncing data...</span>
      )}
    </div>
  );
};

export default OfflineIndicator;