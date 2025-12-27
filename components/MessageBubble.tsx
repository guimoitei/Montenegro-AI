
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Basic markdown parser for code blocks and bold text
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.replace(/```/g, '');
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
            {language && (
              <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{language}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Copy
                </button>
              </div>
            )}
            <pre className="p-4 overflow-x-auto mono text-sm leading-relaxed text-gray-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Basic bold and line break handling
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.split(/(\*\*.*?\*\*)/g).map((subPart, subIndex) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIndex} className="text-white font-semibold">{subPart.slice(2, -2)}</strong>;
            }
            return subPart;
          })}
        </span>
      );
    });
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl ${
        isUser 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
          : 'bg-gray-900/50 border border-gray-800 text-gray-300 backdrop-blur-sm'
      }`}>
        <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest font-bold">
          {isUser ? 'Engineer' : 'Montenegro AI'}
          <span>•</span>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-[15px] leading-7">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
