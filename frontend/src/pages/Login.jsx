import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/reset-password', { email: resetEmail, newPassword });
      setResetMessage(res.data.message);
      setTimeout(() => {
        setIsResetting(false);
        setResetMessage('');
        setEmail(resetEmail);
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MessageSquare size={48} className="text-primary drop-shadow-[0_0_15px_rgba(97,244,216,0.3)]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-bold text-on-surface">
          {isResetting ? 'Reset Password' : 'Sign in to SolutionChat'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-surface-container py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-outline-variant/10">
          
          {resetMessage && (
            <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-secondary text-sm text-center font-medium">
              {resetMessage}
            </div>
          )}

          {isResetting ? (
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant">Account Email</label>
                <div className="mt-1">
                  <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant">New Password</label>
                <div className="mt-1">
                  <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
                </div>
              </div>

              <div className="pt-2 flex flex-col space-y-4">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:from-primary-dim hover:to-primary transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background">
                  Reset Password
                </button>
                <button type="button" onClick={() => setIsResetting(false)} className="flex items-center justify-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                   <ArrowLeft size={16} className="mr-1" /> Back to Sign in
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant">Email address</label>
                <div className="mt-1">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-on-surface-variant">Password</label>
                  <button type="button" onClick={() => setIsResetting(true)} className="text-sm font-medium text-tertiary hover:text-tertiary-dim transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-on-primary bg-gradient-to-r from-primary to-primary-container hover:from-primary-dim hover:to-primary transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background">
                  Sign in
                </button>
              </div>
            </form>
          )}

          {!isResetting && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface-container text-on-surface-variant">New around here?</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/register" className="font-medium text-tertiary hover:text-tertiary-dim transition-colors">
                  Create an account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Login;
