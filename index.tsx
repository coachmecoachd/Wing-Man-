import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown@9';

// --- POLYFILL PROCESS.ENV ---
// This ensures the app doesn't crash if process.env is missing in the browser.
if (typeof process === 'undefined') {
  (window as any).process = { env: { API_KEY: '' } };
}

// --- TYPES ---

type View = 'dashboard' | 'profiles' | 'texter' | 'planner' | 'gifts' | 'advice' | 'interpreter' | 'settings';

interface UserAccount {
  username: string;
  displayName: string;
  avatarUrl: string;
  zipCode: string;
}

interface PersonProfile {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  likes: string;
  dislikes: string;
  hobbies: string;
  occupation: string;
  notes: string;
  zipCode?: string;
}

interface PlannedDate {
  id: string;
  title: string;
  personId: string;
  date: string;
  location: string;
  notes: string;
}

interface Message {
  id: number;
  sender: 'them' | 'me';
  text: string;
}

interface DatingAdviceResponse {
  keyVibe: string;
  dos: string[];
  donts: string[];
  outfitSuggestion: {
    description: string;
    reasoning: string;
  };
  conversationStarters: string[];
  icebreakerJoke: string;
  questionAnswer: string;
}

// --- HOOKS ---

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
      setStoredValue(initialValue);
    }
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// --- SERVICES ---

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!ai) {
        // Note: In a real production app, API keys should be handled by a backend.
        // For this browser-only demo, we assume it's injected or polyfilled.
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.warn("API_KEY not found in process.env");
        }
        ai = new GoogleGenAI({ apiKey: apiKey || '' });
    }
    return ai;
};

const getReplySuggestion = async (messages: Message[]): Promise<string> => {
  try {
    const gemini = getAiClient();
    const conversationHistory = messages.map(m => `${m.sender === 'me' ? 'Me' : 'Them'}: ${m.text}`).join('\n');
    const prompt = `
      You are Wing Man, a dating assistant AI. Your goal is to help users craft engaging, respectful, and charming replies in their dating conversations.
      Analyze the following conversation and suggest a great reply for "Me". 
      Provide 2-3 distinct options, each with a brief explanation of the vibe (e.g., "Playful & Witty", "Direct & Confident", "Curious & Engaging").
      Format the response in Markdown.

      Conversation History:
      ${conversationHistory}
      
      Suggest a reply for "Me":
      `;
    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error getting reply suggestion:", error);
    return "Failed to get reply suggestion from AI. Please check your API Key.";
  }
};

const generateDateIdeas = async (profile: PersonProfile, userZip?: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const locationContext = userZip ? `The user is located in or near zip code ${userZip}. Please prioritize local venues or activities in this area if specific locations are mentioned.` : '';
        
        const prompt = `
        Based on this person's profile, suggest 3 creative and personalized date ideas. For each idea, provide a title, a brief description, and why it's a good fit for them.
        ${locationContext}
        
        **Profile:**
        - **Name:** ${profile.name}
        - **Description:** ${profile.description}
        - **Likes:** ${profile.likes}
        - **Dislikes:** ${profile.dislikes}
        - **Hobbies:** ${profile.hobbies}
        - **Occupation:** ${profile.occupation}
        ${profile.zipCode ? `- **Their Location (Zip):** ${profile.zipCode}` : ''}
        
        Format your response in Markdown.
        `;
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Sorry, I couldn't generate ideas.";
    } catch (error) {
        console.error("Error generating date ideas:", error);
        return "Failed to generate date ideas. Please check your API Key.";
    }
};

const generateGiftIdeas = async (profile: PersonProfile, userZip?: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const locationContext = userZip ? `The user is located in or near zip code ${userZip}. If suggesting experiences or local shops, consider this location.` : '';

        const prompt = `
        You are a thoughtful gift-giving assistant. Based on the provided profile, brainstorm 3-5 unique and personalized gift ideas. For each idea, explain why it would be a great gift for this person.
        ${locationContext}

        Also, for one of the ideas that could be a custom-printed item (like a mug, t-shirt, or poster), provide a detailed, descriptive prompt that could be used with an AI image generator to create a cool design.
        
        **Profile:**
        - **Name:** ${profile.name}
        - **Likes:** ${profile.likes}
        - **Dislikes:** ${profile.dislikes}
        - **Hobbies:** ${profile.hobbies}

        Format your response in Markdown. The image prompt should be clearly labeled and enclosed in a code block.
        `;
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Sorry, I couldn't generate gift ideas.";
    } catch (error) {
        console.error("Error generating gift ideas:", error);
        return "Failed to generate gift ideas.";
    }
};

const generateGiftImage = async (prompt: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image was generated.");

    } catch (error) {
        console.error("Error generating gift image:", error);
        throw new Error("Failed to generate image.");
    }
};

const getDatingAdvice = async (dateType: string, question: string): Promise<DatingAdviceResponse> => {
    try {
        const gemini = getAiClient();
        const prompt = `
        You are Wing Man, an AI dating coach. Provide advice for a "${dateType}" date.
        The user has a specific question: "${question}".
        
        Please provide a comprehensive response in the requested JSON format. The vibe should be confident, friendly, and supportive.
        `;

        const schema = {
            type: Type.OBJECT,
            properties: {
                keyVibe: { type: Type.STRING, description: "A short, catchy phrase for the date's overall vibe." },
                dos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key things to do." },
                donts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key things to avoid." },
                outfitSuggestion: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: "A brief description of a suitable outfit." },
                        reasoning: { type: Type.STRING, description: "Why this outfit works for the occasion." }
                    },
                    required: ['description', 'reasoning']
                },
                conversationStarters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 interesting questions or topics to bring up." },
                icebreakerJoke: { type: Type.STRING, description: "A light-hearted, clean joke to break the ice." },
                questionAnswer: { type: Type.STRING, description: "A direct and thoughtful answer to the user's specific question." }
            },
            required: ['keyVibe', 'dos', 'donts', 'outfitSuggestion', 'conversationStarters', 'questionAnswer']
        };

        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as DatingAdviceResponse;
    } catch (error) {
        console.error("Error getting dating advice:", error);
        throw new Error("Failed to get dating advice. The AI might be having a moment.");
    }
};

const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only return the translated text, with no extra explanations or formatting.\n\nText: "${text}"`;
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error translating text:", error);
        throw new Error("Failed to translate text.");
    }
};

const generateSpeech = async (text: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech.");
    }
};

// --- HELPERS ---

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

// --- COMPONENTS ---

// LOGIN COMPONENT
const Login: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-primary font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          <span className="text-accent">Wing</span> Man
        </h1>
        <p className="text-lg text-gray-400 mb-8">Your Personal Dating AI Assistant</p>
        
        <div className="bg-secondary p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your username to access your profile.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-tertiary border border-tertiary rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter a username"
              />
              <p className="text-xs text-gray-500 mt-3">
                No password required. All data is stored securely on this device.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-500 font-bold transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
         <footer className="text-center p-4 mt-8">
          <p className="text-sm text-gray-500">
             Wing Man &copy; {new Date().getFullYear()}
          </p>
      </footer>
      </div>
    </div>
  );
};

// HEADER COMPONENT
const Header: React.FC<{
  onLogout: () => void;
  toggleSidebar: () => void;
  userAccount: UserAccount;
  onOpenSettings: () => void;
}> = ({ onLogout, toggleSidebar, userAccount, onOpenSettings }) => {
  return (
    <header className="bg-tertiary shadow-md sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
           <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="User Profile"
          >
            <span className="text-gray-300 text-sm font-medium hidden sm:block group-hover:text-white transition-colors">
              {userAccount.displayName || userAccount.username}
            </span>
            {userAccount.avatarUrl ? (
                 <img src={userAccount.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-transparent group-hover:border-accent transition-colors" />
            ) : (
                <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center font-bold text-white text-sm group-hover:bg-red-600 transition-colors">
                  {(userAccount.displayName || userAccount.username).charAt(0).toUpperCase()}
                </div>
            )}
          </button>
          <div className="h-6 w-px bg-gray-600 mx-1"></div>
          <button
            onClick={onLogout}
            className="text-gray-300 hover:text-white p-2 rounded-full transition-colors"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

// SIDEBAR COMPONENT
const Sidebar: React.FC<{
  currentView: View;
  setView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}> = ({ currentView, setView, isSidebarOpen, setIsSidebarOpen }) => {
    const [isCollapsed, setIsCollapsed] = useLocalStorage('wingman-sidebar-collapsed', false);

    const sidebarClasses = `
        bg-secondary flex flex-col z-30 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        lg:relative lg:translate-x-0
        fixed h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    const NavLink = ({ label, viewName, icon }: any) => (
      <li className="px-3">
        <button
          onClick={() => setView(viewName)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
            currentView === viewName
              ? 'bg-accent text-white'
              : 'text-gray-300 hover:bg-tertiary hover:text-white'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <span className="flex-shrink-0">{icon}</span>
          <span className={`flex-1 text-left ${isCollapsed ? 'hidden' : 'block'}`}>{label}</span>
        </button>
      </li>
    );

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-20 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            />
            <aside className={sidebarClasses}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 flex-shrink-0`}>
                     <div className={`font-bold text-white ${isCollapsed ? 'hidden' : 'block'}`}>
                        <span className="text-accent text-xl">Wing</span>
                        <span className="text-xl"> Man</span>
                    </div>
                     <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block text-gray-400 hover:text-white"
                    >
                         {isCollapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>
                <nav className="flex-grow mt-4">
                    <ul className="space-y-1">
                        <NavLink label="Dashboard" viewName="dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} />
                        <NavLink label="Profiles" viewName="profiles" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} />
                        <NavLink label="Text Helper" viewName="texter" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>} />
                        <NavLink label="Date Planner" viewName="planner" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>} />
                        <NavLink label="Gift Lab" viewName="gifts" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>} />
                        <NavLink label="Advice" viewName="advice" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>} />
                        <NavLink label="Interpreter" viewName="interpreter" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.884 5.86 7 6.223v2.445c0 .35.345.622.684.598a3.987 3.987 0 012.632 2.632c.024.34.298.684.648.684h2.445c.363 0 .493.488.223.756A6.012 6.012 0 0111.973 15.67a6.013 6.013 0 01-7.64-7.643z" clipRule="evenodd" /></svg>} />
                        <NavLink label="Settings" viewName="settings" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>} />
                    </ul>
                </nav>
            </aside>
        </>
    );
};

// DASHBOARD COMPONENT
const Dashboard: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div onClick={onClick} className="bg-secondary p-6 rounded-lg shadow-lg hover:shadow-accent/50 hover:-translate-y-1 transform transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-tertiary text-accent mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Wing Man: Your Personal Dating <span className="text-accent">AI Assistant</span></h2>
        <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">Like having your best friend in your pocket. Never run out of things to say or ideas for dates. Wing Man has your back.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard title='Manage Profiles' description='Create detailed profiles for people you are interested in.' icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>} onClick={() => setView('profiles')} />
        <FeatureCard title='Text Message Helper' description='Stuck on what to reply? Get AI-powered suggestions.' icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} onClick={() => setView('texter')} />
        <FeatureCard title='Creative Date Planner' description='Generate unique date ideas based on personality profiles.' icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} onClick={() => setView('planner')} />
        <FeatureCard title='Thoughtful Gift Lab' description='Get inspired with personalized gift ideas and custom designs.' icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>} onClick={() => setView('gifts')} />
        <FeatureCard title='Dating Advice' description='Get expert advice on what to wear, say, and do.' icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} onClick={() => setView('advice')} />
        <FeatureCard title='Travel Interpreter' description='Translate text and play it back with natural audio.' icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.06 11.06l-1.06-1.06a2 2 0 010-2.828l4-4a2 2 0 012.828 0l3 3a2 2 0 010 2.828l-1.06 1.06M9 17l6-6" /></svg>} onClick={() => setView('interpreter')} />
      </div>
    </div>
  );
};

// PROFILE MANAGER COMPONENT
const ProfileManager: React.FC<{
  profiles: PersonProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<PersonProfile[]>>;
  userZip?: string;
}> = ({ profiles, setProfiles, userZip }) => {
  const [selectedProfile, setSelectedProfile] = useState<PersonProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveProfile = (profileToSave: PersonProfile) => {
    if (profileToSave.id) { // Existing profile
      setProfiles(profiles.map(p => p.id === profileToSave.id ? profileToSave : p));
    } else { // New profile
      setProfiles([...profiles, { ...profileToSave, id: Date.now().toString(), avatarUrl: `https://picsum.photos/seed/${Date.now()}/200` }]);
    }
    setSelectedProfile(null);
    setIsCreating(false);
  };
  
  const handleDeleteProfile = (id: string) => {
      if (window.confirm("Are you sure you want to delete this profile?")) {
        setProfiles(profiles.filter(p => p.id !== id));
      }
  }

  // Profile Form Sub-Component
  const ProfileForm = ({ profile: initialProfile, onSave, onCancel }: any) => {
    const [profile, setProfile] = useState(initialProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: any) => {
      const { name, value } = e.target;
      setProfile((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSave(profile); }} className="space-y-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
            <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full object-cover bg-tertiary border-4 border-tertiary group-hover:border-accent transition-colors" />
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
            </div>
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">AI Description</label>
                  <textarea name="description" rows={3} value={profile.description} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent" placeholder="A kind-hearted software engineer..."></textarea>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-400">Occupation</label><input type="text" name="occupation" value={profile.occupation} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md py-2 px-3 focus:outline-none focus:ring-accent" /></div>
            <div><label className="block text-sm font-medium text-gray-400">Zip Code</label><input type="text" name="zipCode" value={profile.zipCode || ''} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md py-2 px-3 focus:outline-none focus:ring-accent" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-400">Hobbies</label><input type="text" name="hobbies" value={profile.hobbies} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md py-2 px-3 focus:outline-none focus:ring-accent" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-400">Likes</label><textarea name="likes" rows={2} value={profile.likes} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md py-2 px-3 focus:outline-none focus:ring-accent"></textarea></div>
            <div><label className="block text-sm font-medium text-gray-400">Dislikes</label><textarea name="dislikes" rows={2} value={profile.dislikes} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md py-2 px-3 focus:outline-none focus:ring-accent"></textarea></div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onCancel} className="bg-tertiary text-gray-300 px-4 py-2 rounded-md hover:bg-secondary">Cancel</button>
          <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-lg">Save Profile</button>
        </div>
      </form>
    );
  };

  if (selectedProfile) {
    // Inline Detail View for brevity
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <button onClick={() => setSelectedProfile(null)} className="text-accent hover:text-red-400 flex items-center gap-2">Back to Profiles</button>
                <button onClick={() => setIsCreating(true)} className="bg-tertiary text-gray-300 px-4 py-2 rounded-md">Edit</button>
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
                <div className="text-center"><img src={selectedProfile.avatarUrl} className="w-32 h-32 rounded-full object-cover mx-auto" /><h2 className="text-2xl font-bold mt-4">{selectedProfile.name}</h2></div>
                <div className="flex-grow"><p className="italic text-gray-300 mb-4">"{selectedProfile.description}"</p><div className="grid grid-cols-2 gap-4 text-sm"><div><strong>Likes:</strong> {selectedProfile.likes}</div><div><strong>Dislikes:</strong> {selectedProfile.dislikes}</div><div className="col-span-2"><strong>Hobbies:</strong> {selectedProfile.hobbies}</div></div></div>
            </div>
        </div>
    );
  }
  
  if (isCreating) {
      const newProfile: PersonProfile = { id: '', name: '', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`, description: '', likes: '', dislikes: '', hobbies: '', occupation: '', notes: '' };
      return <div className="bg-secondary p-6 rounded-lg shadow-lg"><h2 className="text-xl font-bold mb-4">Create New Profile</h2><ProfileForm profile={newProfile} onSave={handleSaveProfile} onCancel={() => setIsCreating(false)} /></div>;
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold">Your Profiles</h2><button onClick={() => setIsCreating(true)} className="bg-accent text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-lg">New Profile</button></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profiles.map(p => (
                <div key={p.id} className="bg-secondary rounded-lg shadow-lg overflow-hidden group relative cursor-pointer" onClick={() => setSelectedProfile(p)}>
                     <button onClick={(e) => { e.stopPropagation(); handleDeleteProfile(p.id); }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-accent">X</button>
                    <img src={p.avatarUrl} className="w-full h-48 object-cover" />
                    <div className="p-4"><h3 className="text-lg font-bold truncate">{p.name}</h3><p className="text-sm text-gray-400 truncate">{p.occupation}</p></div>
                </div>
            ))}
        </div>
    </div>
  );
};

// TEXT ANALYZER COMPONENT
const TextAnalyzer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sender, setSender] = useState<'them' | 'me'>('them');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { id: Date.now(), sender, text: newMessage }]);
    setNewMessage('');
  };

  const handleGetSuggestion = async () => {
    if (messages.length === 0) return;
    setIsLoading(true);
    setSuggestion('');
    const result = await getReplySuggestion(messages);
    setSuggestion(result);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Text Helper</h2>
        <div className="bg-secondary p-4 rounded-lg shadow-lg space-y-4">
          <div className="h-96 overflow-y-auto p-4 bg-primary rounded-md flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'me' ? 'bg-accent text-white' : 'bg-tertiary text-gray-200'}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={sender} onChange={(e) => setSender(e.target.value as 'them' | 'me')} className="bg-tertiary rounded-md p-2"><option value="them">Them</option><option value="me">Me</option></select>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMessage()} className="flex-grow bg-tertiary rounded-md p-2" placeholder="Type message..." />
            <button onClick={addMessage} className="bg-tertiary text-white p-2 rounded-md">Add</button>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => { setMessages([]); setSuggestion(''); }} className="text-sm text-gray-400">Clear</button>
            <button onClick={handleGetSuggestion} disabled={isLoading || messages.length === 0} className="bg-accent text-white px-6 py-2 rounded-md">{isLoading ? 'Thinking...' : 'Get Advice'}</button>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4">AI Suggestion</h2>
        <div className="bg-secondary p-4 rounded-lg shadow-lg min-h-[28rem]">
            {suggestion ? <div className="prose prose-invert max-w-none"><ReactMarkdown>{suggestion}</ReactMarkdown></div> : <p className="text-gray-500 text-center pt-20">Suggestions will appear here.</p>}
        </div>
      </div>
    </div>
  );
};

// DATE PLANNER COMPONENT
const DatePlanner: React.FC<{ dates: PlannedDate[]; setDates: React.Dispatch<React.SetStateAction<PlannedDate[]>>; profiles: PersonProfile[] }> = ({ dates, setDates, profiles }) => {
  const [form, setForm] = useState({ title: '', personId: '', date: '', location: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDates([...dates, { ...form, id: Date.now().toString() }]);
    setForm({ title: '', personId: '', date: '', location: '', notes: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-3xl font-bold mb-6">Your Dates</h2>
        {dates.map(d => (
             <div key={d.id} className="bg-secondary p-4 rounded-lg shadow-lg flex justify-between">
                <div><h4 className="font-bold text-lg text-white">{d.title}</h4><p className="text-sm text-gray-400">{new Date(d.date).toLocaleString()} @ {d.location}</p></div>
                <button onClick={() => setDates(dates.filter(x => x.id !== d.id))} className="text-red-500">Delete</button>
            </div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-bold text-white">New Date</h3>
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-tertiary p-2 rounded" required />
          <select value={form.personId} onChange={e => setForm({...form, personId: e.target.value})} className="w-full bg-tertiary p-2 rounded" required><option value="">Select Profile</option>{profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-tertiary p-2 rounded" required />
          <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-tertiary p-2 rounded" />
          <button type="submit" className="w-full bg-accent p-2 rounded text-white">Add Date</button>
        </form>
      </div>
    </div>
  );
};

// GIFT LAB COMPONENT
const GiftLab: React.FC<{ profiles: PersonProfile[]; userZip?: string }> = ({ profiles, userZip }) => {
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const p = profiles.find(x => x.id === selectedProfileId);
    if (!p) return;
    setIsGenerating(true);
    const res = await generateGiftIdeas(p, userZip);
    setIdeas(res);
    setIsGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-secondary p-6 rounded-lg shadow-lg space-y-6">
        <select value={selectedProfileId} onChange={e => setSelectedProfileId(e.target.value)} className="w-full bg-tertiary p-2 rounded"><option value="">Select Profile</option>{profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <button onClick={handleGenerate} disabled={!selectedProfileId || isGenerating} className="w-full bg-accent p-2 rounded text-white">{isGenerating ? 'Generating...' : 'Get Ideas'}</button>
        {ideas && <div className="prose prose-invert bg-primary p-4 rounded"><ReactMarkdown>{ideas}</ReactMarkdown></div>}
      </div>
    </div>
  );
};

// DATING ADVICE COMPONENT
const DatingAdvice: React.FC = () => {
    const [advice, setAdvice] = useState<DatingAdviceResponse | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleGetAdvice = async () => {
        setLoading(true);
        try {
            const res = await getDatingAdvice("First Date", "General tips");
            setAdvice(res);
        } catch (e) { alert("Error"); }
        setLoading(false);
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quick Advice</h2>
            <button onClick={handleGetAdvice} className="bg-accent px-4 py-2 rounded text-white mb-4">{loading ? "Asking..." : "Get First Date Tips"}</button>
            {advice && (
                <div className="space-y-4">
                    <div className="bg-tertiary p-4 rounded"><strong>Vibe:</strong> {advice.keyVibe}</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>Do:</strong><ul>{advice.dos.map(d => <li key={d}>{d}</li>)}</ul></div>
                        <div><strong>Don't:</strong><ul>{advice.donts.map(d => <li key={d}>{d}</li>)}</ul></div>
                    </div>
                </div>
            )}
        </div>
    )
}

// INTERPRETER COMPONENT
const Interpreter: React.FC = () => {
    const [text, setText] = useState('');
    const [translated, setTranslated] = useState('');
    
    const handleTranslate = async () => {
        const res = await translateText(text, "English", "Spanish");
        setTranslated(res);
    }

    return (
        <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Interpreter</h2>
            <textarea className="w-full bg-tertiary p-2 rounded mb-4" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="English text..." />
            <button onClick={handleTranslate} className="bg-accent px-4 py-2 rounded text-white mb-4">Translate to Spanish</button>
            {translated && <div className="bg-primary p-4 rounded">{translated}</div>}
        </div>
    )
}

// USER SETTINGS COMPONENT
const UserSettings: React.FC<{ userAccount: UserAccount; onSave: (a: UserAccount) => void; onDeleteAccount: () => void }> = ({ userAccount, onSave, onDeleteAccount }) => {
    const [data, setData] = useState(userAccount);
    return (
        <div className="bg-secondary p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-4 mb-8">
                <div><label>Display Name</label><input value={data.displayName} onChange={e => setData({...data, displayName: e.target.value})} className="w-full bg-tertiary p-2 rounded" /></div>
                <div><label>Zip Code</label><input value={data.zipCode} onChange={e => setData({...data, zipCode: e.target.value})} className="w-full bg-tertiary p-2 rounded" /></div>
                <button onClick={() => onSave(data)} className="bg-accent px-4 py-2 rounded text-white w-full">Save</button>
            </div>
            <div className="border-t border-red-900 pt-4">
                <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                <button onClick={onDeleteAccount} className="border border-red-500 text-red-500 px-4 py-2 rounded w-full hover:bg-red-500 hover:text-white">Delete All Data</button>
            </div>
        </div>
    )
}

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('wingman-currentUser', null);
  const [view, setView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const profileKey = currentUser ? `${currentUser}-wingman-profiles` : 'anonymous-profiles';
  const dateKey = currentUser ? `${currentUser}-wingman-dates` : 'anonymous-dates';
  const accountKey = currentUser ? `${currentUser}-wingman-account` : 'anonymous-account';

  const [profiles, setProfiles] = useLocalStorage<PersonProfile[]>(profileKey, []);
  const [dates, setDates] = useLocalStorage<PlannedDate[]>(dateKey, []);
  const [userAccount, setUserAccount] = useLocalStorage<UserAccount>(accountKey, {
      username: currentUser || '',
      displayName: currentUser || '',
      avatarUrl: '',
      zipCode: ''
  });

  useEffect(() => {
      if (currentUser && userAccount.username !== currentUser) {
          setUserAccount(prev => ({...prev, username: currentUser, displayName: prev.displayName || currentUser}));
      }
  }, [currentUser]);

  const handleLogout = () => setCurrentUser(null);

  const handleDeleteAccount = () => {
    if (currentUser) {
        localStorage.removeItem(`${currentUser}-wingman-profiles`);
        localStorage.removeItem(`${currentUser}-wingman-dates`);
        localStorage.removeItem(`${currentUser}-wingman-account`);
        handleLogout();
    }
  };

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard setView={setView} />;
      case 'profiles': return <ProfileManager profiles={profiles} setProfiles={setProfiles} userZip={userAccount.zipCode} />;
      case 'texter': return <TextAnalyzer />;
      case 'planner': return <DatePlanner dates={dates} setDates={setDates} profiles={profiles} />;
      case 'gifts': return <GiftLab profiles={profiles} userZip={userAccount.zipCode} />;
      case 'advice': return <DatingAdvice />;
      case 'interpreter': return <Interpreter />;
      case 'settings': return <UserSettings userAccount={userAccount} onSave={(updated) => { setUserAccount(updated); setView('dashboard'); }} onDeleteAccount={handleDeleteAccount} />;
      default: return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary font-sans flex text-white">
      <Sidebar currentView={view} setView={setView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onLogout={handleLogout} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userAccount={userAccount} onOpenSettings={() => setView('settings')} />
        <main className="flex-grow overflow-y-auto p-4 sm:p-6">
            {renderView()}
        </main>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");
const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
