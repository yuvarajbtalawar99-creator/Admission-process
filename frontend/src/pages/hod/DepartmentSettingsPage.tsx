import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Settings, 
  Bell, 
  Mail, 
  Save, 
  RefreshCw,
  Sliders
} from 'lucide-react';

export const DepartmentSettingsPage: React.FC = () => {
  const [deptName, setDeptName] = useState('Computer Science & Engineering');
  const [emailTemplate, setEmailTemplate] = useState('Dear Faculty, Please submit your course file updates by the upcoming deadline.');
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Department Settings updated successfully!');
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings form */}
        <div className="lg:col-span-6 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3 mb-4">
            <Sliders className="w-4.5 h-4.5 text-sky-500" />
            DEPARTMENT CONFIGURATIONS
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Department Label</label>
              <input
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-sky-550 font-semibold"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-850/40 rounded-2xl border">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-neutral-850 dark:text-neutral-250 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-neutral-400" /> Notifications Enabled
                </h4>
                <p className="text-[10px] text-neutral-405 font-medium leading-normal">Send real-time leave alerts to your dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-sky-600 border-neutral-300 rounded focus:ring-sky-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Configurations
            </button>
          </form>
        </div>

        {/* Email templates config */}
        <div className="lg:col-span-6 glass-panel rounded-[32px] p-6 shadow-ambient">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800/50 pb-3 mb-4">
            <Mail className="w-4.5 h-4.5 text-violet-500" />
            COMMUNICATION EMAIL TEMPLATES
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Faculty Circular Template</label>
              <textarea
                rows={4}
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                required
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 resize-none font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Templates
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default DepartmentSettingsPage;
