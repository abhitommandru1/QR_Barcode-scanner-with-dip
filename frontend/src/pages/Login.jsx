import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://dip-backend-docker.onrender.com/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/scanner');
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Connection failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 overflow-hidden relative">
      {/* Decorative background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 glass-panel relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-primary/10 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-primary/20">
            <LogIn size={40} className="text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
        </motion.div>

        <h2 className="mb-2 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Welcome Back
        </h2>
        <p className="mb-8 text-sm text-center text-slate-400">
          Enter your credentials to access the scanner
        </p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-3 p-3 mb-6 text-sm text-red-200 border border-red-500/30 rounded-xl bg-red-500/10"
          >
            <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block pl-1 text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-11 pr-4 glass-input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block pl-1 text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-11 pr-4 glass-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full gap-2 py-3.5 mt-4 font-semibold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-primary to-blue-500 hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-sm text-center text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-blue-400 transition-colors">
            Create one now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
