import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SystemStatus {
  status: string;
  message: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<SystemStatus>('/api')
      .then((res) => {
        setBackendStatus(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Could not connect to the Backend API server.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-bold tracking-wider animate-pulse">
            ERP
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">College ERP System</h1>
          <p className="text-slate-400 text-sm">Initial Boilerplate Working Structure</p>
        </div>

        <div className="border-t border-slate-800 my-4"></div>

        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <span className="text-sm font-semibold text-slate-400">Frontend UI State</span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
            <span className="text-sm font-semibold text-slate-400">Backend API Connection</span>
            {loading ? (
              <span className="text-xs text-slate-500 animate-pulse">Checking status...</span>
            ) : error ? (
              <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                Disconnected
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                Connected
              </span>
            )}
          </div>
        </div>

        {!loading && backendStatus && (
          <div className="text-xs text-slate-500 text-center bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/30">
            <span className="block font-medium text-slate-400">{backendStatus.message}</span>
            <span className="block mt-1">Checked on: {new Date(backendStatus.timestamp).toLocaleString()}</span>
          </div>
        )}

        {error && (
          <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <div className="pt-4 text-xs text-slate-500 leading-relaxed">
          Initialize feature development in <code className="text-indigo-400 font-mono">frontend/src</code> or <code className="text-indigo-400 font-mono">backend/src</code>. Check out <a href="/docs/DATABASE.md" className="text-indigo-400 underline hover:text-indigo-300">DATABASE.md</a> for architectural maps.
        </div>
      </div>
    </div>
  );
};

export default App;
