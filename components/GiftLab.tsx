import React, { useState } from 'react';
import { PersonProfile } from '../types';
import { generateGiftIdeas, generateGiftImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Image as ImageIcon, Loader2, Gift } from 'lucide-react';

const GiftLab: React.FC<{ profiles: PersonProfile[]; userZip?: string }> = ({ profiles, userZip }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [ideas, setIdeas] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const inputClasses = "w-full bg-tertiary/50 border border-stone-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-white placeholder-slate-500 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-400 mb-2 ml-1 uppercase tracking-wider text-xs";

  const handleGenerateIdeas = async () => {
    if (!selectedProfileId) return;
    const profile = profiles.find(p => p.id === selectedProfileId);
    if (!profile) return;
    
    setIsGeneratingIdeas(true);
    setIdeas('');
    setGeneratedImage('');
    setImagePrompt('');
    
    try {
        const result = await generateGiftIdeas(profile, userZip);
        setIdeas(result);
    } catch (error) {
        console.error(error);
        setIdeas('Failed to generate ideas. Please try again.');
    }
    setIsGeneratingIdeas(false);
  };
  
  const handleGenerateImage = async () => {
      if (!imagePrompt) return;
      setIsGeneratingImage(true);
      setGeneratedImage('');
      try {
          const imageUrl = await generateGiftImage(imagePrompt);
          setGeneratedImage(imageUrl);
      } catch (error) {
          console.error(error);
          alert('Failed to generate image. Please try again.');
      }
      setIsGeneratingImage(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-white tracking-tight">Gift Lab</h2>
        <p className="mt-3 text-xl text-slate-400 max-w-2xl mx-auto">Thoughtful ideas & custom designs, instantly.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls and Ideas */}
        <div className="bg-secondary p-8 rounded-[2rem] shadow-2xl border border-tertiary space-y-8 h-full">
          <div>
            <label htmlFor="profile-select" className={labelClasses}>1. Who is this for?</label>
            <select
              id="profile-select"
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>Choose someone...</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerateIdeas}
            disabled={!selectedProfileId || isGeneratingIdeas}
            className="w-full bg-accent text-white px-6 py-4 rounded-xl hover:bg-accent-hover disabled:bg-tertiary disabled:text-slate-500 font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            {isGeneratingIdeas ? <><Loader2 size={20} className="animate-spin" /> Brainstorming...</> : <><Sparkles size={20} /> 2. Generate Gift Ideas</>}
          </button>
          
          <div className="min-h-[200px] bg-black/20 rounded-2xl border border-white/5 p-6 relative">
            {isGeneratingIdeas && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm rounded-2xl z-10">
                    <div className="text-center text-slate-400">
                        <Loader2 size={32} className="animate-spin mx-auto mb-3 text-accent" />
                        <p>AI is thinking...</p>
                    </div>
                </div>
            )}
            
            {ideas ? (
              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-accent prose-strong:text-white animate-fade-in">
                <ReactMarkdown>{ideas}</ReactMarkdown>
              </div>
            ) : (
                <div className="text-center text-slate-500 py-10 opacity-60">
                    <Gift size={40} className="mx-auto mb-3" />
                    <p className="font-medium">Select a profile to start.</p>
                </div>
            )}
          </div>
        </div>

        {/* Image Generation */}
        <div className="bg-secondary p-8 rounded-[2rem] shadow-2xl border border-tertiary space-y-8 lg:sticky top-24">
          <div>
            <label htmlFor="image-prompt" className={labelClasses}>3. Create Visual Design</label>
            <textarea
              id="image-prompt"
              rows={3}
              value={imagePrompt}
              onChange={e => setImagePrompt(e.target.value)}
              className={inputClasses}
              placeholder="Paste a prompt from the ideas here (e.g., 'A retro poster design of a cat in space')..."
            />
          </div>
          <button
            onClick={handleGenerateImage}
            disabled={!imagePrompt || isGeneratingImage}
            className="w-full bg-white text-stone-900 px-6 py-4 rounded-xl hover:bg-slate-200 disabled:bg-tertiary disabled:text-slate-500 font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            {isGeneratingImage ? <><Loader2 size={20} className="animate-spin" /> Rendering...</> : <><ImageIcon size={20}/> 4. Generate Design</>}
          </button>

          <div className="aspect-square bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden border border-tertiary/50 relative group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            
            {isGeneratingImage ? (
                <div className="text-center text-slate-400 z-10">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-white" />
                    <p className="font-medium text-white">Creating masterpiece...</p>
                </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="Generated gift design" className="object-contain w-full h-full animate-fade-in z-10" />
            ) : (
              <div className="text-center text-slate-600 p-8 z-10 opacity-60">
                <ImageIcon size={64} className="mx-auto mb-4" />
                <p className="text-lg font-semibold">No design yet</p>
                <p className="text-sm">Enter a prompt above to generate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftLab;