import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://dip-backend-docker.onrender.com/register', {
        email,
        password,
      });

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 overflow-hidden relative">
      {/* Decorative background orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

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
          <div className="p-4 bg-accent/10 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-accent/20">
            <UserPlus size={40} className="text-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          </div>
        </motion.div>

        <h2 className="mb-2 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Create Account
        </h2>
        <p className="mb-8 text-sm text-center text-slate-400">
          Join us to start scanning instantly
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
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-3 p-3 mb-6 text-sm text-green-200 border border-green-500/30 rounded-xl bg-green-500/10"
          >
            <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
            <p>{success}</p>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
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
                className="w-full py-3 pl-11 pr-4 glass-input focus:border-accent focus:ring-accent/50"
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
                className="w-full py-3 pl-11 pr-4 glass-input focus:border-accent focus:ring-accent/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || success}
            className="flex items-center justify-center w-full gap-2 py-3.5 mt-4 font-semibold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-accent to-purple-600 hover:shadow-accent/25 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign Up Free
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-sm text-center text-slate-400">
          Already have an account?{' '}
          <Link to="/" className="font-semibold text-accent hover:text-purple-400 transition-colors">
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
