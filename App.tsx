
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgentMode, Message, ConversationState } from './types';
import { getGeminiResponse } from './services/geminiService';
import { Logo, TerminalIcon, MathIcon, BrainIcon, SendIcon } from './components/Icons';
import MessageBubble from './components/MessageBubble';

const App: React.FC = () => {
  const [state, setState] = useState<ConversationState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "I am **Montenegro AI**. I am ready to architect your complex software systems or solve your most challenging mathematical proofs. Which domain shall we explore today?",
        timestamp: new Date()
      }
    ],
    isLoading: false,
    mode: AgentMode.GENERAL
  });

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  const handleSend = async () => {
    if (!input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));
    setInput('');

    const history = state.messages.map(m => ({ role: m.role, content: m.content }));
    const response = await getGeminiResponse(input, history, state.mode);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isLoading: false
    }));
  };

  const setMode = (mode: AgentMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  return (
    <div className="flex h-screen bg-[#030712] text-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-72 border-r border-gray-800 bg-[#0a0f1d]/50 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="p-8">
          <Logo />
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Operations Mode</p>
          
          <button 
            onClick={() => setMode(AgentMode.GENERAL)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              state.mode === AgentMode.GENERAL 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <BrainIcon className="w-5 h-5" />
            <span className="font-medium">General Intelligence</span>
          </button>

          <button 
            onClick={() => setMode(AgentMode.CODE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              state.mode === AgentMode.CODE 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <TerminalIcon className="w-5 h-5" />
            <span className="font-medium">Advanced Coding</span>
          </button>

          <button 
            onClick={() => setMode(AgentMode.MATH)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              state.mode === AgentMode.MATH 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <MathIcon className="w-5 h-5" />
            <span className="font-medium">Mathematical Solver</span>
          </button>
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-400">System Online</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter">
              Gemini 3 Pro Engine Running
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#030712] relative">
        {/* Header - Mobile */}
        <header className="lg:hidden p-4 border-b border-gray-800 bg-[#0a0f1d]/50 flex justify-between items-center">
          <Logo />
          <div className="flex gap-2">
             <button onClick={() => setMode(AgentMode.GENERAL)} className={`p-2 rounded-lg ${state.mode === AgentMode.GENERAL ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'}`}><BrainIcon className="w-5 h-5"/></button>
             <button onClick={() => setMode(AgentMode.CODE)} className={`p-2 rounded-lg ${state.mode === AgentMode.CODE ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'}`}><TerminalIcon className="w-5 h-5"/></button>
             <button onClick={() => setMode(AgentMode.MATH)} className={`p-2 rounded-lg ${state.mode === AgentMode.MATH ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'}`}><MathIcon className="w-5 h-5"/></button>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 relative scroll-smooth"
        >
          <div className="max-w-4xl mx-auto py-12">
            {state.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {state.isLoading && (
              <div className="flex justify-start mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-gray-900/50 border border-gray-800 text-gray-400 px-6 py-4 rounded-2xl backdrop-blur-sm flex items-center gap-4">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest opacity-50">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 border-t border-gray-800 bg-[#030712]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center gap-2 bg-[#0d1326] border border-gray-800 rounded-2xl p-2 pl-6 focus-within:border-blue-500/50 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  state.mode === AgentMode.CODE 
                    ? "Explain the logic for a distributed consensus algorithm..." 
                    : state.mode === AgentMode.MATH 
                    ? "Prove the Riemann hypothesis for specific zeros..." 
                    : "Ask Montenegro AI anything..."
                }
                className="flex-1 bg-transparent border-none outline-none text-gray-200 py-3 text-[15px] placeholder-gray-600"
              />
              <button
                onClick={handleSend}
                disabled={state.isLoading || !input.trim()}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-800 text-gray-600'
                }`}
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex justify-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              <span>Shift + Enter for multiline</span>
              <span>•</span>
              <span className="text-blue-500/80">Active Mode: {state.mode}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
