import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                H
            </div>
            <span className="font-bold text-gray-800 text-xl">HMS</span>
        </div>
        <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-24 max-w-7xl mx-auto w-full gap-12">
        <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Experience Luxury <br/> <span className="text-green-600">Reimagined.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
                Book your stay at the world's most comfortable hotels with just a few clicks. Manage your bookings, order room service, and relax.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/signup" className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                    Book a Room <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
                    Customer Login
                </Link>
            </div>
            <div className="pt-8">
                 <Link to="/admin" className="text-sm text-gray-400 hover:text-gray-600 hover:underline">
                    Staff Login
                </Link>
            </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Luxury Hotel" 
                    className="rounded-xl w-full h-auto object-cover"
                />
            </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>&copy; 2024 Hotel Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;