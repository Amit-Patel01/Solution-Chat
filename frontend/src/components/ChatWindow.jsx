import React, { useEffect, useRef } from 'react';
import { FileText, Download } from 'lucide-react';
import { getMediaUrl } from '../utils/media';

const ChatWindow = ({ messages, currentUser }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderAttachment = (attachmentUrl) => {
    if (!attachmentUrl) return null;
    const isImage = attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/i);
    
    if (isImage) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden border border-outline-variant/20 max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity">
          <img src={getMediaUrl(attachmentUrl)} alt="attachment" className="w-full h-auto object-cover" />
        </div>
      );
    }
    
    return (
      <a href={getMediaUrl(attachmentUrl)} target="_blank" rel="noopener noreferrer" 
         className="mt-2 flex items-center p-3 text-sm bg-surface-container-highest/80 rounded-lg border border-outline-variant/20 hover:bg-surface-container transition-colors max-w-xs overflow-hidden">
        <FileText size={18} className="text-primary mr-2 shrink-0" />
        <span className="text-on-surface underline truncate mr-2">Attached Document</span>
        <Download size={16} className="text-on-surface-variant shrink-0" />
      </a>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-surface custom-scrollbar">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-60">
          <p className="text-lg font-medium">No messages yet.</p>
          <p className="text-sm">Be the first to say hi!</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          if (msg.isSystemMessage) {
            return (
              <div key={idx} className="flex justify-center w-full my-2">
                <div className="bg-surface-container-high px-4 py-2 rounded-full text-[12px] font-bold text-secondary text-center border border-secondary/20 shadow-sm backdrop-blur-sm">
                  {msg.text}
                </div>
              </div>
            );
          }
          const isMe = msg.sender?._id === currentUser._id;
          
          return (
            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end max-w-[90%] sm:max-w-[75%] space-x-1.5 sm:space-x-2">
                {!isMe && (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-surface-container-highest flex items-center justify-center overflow-hidden mb-1 border border-outline-variant/20">
                    {msg.sender?.avatar ? (
                      <img src={getMediaUrl(msg.sender.avatar)} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-on-surface">{msg.sender?.username?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                )}
                
                <div className={`p-3 sm:p-4 shadow-sm ${isMe ? 'bg-secondary-container text-on-surface rounded-2xl rounded-br-sm' : 'bg-surface-container-high text-on-surface border border-outline-variant/10 rounded-2xl rounded-bl-sm'}`}>
                  {!isMe && <p className="text-[11px] sm:text-xs font-semibold text-primary mb-1">{msg.sender?.username}</p>}
                  {msg.text && <p className="text-[14px] sm:text-[15px] leading-relaxed break-words">{msg.text}</p>}
                  {renderAttachment(msg.attachment)}
                  
                  <div className="mt-1 flex justify-end">
                    <span className="text-[10px] text-on-surface-variant opacity-80">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} className="h-1 text-transparent">-</div>
    </div>
  );
};

export default ChatWindow;
