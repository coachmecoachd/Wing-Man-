import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getReplySuggestion } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Trash2, Send, Loader2, User, Bot } from 'lucide-react';

const TextAnalyzer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sender, setSender] = useState<'them' | 'me'>('them');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { id: Date.now(), sender, text: newMessage }]);
    setNewMessage('');
  };

  const handleGetSuggestion = async () => {
    if (messages.length === 0) return;
    setIsLoading(true);
    setSuggestion('');
    try {
        const result = await getReplySuggestion(messages);
        setSuggestion(result);
    } catch (e) {
        setSuggestion("Sorry, I couldn't generate a suggestion. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-white tracking-tight">Text Helper</h2>
            <p className="mt-3 text-xl text-slate-400 max-w-2xl mx-auto">Stuck on a reply? Let AI craft the perfect response.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-[calc(100vh-250px)] min-h-[600px]">
        {/* CONVERSATION BUILDER */}
        <div className="bg-secondary rounded-[2rem] shadow-2xl border border-tertiary flex flex-col h-full overflow-hidden relative">
            <div className="p-6 border-b border-tertiary bg-secondary/50 backdrop-blur-md flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquareMore size={20} className="text-accent"/> Conversation History
                </h3>
                <button 
                  onClick={() => { setMessages([]); setSuggestion(''); }} 
                  className="text-xs font-semibold text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-red-900/20"
                >
                  <Trash2 size={14} /> Clear Chat
                </button>
            </div>
          
            {/* Messages Display */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-black/20 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                        <MessageSquareMore size={48} className="mb-4" />
                        <p className="font-medium text-lg">Start building the chat</p>
                        <p className="text-sm">Add messages to get context-aware advice.</p>
                    </div>
                )}
                {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    {msg.sender === 'them' && (
                        <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0 border border-stone-700">
                            <User size={14} className="text-slate-400"/>
                        </div>
                    )}
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                        msg.sender === 'me' 
                        ? 'bg-accent text-white rounded-br-sm' 
                        : 'bg-tertiary text-slate-200 rounded-bl-sm border border-stone-700'
                    }`}>
                        {msg.text}
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 bg-secondary border-t border-tertiary space-y-4">
                 <div className="flex items-center gap-2 bg-tertiary/50 p-1 rounded-2xl border border-tertiary">
                    <select
                        value={sender}
                        onChange={(e) => setSender(e.target.value as 'them' | 'me')}
                        className="bg-transparent border-none rounded-xl py-3 pl-4 pr-8 focus:ring-0 text-white text-sm font-bold cursor-pointer hover:bg-white/5 transition-colors"
                    >
                        <option value="them" className="bg-secondary">Them</option>
                        <option value="me" className="bg-secondary">Me</option>
                    </select>
                    <div className="h-8 w-px bg-stone-700 mx-1"></div>
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Type what ${sender === 'me' ? 'you' : 'they'} said...`}
                        rows={1}
                        className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-3 px-2 resize-none"
                    />
                    <button 
                        onClick={addMessage} 
                        disabled={!newMessage.trim()}
                        className="bg-accent hover:bg-accent-hover disabled:bg-slate-700 disabled:text-slate-500 text-white p-3 rounded-xl transition-colors shadow-lg"
                    >
                      <Send size={18} />
                    </button>
                </div>
                
                 <button 
                    onClick={handleGetSuggestion} 
                    disabled={isLoading || messages.length === 0} 
                    className="w-full bg-white text-stone-900 px-6 py-4 rounded-xl hover:bg-slate-200 disabled:bg-tertiary disabled:text-slate-500 disabled:cursor-not-allowed font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                    {isLoading ? <><Loader2 size={20} className="animate-spin" /> Analyzing Vibe...</> : <><Sparkles size={20} /> Generate Reply Suggestions</>}
                </button>
            </div>
        </div>

        {/* AI SUGGESTION */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-8 rounded-[2rem] shadow-2xl border border-tertiary h-full flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="bg-white/10 p-2 rounded-lg"><Bot size={24} className="text-accent" /></div>
                Wing Man Suggests
            </h3>
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-full text-slate-400 space-y-4">
                        <Loader2 size={40} className="animate-spin text-accent" /> 
                        <p className="animate-pulse">Crafting the perfect response...</p>
                    </div>
                )}
                {suggestion ? (
                    <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-headings:text-accent prose-strong:text-white prose-li:marker:text-accent animate-fade-in">
                        <ReactMarkdown>{suggestion}</ReactMarkdown>
                    </div>
                ) : !isLoading && (
                    <div className="flex flex-col justify-center items-center h-full text-center text-slate-500 opacity-60">
                        <Sparkles size={48} className="mb-4" />
                        <p className="text-lg font-medium">Ready to help.</p>
                        <p className="text-sm max-w-xs">Add messages to the conversation and hit "Generate" to see magic happen.</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    </div>
  );
};

import { MessageSquareMore } from 'lucide-react';

export default TextAnalyzer;