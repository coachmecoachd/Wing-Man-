
import React from 'react';
import { View } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const icons: { [key in View]: React.ReactNode } = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
    profiles: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
    texter: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>,
    planner: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
    gifts: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>,
    advice: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
    interpreter: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.884 5.86 7 6.223v2.445c0 .35.345.622.684.598a3.987 3.987 0 012.632 2.632c.024.34.298.684.648.684h2.445c.363 0 .493.488.223.756A6.012 6.012 0 0111.973 15.67a6.013 6.013 0 01-7.64-7.643z" clipRule="evenodd" /></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
};

const navItems: { label: string; viewName: View }[] = [
    { label: 'Dashboard', viewName: 'dashboard' },
    { label: 'Profiles', viewName: 'profiles' },
    { label: 'Text Helper', viewName: 'texter' },
    { label: 'Date Planner', viewName: 'planner' },
    { label: 'Gift Lab', viewName: 'gifts' },
    { label: 'Advice', viewName: 'advice' },
    { label: 'Interpreter', viewName: 'interpreter' },
    { label: 'Settings', viewName: 'settings' },
];

const NavLink: React.FC<{
  label: string;
  viewName: View;
  currentView: View;
  setView: (view: View) => void;
  icon: React.ReactNode;
  isCollapsed: boolean;
}> = ({ label, viewName, currentView, setView, icon, isCollapsed }) => (
  <li className="px-3">
    <button
      onClick={() => setView(viewName)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        currentView === viewName
          ? 'bg-accent text-white'
          : 'text-gray-300 hover:bg-tertiary hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`}
      aria-current={currentView === viewName ? 'page' : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className={`flex-1 text-left ${isCollapsed ? 'hidden' : 'block'}`}>{label}</span>
    </button>
  </li>
);


const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isSidebarOpen, setIsSidebarOpen }) => {
    const [isCollapsed, setIsCollapsed] = useLocalStorage('wingman-sidebar-collapsed', false);

    const sidebarClasses = `
        bg-secondary flex flex-col z-30 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        lg:relative lg:translate-x-0
        fixed h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-20 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            />
            <aside className={sidebarClasses}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-16 px-4 flex-shrink-0`}>
                     <div className={`font-bold text-white ${isCollapsed ? 'hidden' : 'block'}`}>
                        <span className="text-accent text-xl">Wing</span>
                        <span className="text-xl"> Man</span>
                    </div>
                     <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block text-gray-400 hover:text-white"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                         {isCollapsed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>
                <nav className="flex-grow mt-4">
                    <ul className="space-y-1">
                        {navItems.map(({label, viewName}) => (
                           <NavLink
                                key={viewName}
                                label={label}
                                viewName={viewName}
                                currentView={currentView}
                                setView={setView}
                                icon={icons[viewName]}
                                isCollapsed={isCollapsed}
                           />
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
