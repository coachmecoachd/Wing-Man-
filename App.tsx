import React, { useState, useEffect } from 'react';
import { View, PersonProfile, PlannedDate, UserAccount } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileManager from './components/ProfileManager';
import TextAnalyzer from './components/TextAnalyzer';
import DatePlanner from './components/DatePlanner';
import GiftLab from './components/GiftLab';
import DatingAdvice from './components/DatingAdvice';
import Interpreter from './components/Interpreter';
import UserSettings from './components/UserSettings';
import Tutorial from './components/Tutorial';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State to pass a profile from Manager to Planner
  const [planningProfile, setPlanningProfile] = useState<PersonProfile | null>(null);

  // Data stored with static keys
  const [profiles, setProfiles] = useLocalStorage<PersonProfile[]>('wingman-profiles', []);
  const [dates, setDates] = useLocalStorage<PlannedDate[]>('wingman-dates', []);
  const [userAccount, setUserAccount] = useLocalStorage<UserAccount>('wingman-account', {
      username: 'User',
      displayName: 'User',
      avatarUrl: '',
      zipCode: ''
  });
  const [hasSeenTutorial, setHasSeenTutorial] = useLocalStorage<boolean>('wingman-tutorial-seen', false);

  const handlePlanDate = (profile: PersonProfile) => {
      setPlanningProfile(profile);
      setView('planner');
  };
  
  const handleSetView = (newView: View) => {
      setView(newView);
      setIsSidebarOpen(false);
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard setView={handleSetView} userAccount={userAccount} />;
      case 'profiles':
        return <ProfileManager profiles={profiles} setProfiles={setProfiles} userZip={userAccount.zipCode} onPlanDate={handlePlanDate} />;
      case 'texter':
        return <TextAnalyzer />;
      case 'planner':
        return <DatePlanner dates={dates} setDates={setDates} profiles={profiles} initialProfile={planningProfile} onClearInitialProfile={() => setPlanningProfile(null)} />;
      case 'gifts':
        return <GiftLab profiles={profiles} userZip={userAccount.zipCode} />;
      case 'advice':
        return <DatingAdvice />;
      case 'interpreter':
        return <Interpreter />;
      case 'settings':
        return <UserSettings 
                  userAccount={userAccount} 
                  onSave={(updated) => { setUserAccount(updated); setView('dashboard'); }} 
                  onReplayTutorial={() => {setHasSeenTutorial(false); setView('dashboard');}}
               />;
      default:
        return <Dashboard setView={handleSetView} userAccount={userAccount} />;
    }
  };

  return (
    <div className="h-screen w-full bg-primary font-sans flex text-slate-300 overflow-hidden">
      {!hasSeenTutorial && <Tutorial onComplete={() => setHasSeenTutorial(true)} />}
      
      <Sidebar
        currentView={view}
        setView={handleSetView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userAccount={userAccount}
          onOpenSettings={() => setView('settings')}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {renderView()}
            </div>
             <footer className="text-center py-8 mt-8 border-t border-tertiary/30">
              <p className="text-sm text-slate-600">
                  Wing Man &copy; {new Date().getFullYear()}
              </p>
            </footer>
        </main>
      </div>
    </div>
  );
};

export default App;