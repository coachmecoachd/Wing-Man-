import React, { useState, useEffect } from 'react';
import { PlannedDate, PersonProfile, DateOption } from '../types';
import { generateStructuredDateIdeas } from '../services/geminiService';
import { Trash2, Calendar, MapPin, Clock, StickyNote, Sparkles, Loader2, RefreshCw, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface DatePlannerProps {
  dates: PlannedDate[];
  setDates: React.Dispatch<React.SetStateAction<PlannedDate[]>>;
  profiles: PersonProfile[];
  initialProfile?: PersonProfile | null;
  onClearInitialProfile: () => void;
}

const DatePlanner: React.FC<DatePlannerProps> = ({ 
    dates, 
    setDates, 
    profiles, 
    initialProfile, 
    onClearInitialProfile 
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'calendar'>('plan');
  
  const [step, setStep] = useState<'input' | 'results' | 'edit'>('input');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<DateOption[]>([]);
  
  const [dateToSave, setDateToSave] = useState<Partial<PlannedDate>>({});

  useEffect(() => {
      if (initialProfile) {
          setSelectedProfileId(initialProfile.id);
          if (initialProfile.zipCode) setZipCode(initialProfile.zipCode);
          setActiveTab('plan');
      }
  }, [initialProfile]);

  const handleGenerate = async () => {
      if (!zipCode || !dateTime) return;
      setIsGenerating(true);
      setStep('results');
      setGeneratedOptions([]); 
      
      const profile = profiles.find(p => p.id === selectedProfileId);
      
      try {
          const options = await generateStructuredDateIdeas(zipCode, dateTime, profile);
          setGeneratedOptions(options);
      } catch (error) {
          console.error(error);
          setGeneratedOptions([]);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleSelectOption = (option: DateOption) => {
      setDateToSave({
          title: option.title,
          location: option.location,
          date: dateTime,
          personId: selectedProfileId,
          notes: `${option.description}\n\nWhy: ${option.reasoning}`
      });
      setStep('edit');
  };
  
  const handleSaveDate = (finalDate: PlannedDate) => {
      setDates([...dates, finalDate]);
      setStep('input');
      setGeneratedOptions([]);
      setDateToSave({});
      setSelectedProfileId('');
      setZipCode('');
      setDateTime('');
      onClearInitialProfile();
      setActiveTab('calendar');
  };

  const handleDeleteDate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this date?")) {
        setDates(dates.filter(d => d.id !== id));
    }
  };
  
<<<<<<< HEAD
  const inputClasses = "w-full bg-tertiary/50 border border-stone-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-white placeholder-slate-500 transition-all";
  const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1";
=======
  const inputClasses = "w-full bg-tertiary border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-text-primary placeholder-text-secondary transition-all";
  const labelClasses = "block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 ml-1";
>>>>>>> 7a3b66c (Update README with correct repo info)

  return (
    <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
<<<<<<< HEAD
            <h2 className="text-5xl font-extrabold text-white tracking-tight">Date Planner</h2>
            <p className="mt-3 text-xl text-slate-400">Plan the perfect outing tailored to you.</p>
        </div>

        <div className="flex justify-center mb-10">
            <div className="bg-secondary p-1.5 rounded-2xl inline-flex border border-tertiary shadow-lg">
                <button 
                    onClick={() => setActiveTab('plan')}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'plan' ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
=======
            <h2 className="text-5xl font-extrabold text-text-primary tracking-tight">Date Planner</h2>
            <p className="mt-3 text-xl text-text-secondary">Plan the perfect outing tailored to you.</p>
        </div>

        <div className="flex justify-center mb-10">
            <div className="bg-secondary p-1.5 rounded-2xl inline-flex border border-gray-200 shadow-lg">
                <button 
                    onClick={() => setActiveTab('plan')}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'plan' ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:text-text-primary hover:bg-black/5'}`}
>>>>>>> 7a3b66c (Update README with correct repo info)
                >
                    Plan a Date
                </button>
                <button 
                    onClick={() => setActiveTab('calendar')}
<<<<<<< HEAD
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'calendar' ? 'bg-accent text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
=======
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'calendar' ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:text-text-primary hover:bg-black/5'}`}
>>>>>>> 7a3b66c (Update README with correct repo info)
                >
                    My Calendar
                </button>
            </div>
        </div>

        {activeTab === 'plan' && (
            <div className="animate-fade-in">
                {step === 'input' && (
<<<<<<< HEAD
                    <div className="max-w-2xl mx-auto bg-secondary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-tertiary">
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
=======
                    <div className="max-w-2xl mx-auto bg-secondary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-200">
                        <h3 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
>>>>>>> 7a3b66c (Update README with correct repo info)
                            <div className="bg-accent/10 p-2 rounded-lg"><Sparkles className="text-accent" size={24}/></div>
                            Create My Perfect Date
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>When?</label>
                                    <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Where? (Zip Code)</label>
                                    <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="e.g. 90210" className={inputClasses} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Who are you going with?</label>
                                <select value={selectedProfileId} onChange={e => {
                                    setSelectedProfileId(e.target.value);
                                    const p = profiles.find(prof => prof.id === e.target.value);
                                    if (p?.zipCode && !zipCode) setZipCode(p.zipCode);
                                }} className={inputClasses}>
<<<<<<< HEAD
                                    <option value="">Just me / Deciding later</option>
                                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1"><Sparkles size={12} /> Select a profile to get personalized ideas.</p>
                            </div>

                            <button onClick={handleGenerate} disabled={!zipCode || !dateTime} className="w-full bg-accent hover:bg-accent-hover disabled:bg-tertiary disabled:text-slate-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95">
=======
                                    <option value="">Continue without a profile</option>
                                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <p className="text-xs text-text-secondary mt-3 flex items-center gap-1"><Sparkles size={12} /> Select a profile to get personalized ideas.</p>
                            </div>

                            <button onClick={handleGenerate} disabled={!zipCode || !dateTime} className="w-full bg-accent hover:bg-accent-hover disabled:bg-tertiary disabled:text-text-secondary text-white py-4 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95">
>>>>>>> 7a3b66c (Update README with correct repo info)
                                <Sparkles size={20} />
                                Generate Date Ideas
                            </button>
                        </div>
                    </div>
                )}

                {step === 'results' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
<<<<<<< HEAD
                             <button onClick={() => setStep('input')} className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-colors group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to details
                            </button>
                            <h3 className="text-xl font-bold text-white">Select an Idea</h3>
                        </div>

                        {isGenerating ? (
                            <div className="py-32 text-center bg-secondary/30 rounded-[2rem] border-2 border-dashed border-tertiary flex flex-col items-center justify-center">
                                <Loader2 size={56} className="animate-spin text-accent mb-6" />
                                <p className="text-2xl font-bold text-white mb-2">Analyzing local spots...</p>
                                <p className="text-slate-400">Finding the perfect match for your date.</p>
=======
                             <button onClick={() => setStep('input')} className="text-text-secondary hover:text-text-primary text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-colors group">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to details
                            </button>
                            <h3 className="text-xl font-bold text-text-primary">Select an Idea</h3>
                        </div>

                        {isGenerating ? (
                            <div className="py-32 text-center bg-secondary/30 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                                <Loader2 size={56} className="animate-spin text-accent mb-6" />
                                <p className="text-2xl font-bold text-text-primary mb-2">Analyzing local spots...</p>
                                <p className="text-text-secondary">Finding the perfect match for your date.</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {generatedOptions.map((option, idx) => (
<<<<<<< HEAD
                                    <div key={idx} className="bg-secondary rounded-3xl p-8 border border-tertiary hover:border-accent/50 transition-all hover:shadow-2xl flex flex-col relative group animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex-grow">
                                            <h4 className="text-2xl font-bold text-white mb-3">{option.title}</h4>
=======
                                    <div key={idx} className="bg-secondary rounded-3xl p-8 border border-gray-200 hover:border-accent/50 transition-all hover:shadow-2xl flex flex-col relative group animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex-grow">
                                            <h4 className="text-2xl font-bold text-text-primary mb-3">{option.title}</h4>
>>>>>>> 7a3b66c (Update README with correct repo info)
                                            <div className="flex items-center gap-2 text-accent text-xs font-bold mb-4 uppercase tracking-widest bg-accent/10 py-1.5 px-3 rounded-full w-fit">
                                                <MapPin size={12} />
                                                {option.location}
                                            </div>
<<<<<<< HEAD
                                            <p className="text-slate-300 mb-6 leading-relaxed">{option.description}</p>
                                            <div className="bg-black/20 p-4 rounded-xl text-sm text-slate-400 border border-white/5">
                                                <strong className="text-slate-200 block mb-1 font-bold text-xs uppercase tracking-wide">Why this works:</strong>
                                                {option.reasoning}
                                            </div>
                                        </div>
                                        <button onClick={() => handleSelectOption(option)} className="mt-8 w-full bg-white text-stone-900 hover:bg-slate-200 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95">
=======
                                            <p className="text-text-secondary mb-6 leading-relaxed">{option.description}</p>
                                            <div className="bg-tertiary p-4 rounded-xl text-sm text-text-secondary border border-gray-200/50">
                                                <strong className="text-text-primary block mb-1 font-bold text-xs uppercase tracking-wide">Why this works:</strong>
                                                {option.reasoning}
                                            </div>
                                        </div>
                                        <button onClick={() => handleSelectOption(option)} className="mt-8 w-full bg-text-primary text-secondary hover:bg-gray-700 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95">
>>>>>>> 7a3b66c (Update README with correct repo info)
                                            Select this Idea <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isGenerating && (
                            <div className="flex justify-center mt-10">
<<<<<<< HEAD
                                <button onClick={handleGenerate} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-tertiary/50 px-6 py-3 rounded-full hover:bg-tertiary font-medium">
=======
                                <button onClick={handleGenerate} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors bg-secondary px-6 py-3 rounded-full hover:bg-tertiary font-medium border border-gray-200">
>>>>>>> 7a3b66c (Update README with correct repo info)
                                    <RefreshCw size={18} />
                                    Regenerate Options
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'edit' && (
                     <div className="max-w-2xl mx-auto">
<<<<<<< HEAD
                        <button onClick={() => setStep('results')} className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wide mb-6 flex items-center gap-2 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to options
                        </button>
                        <div className="bg-secondary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-tertiary">
                            <h3 className="text-3xl font-extrabold text-white mb-8">Finalize & Save</h3>
=======
                        <button onClick={() => setStep('results')} className="text-text-secondary hover:text-text-primary text-sm font-bold uppercase tracking-wide mb-6 flex items-center gap-2 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to options
                        </button>
                        <div className="bg-secondary p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-200">
                            <h3 className="text-3xl font-extrabold text-text-primary mb-8">Finalize & Save</h3>
>>>>>>> 7a3b66c (Update README with correct repo info)
                            <DateForm initialData={dateToSave} profiles={profiles} onSave={handleSaveDate} onCancel={() => setStep('results')} />
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'calendar' && (
            <div className="animate-fade-in">
                <DateList dates={dates} profiles={profiles} onDelete={handleDeleteDate} />
            </div>
        )}
    </div>
  );
};


const DateForm: React.FC<{
  initialData?: Partial<PlannedDate>;
  profiles: PersonProfile[];
  onSave: (date: PlannedDate) => void;
  onCancel: () => void;
}> = ({ initialData, profiles, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [personId, setPersonId] = useState(initialData?.personId || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!title || !personId || !date) return;
    onSave({ id: Date.now().toString(), title, personId, date, location, notes });
  };
  
  const inputClasses = "mt-1 block w-full bg-tertiary/50 border border-stone-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/50 text-white transition-all";
  const labelClasses = "block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1";
=======
    if (!title || !date) return;
    onSave({ id: Date.now().toString(), title, personId, date, location, notes });
  };
  
  const inputClasses = "mt-1 block w-full bg-tertiary border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-primary transition-all";
  const labelClasses = "block text-xs font-bold text-text-secondary uppercase tracking-wider ml-1";
>>>>>>> 7a3b66c (Update README with correct repo info)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelClasses}>Date Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={inputClasses} required placeholder="e.g. Dinner & Movie" />
        </div>
        <div>
          <label htmlFor="personId" className={labelClasses}>With</label>
<<<<<<< HEAD
          <select id="personId" value={personId} onChange={e => setPersonId(e.target.value)} className={inputClasses} required>
            <option value="" disabled>Select a profile</option>
=======
          <select id="personId" value={personId} onChange={e => setPersonId(e.target.value)} className={inputClasses}>
            <option value="">No specific profile</option>
>>>>>>> 7a3b66c (Update README with correct repo info)
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className={labelClasses}>Date & Time</label>
          <input type="datetime-local" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputClasses} required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="location" className={labelClasses}>Location</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className={inputClasses} placeholder="e.g., The Cozy Cafe" />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className={labelClasses}>Notes</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={4} className={inputClasses} placeholder="Reservation info, dress code, etc."></textarea>
      </div>
<<<<<<< HEAD
      <div className="flex justify-end gap-4 pt-6 border-t border-tertiary">
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white px-6 py-3 font-bold transition-colors rounded-xl hover:bg-tertiary">Cancel</button>
=======
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="text-text-secondary hover:text-text-primary px-6 py-3 font-bold transition-colors rounded-xl hover:bg-tertiary">Cancel</button>
>>>>>>> 7a3b66c (Update README with correct repo info)
        <button type="submit" className="bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent-hover font-bold transition-all shadow-lg active:scale-95">Save to Calendar</button>
      </div>
    </form>
  );
};

const DateList: React.FC<{
    dates: PlannedDate[];
    profiles: PersonProfile[];
    onDelete: (id: string) => void;
}> = ({ dates, profiles, onDelete }) => {
    const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'Unknown';
  
    const upcomingDates = dates
        .filter(d => new Date(d.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const pastDates = dates
        .filter(d => new Date(d.date) < new Date())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const DateCard: React.FC<{ date: PlannedDate }> = ({ date }) => (
<<<<<<< HEAD
        <div className="bg-secondary p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start gap-6 border border-tertiary hover:border-accent/30 transition-colors group">
            <div className="flex-shrink-0 text-center bg-stone-950 p-4 rounded-xl min-w-[90px] flex flex-col items-center justify-center border border-tertiary">
                <div className="text-accent text-xs uppercase font-bold tracking-wider">{new Date(date.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div className="text-white text-3xl font-black my-1">{new Date(date.date).getDate()}</div>
                <div className="text-slate-500 text-xs uppercase font-bold">{new Date(date.date).toLocaleDateString(undefined, { month: 'short' })}</div>
=======
        <div className="bg-secondary p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start gap-6 border border-gray-200 hover:border-accent/30 transition-colors group">
            <div className="flex-shrink-0 text-center bg-tertiary p-4 rounded-xl min-w-[90px] flex flex-col items-center justify-center border border-gray-200">
                <div className="text-accent text-xs uppercase font-bold tracking-wider">{new Date(date.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                <div className="text-text-primary text-3xl font-black my-1">{new Date(date.date).getDate()}</div>
                <div className="text-text-secondary text-xs uppercase font-bold">{new Date(date.date).toLocaleDateString(undefined, { month: 'short' })}</div>
>>>>>>> 7a3b66c (Update README with correct repo info)
            </div>
            <div className="flex-grow w-full">
                <div className="flex justify-between items-start">
                    <div>
<<<<<<< HEAD
                        <h4 className="font-bold text-xl text-white mb-1">{date.title}</h4>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                            Date with <span className="text-accent font-semibold">{getProfileName(date.personId)}</span>
                        </p>
                    </div>
                    <button onClick={() => onDelete(date.id)} className="text-slate-600 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
=======
                        <h4 className="font-bold text-xl text-text-primary mb-1">{date.title}</h4>
                        {date.personId ? (
                            <p className="text-sm text-text-secondary flex items-center gap-1">
                                Date with <span className="text-accent font-semibold">{getProfileName(date.personId)}</span>
                            </p>
                        ) : (
                             <p className="text-sm text-text-secondary flex items-center gap-1">
                                General Date
                            </p>
                        )}
                    </div>
                    <button onClick={() => onDelete(date.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
>>>>>>> 7a3b66c (Update README with correct repo info)
                        <Trash2 size={20} />
                    </button>
                </div>
                
<<<<<<< HEAD
                <div className="mt-4 space-y-2 text-slate-300">
=======
                <div className="mt-4 space-y-2 text-text-primary">
>>>>>>> 7a3b66c (Update README with correct repo info)
                    <p className="text-sm flex items-center gap-2.5 font-medium"><Clock size={16} className="text-accent" />{new Date(date.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                    {date.location && <p className="text-sm flex items-center gap-2.5 font-medium"><MapPin size={16} className="text-accent" />{date.location}</p>}
                </div>

                {date.notes && (
<<<<<<< HEAD
                    <div className="mt-4 text-sm bg-black/20 p-4 rounded-xl border border-white/5 flex gap-3 items-start">
                        <StickyNote size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-400 italic whitespace-pre-wrap leading-relaxed">{date.notes}</p>
=======
                    <div className="mt-4 text-sm bg-tertiary p-4 rounded-xl border border-gray-200 flex gap-3 items-start">
                        <StickyNote size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary italic whitespace-pre-wrap leading-relaxed">{date.notes}</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            <div>
<<<<<<< HEAD
                <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-accent rounded-full"></div> Upcoming</h3>
                {upcomingDates.length > 0 ? (
                    <div className="space-y-4">{upcomingDates.map(d => <DateCard key={d.id} date={d}/>)}</div>
                ) : (
                    <div className="text-center py-16 bg-secondary/30 rounded-[2rem] border border-dashed border-tertiary">
                        <p className="text-slate-500 font-medium">No upcoming dates scheduled.</p>
=======
                <h3 className="text-xl text-text-primary font-bold mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-accent rounded-full"></div> Upcoming</h3>
                {upcomingDates.length > 0 ? (
                    <div className="space-y-4">{upcomingDates.map(d => <DateCard key={d.id} date={d}/>)}</div>
                ) : (
                    <div className="text-center py-16 bg-secondary/30 rounded-[2rem] border border-dashed border-gray-200">
                        <p className="text-text-secondary font-medium">No upcoming dates scheduled.</p>
>>>>>>> 7a3b66c (Update README with correct repo info)
                    </div>
                )}
            </div>
            {pastDates.length > 0 && (
                <div>
<<<<<<< HEAD
                     <h3 className="text-xl text-slate-500 font-bold mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-slate-600 rounded-full"></div> Past</h3>
=======
                     <h3 className="text-xl text-text-secondary font-bold mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-gray-400 rounded-full"></div> Past</h3>
>>>>>>> 7a3b66c (Update README with correct repo info)
                    <div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">{pastDates.map(d => <DateCard key={d.id} date={d}/>)}</div>
                </div>
            )}
        </div>
    );
}

export default DatePlanner;