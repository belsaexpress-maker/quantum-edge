import { useEffect, useState } from 'react';

function Portfolio() {
  const [signals, setSignals] = useState([]);
  const [report, setReport] = useState("");

  const getAnalysis = async () => {
    const res = await fetch("http://localhost:8000/api/analyze", { method: "POST" });
    const data = await res.json();
    setReport(data.report);
  };

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/signals");
        const data = await res.json();
        setSignals(data);
      } catch (err) {
        console.log("Sunucu bağlantısı bekleniyor...");
      }
    };
    fetchSignals();
    const interval = setInterval(fetchSignals, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <button onClick={getAnalysis} className="bg-green-600 p-4 rounded-xl w-full font-bold hover:bg-green-500">
        Yapay Zeka ile Analiz Et
      </button>
      {report && <div className="p-4 bg-gray-800 rounded-lg text-green-400 font-mono">{report}</div>}
      
      <div className="bg-black border border-gray-800 rounded-lg p-2">
        {signals.map(s => (
          <div key={s.id} className="flex justify-between p-3 border-b border-gray-800">
            <span>{s.symbol}</span> 
            <span className={s.type === "BUY" ? "text-green-500" : "text-red-500"}>{s.type}</span>
            <span>${s.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// !!! EN ÖNEMLİ SATIR BURASI !!!
export default Portfolio;