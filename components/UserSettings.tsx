
import React, { useState, useRef } from 'react';
import { UserAccount } from '../types.ts';

interface UserSettingsProps {
    userAccount: UserAccount;
    onSave: (account: UserAccount) => void;
    onDeleteAccount: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userAccount, onSave, onDeleteAccount }) => {
    const [formData, setFormData] = useState<UserAccount>(userAccount);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleRandomizeAvatar = () => {
        const randomId = Math.floor(Math.random() * 10000);
        setFormData(prev => ({
            ...prev,
            avatarUrl: `https://picsum.photos/seed/${randomId}/200`
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatarUrl: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteClick = () => {
        if (window.confirm("Are you sure? This will permanently delete all profiles, dates, and settings stored on this device. This action cannot be undone.")) {
            onDeleteAccount();
        }
    };

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-white">Account Settings</h2>
                <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">Personalize your profile and improve AI recommendations.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-secondary p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer" onClick={handleUploadClick}>
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-tertiary group-hover:border-accent transition-colors" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-tertiary flex items-center justify-center text-4xl font-bold text-white border-4 border-tertiary group-hover:border-accent transition-colors">
                                    {formData.displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="text-sm bg-tertiary px-3 py-1.5 rounded-md text-gray-300 hover:bg-accent hover:text-white transition-colors"
                            >
                                Upload Picture
                            </button>
                            <button
                                type="button"
                                onClick={handleRandomizeAvatar}
                                className="text-sm bg-tertiary px-3 py-1.5 rounded-md text-gray-300 hover:bg-accent hover:text-white transition-colors"
                            >
                                Randomize Avatar
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-400">Display Name</label>
                            <input
                                type="text"
                                name="displayName"
                                id="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-tertiary border-transparent rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>

                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-400">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                id="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="e.g., 90210"
                                className="mt-1 block w-full bg-tertiary border-transparent rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Enter your zip code to get date and gift ideas relevant to your location.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-tertiary">
                        <button
                            type="submit"
                            className="w-full bg-accent text-white px-6 py-3 rounded-md hover:bg-red-700 font-bold transition-colors shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-red-900/30">
                    <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
                    <div className="flex items-center justify-between bg-primary/50 p-4 rounded-lg border border-red-900/30">
                        <div>
                            <h4 className="text-white font-medium">Delete All Data</h4>
                            <p className="text-gray-400 text-sm">Permanently delete all profiles, dates, and settings.</p>
                        </div>
                         <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="bg-transparent border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Delete Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
