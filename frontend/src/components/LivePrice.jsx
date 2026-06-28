import React, { useState, useEffect } from 'react';

export default function LivePrice() {
  const [price, setPrice] = useState('Yükleniyor...');
  const [color, setColor] = useState('text-gray-300');

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    let lastPrice = 0;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const currentPrice = parseFloat(data.p).toFixed(2);
      
      if (currentPrice > lastPrice) setColor('text-green-400');
      else if (currentPrice < lastPrice) setColor('text-red-400');
      
      setPrice(`$${currentPrice}`);
      lastPrice = currentPrice;
    };

    // React Strict Mode'un anlık bağlantı koparmalarında hata vermesini engelliyoruz
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-gray-900 px-4 py-1.5 rounded-lg border border-gray-700 shadow-inner">
      <span className="text-sm font-semibold text-gray-400">BTC/USDT</span>
      <span className={`font-mono font-bold tracking-wider ${color}`}>{price}</span>
    </div>
  );
}