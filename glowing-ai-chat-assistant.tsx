import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X } from 'lucide-react';

const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;
  const chatRef = useRef<HTMLDivElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      setCharCount(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        // Check if the click is not on the floating button
        if (!(event.target as HTMLElement).closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {/* Floating 3D Glowing AI Logo */}
      <button 
        className={`floating-ai-button relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${
          isChatOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background: 'linear-gradient(135deg, rgba(144, 72, 253, 0.8) 0%, rgba(123, 63, 232, 0.8) 100%)',
          boxShadow: '0 0 20px rgba(144, 72, 253, 0.7), 0 0 40px rgba(144, 72, 253, 0.5), 0 0 60px rgba(144, 72, 253, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* 3D effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        
        {/* AI Icon */}
        <div className="relative z-10 text-white">
        { isChatOpen ? <X size={24} /> :  <Bot className="w-8 h-8 text-white" />}
        </div>
        
        {/* Glowing animation */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-brand"></div>
      </button>

      {/* Chat Interface */}
      {isChatOpen && (
        <div 
          ref={chatRef}
          className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[420px] max-w-[500px] transition-all duration-300 origin-bottom-right"
          style={{
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="relative flex flex-col rounded-3xl bg-gradient-to-br from-zinc-900/95 to-zinc-950/98 border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Assistente Jarvis</span>
                    <span className="text-[10px] text-zinc-500">Expert em Otimização</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-zinc-400 rounded-full border border-white/5">
                  GPT-4
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand/10 text-brand border border-brand/20 rounded-full">
                  PRO
                </span>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Chat History Placeholder (Scrollable) */}
            <div className="flex-1 max-h-[300px] overflow-y-auto p-6 scrollbar-none space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-zinc-300">
                    Olá! Sou o assistente da **Collect Tweak**. Como posso te ajudar a extrair o máximo de FPS do seu computador hoje?
                </div>
            </div>

            {/* Input Section */}
            <div className="relative px-6 py-2">
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={3}
                className="w-full bg-transparent border-none outline-none resize-none text-sm font-normal leading-relaxed text-zinc-100 placeholder-zinc-600 scrollbar-none"
                placeholder="Como diminuir meu input lag?"
              />
            </div>

            {/* Controls Section */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-1">
                  {/* File Upload */}
                  <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <button className="p-2 text-zinc-500 hover:text-brand transition-colors"><Code className="w-4 h-4" /></button>
                  <button className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Mic className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Character Counter */}
                  <div className="text-[10px] font-medium text-zinc-600">
                    <span>{charCount}</span>/{maxChars}
                  </div>

                  {/* Send Button */}
                  <button 
                    onClick={handleSend}
                    className="p-3 bg-brand text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                    style={{
                      boxShadow: '0 4px 15px rgba(144, 72, 253, 0.4)',
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between mt-3 px-2 text-[10px] text-zinc-600">
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3 text-zinc-700" />
                  <span>Shift + Enter para nova linha</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .floating-ai-button:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 30px rgba(144, 72, 253, 0.9), 0 0 50px rgba(144, 72, 253, 0.7), 0 0 70px rgba(144, 72, 253, 0.5);
        }
      `}</style>
    </div>
  );
};

export {FloatingAiAssistant};
