import React, { useState, useEffect } from 'react';

export default function SignalList() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend API'sinden gerçek verileri çekme fonksiyonu
    const fetchSignals = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/signals');
        const data = await response.json();
        setSignals(data);
      } catch (error) {
        console.error("Sinyal API'ye ulaşılamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    // Sayfa açıldığında ilk veriyi çek
    fetchSignals();

    // Sistemi tam otomatik hale getir: Her 1 dakikada bir (60000ms) sinyalleri güncelle
    const interval = setInterval(fetchSignals, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
        <span className="text-blue-400 font-semibold animate-pulse">Analyzing Markets...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
      {signals.map((sig) => (
        <div key={sig.id} className="bg-gray-700/40 p-3 rounded-lg border border-gray-600/50 flex items-center justify-between hover:bg-gray-700/60 transition cursor-pointer">
          
          <div className="flex flex-col">
            <span className="font-bold text-gray-200">{sig.coin}</span>
            <span className="text-xs text-gray-400">{sig.indicator} • {sig.time}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className={`font-bold ${
              sig.action === 'BUY' ? 'text-green-500' : 
              sig.action === 'SELL' ? 'text-red-500' : 
              'text-yellow-500'
            }`}>
              {sig.action}
            </span>
            <span className="text-xs text-gray-400">%{sig.confidence} Confidence</span>
          </div>

        </div>
      ))}
    </div>
  );
}