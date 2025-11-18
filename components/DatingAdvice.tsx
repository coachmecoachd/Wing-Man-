

import React, { useState } from 'react';
import { getDatingAdvice } from '../services/geminiService.ts';
import { DatingAdviceResponse } from '../types.ts';

const DatingAdvice: React.FC = () => {
    const [dateType, setDateType] = useState('First Date');
    const [question, setQuestion] = useState('');
    const [advice, setAdvice] = useState<DatingAdviceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dateOptions = [
        'First Date',
        'Casual Coffee',
        'Formal Dinner',
        'Outdoor Activity (e.g., hiking, picnic)',
        'Movie Night',
        'Concert / Live Music',
        'Creative/Artsy (e.g., museum, pottery class)',
        'Home-cooked Meal',
    ];

    const handleGetAdvice = async () => {
        if (!dateType) return;
        setIsLoading(true);
        setAdvice(null);
        setError('');
        try {
            const result = await getDatingAdvice(dateType, question || "Give me some general tips.");
            setAdvice(result);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const AdviceSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
        <div className="bg-primary p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
                <span className="text-accent">{icon}</span>
                <h3 className="font-bold text-lg text-white">{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-white">Dating Advice</h2>
                <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">Your best friend in your pocket, ready to help you navigate any dating scenario.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg space-y-6 self-start">
                    <div>
                        <label htmlFor="date-type" className="block text-sm font-medium text-gray-400">1. What's the occasion?</label>
                        <select
                            id="date-type"
                            value={dateType}
                            onChange={(e) => setDateType(e.target.value)}
                            className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            {dateOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-400">2. Have a specific question? (Optional)</label>
                        <textarea
                            id="question"
                            rows={3}
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="e.g., What's a good way to bring up a second date?"
                        />
                    </div>
                    <button
                        onClick={handleGetAdvice}
                        disabled={isLoading}
                        className="w-full bg-accent text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-500 font-bold"
                    >
                        {isLoading ? 'Getting Advice...' : '3. Ask Wing Man'}
                    </button>
                </div>

                {/* Advice Display */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg min-h-[28rem] flex flex-col">
                    {isLoading ? (
                        <div className="flex-grow flex justify-center items-center">
                            <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                    ) : error ? (
                         <div className="flex-grow flex flex-col justify-center items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-red-400">{error}</p>
                        </div>
                    ): advice ? (
                        <div className="space-y-4">
                            <div className="text-center bg-tertiary p-4 rounded-lg">
                                <p className="text-gray-400 text-sm uppercase tracking-wider">Key Vibe</p>
                                <p className="text-xl font-semibold text-white italic">"{advice.keyVibe}"</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AdviceSection title="Do's" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}>
                                    <ul className="list-none space-y-2 text-gray-300 text-sm">
                                        {advice.dos.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-green-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>{item}</li>)}
                                    </ul>
                                </AdviceSection>
                                <AdviceSection title="Don'ts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}>
                                     <ul className="list-none space-y-2 text-gray-300 text-sm">
                                        {advice.donts.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></span>{item}</li>)}
                                    </ul>
                                </AdviceSection>
                            </div>
                            
                            <AdviceSection title="Outfit Suggestion" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 10l8 4m0 0l8-4m-8 4V7" /></svg>}>
                                <p className="text-gray-300 text-sm font-semibold">{advice.outfitSuggestion.description}</p>
                                <p className="text-gray-400 text-xs italic mt-1">{advice.outfitSuggestion.reasoning}</p>
                            </AdviceSection>

                            <AdviceSection title="Conversation Starters" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>
                                <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                                    {advice.conversationStarters.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </AdviceSection>

                            {advice.icebreakerJoke && (
                                 <AdviceSection title="Icebreaker" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                                    <p className="text-gray-300 text-sm italic">"{advice.icebreakerJoke}"</p>
                                </AdviceSection>
                            )}

                            {question && advice.questionAnswer && (
                                 <AdviceSection title="Your Question" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                                    <p className="text-gray-300 text-sm">{advice.questionAnswer}</p>
                                </AdviceSection>
                            )}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col justify-center items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-tertiary mb-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <p className="text-gray-500">Select a date type and ask a question to get personalized dating advice from your Wing Man.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatingAdvice;