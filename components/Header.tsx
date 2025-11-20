import React from 'react';
import { UserAccount } from '../types';
import { Menu, User, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  userAccount: UserAccount;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, userAccount, onOpenSettings }) => {
  return (
    <header className="bg-primary/80 backdrop-blur-md sticky top-0 z-30 border-b border-tertiary h-20 flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left side: Hamburger for mobile */}
        <div className="flex items-center gap-4">
           <button
            onClick={toggleSidebar}
            className="lg:hidden text-slate-400 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-tertiary transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <h2 className="lg:hidden text-xl font-bold text-white tracking-tight flex items-center gap-2">
             Wing<span className="text-accent">Man</span>
          </h2>
        </div>

        {/* Right side: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <button 
            className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-tertiary relative group"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-primary"></span>
          </button>

          <div className="h-8 w-px bg-tertiary mx-1 hidden sm:block"></div>

          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-tertiary/40 hover:bg-tertiary border border-transparent hover:border-tertiary transition-all duration-200 group"
          >
             <div className="relative">
                {userAccount.avatarUrl ? (
                    <img src={userAccount.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-tertiary group-hover:border-accent transition-colors" />
                ) : (
                    <div className="w-9 h-9 bg-stone-700 rounded-full flex items-center justify-center font-bold text-white text-sm border border-stone-600 group-hover:border-accent transition-colors">
                    {userAccount.displayName ? userAccount.displayName.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-primary"></div>
             </div>
            
            <div className="flex flex-col items-start text-sm hidden sm:flex">
                <span className="text-slate-200 font-semibold group-hover:text-white transition-colors leading-tight">
                {userAccount.displayName || userAccount.username}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-accent transition-colors">Settings</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;