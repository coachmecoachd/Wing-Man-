
import React from 'react';
import { View } from '../types.ts';

interface DashboardProps {
  setView: (view: View) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  // FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-secondary p-6 rounded-lg shadow-lg hover:shadow-accent/50 hover:-translate-y-1 transform transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-tertiary text-accent mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const features = [
    {
      title: 'Manage Profiles',
      description: 'Create detailed profiles for people you\'re interested in to get personalized advice.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>,
      view: 'profiles' as View,
    },
    {
      title: 'Text Message Helper',
      description: 'Stuck on what to reply? Paste your conversation and get AI-powered suggestions.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      view: 'texter' as View,
    },
    {
      title: 'Creative Date Planner',
      description: 'Generate unique date ideas based on personality profiles and save them to your calendar.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      view: 'planner' as View,
    },
    {
      title: 'Thoughtful Gift Lab',
      description: 'Get inspired with personalized gift ideas and generate custom designs for them.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
      view: 'gifts' as View,
    },
    {
      title: 'Dating Advice',
      description: 'Get expert advice on what to wear, what to say, and how to act on any type of date.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      view: 'advice' as View,
    },
    {
      title: 'Travel Interpreter',
      description: 'Speak any language. Translate text and play it back with natural-sounding audio.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.06 11.06l-1.06-1.06a2 2 0 010-2.828l4-4a2 2 0 012.828 0l3 3a2 2 0 010 2.828l-1.06 1.06M9 17l6-6" /></svg>,
      view: 'interpreter' as View,
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Wing Man: Your Personal Dating <span className="text-accent">AI Assistant</span></h2>
        <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">Like having your best friend in your pocket. Never run out of things to say or ideas for dates. Wing Man has your back.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.view} {...feature} onClick={() => setView(feature.view)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;