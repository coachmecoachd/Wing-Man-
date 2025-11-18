
import React, { useState } from 'react';
import { PersonProfile } from '../types.ts';
import { generateDateIdeas } from '../services/geminiService.ts';
import ReactMarkdown from 'react-markdown@9';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full object-cover bg-tertiary border-4 border-tertiary group-hover:border-accent transition-colors" />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
              </div>
               <button 
                type="button" 
                onClick={handleRandomizeAvatar}
                className="mt-2 text-xs text-accent hover:text-white transition-colors"
              >
                Randomize Avatar
              </button>
          </div>

          {/* Main Info */}
          <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
                <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-400">AI Description</label>
                <textarea name="description" id="description" rows={3} value={profile.description} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., A kind-hearted software engineer who loves hiking and indie music."></textarea>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-400">Occupation</label>
            <input type="text" name="occupation" id="occupation" value={profile.occupation} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., Graphic Designer" />
        </div>
         <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-400">Zip Code (Optional)</label>
            <input type="text" name="zipCode" id="zipCode" value={profile.zipCode || ''} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., 90210" />
        </div>
      </div>

      <div>
        <label htmlFor="hobbies" className="block text-sm font-medium text-gray-400">Hobbies</label>
        <input type="text" name="hobbies" id="hobbies" value={profile.hobbies} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., Playing guitar, pottery, rock climbing" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="likes" className="block text-sm font-medium text-gray-400">Likes</label>
            <textarea name="likes" id="likes" rows={2} value={profile.likes} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., Spicy food, old movies"></textarea>
        </div>
        <div>
            <label htmlFor="dislikes" className="block text-sm font-medium text-gray-400">Dislikes</label>
            <textarea name="dislikes" id="dislikes" rows={2} value={profile.dislikes} onChange={handleChange} className="mt-1 block w-full bg-secondary border border-tertiary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" placeholder="e.g., Loud bars, cilantro"></textarea>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-tertiary">
        <button type="button" onClick={onCancel} className="bg-tertiary text-gray-300 px-4 py-2 rounded-md hover:bg-secondary transition-colors">Cancel</button>
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors shadow-lg">Save Profile</button>
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
            <div className="bg-secondary p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Editing {profile.name}</h2>
                <ProfileForm profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="text-accent hover:text-red-400 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    All Profiles
                </button>
                 <button onClick={() => setIsEditing(true)} className="bg-tertiary text-gray-300 px-4 py-2 rounded-md hover:bg-secondary flex items-center gap-2 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    Edit
                </button>
            </div>
            <div className="bg-secondary p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 text-center">
                    <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full object-cover bg-tertiary mx-auto" />
                    <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
                    <p className="text-gray-400">{profile.occupation}</p>
                    {profile.zipCode && <p className="text-gray-500 text-sm mt-1">📍 {profile.zipCode}</p>}
                </div>
                <div className="border-t md:border-t-0 md:border-l border-tertiary mt-4 md:mt-0 pt-4 md:pt-0 md:pl-6 flex-grow">
                     <p className="italic text-gray-300 mb-4 text-lg">"{profile.description}"</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-accent block">Likes:</strong> <span className="text-gray-300">{profile.likes}</span></div>
                        <div><strong className="text-accent block">Dislikes:</strong> <span className="text-gray-300">{profile.dislikes}</span></div>
                        <div className="sm:col-span-2"><strong className="text-accent block">Hobbies:</strong> <span className="text-gray-300">{profile.hobbies}</span></div>
                        {profile.notes && <div className="sm:col-span-2"><strong className="text-accent block">Notes:</strong> <span className="text-gray-300">{profile.notes}</span></div>}
                    </div>
                </div>
            </div>

            <div className="bg-secondary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Date Ideas</h3>
                <button onClick={handleGenerateIdeas} disabled={isLoading} className="bg-accent text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-500 w-full sm:w-auto transition-colors shadow-lg">
                    {isLoading ? 'Brainstorming...' : `Generate Ideas for ${profile.name}`}
                </button>
                {isLoading && <div className="mt-4 text-center text-gray-400 animate-pulse">Asking the AI...</div>}
                {dateIdeas && <div className="mt-4 p-4 bg-primary rounded-md prose prose-invert max-w-none prose-h3:text-accent prose-strong:text-white"><ReactMarkdown>{dateIdeas}</ReactMarkdown></div>}
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Profiles</h2>
                <button onClick={onAddProfile} className="bg-accent text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2 transition-colors shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    New Profile
                </button>
            </div>
            {profiles.length === 0 ? (
                <div className="text-center py-10 bg-secondary rounded-lg">
                    <p className="text-gray-400">No profiles yet. Add one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {profiles.map(p => (
                        <div key={p.id} className="bg-secondary rounded-lg shadow-lg overflow-hidden group relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                             <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteProfile(p.id); }} 
                                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                                aria-label="Delete profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                            </button>
                            <div onClick={() => onSelectProfile(p)} className="cursor-pointer">
                                <img src={p.avatarUrl} alt={p.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold truncate">{p.name}</h3>
                                    <p className="text-sm text-gray-400 truncate">{p.occupation || 'No occupation'}</p>
                                </div>
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
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Profile</h2>
            <ProfileForm profile={newProfile} onSave={handleSaveProfile} onCancel={() => setIsCreating(false)} />
        </div>
      )
  }

  return <ProfileList profiles={profiles} onSelectProfile={setSelectedProfile} onAddProfile={() => setIsCreating(true)} onDeleteProfile={handleDeleteProfile} />;
};

export default ProfileManager;
