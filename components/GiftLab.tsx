import React, { useState } from 'react';
import { PersonProfile, GiftIdea } from '../types';
import { generateGiftIdeas, generateGiftImage } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Loader2, Gift, ClipboardCopy, ShoppingBag } from 'lucide-react';

const GiftLab: React.FC<{ profiles: PersonProfile[]; userZip?: string }> = ({ profiles, userZip }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [ideas, setIdeas] = useState<GiftIdea[]>([]);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const inputClasses = "w-full bg-tertiary border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary placeholder-text-secondary transition-all";
  const labelClasses = "block text-sm font-bold text-text-secondary mb-2 ml-1 uppercase tracking-wider text-xs";

  const handleGenerateIdeas = async () => {
    if (!selectedProfileId) return;

    let profile: PersonProfile;

    if (selectedProfileId === 'generic') {
        profile = {
            id: 'generic',
            name: 'My Date / Friend',
            avatarUrl: '',
            description: 'I am looking for generally great, creative, and versatile gift ideas. I haven\'t specified a specific person, so provide options that are universally appreciated but still feel thoughtful and unique.',
            likes: 'Quality items, unique experiences, thoughtful gestures',
            dislikes: 'Cheap gags, impersonal gift cards',
            hobbies: 'Various interests',
            occupation: '',
            notes: ''
        };
    } else {
        const found = profiles.find(p => p.id === selectedProfileId);
        if (!found) return;
        profile = found;
    }
    
    setIsGeneratingIdeas(true);
    setIdeas([]);
    setGeneratedImage('');
    setImagePrompt('');
    
    try {
        const result = await generateGiftIdeas(profile, userZip);
        setIdeas(result);
    } catch (error) {
        console.error(error);
        setIdeas([]);
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
        <h2 className="text-5xl font-extrabold text-text-primary tracking-tight">Gift Lab</h2>
        <p className="mt-3 text-xl text-text-secondary max-w-2xl mx-auto">Thoughtful ideas & custom designs, instantly.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls and Ideas */}
        <div className="bg-secondary p-8 rounded-[2rem] shadow-2xl border border-gray-200 space-y-8 h-full">
          <div>
            <label htmlFor="profile-select" className={labelClasses}>1. Who is this for?</label>
            <select
              id="profile-select"
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>Choose someone...</option>
              <option value="generic">No one specific (General Ideas)</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerateIdeas}
            disabled={!selectedProfileId || isGeneratingIdeas}
            className="w-full bg-accent text-white px-6 py-4 rounded-xl hover:bg-accent-hover disabled:bg-tertiary disabled:text-text-secondary font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            {isGeneratingIdeas ? <><Loader2 size={20} className="animate-spin" /> Brainstorming...</> : <><Sparkles size={20} /> 2. Generate Gift Ideas</>}
          </button>
          
          <div className="min-h-[200px] bg-gray-50 rounded-2xl border border-gray-200/50 p-6 relative">
            {isGeneratingIdeas && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm rounded-2xl z-10">
                    <div className="text-center text-text-secondary">
                        <Loader2 size={32} className="animate-spin mx-auto mb-3 text-accent" />
                        <p>AI is thinking...</p>
                    </div>
                </div>
            )}
            
            {ideas.length > 0 ? (
                <div className="space-y-4 animate-fade-in">
                    {ideas.map((idea, idx) => {
                    const hasImagePrompt = idea.imagePrompt && idea.imagePrompt.trim() !== '';
                    const hasPurchaseUrl = idea.purchaseUrl && idea.purchaseUrl.trim() !== '';
                    return (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200/50 transition-all hover:border-accent/30 flex flex-col">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <h4 className="text-lg font-bold text-text-primary">{idea.title}</h4>
                                    <span className="text-xs flex-shrink-0 font-bold uppercase tracking-wider bg-accent/10 text-accent px-2.5 py-1 rounded-full">{idea.category}</span>
                                </div>
                                <p className="text-text-secondary mb-3 text-sm leading-relaxed">{idea.description}</p>
                                <div className="bg-tertiary p-3 rounded-lg text-sm border border-gray-200/50">
                                    <strong className="text-text-secondary font-semibold text-xs uppercase tracking-wide block mb-1">Reasoning:</strong>
                                    <p className="text-text-secondary italic text-xs leading-normal">{idea.reasoning}</p>
                                </div>
                            </div>
                            
                            {(hasImagePrompt || hasPurchaseUrl) && (
                                <div className="mt-4 space-y-2">
                                    {hasImagePrompt && (
                                        <div className="bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20">
                                            <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">AI Image Prompt:</p>
                                            <p className="text-sm font-mono text-yellow-800/80 bg-yellow-400/20 p-3 rounded-md mb-3 whitespace-pre-wrap break-words">{idea.imagePrompt}</p>
                                            <button 
                                                onClick={() => {
                                                    setImagePrompt(idea.imagePrompt!);
                                                    document.getElementById('image-prompt')?.focus();
                                                }}
                                                className="w-full text-center text-xs font-bold bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                            <ClipboardCopy size={14} /> Use This Prompt
                                            </button>
                                        </div>
                                    )}
                                    {hasPurchaseUrl && (
                                        <a
                                          href={idea.purchaseUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="w-full text-center text-xs font-bold bg-green-500/20 text-green-700 hover:bg-green-500/30 py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag size={14} /> Find Online
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                    })}
                </div>
            ) : (
                <div className="text-center text-text-secondary py-10 opacity-60">
                    <Gift size={40} className="mx-auto mb-3" />
                    <p className="font-medium">Select a profile to start.</p>
                </div>
            )}
          </div>
        </div>

        {/* Image Generation */}
        <div className="bg-secondary p-8 rounded-[2rem] shadow-2xl border border-gray-200 space-y-8 lg:sticky top-24">
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
            className="w-full bg-text-primary text-secondary px-6 py-4 rounded-xl hover:bg-gray-700 disabled:bg-tertiary disabled:text-text-secondary font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            {isGeneratingImage ? <><Loader2 size={20} className="animate-spin" /> Rendering...</> : <><ImageIcon size={20}/> 4. Generate Design</>}
          </button>

          <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200/50 relative group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
            
            {isGeneratingImage ? (
                <div className="text-center text-text-secondary z-10">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-text-primary" />
                    <p className="font-medium text-text-primary">Creating masterpiece...</p>
                </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="Generated gift design" className="object-contain w-full h-full animate-fade-in z-10" />
            ) : (
              <div className="text-center text-gray-400 p-8 z-10 opacity-60">
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