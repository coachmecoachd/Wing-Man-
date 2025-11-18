
import React, { useState, useRef } from 'react';
import { translateText, generateSpeech } from '../services/geminiService.ts';

// Audio decoding helpers from Gemini documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const languageList = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' }, { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' }, { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese (Simplified)' }, { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }, { code: 'sv', name: 'Swedish' },
];

const Interpreter: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('es');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [error, setError] = useState('');

    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioContext = () => {
        if (audioContextRef.current === null) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error("Web Audio API is not supported in this browser.");
            }
            // Modern AudioContext takes an options object, legacy webkitAudioContext does not.
            if (AudioContextClass === window.AudioContext) {
                 audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
            } else {
                 audioContextRef.current = new AudioContextClass();
            }
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    };


    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setIsTranslating(true);
        setError('');
        setTranslatedText('');
        const sourceLangName = languageList.find(l => l.code === sourceLang)?.name || sourceLang;
        const targetLangName = languageList.find(l => l.code === targetLang)?.name || targetLang;
        try {
            const result = await translateText(inputText, sourceLangName, targetLangName);
            setTranslatedText(result);
        } catch (e) {
            setError('Translation failed. Please try again.');
        }
        setIsTranslating(false);
    };

    const handlePlayAudio = async () => {
        if (!translatedText.trim()) return;
        setIsGeneratingAudio(true);
        setError('');
        try {
            const outputAudioContext = getAudioContext();
            const base64Audio = await generateSpeech(translatedText);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
        } catch (e) {
            setError('Failed to generate audio. Please try again.');
        }
        setIsGeneratingAudio(false);
    };
    
    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-white">Travel Interpreter</h2>
                <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">Break language barriers on the go. Powered by Wing Man.</p>
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Input Column */}
                    <div className="flex flex-col gap-4">
                         <label htmlFor="source-lang" className="sr-only">Source Language</label>
                        <select
                            id="source-lang"
                            value={sourceLang}
                            onChange={e => setSourceLang(e.target.value)}
                            className="w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            {languageList.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                         <label htmlFor="input-text" className="sr-only">Text to Translate</label>
                        <textarea
                            id="input-text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            rows={8}
                            className="w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Enter text to translate..."
                        />
                    </div>
                     {/* Swap Button for mobile */}
                    <div className="flex justify-center md:hidden">
                         <button
                            onClick={handleSwapLanguages}
                            className="p-2 bg-tertiary rounded-full hover:bg-accent"
                            aria-label="Swap languages"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    {/* Output Column */}
                    <div className="flex flex-col gap-4">
                         <label htmlFor="target-lang" className="sr-only">Target Language</label>
                        <select
                            id="target-lang"
                            value={targetLang}
                            onChange={e => setTargetLang(e.target.value)}
                            className="w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            {languageList.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                        <div className="w-full h-full bg-primary rounded-md p-3 min-h-[10rem] text-gray-300 relative">
                            {isTranslating ? 'Translating...' : translatedText}
                            {translatedText && !isTranslating && (
                                <button 
                                    onClick={handlePlayAudio}
                                    disabled={isGeneratingAudio}
                                    className="absolute bottom-2 right-2 bg-accent p-2 rounded-full hover:bg-red-700 disabled:bg-gray-500"
                                    aria-label="Play audio"
                                >
                                    {isGeneratingAudio 
                                        ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Actions */}
                <div className="flex justify-center items-center gap-4 mt-6">
                     <button
                        onClick={handleSwapLanguages}
                        className="p-2 bg-tertiary rounded-full hover:bg-accent hidden md:block"
                        aria-label="Swap languages"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={handleTranslate}
                        disabled={isTranslating || !inputText.trim()}
                        className="w-full sm:w-auto bg-accent text-white px-8 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-500 font-bold text-lg"
                    >
                        {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                </div>
                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default Interpreter;