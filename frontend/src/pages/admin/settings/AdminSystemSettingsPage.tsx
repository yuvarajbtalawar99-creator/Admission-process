import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Save } from 'lucide-react';
import settingsService from '../../../services/settings.service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export const AdminSystemSettingsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [settings, setSettings] = useState({
    require2FA: true,
    admissionsPortalOpen: true,
    smtpServer: '',
    smsGateway: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsService.getSettings();
      if (res.success) {
        setSettings(res.data);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await settingsService.updateSettings(settings);
      if (res.success) {
        toast.success(res.message || 'Settings saved successfully');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
        <Shield size={48} className="text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Access Denied</h2>
        <p>System Settings are restricted to SUPER_ADMIN authority.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Settings className="text-violet-600" /> System Preferences
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Global configurations, feature toggles, and integration settings.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-neutral-200/60 shadow-ambient">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400 flex items-center gap-2 mb-6">
              <Shield size={16} /> Security & Access
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Force Two-Factor Authentication</p>
                  <p className="text-xs text-neutral-500 font-medium">Require all admin and faculty accounts to use 2FA.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.require2FA}
                  onChange={(e) => setSettings({...settings, require2FA: e.target.checked})}
                  className="w-5 h-5 accent-violet-600 cursor-pointer" 
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Admissions Portal Status</p>
                  <p className="text-xs text-neutral-500 font-medium">Toggle the public admissions form open or closed.</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    id="toggle" 
                    checked={settings.admissionsPortalOpen}
                    onChange={(e) => setSettings({...settings, admissionsPortalOpen: e.target.checked})}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                  />
                  <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-neutral-200/60 shadow-ambient">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400 flex items-center gap-2 mb-6">
              <Mail size={16} /> Notifications & Integrations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-bold text-neutral-500 mb-2 uppercase">SMTP Server</p>
                <input 
                  type="text" 
                  value={settings.smtpServer}
                  onChange={(e) => setSettings({...settings, smtpServer: e.target.value})}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-violet-500 mb-2" 
                />
              </div>
              
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-bold text-neutral-500 mb-2 uppercase">SMS Gateway API Key</p>
                <input 
                  type="password" 
                  value={settings.smsGateway}
                  onChange={(e) => setSettings({...settings, smsGateway: e.target.value})}
                  placeholder="************************"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-violet-500 mb-2" 
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminSystemSettingsPage;
