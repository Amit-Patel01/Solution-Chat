import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      alert('Registration failed. Username or email might be taken.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MessageSquare size={48} className="text-secondary drop-shadow-[0_0_15px_rgba(69,254,201,0.3)]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-bold text-on-surface">
          Join SolutionChat
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-outline-variant/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant">Username</label>
              <div className="mt-1">
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant">Email address</label>
              <div className="mt-1">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant">Password</label>
              <div className="mt-1">
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-outline-variant/20 rounded-xl shadow-sm placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary bg-surface-container-high text-on-surface sm:text-sm transition-all" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-on-secondary bg-gradient-to-r from-secondary to-secondary-container hover:from-secondary-dim hover:to-secondary transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-background">
                Sign Up
              </button>
            </div>
          </form>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container text-on-surface-variant">Already have an account?</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-tertiary hover:text-tertiary-dim transition-colors">
                Log in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
