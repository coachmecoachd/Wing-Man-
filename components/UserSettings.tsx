import React, { useState, useRef } from 'react';
import { UserAccount } from '../types';
import { Upload, RefreshCw, CheckCircle2 } from 'lucide-react';

interface UserSettingsProps {
    userAccount: UserAccount;
    onSave: (account: UserAccount) => void;
    onReplayTutorial: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userAccount, onSave, onReplayTutorial }) => {
    const [formData, setFormData] = useState<UserAccount>(userAccount);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.displayName.trim()) {
            setError("Display name cannot be empty.");
            return;
        }
        onSave(formData);
        setSuccessMsg("Settings saved successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handleRandomizeAvatar = () => {
        const randomId = Math.floor(Math.random() * 10000);
        setFormData(prev => ({
            ...prev,
            avatarUrl: `https://picsum.photos/seed/${randomId}/200`
        }));
        setError(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 800 * 1024) {
                setError("Image is too large. Please select an image under 800KB.");
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    setFormData(prev => ({ ...prev, avatarUrl: result }));
                    setError(null);
                }
            };
            reader.onerror = () => { setError("Failed to read file."); };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => { fileInputRef.current?.click(); };

    const inputClasses = "block w-full bg-tertiary border border-gray-200 rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder-text-secondary";
    const labelClasses = "block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1";

    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold text-text-primary tracking-tight">Settings</h2>
                <p className="mt-3 text-xl text-text-secondary">Personalize your experience.</p>
            </div>

            <div className="bg-secondary p-10 rounded-[2rem] shadow-2xl border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={handleUploadClick}>
                            <div className="w-40 h-40 rounded-full border-4 border-gray-200 group-hover:border-accent transition-all duration-300 overflow-hidden bg-primary shadow-2xl relative">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-text-primary bg-tertiary">
                                        {formData.displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                    <Upload className="text-white w-10 h-10" />
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" title="Upload profile image" placeholder="Choose an image file" />
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={handleUploadClick} className="flex items-center gap-2 text-sm bg-tertiary px-5 py-2.5 rounded-xl text-text-primary hover:bg-gray-200 transition-all shadow-md font-bold border border-gray-200">
                                <Upload size={16} /> Upload
                            </button>
                            <button type="button" onClick={handleRandomizeAvatar} className="flex items-center gap-2 text-sm bg-tertiary px-5 py-2.5 rounded-xl text-text-primary hover:bg-gray-200 transition-all shadow-md font-bold border border-gray-200">
                                <RefreshCw size={16} /> Randomize
                            </button>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm mt-4 animate-fade-in bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 font-medium">{error}</p>}
                        {successMsg && <p className="text-green-600 text-sm mt-4 animate-fade-in flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20 font-medium"><CheckCircle2 size={16} /> {successMsg}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label htmlFor="displayName" className={labelClasses}>Display Name</label>
                            <input type="text" name="displayName" id="displayName" value={formData.displayName} onChange={handleChange} className={inputClasses} placeholder="Your Name" />
                        </div>

                        <div>
                            <label htmlFor="zipCode" className={labelClasses}>Default Zip Code</label>
                            <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="e.g., 90210" className={inputClasses}/>
                            <p className="mt-2 text-xs text-text-secondary font-medium">Used for quick recommendations in the Date Planner.</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-6 justify-between items-center">
                         <button type="button" onClick={onReplayTutorial} className="text-sm text-text-secondary hover:text-text-primary hover:underline transition-colors">
                            Replay Welcome Tutorial
                        </button>
                        <button type="submit" className="w-full sm:w-auto bg-accent text-white px-10 py-4 rounded-xl hover:bg-accent-hover font-bold transition-all shadow-lg hover:shadow-accent/25 active:scale-95">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;