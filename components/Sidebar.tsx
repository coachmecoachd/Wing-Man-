import React from 'react';
import { View } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { 
  LayoutDashboard, 
  MessageSquareMore, 
  CalendarHeart, 
  UsersRound, 
  Sparkles, 
  Gift, 
  Languages, 
  Settings,
  ChevronsLeft,
  HeartHandshake,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const icons: { [key in View]: React.ReactNode } = {
    dashboard: <LayoutDashboard size={20} />,
    texter: <MessageSquareMore size={20} />,
    planner: <CalendarHeart size={20} />,
    profiles: <UsersRound size={20} />,
    advice: <Sparkles size={20} />,
    gifts: <Gift size={20} />,
    interpreter: <Languages size={20} />,
    settings: <Settings size={20} />,
};

const navItems: { label: string; viewName: View }[] = [
    { label: 'Dashboard', viewName: 'dashboard' },
    { label: 'Text Helper', viewName: 'texter' },
    { label: 'Date Planner', viewName: 'planner' },
    { label: 'Profiles', viewName: 'profiles' },
    { label: 'Advice', viewName: 'advice' },
    { label: 'Gift Lab', viewName: 'gifts' },
    { label: 'Interpreter', viewName: 'interpreter' },
];

const NavLink: React.FC<{
  label: string;
  viewName: View;
  currentView: View;
  setView: (view: View) => void;
  icon: React.ReactNode;
  isCollapsed: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}> = ({ label, viewName, currentView, setView, icon, isCollapsed, setIsSidebarOpen }) => (
    <button
      onClick={() => { setView(viewName); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
        currentView === viewName
          ? 'bg-accent text-white shadow-md shadow-accent/20'
// ...existing code...
          : 'text-slate-400 hover:bg-tertiary hover:text-slate-100'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : undefined}
    >
      <span className={`${currentView === viewName ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors flex-shrink-0`}>
// ...existing code...
          : 'text-text-secondary hover:bg-tertiary hover:text-text-primary'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : undefined}
    >
      <span className={`${currentView === viewName ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'} transition-colors flex-shrink-0`}>
// ...existing code...
        {icon}
      </span>
      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isSidebarOpen, setIsSidebarOpen }) => {
<<<<<<< HEAD
    const [isCollapsed, setIsCollapsed] = useLocalStorage('wingman-sidebar-collapsed', false);
=======
    const [isCollapsed, setIsCollapsed] = useLocalStorage('bruh-sidebar-collapsed', false);
>>>>>>> 7a3b66c (Update README with correct repo info)

    // Base classes for sidebar positioning and appearance
    const sidebarClasses = `
        fixed inset-y-0 left-0 z-50 flex flex-col
<<<<<<< HEAD
        bg-secondary border-r border-tertiary shadow-2xl
=======
        bg-secondary border-r border-gray-200 shadow-2xl
>>>>>>> 7a3b66c (Update README with correct repo info)
        transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'w-[80px]' : 'w-72'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-full flex-shrink-0
    `;

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            <aside className={sidebarClasses}>
                {/* Logo Area */}
<<<<<<< HEAD
                <div className="h-20 flex items-center px-6 border-b border-tertiary/50 flex-shrink-0">
                     <div className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="bg-gradient-to-br from-accent to-rose-700 p-2 rounded-xl shadow-lg shadow-accent/20 flex-shrink-0">
                             <HeartHandshake size={24} className="text-white"/>
                        </div>
                        {!isCollapsed && (
                            <div className="font-bold text-lg tracking-tight text-white flex-grow flex justify-between items-center">
                                <span>Wing<span className="text-accent">Man</span></span>
                                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white">
=======
                <div className="h-20 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
                     <div className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="bg-accent p-2 rounded-xl shadow-lg shadow-accent/20 flex-shrink-0">
                             <HeartHandshake size={24} className="text-white"/>
                        </div>
                        {!isCollapsed && (
                            <div className="font-black text-xl tracking-tighter text-text-primary flex-grow flex justify-between items-center">
                                <span>BRUH<span className="text-accent">!</span></span>
                                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-secondary hover:text-text-primary">
>>>>>>> 7a3b66c (Update README with correct repo info)
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-grow mt-6 overflow-y-auto custom-scrollbar px-2 flex flex-col gap-1">
                    {navItems.map(({label, viewName}) => (
                       <NavLink
                            key={viewName}
                            label={label}
                            viewName={viewName}
                            currentView={currentView}
                            setView={setView}
                            icon={icons[viewName]}
                            isCollapsed={isCollapsed}
                            setIsSidebarOpen={setIsSidebarOpen}
                       />
                    ))}
                </nav>
                
                {/* Bottom Section */}
<<<<<<< HEAD
                <div className="p-4 border-t border-tertiary/50 bg-black/20 flex-shrink-0">
=======
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
>>>>>>> 7a3b66c (Update README with correct repo info)
                     <div className="flex flex-col gap-1 mb-2">
                        <NavLink
                            label="Settings"
                            viewName="settings"
                            currentView={currentView}
                            setView={setView}
                            icon={icons.settings}
                            isCollapsed={isCollapsed}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                     </div>
                     <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
<<<<<<< HEAD
                        className={`hidden lg:flex items-center justify-center w-full gap-2 p-2 rounded-lg hover:bg-tertiary text-slate-500 hover:text-white transition-all duration-200`}
=======
                        className={`hidden lg:flex items-center justify-center w-full gap-2 p-2 rounded-lg hover:bg-tertiary text-text-secondary hover:text-text-primary transition-all duration-200`}
>>>>>>> 7a3b66c (Update README with correct repo info)
                        title={isCollapsed ? "Expand" : "Collapse"}
                    >
                         <ChevronsLeft size={20} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;