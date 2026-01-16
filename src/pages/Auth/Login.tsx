import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      navigate(AuthService.getDashboardPath(user.role));
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = AuthService.login(email, password);

    if (user) {
        if (user.role !== 'Customer') {
            AuthService.logout();
            setError('Staff must login from /admin');
            return;
        }
        navigate(AuthService.getDashboardPath(user.role));
        window.location.reload(); // Ensure sidebar updates
    } else {
        setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">Sign in to manage your stay</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              required
            />
          </div>
          
          {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                  {error}
              </div>
          )}

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-green-600 hover:underline font-medium">Sign up</Link>
        </div>
        <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;