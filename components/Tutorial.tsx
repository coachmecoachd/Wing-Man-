import React, { useState } from 'react';
import { HeartHandshake, UsersRound, MessageSquareMore, CalendarHeart, Sparkles, ChevronRight } from 'lucide-react';

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      title: "Your AI Wingman",
      description: "Welcome! I'm here to help you navigate dating with confidence, creativity, and a little bit of AI magic.",
      icon: <HeartHandshake size={100} className="text-accent drop-shadow-2xl" />,
    },
    {
      title: "Remember Details",
      description: "Create Profiles for the people you meet. I'll remember their likes and hobbies so you can plan better dates.",
      icon: <UsersRound size={100} className="text-ocean drop-shadow-2xl" />,
    },
    {
      title: "Never Get Stuck",
      description: "Don't know what to reply? Use the Text Helper. I'll suggest charming, witty, or serious responses instantly.",
      icon: <MessageSquareMore size={100} className="text-mint drop-shadow-2xl" />,
    },
    {
      title: "Plan Dates",
      description: "Use the Date Planner and Gift Lab to generate unique ideas tailored specifically to their personality.",
      icon: <CalendarHeart size={100} className="text-violet-500 drop-shadow-2xl" />,
    },
    {
      title: "Expert Guidance",
      description: "From outfit checks to breaking language barriers, I've got the tools you need. Let's get started!",
      icon: <Sparkles size={100} className="text-sunshine drop-shadow-2xl" />,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      onComplete();
    }
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/90 backdrop-blur-xl animate-fade-in">
      <div 
        className="bg-secondary border border-gray-200 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative min-h-[600px]"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-tertiary">
            <div 
                className="bg-accent h-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%`}}
            />
        </div>
        
        {/* Skip Button */}
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={onComplete}
            className="text-text-secondary hover:text-text-primary text-sm font-semibold px-4 py-2 rounded-full hover:bg-tertiary transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col items-center justify-center p-10 text-center space-y-10 select-none">
            <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full"></div>
                <div className="relative bg-tertiary p-10 rounded-full border border-gray-200 shadow-2xl transform transition-all duration-500 hover:scale-105">
                    {slides[currentSlide].icon}
                </div>
            </div>
            
            <div className="space-y-4 animate-slide-up">
                <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">
                    {slides[currentSlide].title}
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed max-w-xs mx-auto">
                    {slides[currentSlide].description}
                </p>
            </div>
        </div>

        {/* Navigation Area */}
        <div className="p-8 pt-0 mt-auto w-full">
             <button 
                onClick={handleNext}
                className="w-full bg-accent hover:bg-accent-hover text-white text-lg px-8 py-4 rounded-2xl font-bold shadow-xl shadow-accent/20 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
            >
                {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;