
import React from 'react';
import { UserAccount } from '../types.ts';

interface HeaderProps {
  onLogout: () => void;
  toggleSidebar: () => void;
  userAccount: UserAccount;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, toggleSidebar, userAccount, onOpenSettings }) => {
  return (
    <header className="bg-tertiary shadow-md sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side: Hamburger for mobile */}
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

        {/* Right side: User Menu */}
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

export default Header;
