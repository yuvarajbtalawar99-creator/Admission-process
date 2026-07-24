import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Sparkles, Bell, Globe, LayoutGrid } from 'lucide-react';
import Toast from '../../components/common/Toast';

export const PreferencesPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = () => {
    setToast('Preferences saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && (
        <Toast
          type="success"
          message={toast}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Banner Card */}
      <div className="glass-panel rounded-[32px] p-6 shadow-ambient">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">System Preferences</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Manage notifications, workspace UI layouts, and regional settings</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[32px] p-6 shadow-ambient space-y-6">
        {/* 1. Notifications Preferences */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Bell className="w-5 h-5 text-neutral-450" />
            Alerts & Notifications
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-white">Email Grade Notifications</p>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Receive immediate notifications on email when marks/results are published.</p>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer p-1"
            >
              {emailAlerts ? (
                <ToggleRight className="w-9 h-9 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-9 h-9" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-neutral-100/50 dark:border-neutral-800/50">
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-white">SMS Attendance Warnings</p>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Send mobile SMS warning codes if attendance in any subject drops below 75%.</p>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer p-1"
            >
              {smsAlerts ? (
                <ToggleRight className="w-9 h-9 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-9 h-9" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Interface Settings */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <LayoutGrid className="w-5 h-5 text-neutral-450" />
            Workspace UI Layout
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-white">Show Weekly Performance Widget</p>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Display the line-area trend performance widget inside the primary student dashboard view.</p>
            </div>
            <button
              onClick={() => setDashboardSummary(!dashboardSummary)}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer p-1"
            >
              {dashboardSummary ? (
                <ToggleRight className="w-9 h-9 text-indigo-500" />
              ) : (
                <ToggleLeft className="w-9 h-9" />
              )}
            </button>
          </div>
        </div>

        {/* 3. Regional Settings */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Globe className="w-5 h-5 text-neutral-450" />
            Language & Region
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Primary Language</label>
              <select className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-250 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold outline-none transition-colors appearance-none cursor-pointer">
                <option value="en">English (United States)</option>
                <option value="es">Español (Castellano)</option>
                <option value="fr">Français (France)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Time Zone</label>
              <select className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-250 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-2xl py-3 px-4 text-xs font-semibold outline-none transition-colors appearance-none cursor-pointer">
                <option value="utc">Coordinated Universal Time (UTC)</option>
                <option value="ist">Indian Standard Time (IST - UTC+5:30)</option>
                <option value="est">Eastern Standard Time (EST - UTC-5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
          <button
            onClick={handleSave}
            className="btn-primary-custom font-bold px-6 py-3 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
