import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link to="/" className="px-6 py-2 bg-primary-500 text-white rounded-lg inline-block hover:bg-primary-600">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;