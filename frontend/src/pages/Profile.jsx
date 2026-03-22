import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Image as ImageIcon, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { getMediaUrl } from '../utils/media';

const Profile = () => {
  const { user, updateProfileObj } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatar(res.data.url);
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/users/profile', {
        username, bio, avatar
      });
      updateProfileObj(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.')) {
      try {
        await axios.delete('/api/users/account');
        localStorage.removeItem('token');
        navigate('/register');
        window.location.reload();
      } catch (err) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="flex items-center text-primary hover:text-primary-dim transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Chat
        </button>

        <div className="bg-surface-container rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-3xl font-display font-bold mb-8">Edit Profile</h2>
            
            <form onSubmit={handleSave} className="space-y-8">
              {/* Avatar section */}
              <div className="flex items-center space-x-6">
                <div className="relative group cursor-pointer">
                  {avatar ? (
                     <img src={getMediaUrl(avatar)} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center border-2 border-outline-variant/30">
                      <User size={40} className="text-on-surface-variant" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <ImageIcon size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*, .pdf, .doc, .docx" onChange={handleAvatarUpload} disabled={loading} />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <label className="inline-flex mt-2 px-4 py-1.5 bg-surface-container-highest border border-outline-variant/30 rounded-full text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer text-primary">
                    Upload New Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={loading} />
                  </label>
                  <p className="text-xs text-on-surface-variant mt-1 px-1">(Max 5MB Image)</p>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                    className="block w-full px-4 py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl focus:ring-primary focus:border-primary sm:text-sm text-on-surface transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Bio</label>
                  <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                    className="block w-full px-4 py-3 bg-surface-container-high border border-outline-variant/20 rounded-xl focus:ring-primary focus:border-primary sm:text-sm text-on-surface transition-colors resize-none" />
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button type="submit" disabled={loading}
                  className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary-container hover:from-primary-dim hover:to-primary text-on-primary font-bold rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary disabled:opacity-50 min-w-[150px]">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                </button>
                {success && (
                  <span className="flex items-center text-secondary text-sm font-medium">
                    <CheckCircle size={16} className="mr-2" /> Saved successfully
                  </span>
                )}
              </div>
              
              <div className="pt-8 mt-8 border-t border-error/20 flex flex-col items-start bg-error/5 p-4 rounded-xl border border-error/10">
                <h3 className="text-lg font-bold text-error mb-2 flex items-center"><Trash2 size={18} className="mr-2" /> Danger Zone</h3>
                <p className="text-sm text-on-surface-variant mb-4">Once you delete your account, there is no going back. All of your personal data will be completely wiped from the database.</p>
                <button type="button" onClick={handleDeleteAccount} className="px-6 py-2.5 bg-error/10 hover:bg-error/20 text-error font-bold rounded-lg border border-error/50 transition-colors flex items-center shadow-sm">
                  <Trash2 size={16} className="mr-2" /> Delete My Account Forever
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
