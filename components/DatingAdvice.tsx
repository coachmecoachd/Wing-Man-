import React, { useState } from 'react';
import { getDatingAdvice } from '../services/geminiService';
import { DatingAdviceResponse } from '../types';
import { CheckCircle2, XCircle, Shirt, MessageCircle, Smile, HelpCircle, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DatingAdvice: React.FC = () => {
    const [dateType, setDateType] = useState('First Date');
    const [customOccasion, setCustomOccasion] = useState('');
    const [question, setQuestion] = useState('');
    const [advice, setAdvice] = useState<DatingAdviceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dateOptions = [
        'First Date', 'Casual Coffee', 'Formal Dinner', 'Outdoor Activity',
        'Movie Night', 'Concert / Live Music', 'Creative/Artsy Date', 'Home-cooked Meal',
        'Other'
    ];

    const handleGetAdvice = async () => {
        const activeDateType = dateType === 'Other' ? customOccasion : dateType;
        if (!activeDateType) return;
        
        setIsLoading(true);
        setAdvice(null);
        setError('');
        try {
            const result = await getDatingAdvice(activeDateType, question || "Give me some general tips.");
            setAdvice(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const AdviceSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
        <div className={`bg-secondary border border-gray-200 p-6 rounded-2xl ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-tertiary p-2 rounded-lg text-accent">{icon}</div>
                <h3 className="font-bold text-xl text-text-primary">{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold text-text-primary tracking-tight">Dating Advice</h2>
                <p className="mt-3 text-xl text-text-secondary max-w-2xl mx-auto">Expert coaching for every moment.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 items-start">
                {/* Controls */}
                <div className="bg-secondary p-8 rounded-[2rem] shadow-2xl space-y-6 border border-gray-200 lg:sticky top-24">
                    <div className="relative">
                        <label htmlFor="date-type" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">1. The Occasion</label>
                        <div className="relative">
                            <select
                                id="date-type"
                                value={dateType}
                                onChange={(e) => setDateType(e.target.value)}
                                className="w-full bg-tertiary border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary appearance-none cursor-pointer"
                            >
                                {dateOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={20} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="question" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1">2. Specific Question (Optional)</label>
                        <textarea
                            id="question"
                            rows={4}
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="w-full bg-tertiary border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary resize-none placeholder-text-secondary"
                            placeholder="e.g., What's a good way to bring up a second date?"
                        />
                    </div>
                    <button
                        onClick={handleGetAdvice}
                        disabled={isLoading || (dateType === 'Other' && !customOccasion.trim())}
                        className="w-full bg-accent text-white px-6 py-4 rounded-xl hover:bg-accent-hover disabled:bg-tertiary disabled:text-text-secondary font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isLoading ? <><Loader2 size={20} className="animate-spin" /> Consulting...</> : '3. Ask BRUH'}
                    </button>
                </div>

                {/* Advice Display */}
                <div className="bg-primary/30 rounded-[2rem] min-h-[400px] flex flex-col">
                    {isLoading ? (
                        <div className="flex-grow flex flex-col justify-center items-center text-text-secondary py-20">
                            <Loader2 size={64} className="animate-spin text-accent mb-4" />
                            <p className="text-lg font-medium">Analyzing the vibe...</p>
                        </div>
                    ) : error ? (
                         <div className="flex-grow flex flex-col justify-center items-center text-center py-20 bg-secondary rounded-[2rem] border border-red-500/20">
                            <XCircle size={64} className="text-red-500 mb-6" />
                            <p className="text-red-600 font-bold text-xl">Oops, something went wrong.</p>
                            <p className="text-red-500/70 text-sm mt-2">{error}</p>
                        </div>
                    ): advice ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-8 rounded-[2rem] shadow-xl">
                                <p className="text-accent text-xs uppercase tracking-[0.2em] font-extrabold mb-3">The Vibe</p>
                                <p className="text-3xl md:text-4xl font-black text-text-primary italic leading-tight">"{advice.keyVibe}"</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AdviceSection title="Do's" icon={<CheckCircle2 size={20} />} className="bg-green-500/5 border-green-500/20">
                                    <ul className="list-none space-y-3 text-text-secondary">
                                        {advice.dos.map((item, i) => <li key={i} className="flex items-start gap-3"><span className="text-green-500 mt-1"><CheckCircle2 size={16} /></span><span className="leading-relaxed">{item}</span></li>)}
                                    </ul>
                                </AdviceSection>
                                <AdviceSection title="Don'ts" icon={<XCircle size={20} />} className="bg-red-500/5 border-red-500/20">
                                     <ul className="list-none space-y-3 text-text-secondary">
                                        {advice.donts.map((item, i) => <li key={i} className="flex items-start gap-3"><span className="text-red-500 mt-1"><XCircle size={16} /></span><span className="leading-relaxed">{item}</span></li>)}
                                    </ul>
                                </AdviceSection>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AdviceSection title="Outfit Suggestion" icon={<Shirt size={20} />}>
                                    <p className="text-text-primary font-semibold text-lg mb-2">{advice.outfitSuggestion.description}</p>
                                    <p className="text-text-secondary text-sm italic leading-relaxed border-l-2 border-accent pl-3">{advice.outfitSuggestion.reasoning}</p>
                                </AdviceSection>

                                <AdviceSection title="Icebreaker" icon={<Smile size={20} />}>
                                     <p className="text-text-primary text-lg italic font-medium">"{advice.icebreakerJoke}"</p>
                                </AdviceSection>
                            </div>

                            <AdviceSection title="Conversation Starters" icon={<MessageCircle size={20} />}>
                                <ul className="space-y-3 text-text-secondary">
                                    {advice.conversationStarters.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </AdviceSection>

                            {question && advice.questionAnswer && (
                                 <AdviceSection title="Your Question" icon={<HelpCircle size={20} />}>
                                    <div className="prose max-w-none text-text-secondary prose-p:leading-relaxed">
                                        <ReactMarkdown>{advice.questionAnswer}</ReactMarkdown>
                                    </div>
                                </AdviceSection>
                            )}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col justify-center items-center text-center py-20 bg-secondary rounded-[2rem] border border-gray-200">
                            <div className="bg-tertiary p-8 rounded-full mb-6">
                                <Sparkles size={64} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">Ask away</h3>
                            <p className="text-text-secondary max-w-xs">Select a date type and ask a question to get personalized coaching.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatingAdvice;