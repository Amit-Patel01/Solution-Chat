import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Search, Plus, X, Lock, KeyRound, Archive, Trash2, LogOut } from 'lucide-react';
import { getMediaUrl } from '../utils/media';

const Sidebar = ({ setRoom, setCurrentChatUser }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [secureRooms, setSecureRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalTab, setModalTab] = useState('direct'); // 'direct', 'create', 'join'
  
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomError, setRoomError] = useState('');
  
  const [showArchived, setShowArchived] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  
  const { user, updateProfileObj } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const [usersRes, roomsRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/rooms/my-rooms')
      ]);
      setUsers(usersRes.data);
      setSecureRooms(roomsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserSelect = (targetUser) => {
    const roomKey = [user._id, targetUser._id].sort().join('_');
    setRoom(roomKey);
    setCurrentChatUser(targetUser);
    setShowNewModal(false);
    setSearchQuery('');
  };

  const handleRoomSelect = (roomObj) => {
    setRoom(roomObj.name);
    setCurrentChatUser({ username: roomObj.name, isOnline: true, isSecure: true });
  };

  const handleContextMenu = (e, chatId, type, isCreator = false) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, chatId, type, isCreator });
  };

  const handleToggleArchive = async () => {
    if (!contextMenu) return;
    try {
      const res = await axios.put('/api/users/archive', { chatId: contextMenu.chatId });
      updateProfileObj(res.data);
      setContextMenu(null);
    } catch (err) {
      console.error('Failed to toggle archive');
    }
  };

  const handleDeleteRoom = async () => {
    if (!contextMenu || contextMenu.type !== 'room') return;
    if (window.confirm(`Are you sure you want to permanently delete the room "${contextMenu.chatId}"? All messages will be erased.`)) {
      try {
        await axios.delete(`/api/rooms/name/${contextMenu.chatId}`);
        setContextMenu(null);
        fetchData();
        setRoom('');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete room');
      }
    }
  };

  const handleLeaveRoom = async () => {
    if (!contextMenu || contextMenu.type !== 'room') return;
    if (window.confirm(`Are you sure you want to leave the room "${contextMenu.chatId}"?`)) {
      try {
        await axios.post('/api/rooms/leave', { name: contextMenu.chatId });
        setContextMenu(null);
        fetchData();
        setRoom('');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to leave room');
      }
    }
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setRoomError('');
    try {
      const res = await axios.post('/api/rooms/create', { name: roomName, password: roomPassword });
      setSecureRooms([...secureRooms, res.data]);
      handleRoomSelect(res.data);
      setShowNewModal(false);
      setRoomName('');
      setRoomPassword('');
    } catch (err) {
      setRoomError(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setRoomError('');
    try {
      const res = await axios.post('/api/rooms/join', { name: roomName, password: roomPassword });
      fetchData();
      handleRoomSelect(res.data);
      setShowNewModal(false);
      setRoomName('');
      setRoomPassword('');
    } catch (err) {
      setRoomError(err.response?.data?.message || 'Failed to join room. Invalid password or name.');
    }
  };

  const archivedList = user?.archivedChats || [];
  const isArchived = (id) => archivedList.includes(id);

  const displayUsers = users.filter(u => showArchived ? isArchived(u._id) : !isArchived(u._id));
  const displaySecureRooms = secureRooms.filter(r => showArchived ? isArchived(r.name) : !isArchived(r.name));

  const filteredUsers = displayUsers.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full md:w-80 bg-surface-container-low border-r border-outline-variant/10 flex flex-col h-full relative">
      <div className="p-4 bg-surface-bright/60 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/profile')} 
            className="p-1.5 rounded-full bg-surface-container text-primary border border-outline-variant/20 hover:bg-primary-container transition-all"
            title="My Profile"
          >
            <User size={18} />
          </button>
          <h2 className="text-xl font-display font-bold text-on-surface">Chats</h2>
        </div>
        <button 
          onClick={() => { setShowNewModal(!showNewModal); setModalTab('direct'); }}
          className={`p-2 rounded-full transition-all shadow-sm ${showNewModal ? 'bg-surface-container-highest text-on-surface-variant hover:text-error' : 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary'}`}
          title="Start New Chat"
        >
          {showNewModal ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {showNewModal ? (
        <div className="absolute top-[69px] left-0 w-full h-[calc(100%-69px)] bg-surface z-20 flex flex-col shadow-2xl">
          <div className="flex border-b border-outline-variant/10 text-[13px] sm:text-sm font-medium">
            <button onClick={() => setModalTab('direct')} className={`flex-1 py-2.5 sm:py-3 text-center transition-colors ${modalTab === 'direct' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>DM</button>
            <button onClick={() => setModalTab('join')} className={`flex-1 py-2.5 sm:py-3 text-center transition-colors ${modalTab === 'join' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>Join Room</button>
            <button onClick={() => setModalTab('create')} className={`flex-1 py-2.5 sm:py-3 text-center transition-colors ${modalTab === 'create' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>Create Room</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {modalTab === 'direct' && (
              <>
                <div className="relative mb-4">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    autoFocus
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-on-surface-variant text-center mt-8">No users found</p>
                ) : (
                  filteredUsers.map((u) => (
                    <div 
                      key={u._id} 
                      onClick={() => handleUserSelect(u)}
                      className="flex items-center p-3 rounded-xl hover:bg-surface-container cursor-pointer transition-all hover:translate-x-1 group mb-2 border border-transparent hover:border-primary/20"
                    >
                      <div className="relative">
                        {u.avatar ? (
                          <img src={getMediaUrl(u.avatar)} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 overflow-hidden">
                        <h3 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{u.username}</h3>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {modalTab === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-on-surface mb-2 px-1">Join Secure Room</h3>
                {roomError && <p className="text-xs text-error px-1">{roomError}</p>}
                <div>
                  <input type="text" required placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="password" required placeholder="Password" value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <button type="submit" className="w-full py-3 bg-secondary text-on-secondary font-bold rounded-lg hover:opacity-90 transition-opacity">
                  Join Room
                </button>
              </form>
            )}

            {modalTab === 'create' && (
              <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-on-surface mb-2 px-1">Create Secure Room</h3>
                {roomError && <p className="text-xs text-error px-1">{roomError}</p>}
                <div>
                  <input type="text" required placeholder="New Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <input type="password" required placeholder="Secure Password" value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity">
                  Create Room
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <div 
            onClick={() => { setRoom('global'); setCurrentChatUser({ username: 'Global Chat', isOnline: true }); }}
            className="flex items-center p-3 rounded-xl hover:bg-surface-container cursor-pointer transition-colors border border-transparent hover:border-primary/20 mb-3"
          >
            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-primary-dim to-primary-container flex flex-shrink-0 items-center justify-center text-on-primary font-bold text-lg shadow-[0_0_15px_rgba(97,244,216,0.3)]">
              G
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-bold text-on-surface text-[15px]">Global Chat</h3>
              <p className="text-sm text-primary/80 truncate font-medium">Public room for everyone</p>
            </div>
          </div>

          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2 px-2">
              {showArchived ? 'Archived Chats' : 'Active Chats'}
            </h3>
            {archivedList.length > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowArchived(!showArchived); }}
                className="flex items-center text-[10px] font-bold text-primary hover:text-primary-dim transition-colors px-2 py-1.5 bg-primary/10 rounded-full mb-2"
              >
                <Archive size={12} className="mr-1" />
                {showArchived ? 'View Active' : `Archived (${archivedList.length})`}
              </button>
            )}
          </div>

          {displaySecureRooms.length > 0 && (
            <>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-2 px-2">Secure Rooms</h3>
              {displaySecureRooms.map(r => (
                <div 
                  key={r._id} 
                  onClick={() => handleRoomSelect(r)}
                  onContextMenu={(e) => handleContextMenu(e, r.name, 'room', r.creator === user._id)}
                  className="flex items-center p-3 rounded-xl hover:bg-surface-container cursor-pointer transition-colors group mb-1 border border-transparent hover:border-outline-variant/10"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-secondary group-hover:text-secondary-dim transition-colors shadow-inner">
                    <Lock size={20} />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <h3 className="font-semibold text-[15px] text-on-surface truncate">{r.name}</h3>
                    <p className="text-[13px] text-on-surface-variant/80 truncate mt-0.5 flex items-center"><KeyRound size={12} className="mr-1"/> Private</p>
                  </div>
                </div>
              ))}
            </>
          )}

          <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 mt-4 px-2">Direct Messages</h3>
          {displayUsers.map((u) => (
            <div 
              key={u._id} 
              onClick={() => handleUserSelect(u)}
              onContextMenu={(e) => handleContextMenu(e, u._id, 'user')}
              className="flex items-center p-3 rounded-xl hover:bg-surface-container cursor-pointer transition-colors group mb-1 border border-transparent hover:border-outline-variant/10"
            >
              <div className="relative flex-shrink-0">
                {u.avatar ? (
                  <img src={getMediaUrl(u.avatar)} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-outline-variant/20" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors shadow-inner">
                    <User size={24} />
                  </div>
                )}
                {u.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-surface-container-low shadow-[0_0_5px_rgba(69,254,201,0.5)]"></span>
                )}
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <h3 className="font-semibold text-[15px] text-on-surface truncate">{u.username}</h3>
                <p className="text-[13px] text-on-surface-variant/80 truncate mt-0.5">{u.bio || 'Available'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {contextMenu && (
        <div 
          className="fixed z-50 bg-secondary-container text-on-surface rounded-lg shadow-xl border border-outline-variant/20 overflow-hidden min-w-[150px]"
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 100), left: Math.min(contextMenu.x, window.innerWidth - 160) }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleToggleArchive} 
            className="px-4 py-3 text-sm font-semibold hover:bg-surface-container w-full text-left flex items-center border-b border-outline-variant/10"
          >
             <Archive size={16} className="mr-2" />
             {user?.archivedChats?.includes(contextMenu.chatId) ? 'Unarchive' : 'Archive'}
          </button>
          
          {contextMenu.type === 'room' && (
            contextMenu.isCreator ? (
              <button 
                onClick={handleDeleteRoom} 
                className="px-4 py-3 text-sm font-semibold text-error hover:bg-error/10 w-full text-left flex items-center"
              >
                 <Trash2 size={16} className="mr-2" />
                 Delete Room
              </button>
            ) : (
              <button 
                onClick={handleLeaveRoom} 
                className="px-4 py-3 text-sm font-semibold text-orange-400 hover:bg-orange-400/10 w-full text-left flex items-center"
              >
                 <LogOut size={16} className="mr-2" />
                 Leave Room
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
