import React, { useState, useEffect } from 'react';

export default function Signals() {
  const [extSignals, setExtSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExternalSignals = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/webhook/signals');
      const data = await response.json();
      setExtSignals(data);
    } catch (error) {
      console.error("Dış sinyaller çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalSignals();
    const interval = setInterval(fetchExternalSignals, 5000); // Her 5 saniyede bir yeni sinyal var mı diye kontrol et
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-700 bg-gray-800/80 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-black text-white tracking-wider">Command Center</h2>
          <p className="text-sm text-gray-400 mt-1">External Strategy & Webhook Alerts</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Webhook Listening on Port 8000</span>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="text-blue-400 animate-pulse font-bold">Scanning for incoming signals...</div>
        ) : extSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
              📡
            </div>
            <p>Sistem dinlemede. Henüz TradingView'dan bir sinyal ulaşmadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extSignals.map((sig, index) => (
              <div key={index} className="bg-gray-900/50 p-5 rounded-lg border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition">
                <div className="flex flex-col">
                  <span className="font-black text-lg text-white">{sig.coin}</span>
                  <span className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">{sig.source} • {sig.time}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-black ${sig.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                    {sig.action}
                  </span>
                  <span className="text-sm font-medium text-gray-300 mt-1">@ ${sig.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}