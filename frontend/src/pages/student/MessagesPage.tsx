import React, { useState } from 'react';
import { Send, Search, CheckCheck, Paperclip, Smile, MoreVertical } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const initialChannels: Channel[] = [
  { id: '1', name: 'Dr. Sarah Jenkins', role: 'Database Professor & Mentor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop', lastMessage: 'Please submit your DBMS lab workbook by tomorrow evening.', time: '11:32 AM', unread: 2 },
  { id: '2', name: 'Prof. Alan Turing', role: 'Automata Theory Lecturer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop', lastMessage: 'The notes for context-free grammars have been uploaded.', time: 'Yesterday', unread: 0 },
  { id: '3', name: 'Margaret Hamilton', role: 'Software Engineering HOD', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop', lastMessage: 'Good job on the sprint documentation template.', time: 'Oct 20', unread: 0 },
];

export const MessagesPage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [activeChannelId, setActiveChannelId] = useState('1');
  const [messages, setMessages] = useState<Array<{ sender: 'me' | 'them'; text: string; time: string }>>([
    { sender: 'them', text: 'Hi John, I reviewed your project submission outline.', time: '10:45 AM' },
    { sender: 'me', text: 'Thank you, Dr. Jenkins! Does the schema design look correct?', time: '10:48 AM' },
    { sender: 'them', text: 'Yes, it looks solid. Please submit your DBMS lab workbook by tomorrow evening to lock in your internal credits.', time: '11:32 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([...messages, { sender: 'me', text: inputMessage, time: '11:34 AM' }]);
    setInputMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      {/* Left Inbox List - 4 Cols */}
      <div className="lg:col-span-4 glass-panel rounded-[32px] p-5 shadow-ambient flex flex-col h-full overflow-hidden">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-4">Messages</h3>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full bg-neutral-50 dark:bg-neutral-200/50 border border-neutral-100 dark:border-neutral-800/80 focus:border-neutral-300 dark:focus:border-neutral-700 rounded-2xl py-3 px-4 pl-10 text-sm outline-none transition-colors placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {channels.map((chan) => (
            <div
              key={chan.id}
              onClick={() => {
                setActiveChannelId(chan.id);
                // Clear unread indicator
                setChannels(channels.map(c => c.id === chan.id ? { ...c, unread: 0 } : c));
              }}
              className={`flex items-center space-x-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-150 ${
                chan.id === activeChannelId
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                  : 'hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30'
              }`}
            >
              <img
                src={chan.avatar}
                alt={chan.name}
                className="w-11 h-11 rounded-full object-cover border border-neutral-200/30"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold tracking-tight truncate ${
                    chan.id === activeChannelId ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-white'
                  }`}>{chan.name}</h4>
                  <span className="text-[10px] opacity-60 font-semibold">{chan.time}</span>
                </div>
                <p className="text-xs opacity-65 font-medium truncate mt-0.5">{chan.lastMessage}</p>
              </div>

              {chan.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {chan.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Panel - 8 Cols */}
      <div className="lg:col-span-8 glass-panel rounded-[32px] shadow-ambient flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between bg-white/30 dark:bg-neutral-900/20">
          <div className="flex items-center space-x-3.5">
            <img
              src={activeChannel.avatar}
              alt={activeChannel.name}
              className="w-11 h-11 rounded-full object-cover border border-neutral-200/35"
            />
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">{activeChannel.name}</h4>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold">{activeChannel.role}</p>
            </div>
          </div>

          <button className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-3xl p-4 flex flex-col ${
                  isMe
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-tr-sm shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm'
                }`}>
                  <p className="text-sm font-semibold leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] self-end mt-1.5 opacity-60 font-bold flex items-center gap-1 ${
                    isMe ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'
                  }`}>
                    {msg.time}
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Footer */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center gap-2.5 bg-white/20 dark:bg-neutral-900/10">
          <button type="button" className="w-11 h-11 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 cursor-pointer">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-neutral-50 dark:bg-neutral-850 border border-neutral-250 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-700 rounded-2xl py-3 px-4 text-sm outline-none transition-colors text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
          />

          <button type="button" className="w-11 h-11 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 cursor-pointer">
            <Smile className="w-5 h-5" />
          </button>

          <button type="submit" className="w-11 h-11 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 hover:scale-[1.02] flex items-center justify-center shrink-0 shadow-md cursor-pointer transition-all active:scale-[0.97]">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
