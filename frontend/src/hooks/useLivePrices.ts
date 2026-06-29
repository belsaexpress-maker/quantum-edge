import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/market/live-prices';

export function useLivePrices() {
  const [prices, setPrices] = useState<Record<string, any>>({});
  const [flashSymbols, setFlashSymbols] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data && !res.data.error) {
          setPrices(prev => {
            const changed = new Set<string>();
            Object.entries(res.data).forEach(([symbol, data]: any) => {
              if (prev[symbol] && Math.abs(prev[symbol].price - data.price) > 0.01) {
                changed.add(symbol);
              }
            });
            if (changed.size > 0) {
              setFlashSymbols(changed);
              setTimeout(() => setFlashSymbols(new Set()), 600);
            }
            return res.data;
          });
        }
      } catch (err) {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, []);

  return { prices, flashSymbols };
}