
import React, { useState, useEffect } from 'react';
import { View, PersonProfile, PlannedDate, UserAccount } from './types.ts';
import useLocalStorage from './hooks/useLocalStorage.ts';
import Header from './components/Header.tsx';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import ProfileManager from './components/ProfileManager.tsx';
import TextAnalyzer from './components/TextAnalyzer.tsx';
import DatePlanner from './components/DatePlanner.tsx';
import GiftLab from './components/GiftLab.tsx';
import DatingAdvice from './components/DatingAdvice.tsx';
import Interpreter from './components/Interpreter.tsx';
import Login from './components/Login.tsx';
import UserSettings from './components/UserSettings.tsx';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('wingman-currentUser', null);
  const [view, setView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data is now scoped by user. Keys will change when user logs in/out.
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

  // Sync userAccount username with currentUser on login
  useEffect(() => {
      if (currentUser && userAccount.username !== currentUser) {
          setUserAccount(prev => ({...prev, username: currentUser, displayName: prev.displayName || currentUser}));
      }
  }, [currentUser, userAccount.username, setUserAccount]);


  // When user logs out, reset view to dashboard
  useEffect(() => {
    if (!currentUser) {
      setView('dashboard');
    }
  }, [currentUser]);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleDeleteAccount = () => {
    if (currentUser) {
        // Manually remove the items from localStorage since the hooks sync with state, 
        // but we want to ensure the data is gone from the browser storage.
        localStorage.removeItem(`${currentUser}-wingman-profiles`);
        localStorage.removeItem(`${currentUser}-wingman-dates`);
        localStorage.removeItem(`${currentUser}-wingman-account`);
        handleLogout();
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard setView={setView} />;
      case 'profiles':
        return <ProfileManager profiles={profiles} setProfiles={setProfiles} userZip={userAccount.zipCode} />;
      case 'texter':
        return <TextAnalyzer />;
      case 'planner':
        return <DatePlanner dates={dates} setDates={setDates} profiles={profiles} />;
      case 'gifts':
        return <GiftLab profiles={profiles} userZip={userAccount.zipCode} />;
      case 'advice':
        return <DatingAdvice />;
      case 'interpreter':
        return <Interpreter />;
      case 'settings':
        return <UserSettings userAccount={userAccount} onSave={(updated) => { setUserAccount(updated); setView('dashboard'); }} onDeleteAccount={handleDeleteAccount} />;
      default:
        return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary font-sans flex text-white">
      <Sidebar
        currentView={view}
        setView={setView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onLogout={handleLogout}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userAccount={userAccount}
          onOpenSettings={() => setView('settings')}
        />
        <main className="flex-grow overflow-y-auto">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderView()}
            </div>
             <footer className="bg-primary text-center p-4 mt-8">
              <p className="text-sm text-gray-400">
                  Wing Man &copy; {new Date().getFullYear()} | <a href="./privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Privacy Policy</a>
              </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
