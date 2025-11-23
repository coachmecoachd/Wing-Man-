import React, { useState, useRef } from 'react';
import { translateText, generateSpeech } from '../services/geminiService';
import { ArrowRightLeft, Volume2, Loader2, Mic } from 'lucide-react';

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

    const selectClasses = "w-full bg-tertiary border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary font-bold cursor-pointer";

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold text-text-primary tracking-tight">Travel Interpreter</h2>
                <p className="mt-3 text-xl text-text-secondary">Break barriers. Connect globally.</p>
            </div>
            
            <div className="bg-secondary p-8 rounded-[2rem] shadow-2xl border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                     <div className="w-full md:w-1/3">
                        <select title="Source Language" value={sourceLang} onChange={e => setSourceLang(e.target.value)} className={selectClasses}>
                            {languageList.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                     </div>
                     <button
                        onClick={handleSwapLanguages}
                        className="p-3 bg-tertiary rounded-full hover:bg-accent transition-all text-text-secondary hover:text-white shadow-lg border border-gray-200"
                        aria-label="Swap languages"
                    >
                        <ArrowRightLeft size={20} className="md:rotate-0 rotate-90" />
                    </button>
                     <div className="w-full md:w-1/3">
                        <select title="Target Language" value={targetLang} onChange={e => setTargetLang(e.target.value)} className={selectClasses}>
                            {languageList.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="relative">
                         <textarea
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            rows={8}
                            className="w-full h-full bg-tertiary border border-gray-200 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary placeholder-text-secondary resize-none text-lg leading-relaxed"
                            placeholder="Enter text..."
                        />
                    </div>

                    {/* Output */}
                    <div className="relative">
                         <div className="w-full h-full bg-tertiary border border-gray-200 rounded-2xl p-5 min-h-[14rem] text-text-primary text-lg leading-relaxed flex flex-col">
                            {isTranslating ? (
                                <div className="flex-grow flex items-center justify-center text-accent gap-2">
                                    <Loader2 className="animate-spin" size={24} /> Translating...
                                </div>
                            ) : translatedText ? (
                                <div className="flex-grow">{translatedText}</div>
                            ) : (
                                <span className="text-text-secondary italic">Translation will appear here...</span>
                            )}
                            
                            {translatedText && !isTranslating && (
                                <button 
                                    onClick={handlePlayAudio}
                                    disabled={isGeneratingAudio}
                                    className="absolute bottom-4 right-4 bg-text-primary text-secondary p-3 rounded-full hover:bg-gray-700 disabled:bg-gray-300 transition-all shadow-lg"
                                    aria-label="Play audio"
                                >
                                    {isGeneratingAudio 
                                        ? <Loader2 size={20} className="animate-spin text-accent" />
                                        : <Volume2 size={24} />
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleTranslate}
                        disabled={isTranslating || !inputText.trim()}
                        className="w-full bg-accent text-white py-4 rounded-xl hover:bg-accent-hover disabled:bg-tertiary disabled:text-text-secondary font-bold text-lg shadow-lg shadow-accent/20 transition-all transform active:scale-[0.98]"
                    >
                        {isTranslating ? 'Translating...' : 'Translate Text'}
                    </button>
                </div>
                {error && <p className="text-center text-red-500 mt-4 bg-red-500/10 p-2 rounded-lg">{error}</p>}
            </div>
        </div>
    );
};

export default Interpreter;