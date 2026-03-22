import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { User as UserIcon, LogOut, ArrowLeft, Lock, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import { getMediaUrl } from '../utils/media';

const ChatDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const room = searchParams.get('room') || '';
  const setRoom = (newRoom) => {
    if (newRoom) setSearchParams({ room: newRoom });
    else setSearchParams({});
  };

  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!socket || !room) return;

    socket.emit('join_room', room);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${room}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
    
    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        // Prevent duplicate entries if the sender already added it locally
        if (prev.some(msg => msg._id === data.message._id)) return prev;
        return [...prev, data.message];
      });
    };
    
    const handleUserTyping = (data) => {
      if(data.user !== user.username) {
        setTypingUsers(prev => ({ ...prev, [data.user]: true }));
      }
    };

    const handleUserStoppedTyping = (data) => {
      setTypingUsers(prev => {
        const newTyping = { ...prev };
        delete newTyping[data.user];
        return newTyping;
      });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [socket, room, user]);

  const handleSendMessage = async (text, attachment) => {
    if (!room) return;
    
    try {
      const res = await axios.post('/api/messages', {
        room,
        text,
        attachment
      });

      const messageObj = { room, message: res.data };
      socket.emit('send_message', messageObj);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = () => {
    if(socket && room) {
      socket.emit('typing', { room, user: user.username });
    }
  };

  const handleStopTyping = () => {
    if(socket && room) {
      socket.emit('stop_typing', { room, user: user.username });
    }
  };

  const handleClearChat = async () => {
    if (!room) return;
    if (window.confirm('Are you sure you want to clear this entire chat history?')) {
      try {
        await axios.delete(`/api/messages/${room}`);
        setMessages([]);
      } catch (err) {
        alert('Failed to clear chat');
      }
    }
  };

  const getHeaderInfo = () => {
    if (room === 'global') {
      return { name: 'Global Chat', status: 'Public Room' };
    }
    if (currentChatUser) {
      return { 
        name: currentChatUser.username, 
        status: currentChatUser.isSecure ? 'Secure Room' : (currentChatUser.isOnline ? 'Online' : 'Offline'),
        avatar: currentChatUser.avatar,
        isSecure: currentChatUser.isSecure
      };
    }
    return { name: room.includes('_') ? 'Private Chat' : room, status: 'Active' };
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar - Dynamically hidden on mobile if room is set */}
      <div className={`${room ? 'hidden md:flex' : 'flex'} w-full md:w-80 h-full shrink-0`}>
        <Sidebar setRoom={setRoom} setCurrentChatUser={setCurrentChatUser} />
      </div>
      
      {/* Chat Area - Dynamically hidden on mobile if NO room is set */}
      <div className={`${!room ? 'hidden md:flex' : 'flex'} flex-1 flex-col relative z-10 h-full min-w-0`}>
        {/* Header */}
        <header className="h-[60px] sm:h-16 px-3 sm:px-6 flex-shrink-0 bg-surface-bright/60 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between z-20">
          <div className="flex items-center min-w-0 pr-2">
             {room && (
               <button onClick={() => setRoom('')} className="mr-2 p-1.5 sm:mr-3 sm:p-2 md:hidden bg-surface-container hover:bg-surface-container-high rounded-full text-on-surface-variant hover:text-primary transition-colors flex-shrink-0">
                 <ArrowLeft size={20} />
               </button>
             )}
             {room && room !== 'global' && currentChatUser?.avatar ? (
                <img src={getMediaUrl(currentChatUser.avatar)} alt="Avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-4 object-cover border border-outline-variant/20 flex-shrink-0" />
             ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container flex items-center justify-center mr-2 sm:mr-4 text-primary flex-shrink-0 shadow-sm border border-outline-variant/10">
                  {room === 'global' ? 
                     <span className="font-bold text-base sm:text-lg">G</span> : 
                     (getHeaderInfo().isSecure ? <Lock size={16} className="text-secondary sm:w-4 sm:h-4 w-3.5 h-3.5"/> : <UserIcon size={18} />)
                  }
                </div>
             )}
            <div className="min-w-0">
              <h2 className="text-[15px] sm:text-[17px] font-bold text-on-surface leading-tight truncate">{getHeaderInfo().name}</h2>
              <span className={`text-[11px] sm:text-[13px] font-medium tracking-wide ${getHeaderInfo().status === 'Online' || getHeaderInfo().status === 'Secure Room' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                {getHeaderInfo().status}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
             {room && (
               <button onClick={handleClearChat} className="p-1.5 sm:p-2 bg-surface-container hover:bg-error/20 rounded-full text-on-surface-variant hover:text-error transition-all" title="Clear Chat">
                 <Trash2 size={18} className="sm:w-4 sm:h-4" />
               </button>
             )}
             <button onClick={() => navigate('/profile')} className="p-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-surface-container-high to-surface-container border border-outline-variant/20 rounded-full hover:border-primary/50 transition-all group flex items-center">
               <UserIcon size={18} className="text-primary group-hover:text-primary-dim sm:w-4 sm:h-4" />
               <span className="hidden sm:block ml-2 text-sm font-semibold text-on-surface">Profile</span>
             </button>
             <button onClick={logout} className="p-1.5 sm:p-2 bg-surface-container hover:bg-error/20 rounded-full text-on-surface-variant hover:text-error transition-all" title="Logout">
               <LogOut size={18} className="sm:w-4 sm:h-4" />
             </button>
          </div>
        </header>

        {/* Chat Messages */}
        {room ? (
          <div className="flex-1 flex flex-col relative min-h-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-5">
            <ChatWindow messages={messages} currentUser={user} />
            
            {/* Typing Indicator */}
            {Object.keys(typingUsers).length > 0 && (
              <div className="absolute bottom-[80px] left-4 sm:left-6 text-xs sm:text-sm font-medium text-primary italic drop-shadow-[0_0_5px_rgba(97,244,216,0.3)] bg-surface-container-highest/90 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full backdrop-blur-md shadow-lg border border-primary/20 z-20 flex items-center">
                <span className="flex space-x-1 mr-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                </span>
                {Object.keys(typingUsers).join(', ')} typing
              </div>
            )}
            
            <MessageInput 
              onSendMessage={handleSendMessage} 
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
            />
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-on-surface-variant flex-col min-h-0 bg-surface">
            <div className="w-24 h-24 mb-6 rounded-full bg-surface-container-high flex items-center justify-center shadow-[0_0_30px_rgba(97,244,216,0.05)] border border-outline-variant/10">
               <UserIcon size={48} className="text-on-surface-variant opacity-60" />
            </div>
            <h2 className="text-2xl font-display font-medium text-on-surface mb-2">Welcome to SolutionChat</h2>
            <p className="text-sm opacity-80 text-center max-w-sm">Select a conversation from the sidebar to start a real-time messaging session with attachments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
