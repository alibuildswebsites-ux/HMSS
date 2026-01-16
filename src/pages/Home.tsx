import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Star, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-900 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                H
            </div>
            <span className="font-bold text-gray-800 text-xl tracking-tight">HMS</span>
        </div>
        <div className="flex gap-4">
            <Link to="/login" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Sign In</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium text-sm transition-all shadow-sm hover:shadow-md">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-20 max-w-7xl mx-auto w-full gap-12 lg:gap-20">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 space-y-8 max-w-xl"
        >
            <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100">
                        Luxury Hotel Management System
                    </span>
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                    Experience Luxury <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                        Reimagined.
                    </span>
                </h1>
                
                <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                    Seamlessly book rooms, order premium service, and manage your entire stay with our award-winning hospitality platform.
                </p>
            </div>

            <div className="flex flex-col space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/signup" className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        Book a Room <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl text-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center">
                        Customer Login
                    </Link>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-400">
                    <span>Are you a staff member?</span>
                    <Link to="/admin" className="text-gray-500 hover:text-green-600 font-medium hover:underline transition-colors">
                        Staff Login
                    </Link>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-gray-100 grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                        4.9 <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Customer Rating</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-gray-800 font-bold text-lg">
                        200+ <Building2 className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Luxury Rooms</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-gray-800 font-bold text-lg">
                        10k+ <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Happy Guests</span>
                </div>
            </div>
        </motion.div>

        {/* Visual Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full relative"
        >
            <div className="relative z-10">
                <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Luxury Hotel Interior" 
                    className="rounded-3xl w-full h-auto object-cover shadow-2xl shadow-gray-200 border-4 border-white"
                />
                
                {/* Floating Badge */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm">Best Choice 2024</p>
                        <p className="text-xs text-gray-500">Voted by travelers</p>
                    </div>
                </motion.div>
            </div>

            {/* Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>
        </motion.div>
      </div>
      
      <footer className="bg-white border-t border-gray-100 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">H</div>
            <span className="font-bold text-gray-900">HMS</span>
        </div>
        <p className="text-gray-400 text-sm">&copy; 2024 Hotel Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;