import React from 'react';
import { View, UserAccount } from '../types';
import { 
  MessageSquareMore, 
  CalendarHeart, 
  UsersRound, 
  Sparkles, 
  Gift, 
  Languages,
  ArrowRight,
  Heart
} from 'lucide-react';

interface DashboardProps {
  setView: (view: View) => void;
  userAccount: UserAccount;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay: number;
  colorClass: string;
}> = ({ title, description, icon, onClick, delay, colorClass }) => (
  <button
    onClick={onClick}
<<<<<<< HEAD
    className="group relative w-full text-left bg-secondary rounded-3xl p-6 shadow-lg border border-tertiary hover:border-accent/50 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
=======
    className="group relative w-full text-left bg-secondary rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-accent/50 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
>>>>>>> 7a3b66c (Update README with correct repo info)
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 flex justify-between items-start">
            <div className={`p-3.5 rounded-2xl text-white transition-all duration-300 shadow-lg ${colorClass} group-hover:scale-110`}>
                {icon}
            </div>
<<<<<<< HEAD
            <div className="text-tertiary group-hover:text-accent transition-colors duration-300">
=======
            <div className="text-gray-300 group-hover:text-accent transition-colors duration-300">
>>>>>>> 7a3b66c (Update README with correct repo info)
                 <ArrowRight size={24} />
            </div>
        </div>
        
<<<<<<< HEAD
        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-grow">{description}</p>
=======
        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-text-primary transition-colors">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed flex-grow">{description}</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ setView, userAccount }) => {
  const features = [
    {
      title: 'Text Helper',
      description: 'Draft the perfect reply. AI suggests witty, charming, or serious responses.',
      icon: <MessageSquareMore size={24} />,
      view: 'texter' as View,
<<<<<<< HEAD
      color: 'bg-blue-500',
=======
      color: 'bg-ocean',
>>>>>>> 7a3b66c (Update README with correct repo info)
    },
    {
      title: 'Date Planner',
      description: 'Create unforgettable dates tailored to personality and location.',
      icon: <CalendarHeart size={24} />,
      view: 'planner' as View,
      color: 'bg-accent',
    },
    {
      title: 'Profiles',
      description: 'Manage insights on the people you meet. Never forget a detail.',
      icon: <UsersRound size={24} />,
      view: 'profiles' as View,
<<<<<<< HEAD
      color: 'bg-purple-500',
=======
      color: 'bg-violet-500',
>>>>>>> 7a3b66c (Update README with correct repo info)
    },
    {
      title: 'Expert Advice',
      description: 'Guidance for any scenario, outfit, or conversation starter.',
      icon: <Sparkles size={24} />,
      view: 'advice' as View,
<<<<<<< HEAD
      color: 'bg-yellow-500',
=======
      color: 'bg-sunshine',
>>>>>>> 7a3b66c (Update README with correct repo info)
    },
    {
      title: 'Gift Lab',
      description: 'Personalized gift ideas and custom design generation.',
      icon: <Gift size={24} />,
      view: 'gifts' as View,
<<<<<<< HEAD
      color: 'bg-green-500',
=======
      color: 'bg-mint',
>>>>>>> 7a3b66c (Update README with correct repo info)
    },
    {
      title: 'Interpreter',
      description: 'Real-time translation and speech to break language barriers.',
      icon: <Languages size={24} />,
      view: 'interpreter' as View,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Hero Section */}
<<<<<<< HEAD
      <div className="relative bg-secondary rounded-[2.5rem] p-8 sm:p-12 overflow-hidden border border-tertiary shadow-2xl">
=======
      <div className="relative bg-secondary rounded-[2.5rem] p-8 sm:p-12 overflow-hidden border border-gray-200 shadow-2xl">
>>>>>>> 7a3b66c (Update README with correct repo info)
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold mb-6">
                <Heart size={14} fill="currentColor" /> 
                Your AI Dating Companion
            </div>
<<<<<<< HEAD
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Hello, {userAccount.displayName || 'Friend'}. <br/>
              <span className="text-slate-400 text-3xl sm:text-4xl">Ready to make a connection?</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed mb-8">
              Wing Man is here to help you navigate the dating world with confidence. Select a tool below to get started.
            </p>
            <button 
                onClick={() => setView('planner')}
                className="bg-white text-secondary px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg flex items-center gap-2 active:scale-95"
=======
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight mb-6 leading-tight">
              Hello, {userAccount.displayName || 'Friend'}. <br/>
              <span className="text-text-secondary text-3xl sm:text-4xl">Ready to make a connection?</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-lg leading-relaxed mb-8">
              BRUH is here to help you navigate the dating world with confidence. Select a tool below to get started.
            </p>
            <button 
                onClick={() => setView('planner')}
                className="bg-text-primary text-secondary px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-2 active:scale-95"
>>>>>>> 7a3b66c (Update README with correct repo info)
            >
                Plan a Date Now <ArrowRight size={18} />
            </button>
         </div>
      </div>
      
      {/* Grid */}
      <div>
<<<<<<< HEAD
          <h2 className="text-2xl font-bold text-white mb-6 px-2">Tools & Features</h2>
=======
          <h2 className="text-2xl font-bold text-text-primary mb-6 px-2">Tools & Features</h2>
>>>>>>> 7a3b66c (Update README with correct repo info)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
            <div key={feature.view} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <FeatureCard 
                    {...feature} 
                    onClick={() => setView(feature.view)} 
                    delay={idx * 100} 
                    colorClass={feature.color}
                />
            </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;