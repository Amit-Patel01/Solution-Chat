import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Smile, Loader2, X } from 'lucide-react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAttachment(res.data.url);
    } catch (err) {
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    onTyping();
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 2000);
  };

  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    onTyping();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '' && !attachment) return;
    
    onSendMessage(text, attachment);
    setText('');
    setAttachment(null);
    setShowEmojiPicker(false);
    onStopTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  return (
    <div className="relative z-30">
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 mb-2 shadow-2xl z-50 rounded-lg overflow-hidden border border-outline-variant/10" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" width={320} height={350} />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-2 sm:p-4 bg-surface border-t border-outline-variant/10">
        {attachment && (
          <div className="absolute top-[-40px] left-4 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-container-highest rounded-lg inline-flex items-center border border-primary/20 shadow-lg">
             <span className="text-[11px] sm:text-xs font-medium text-primary mr-2 sm:mr-3 truncate max-w-[150px] sm:max-w-[200px]">Attachment added</span>
             <button type="button" onClick={() => setAttachment(null)} className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-container">
               <X size={14} strokeWidth={3} />
             </button>
          </div>
        )}
        <div className="flex items-end bg-surface-container-highest rounded-3xl p-1 sm:p-1.5 shadow-inner border border-outline-variant/10">
          <label className="p-2 sm:p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer rounded-full ml-0.5 sm:ml-1">
            {uploading ? <Loader2 size={20} className="sm:w-6 sm:h-6 animate-spin" /> : <Paperclip size={20} className="sm:w-6 sm:h-6" />}
            <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
          
          <button 
            type="button" 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 sm:p-3 hover:bg-surface-container transition-colors rounded-full hidden sm:block ${showEmojiPicker ? 'text-tertiary' : 'text-on-surface-variant hover:text-tertiary'}`}
          >
            <Smile size={24} />
          </button>

          <input 
            type="text" 
            value={text} 
            onChange={handleTextChange} 
            placeholder="Type a message..." 
            className="flex-1 min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface placeholder-on-surface-variant px-2 py-2.5 sm:px-4 sm:py-3 text-[14px] sm:text-[15px]"
          />

          <button 
            type="submit" 
            disabled={(!text.trim() && !attachment) || uploading}
            className={`p-2 sm:p-3 ml-1 sm:ml-2 rounded-full flex items-center justify-center transition-all ${
              (text.trim() || attachment) && !uploading 
                ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_0_15px_rgba(97,244,216,0.2)] hover:shadow-[0_0_20px_rgba(97,244,216,0.3)] transform hover:-translate-y-0.5' 
                : 'bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed'
            }`}
          >
            <Send size={18} className="sm:w-5 sm:h-5 sm:ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
