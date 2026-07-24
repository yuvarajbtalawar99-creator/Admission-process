import React, { useState } from 'react';
import { Bell, Check, Trash2, FileText, CreditCard, MessageSquare } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'ACADEMIC' | 'FINANCE' | 'GRIEVANCE' | 'SYSTEM';
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  { id: '1', title: 'DBMS Lab Manual Submission', description: 'Reminder: Submit your Lab 3 SQL exercises manual to Dr. Sarah Jenkins before tomorrow 5:00 PM.', time: '2 hours ago', type: 'ACADEMIC', read: false },
  { id: '2', title: 'Invoice Due Alert', description: 'Tuition Fee (Sem 3) Invoice INV-2026-004 of $4,500 is due on 15 Nov 2026. Please complete the transaction to secure exam clearance.', time: '1 day ago', type: 'FINANCE', read: false },
  { id: '3', title: 'Grievance Ticket Update', description: 'Ticket #G-1024 relating to Hostel Wi-Fi speeds has been updated with admin notes.', time: '3 days ago', type: 'GRIEVANCE', read: true },
  { id: '4', title: 'Admit Card Generated', description: 'Your exam admit card for Mid-Sem Practical testing has been successfully signed by the registrar.', time: '5 days ago', type: 'ACADEMIC', read: true }
];

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ACADEMIC': return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'FINANCE': return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'GRIEVANCE': return <MessageSquare className="w-5 h-5 text-rose-500" />;
      default: return <Bell className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">System Notifications</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Keep track of alerts, deadlines, and registration timelines</p>
            </div>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 btn-primary-custom px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Mark All As Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`glass-panel rounded-[28px] p-5 shadow-ambient flex items-start gap-4 transition-all hover:scale-[1.005] ${
                !item.read ? 'border-l-4 border-indigo-500' : 'border-l border-neutral-200/40 dark:border-neutral-800'
              }`}
            >
              {/* Type Icon */}
              <div className="w-11 h-11 rounded-2xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-neutral-800">
                {getIcon(item.type)}
              </div>

              {/* Descriptions */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{item.title}</h4>
                  <span className="text-[10px] text-neutral-400 font-semibold shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{item.description}</p>
              </div>

              {/* Action Delete */}
              <button
                onClick={() => handleDelete(item.id)}
                className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                title="Delete notification"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="glass-panel rounded-[32px] p-12 text-center shadow-ambient">
            <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-neutral-500">All caught up! No notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
