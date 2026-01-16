import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link to="/" className="mt-4 text-green-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
