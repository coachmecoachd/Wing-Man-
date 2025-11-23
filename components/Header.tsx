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
    <header className="bg-secondary/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 h-20 flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Left side: Hamburger for mobile */}
        <div className="flex items-center gap-4">
           <button
            onClick={toggleSidebar}
            className="lg:hidden text-text-secondary hover:text-text-primary focus:outline-none p-2 rounded-lg hover:bg-tertiary transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <h2 className="lg:hidden text-2xl font-black text-text-primary tracking-tighter flex items-center">
             BRUH<span className="text-accent">!</span>
          </h2>
        </div>

        {/* Right side: Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <button 
            className="text-text-secondary hover:text-text-primary transition-colors p-2.5 rounded-full hover:bg-tertiary relative group"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-secondary"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-tertiary/40 hover:bg-tertiary border border-transparent hover:border-gray-200 transition-all duration-200 group"
          >
             <div className="relative">
                {userAccount.avatarUrl ? (
                    <img src={userAccount.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200 group-hover:border-accent transition-colors" />
                ) : (
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-text-primary text-sm border border-gray-300 group-hover:border-accent transition-colors">
                    {userAccount.displayName ? userAccount.displayName.charAt(0).toUpperCase() : <User size={16} />}
                    </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-secondary"></div>
             </div>
            
            <div className="flex flex-col items-start text-sm hidden sm:flex">
                <span className="text-text-primary font-semibold group-hover:text-text-primary transition-colors leading-tight">
                {userAccount.displayName || userAccount.username}
                </span>
                <span className="text-xs text-text-secondary group-hover:text-accent transition-colors">Settings</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;