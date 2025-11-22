import React, { useState } from 'react';
import { PersonProfile } from '../types';
import { generateDateIdeas } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Camera, ArrowLeft, Edit, Trash2, Plus, User, Sparkles, StickyNote, Save, MapPin, Loader2, UsersRound, ArrowRight, CalendarHeart } from 'lucide-react';

const ProfileForm: React.FC<{
  profile: PersonProfile;
  onSave: (profile: PersonProfile) => void;
  onCancel: () => void;
}> = ({ profile: initialProfile, onSave, onCancel }) => {
  const [profile, setProfile] = useState(initialProfile);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  const handleRandomizeAvatar = () => {
    const randomId = Math.floor(Math.random() * 10000);
    setProfile(prev => ({
        ...prev,
        avatarUrl: `https://picsum.photos/seed/${randomId}/200`
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({
                ...prev,
                avatarUrl: reader.result as string
            }));
        };
        reader.readAsDataURL(file);
    }
  };

<<<<<<< HEAD
  const inputClasses = "block w-full bg-tertiary/50 border border-stone-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder-slate-500";
  const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1";
  const sectionClasses = "bg-secondary p-8 rounded-3xl border border-tertiary shadow-lg";
  const sectionHeaderClasses = "flex items-center gap-3 mb-6 border-b border-tertiary pb-4 text-xl font-bold text-stone-100";
=======
  const inputClasses = "block w-full bg-tertiary border border-gray-200 rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder-text-secondary";
  const labelClasses = "block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1";
  const sectionClasses = "bg-secondary p-8 rounded-3xl border border-gray-200 shadow-lg";
  const sectionHeaderClasses = "flex items-center gap-3 mb-6 border-b border-gray-200 pb-4 text-xl font-bold text-text-primary";
>>>>>>> 7a3b66c (Update README with correct repo info)

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative pb-24 animate-fade-in max-w-4xl mx-auto">
      
      <div className={sectionClasses}>
        <div className={sectionHeaderClasses}>
            <User size={24} className="text-accent" />
            <h3>The Basics</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
             <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                <div className="relative group cursor-pointer w-40 h-40" onClick={() => fileInputRef.current?.click()}>
<<<<<<< HEAD
                    <img src={profile.avatarUrl} alt={profile.name || 'Avatar'} className="w-full h-full rounded-full object-cover bg-tertiary border-4 border-tertiary shadow-xl group-hover:border-accent transition-colors duration-300" />
=======
                    <img src={profile.avatarUrl} alt={profile.name || 'Avatar'} className="w-full h-full rounded-full object-cover bg-tertiary border-4 border-gray-200 shadow-xl group-hover:border-accent transition-colors duration-300" />
>>>>>>> 7a3b66c (Update README with correct repo info)
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                         <Camera size={32} className="text-white" />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
<<<<<<< HEAD
                 <button type="button" onClick={handleRandomizeAvatar} className="text-xs font-bold text-accent hover:text-white transition-colors flex items-center gap-1 py-1 px-3 bg-accent/10 rounded-full">
=======
                 <button type="button" onClick={handleRandomizeAvatar} className="text-xs font-bold text-accent hover:text-text-primary transition-colors flex items-center gap-1 py-1 px-3 bg-accent/10 rounded-full">
>>>>>>> 7a3b66c (Update README with correct repo info)
                  <Sparkles size={12} /> Randomize
                </button>
            </div>

            <div className="flex-grow space-y-6 w-full">
                <div>
                  <label htmlFor="name" className={labelClasses}>Full Name</label>
                  <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className={inputClasses} placeholder="e.g. Sarah Connor" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="occupation" className={labelClasses}>Occupation</label>
                        <input type="text" name="occupation" id="occupation" value={profile.occupation} onChange={handleChange} className={inputClasses} placeholder="e.g. Graphic Designer" />
                    </div>
                     <div>
                        <label htmlFor="zipCode" className={labelClasses}>Zip Code</label>
                        <input type="text" name="zipCode" id="zipCode" value={profile.zipCode || ''} onChange={handleChange} className={inputClasses} placeholder="e.g. 90210" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className={sectionClasses}>
        <div className={sectionHeaderClasses}>
            <Sparkles size={24} className="text-purple-400"/>
            <h3>Personality & Interests</h3>
        </div>

        <div className="space-y-6">
            <div>
                <label htmlFor="description" className={labelClasses}>
<<<<<<< HEAD
                    AI Bio <span className="normal-case text-slate-500 font-normal italic ml-2">- The most important part for AI advice!</span>
=======
                    AI Bio <span className="normal-case text-text-secondary font-normal italic ml-2">- The most important part for AI advice!</span>
>>>>>>> 7a3b66c (Update README with correct repo info)
                </label>
                <textarea name="description" id="description" rows={3} value={profile.description} onChange={handleChange} className={inputClasses} placeholder="Describe them! A kind-hearted software engineer who loves hiking, indie music, and trying new coffee shops..."></textarea>
            </div>

            <div>
                <label htmlFor="hobbies" className={labelClasses}>Hobbies</label>
                <input type="text" name="hobbies" id="hobbies" value={profile.hobbies} onChange={handleChange} className={inputClasses} placeholder="Playing guitar, pottery, rock climbing" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
<<<<<<< HEAD
                    <label htmlFor="likes" className={`${labelClasses} text-green-400`}>Likes</label>
                    <textarea name="likes" id="likes" rows={3} value={profile.likes} onChange={handleChange} className={`${inputClasses} focus:border-green-500/50 focus:ring-green-500/20`} placeholder="Spicy food, old movies, dogs"></textarea>
                </div>
                <div>
                    <label htmlFor="dislikes" className={`${labelClasses} text-red-400`}>Dislikes</label>
=======
                    <label htmlFor="likes" className={`${labelClasses} text-green-500`}>Likes</label>
                    <textarea name="likes" id="likes" rows={3} value={profile.likes} onChange={handleChange} className={`${inputClasses} focus:border-green-500/50 focus:ring-green-500/20`} placeholder="Spicy food, old movies, dogs"></textarea>
                </div>
                <div>
                    <label htmlFor="dislikes" className={`${labelClasses} text-red-500`}>Dislikes</label>
>>>>>>> 7a3b66c (Update README with correct repo info)
                    <textarea name="dislikes" id="dislikes" rows={3} value={profile.dislikes} onChange={handleChange} className={`${inputClasses} focus:border-red-500/50 focus:ring-red-500/20`} placeholder="Loud bars, cilantro, traffic"></textarea>
                </div>
            </div>
        </div>
      </div>

      <div className={sectionClasses}>
        <div className={sectionHeaderClasses}>
            <StickyNote size={24} className="text-yellow-400" />
            <h3>Private Notes</h3>
        </div>
         <div>
            <label htmlFor="notes" className={labelClasses}>Things to remember</label>
            <textarea name="notes" id="notes" rows={4} value={profile.notes || ''} onChange={handleChange} className={inputClasses} placeholder="Allergic to peanuts, birthday is in June, prefers text over call."></textarea>
        </div>
      </div>
      
<<<<<<< HEAD
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-6 bg-secondary/90 backdrop-blur-xl border-t border-tertiary z-20 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl text-slate-400 font-bold hover:bg-tertiary hover:text-white transition-colors">
=======
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-6 bg-secondary/90 backdrop-blur-xl border-t border-gray-200 z-20 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl text-text-secondary font-bold hover:bg-tertiary hover:text-text-primary transition-colors">
>>>>>>> 7a3b66c (Update README with correct repo info)
              Cancel
          </button>
          <button type="submit" className="flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 font-bold active:scale-95">
              <Save size={20} />
              Save Profile
          </button>
      </div>
    </form>
  );
};


const ProfileDetail: React.FC<{
  profile: PersonProfile;
  onBack: () => void;
  onUpdateProfile: (profile: PersonProfile) => void;
  userZip?: string;
}> = ({ profile, onBack, onUpdateProfile, userZip }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [dateIdeas, setDateIdeas] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateIdeas = async () => {
        setIsLoading(true);
        setDateIdeas('');
        const ideas = await generateDateIdeas(profile, userZip);
        setDateIdeas(ideas);
        setIsLoading(false);
    };

    const handleSave = (updatedProfile: PersonProfile) => {
        onUpdateProfile(updatedProfile);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto pb-10">
                <div className="flex items-center gap-4 mb-8">
<<<<<<< HEAD
                    <button onClick={() => setIsEditing(false)} className="p-3 rounded-full hover:bg-tertiary transition-colors text-slate-400">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-extrabold text-stone-100">Edit Profile</h2>
=======
                    <button onClick={() => setIsEditing(false)} className="p-3 rounded-full hover:bg-tertiary transition-colors text-text-secondary">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-extrabold text-text-primary">Edit Profile</h2>
>>>>>>> 7a3b66c (Update README with correct repo info)
                </div>
                <ProfileForm profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
<<<<<<< HEAD
                <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Profiles
                </button>
                 <button onClick={() => setIsEditing(true)} className="bg-tertiary text-white px-6 py-2.5 rounded-xl hover:bg-stone-700 flex items-center gap-2 transition-all border border-stone-700 shadow-lg font-semibold">
=======
                <button onClick={onBack} className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Profiles
                </button>
                 <button onClick={() => setIsEditing(true)} className="bg-tertiary text-text-primary px-6 py-2.5 rounded-xl hover:bg-gray-200 flex items-center gap-2 transition-all border border-gray-200 shadow-lg font-semibold">
>>>>>>> 7a3b66c (Update README with correct repo info)
                   <Edit size={18} />
                    Edit Profile
                </button>
            </div>

<<<<<<< HEAD
            <div className="bg-secondary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-tertiary flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0 text-center md:text-left flex flex-col items-center md:items-start">
                    <img src={profile.avatarUrl} alt={profile.name} className="w-40 h-40 rounded-full object-cover bg-tertiary border-4 border-tertiary shadow-2xl" />
                    <h2 className="text-4xl font-black mt-6 text-white tracking-tight">{profile.name}</h2>
                    <p className="text-accent font-bold text-xl mt-1">{profile.occupation}</p>
                    {profile.zipCode && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-3 bg-tertiary px-4 py-1.5 rounded-full">
=======
            <div className="bg-secondary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-200 flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0 text-center md:text-left flex flex-col items-center md:items-start">
                    <img src={profile.avatarUrl} alt={profile.name} className="w-40 h-40 rounded-full object-cover bg-tertiary border-4 border-gray-200 shadow-2xl" />
                    <h2 className="text-4xl font-black mt-6 text-text-primary tracking-tight">{profile.name}</h2>
                    <p className="text-accent font-bold text-xl mt-1">{profile.occupation}</p>
                    {profile.zipCode && (
                        <div className="flex items-center gap-1.5 text-text-secondary text-sm mt-3 bg-tertiary px-4 py-1.5 rounded-full">
>>>>>>> 7a3b66c (Update README with correct repo info)
                            <MapPin size={14} /> 
                            {profile.zipCode}
                        </div>
                    )}
                </div>
                
<<<<<<< HEAD
                <div className="md:border-l border-tertiary md:pl-10 flex-grow space-y-8">
                     <div className="relative bg-tertiary/30 p-6 rounded-2xl border border-tertiary/50">
                        <p className="italic text-stone-200 text-lg leading-relaxed font-light">"{profile.description}"</p>
                     </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="bg-stone-950/50 p-5 rounded-2xl border border-tertiary/50">
                            <strong className="text-green-400 block uppercase text-xs tracking-widest mb-3 font-bold">Likes</strong> 
                            <p className="text-slate-300 leading-relaxed text-base">{profile.likes}</p>
                        </div>
                        <div className="bg-stone-950/50 p-5 rounded-2xl border border-tertiary/50">
                            <strong className="text-red-400 block uppercase text-xs tracking-widest mb-3 font-bold">Dislikes</strong> 
                            <p className="text-slate-300 leading-relaxed text-base">{profile.dislikes}</p>
                        </div>
                        <div className="sm:col-span-2 bg-stone-950/50 p-5 rounded-2xl border border-tertiary/50">
                            <strong className="text-blue-400 block uppercase text-xs tracking-widest mb-3 font-bold">Hobbies</strong> 
                            <p className="text-slate-300 leading-relaxed text-base">{profile.hobbies}</p>
                        </div>
                        {profile.notes && (
                            <div className="sm:col-span-2 bg-yellow-900/10 p-5 rounded-2xl border border-yellow-900/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <StickyNote size={16} className="text-yellow-500" />
                                    <strong className="text-yellow-500 uppercase text-xs tracking-widest font-bold">Private Notes</strong> 
                                </div>
                                <p className="text-slate-300 leading-relaxed text-base">{profile.notes}</p>
=======
                <div className="md:border-l border-gray-200 md:pl-10 flex-grow space-y-8">
                     <div className="relative bg-tertiary p-6 rounded-2xl border border-gray-200/50">
                        <p className="italic text-text-primary text-lg leading-relaxed font-light">"{profile.description}"</p>
                     </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/50">
                            <strong className="text-green-600 block uppercase text-xs tracking-widest mb-3 font-bold">Likes</strong> 
                            <p className="text-text-secondary leading-relaxed text-base">{profile.likes}</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/50">
                            <strong className="text-red-600 block uppercase text-xs tracking-widest mb-3 font-bold">Dislikes</strong> 
                            <p className="text-text-secondary leading-relaxed text-base">{profile.dislikes}</p>
                        </div>
                        <div className="sm:col-span-2 bg-gray-50 p-5 rounded-2xl border border-gray-200/50">
                            <strong className="text-blue-600 block uppercase text-xs tracking-widest mb-3 font-bold">Hobbies</strong> 
                            <p className="text-text-secondary leading-relaxed text-base">{profile.hobbies}</p>
                        </div>
                        {profile.notes && (
                            <div className="sm:col-span-2 bg-yellow-400/10 p-5 rounded-2xl border border-yellow-400/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <StickyNote size={16} className="text-yellow-600" />
                                    <strong className="text-yellow-700 uppercase text-xs tracking-widest font-bold">Private Notes</strong> 
                                </div>
                                <p className="text-text-secondary leading-relaxed text-base">{profile.notes}</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
                            </div>
                        )}
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-8 md:p-10 rounded-[2rem] shadow-2xl border border-tertiary relative overflow-hidden group">
=======
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-text-primary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-200 relative overflow-hidden group">
>>>>>>> 7a3b66c (Update README with correct repo info)
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-700"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
<<<<<<< HEAD
                            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><Sparkles className="text-accent" /> Date Ideas</h3>
                            <p className="text-slate-400 text-sm">AI-powered suggestions tailored for {profile.name}.</p>
                        </div>
                        <button onClick={handleGenerateIdeas} disabled={isLoading} className="bg-white text-stone-900 px-6 py-3 rounded-xl hover:bg-slate-200 disabled:bg-stone-600 disabled:text-stone-400 w-full sm:w-auto transition-all shadow-lg font-bold flex items-center justify-center gap-2">
=======
                            <h3 className="text-2xl font-bold text-text-primary mb-1 flex items-center gap-2"><Sparkles className="text-accent" /> Date Ideas</h3>
                            <p className="text-text-secondary text-sm">AI-powered suggestions tailored for {profile.name}.</p>
                        </div>
                        <button onClick={handleGenerateIdeas} disabled={isLoading} className="bg-text-primary text-secondary px-6 py-3 rounded-xl hover:bg-gray-700 disabled:bg-gray-300 disabled:text-text-secondary w-full sm:w-auto transition-all shadow-lg font-bold flex items-center justify-center gap-2">
>>>>>>> 7a3b66c (Update README with correct repo info)
                            {isLoading ? (
                                <><Loader2 size={20} className="animate-spin" /> Thinking...</>
                            ) : (
                                <>
                                    Generate Ideas
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                    
                    {isLoading && (
                         <div className="mt-8 space-y-4 animate-pulse opacity-50">
<<<<<<< HEAD
                            <div className="h-4 bg-tertiary rounded w-3/4"></div>
                            <div className="h-4 bg-tertiary rounded w-1/2"></div>
                            <div className="h-4 bg-tertiary rounded w-5/6"></div>
=======
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
>>>>>>> 7a3b66c (Update README with correct repo info)
                         </div>
                    )}
                    
                    {dateIdeas && (
<<<<<<< HEAD
                        <div className="mt-8 p-8 bg-black/20 rounded-2xl border border-white/5 prose prose-invert max-w-none prose-headings:text-accent prose-p:text-slate-300 prose-li:text-slate-300">
=======
                        <div className="mt-8 p-8 bg-white/50 rounded-2xl border border-gray-200 prose max-w-none prose-headings:text-accent prose-p:text-text-secondary prose-li:text-text-secondary">
>>>>>>> 7a3b66c (Update README with correct repo info)
                            <ReactMarkdown>{dateIdeas}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileList: React.FC<{
  profiles: PersonProfile[];
  onSelectProfile: (profile: PersonProfile) => void;
  onAddProfile: () => void;
  onDeleteProfile: (id: string) => void;
}> = ({ profiles, onSelectProfile, onAddProfile, onDeleteProfile }) => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div>
<<<<<<< HEAD
                    <h2 className="text-5xl font-extrabold text-white tracking-tight">Your Profiles</h2>
                    <p className="text-slate-400 mt-2 text-lg">Manage the important people in your dating life.</p>
=======
                    <h2 className="text-5xl font-extrabold text-text-primary tracking-tight">Your Profiles</h2>
                    <p className="text-text-secondary mt-2 text-lg">Manage the important people in your dating life.</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
                </div>
                <button onClick={onAddProfile} className="bg-accent text-white px-6 py-3.5 rounded-2xl hover:bg-accent-hover flex items-center gap-2 transition-all shadow-lg shadow-accent/20 font-bold active:scale-95 group">
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    Create Profile
                </button>
            </div>
            
            {profiles.length === 0 ? (
<<<<<<< HEAD
                <div className="text-center py-32 bg-secondary/50 rounded-[2rem] border-2 border-dashed border-tertiary flex flex-col items-center justify-center group hover:border-accent/50 transition-colors">
                    <div className="bg-tertiary/50 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-slate-500 group-hover:text-accent group-hover:scale-110 transition-all duration-500">
                        <UsersRound size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No profiles yet</h3>
                    <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">Add a profile to start generating personalized advice and date ideas. It's where the magic begins.</p>
                    <button onClick={onAddProfile} className="text-accent hover:text-white font-bold text-lg flex items-center gap-2 hover:underline underline-offset-4">
=======
                <div className="text-center py-32 bg-secondary rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group hover:border-accent/50 transition-colors">
                    <div className="bg-tertiary w-24 h-24 rounded-full flex items-center justify-center mb-6 text-gray-400 group-hover:text-accent group-hover:scale-110 transition-all duration-500">
                        <UsersRound size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-3">No profiles yet</h3>
                    <p className="text-text-secondary max-w-sm mb-8 leading-relaxed">Add a profile to start generating personalized advice and date ideas. It's where the magic begins.</p>
                    <button onClick={onAddProfile} className="text-accent hover:text-text-primary font-bold text-lg flex items-center gap-2 hover:underline underline-offset-4">
>>>>>>> 7a3b66c (Update README with correct repo info)
                        <Plus size={20} /> Add your first profile
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {profiles.map((p, idx) => (
                        <div 
                            key={p.id} 
<<<<<<< HEAD
                            className="bg-secondary rounded-3xl shadow-xl overflow-hidden group relative transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-tertiary cursor-pointer hover:border-accent/50 animate-slide-up"
=======
                            className="bg-secondary rounded-3xl shadow-xl overflow-hidden group relative transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-gray-200 cursor-pointer hover:border-accent/50 animate-slide-up"
>>>>>>> 7a3b66c (Update README with correct repo info)
                            style={{ animationDelay: `${idx * 100}ms` }}
                            onClick={() => onSelectProfile(p)}
                        >
                             <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteProfile(p.id); }} 
                                className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110"
                                aria-label="Delete profile"
                            >
                                <Trash2 size={18} />
                            </button>
                            
                            <div className="relative h-64 overflow-hidden">
<<<<<<< HEAD
                                 <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10 opacity-90" />
                                 <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                 <div className="absolute bottom-5 left-5 right-5 z-20">
                                     <h3 className="text-2xl font-bold text-white truncate drop-shadow-md">{p.name}</h3>
                                     <p className="text-sm text-slate-300 truncate opacity-90 font-medium">{p.occupation || 'No occupation'}</p>
=======
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-90" />
                                 <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                 <div className="absolute bottom-5 left-5 right-5 z-20">
                                     <h3 className="text-2xl font-bold text-white truncate drop-shadow-md">{p.name}</h3>
                                     <p className="text-sm text-gray-200 truncate opacity-90 font-medium">{p.occupation || 'No occupation'}</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
                                 </div>
                            </div>
                            
                            <div className="p-5 bg-secondary relative h-24">
<<<<<<< HEAD
                                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
=======
                                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
>>>>>>> 7a3b66c (Update README with correct repo info)
                                    {p.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const ProfileManager: React.FC<{
  profiles: PersonProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<PersonProfile[]>>;
  userZip?: string;
  onPlanDate: (profile: PersonProfile) => void;
}> = ({ profiles, setProfiles, userZip, onPlanDate }) => {
  const [selectedProfile, setSelectedProfile] = useState<PersonProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [promptProfile, setPromptProfile] = useState<PersonProfile | null>(null);

  const handleSaveProfile = (profileToSave: PersonProfile) => {
    const isNew = !profileToSave.id;
    let savedProfile = profileToSave;

    if (!isNew) { 
      setProfiles(profiles.map(p => p.id === profileToSave.id ? profileToSave : p));
    } else { 
      savedProfile = { ...profileToSave, id: Date.now().toString(), avatarUrl: profileToSave.avatarUrl || `https://picsum.photos/seed/${Date.now()}/200` };
      setProfiles([...profiles, savedProfile]);
    }
    setSelectedProfile(null);
    setIsCreating(false);

    if (isNew) {
        setPromptProfile(savedProfile);
    }
  };
  
  const handleDeleteProfile = (id: string) => {
      if (window.confirm("Are you sure you want to delete this profile?")) {
        setProfiles(profiles.filter(p => p.id !== id));
      }
  }

  if (promptProfile) {
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
<<<<<<< HEAD
              <div className="bg-secondary border border-tertiary w-full max-w-md rounded-[2rem] shadow-2xl p-10 text-center relative overflow-hidden">
=======
              <div className="bg-secondary border border-gray-200 w-full max-w-md rounded-[2rem] shadow-2xl p-10 text-center relative overflow-hidden">
>>>>>>> 7a3b66c (Update README with correct repo info)
                  <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                  <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <CalendarHeart size={48} className="text-accent" />
                  </div>
<<<<<<< HEAD
                  <h3 className="text-3xl font-extrabold text-white mb-3">Profile Created!</h3>
                  <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                      Ready to plan your first date with <span className="font-bold text-white">{promptProfile.name}</span>?
=======
                  <h3 className="text-3xl font-extrabold text-text-primary mb-3">Profile Created!</h3>
                  <p className="text-text-secondary mb-10 text-lg leading-relaxed">
                      Ready to plan your first date with <span className="font-bold text-text-primary">{promptProfile.name}</span>?
>>>>>>> 7a3b66c (Update README with correct repo info)
                  </p>
                  <div className="flex flex-col gap-4">
                      <button 
                          onClick={() => {
                              setPromptProfile(null);
                              onPlanDate(promptProfile);
                          }}
                          className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                      >
                          Yes, Plan a Date <ArrowRight size={20} />
                      </button>
                       <button 
                          onClick={() => setPromptProfile(null)}
<<<<<<< HEAD
                          className="w-full py-4 rounded-xl text-slate-500 font-semibold hover:bg-tertiary hover:text-white transition-colors"
=======
                          className="w-full py-4 rounded-xl text-text-secondary font-semibold hover:bg-tertiary hover:text-text-primary transition-colors"
>>>>>>> 7a3b66c (Update README with correct repo info)
                      >
                          Maybe Later
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  if (selectedProfile) {
    return <ProfileDetail 
        profile={selectedProfile} 
        onBack={() => setSelectedProfile(null)} 
        onUpdateProfile={handleSaveProfile}
        userZip={userZip}
    />;
  }
  
  if (isCreating) {
      const newProfile: PersonProfile = {
          id: '', name: '', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`, description: '', likes: '', dislikes: '', hobbies: '', occupation: '', notes: ''
      };
      return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-8">
<<<<<<< HEAD
                <button onClick={() => setIsCreating(false)} className="p-3 rounded-full hover:bg-tertiary transition-colors text-slate-400">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-extrabold text-stone-100">Create New Profile</h2>
=======
                <button onClick={() => setIsCreating(false)} className="p-3 rounded-full hover:bg-tertiary transition-colors text-text-secondary">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-extrabold text-text-primary">Create New Profile</h2>
>>>>>>> 7a3b66c (Update README with correct repo info)
            </div>
            <ProfileForm profile={newProfile} onSave={handleSaveProfile} onCancel={() => setIsCreating(false)} />
        </div>
      )
  }

  return <ProfileList profiles={profiles} onSelectProfile={setSelectedProfile} onAddProfile={() => setIsCreating(true)} onDeleteProfile={handleDeleteProfile} />;
};

export default ProfileManager;