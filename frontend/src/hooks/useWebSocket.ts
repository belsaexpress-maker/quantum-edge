import { useEffect, useState, useRef } from 'react';

const WS_URL = 'wss://quantum-edge-api.onrender.com/ws/live';

interface PriceData {
  [symbol: string]: number;
}

export function useWebSocket() {
  const [prices, setPrices] = useState<PriceData>({});
  const [connected, setConnected] = useState(false);
  const [flashSymbols, setFlashSymbols] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'prices') {
        setPrices(prev => {
          const changed = new Set<string>();
          Object.entries(data.data).forEach(([symbol, price]) => {
            if (prev[symbol] && prev[symbol] !== price) {
              changed.add(symbol);
            }
          });
          setFlashSymbols(changed);
          setTimeout(() => setFlashSymbols(new Set()), 500);
          return data.data;
        });
      }
    };

    return () => ws.close();
  }, []);

  return { prices, connected, flashSymbols };
}