import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

const config = {
  botName: "QuantumBot",
  initialMessages: [{ id: 1, message: "Merhaba! Size nasıl yardımcı olabilirim?" }],
};

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2">
          <Chatbot config={config} />
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg hover:bg-blue-700">💬</button>
    </div>
  );
};

export default ChatbotWidget;