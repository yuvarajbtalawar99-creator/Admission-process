import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Megaphone, 
  Send, 
  Users, 
  Mail, 
  MessageSquare,
  ShieldAlert,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  ChevronRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: string;
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  channels: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  date: string;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
}

export const AnnounceementPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [audience, setAudience] = useState<string>('All Students');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('NORMAL');
  const [channels, setChannels] = useState<string[]>(['DASHBOARD']);
  const [posting, setPosting] = useState<boolean>(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await API.get('/principal/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedAnn(res.data.data[0]);
        }
      }
    } catch (err: any) {
      toast.error('Failed to load announcements history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warning('Please provide a title and content.');
      return;
    }

    setPosting(true);
    try {
      const res = await API.post('/api/principal/announcements', {
        title,
        content,
        audience,
        priority,
        channels,
      });

      if (res.data.success) {
        toast.success('Announcement broadcast successfully!');
        setTitle('');
        setContent('');
        setChannels(['DASHBOARD']);
        setPriority('NORMAL');
        setAudience('All Students');
        fetchAnnouncements();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to post announcement.');
    } finally {
      setPosting(false);
    }
  };

  const handleChannelToggle = (channel: string) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const chartData = selectedAnn ? [
    { name: 'Sent', count: selectedAnn.sentCount, fill: '#6366F1' },
    { name: 'Delivered', count: selectedAnn.deliveredCount, fill: '#10B981' },
    { name: 'Opened', count: selectedAnn.openedCount || Math.round(selectedAnn.deliveredCount * 0.78), fill: '#F59E0B' }
  ] : [];

  return (
    <div className="space-y-6 pb-8">
      
      {loading ? (
        <div className="glass-panel rounded-[28px] p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="size-10 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin" />
          <p className="text-sm font-bold text-neutral-500">Loading announcement desk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Announcement Composer */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
              <div className="flex items-center gap-2 mb-6">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-neutral-900 dark:text-white text-md">📣 BROADCAST NEW ANNOUNCEMENT</h3>
              </div>

              <form onSubmit={handlePost} className="space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Announcement Title</label>
                  <input
                    type="text"
                    placeholder="E.g., Special Holiday Notice, Sports Meet Postponement..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Message Content</label>
                  <textarea
                    placeholder="Type the detailed details or guidelines here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full p-4 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Target Audience & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Target Audience</label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
                    >
                      <option value="All Students">All Students (1,250)</option>
                      <option value="All Faculty">All Faculty (50)</option>
                      <option value="HODs & Principal">HODs & Principal (8)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full py-2.5 px-3.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none"
                    >
                      <option value="NORMAL">Normal Priority</option>
                      <option value="HIGH">High Priority</option>
                      <option value="CRITICAL">Critical Alert</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Channels */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Multi-channel Delivery</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'DASHBOARD', label: 'Student/Teacher Dashboard', icon: Inbox },
                      { id: 'EMAIL', label: 'Send via Email', icon: Mail },
                      { id: 'SMS', label: 'Push SMS Notification', icon: MessageSquare }
                    ].map((chan) => {
                      const Icon = chan.icon;
                      const isSelected = channels.includes(chan.id);
                      return (
                        <button
                          type="button"
                          key={chan.id}
                          onClick={() => handleChannelToggle(chan.id)}
                          className={`flex-1 py-3 px-4 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-500' 
                              : 'border-neutral-200/60 dark:border-neutral-700/65 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {chan.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Post Button */}
                <button
                  type="submit"
                  disabled={posting}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-850 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {posting ? 'Broadcasting now...' : 'Broadcast Announcement'}
                </button>
              </form>
            </div>
          </div>

          {/* History & Delivery Stats Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Delivery Performance Stats card */}
            {selectedAnn && (
              <div className="glass-panel rounded-[32px] p-5 shadow-ambient space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-extrabold text-neutral-900 dark:text-white text-xs uppercase flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Delivery & Engagement metrics
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Title: {selectedAnn.title}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                    selectedAnn.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {selectedAnn.priority}
                  </span>
                </div>

                <div className="relative w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3a3a3', fontSize: 10, fontWeight: 700 }} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                          borderRadius: '12px', 
                          border: 'none',
                          boxShadow: '0 5px 15px -5px rgba(0,0,0,0.3)',
                          color: '#fff',
                          fontSize: 11
                        }} 
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={30}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Details */}
                <div className="grid grid-cols-3 gap-3 text-center border-t pt-3 text-xs">
                  <div className="p-2 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-xl">
                    <span className="text-[9px] font-bold text-neutral-400 block">Recipients</span>
                    <span className="font-extrabold text-indigo-600">{selectedAnn.sentCount}</span>
                  </div>
                  <div className="p-2 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl">
                    <span className="text-[9px] font-bold text-neutral-400 block">Delivered</span>
                    <span className="font-extrabold text-emerald-600">
                      {Math.round((selectedAnn.deliveredCount / selectedAnn.sentCount) * 100)}%
                    </span>
                  </div>
                  <div className="p-2 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl">
                    <span className="text-[9px] font-bold text-neutral-400 block">Opened Rate</span>
                    <span className="font-extrabold text-amber-600">
                      {Math.round(((selectedAnn.openedCount || Math.round(selectedAnn.deliveredCount * 0.78)) / selectedAnn.deliveredCount) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Broadcast History List */}
            <div className="glass-panel rounded-[32px] p-5 shadow-ambient space-y-4 flex-1 overflow-hidden">
              <h3 className="font-extrabold text-neutral-900 dark:text-white text-sm">📅 BROADCAST HISTORY</h3>
              
              <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnn(ann)}
                    className={`p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border cursor-pointer hover:border-amber-300/40 transition-all flex items-start gap-3 ${
                      selectedAnn?.id === ann.id 
                        ? 'border-amber-500 bg-amber-50/10' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 flex-shrink-0 self-center">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100 truncate">{ann.title}</h4>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">{ann.content}</p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[9px] text-neutral-400 font-bold">
                          {new Date(ann.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-350">
                          {ann.audience}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default AnnounceementPage;
