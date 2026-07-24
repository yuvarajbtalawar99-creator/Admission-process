import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Edit, CheckCircle2 } from 'lucide-react';
import officeService, { Ticket } from '../../../services/office.service';

export const AdminMessagesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await officeService.getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    return t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
           t.sender?.firstName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleResolve = async (id: string) => {
    try {
      await officeService.resolveTicket(id);
      fetchTickets();
      if (selectedTicket?.id === id) {
        setSelectedTicket(prev => prev ? { ...prev, status: 'CLOSED' } : null);
      }
    } catch (error) {
      console.error('Failed to resolve ticket', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Messages & Support</h2>
          <p className="text-sm text-neutral-500">Direct messages and support tickets from users.</p>
        </div>
        <button className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all">
          <Edit size={16} /> New Message
        </button>
      </div>

      <div className="glass-panel rounded-2xl shadow-ambient border border-neutral-200/50 flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Left Sidebar - Inbox */}
        <div className="w-full md:w-1/3 border-r border-neutral-200 dark:border-neutral-700 flex flex-col bg-white/50 dark:bg-neutral-900/50">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
              </div>
            ) : (
              filteredTickets.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => setSelectedTicket(msg)}
                  className={`p-4 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${selectedTicket?.id === msg.id ? 'bg-violet-50 dark:bg-violet-900/20' : ''} ${msg.status === 'OPEN' ? 'bg-violet-50/30 dark:bg-violet-900/10' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-bold ${msg.status === 'OPEN' ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>{msg.sender?.firstName} {msg.sender?.lastName}</span>
                    <span className="text-[10px] font-semibold text-neutral-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-semibold text-violet-600 mb-1">{msg.category}</div>
                  <div className="text-xs text-neutral-500 truncate">{msg.subject}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Content - View Message */}
        <div className="hidden md:flex flex-1 flex-col bg-neutral-50/50 dark:bg-neutral-900/20">
          {selectedTicket ? (
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">From: {selectedTicket.sender?.firstName} {selectedTicket.sender?.lastName}</span>
                    <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-[10px] font-bold uppercase tracking-wider">{selectedTicket.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedTicket.status === 'OPEN' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{selectedTicket.status}</span>
                  </div>
                </div>
                {selectedTicket.status !== 'CLOSED' && (
                  <button onClick={() => handleResolve(selectedTicket.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 transition-all">
                    <CheckCircle2 size={14} /> Resolve Ticket
                  </button>
                )}
              </div>
              <div className="flex-1 bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-y-auto text-sm text-neutral-700 dark:text-neutral-300">
                {selectedTicket.body}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <MessageSquare size={48} className="text-neutral-300 dark:text-neutral-700 mb-4" />
              <h3 className="text-lg font-bold text-neutral-400">Select a message to read</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminMessagesPage;
