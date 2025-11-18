

import React, { useState } from 'react';
import { PlannedDate, PersonProfile } from '../types.ts';

interface DatePlannerProps {
  dates: PlannedDate[];
  setDates: React.Dispatch<React.SetStateAction<PlannedDate[]>>;
  profiles: PersonProfile[];
}

const DateForm: React.FC<{
  profiles: PersonProfile[];
  onAddDate: (date: Omit<PlannedDate, 'id'>) => void;
}> = ({ profiles, onAddDate }) => {
  const [title, setTitle] = useState('');
  const [personId, setPersonId] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !personId || !date) return;
    onAddDate({ title, personId, date, location, notes });
    setTitle('');
    setPersonId('');
    setDate('');
    setLocation('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-white">Schedule a New Date</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400">Date Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent" required />
        </div>
        <div>
          <label htmlFor="personId" className="block text-sm font-medium text-gray-400">With</label>
          <select id="personId" value={personId} onChange={e => setPersonId(e.target.value)} className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent" required>
            <option value="" disabled>Select a profile</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-400">Date & Time</label>
          <input type="datetime-local" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent" required />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-400">Location</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="e.g., The Cozy Cafe" />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-400">Notes</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-tertiary border-tertiary rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="e.g., Reservation at 7pm, wear something nice."></textarea>
      </div>
      <div className="text-right">
        <button type="submit" className="bg-accent text-white px-6 py-2 rounded-md hover:bg-red-700">Add Date</button>
      </div>
    </form>
  );
};


const DatePlanner: React.FC<DatePlannerProps> = ({ dates, setDates, profiles }) => {
  const addDate = (date: Omit<PlannedDate, 'id'>) => {
    const newDate = { ...date, id: Date.now().toString() };
    setDates([...dates, newDate]);
  };

  const deleteDate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this date?")) {
        setDates(dates.filter(d => d.id !== id));
    }
  };
  
  const getProfileName = (id: string) => profiles.find(p => p.id === id)?.name || 'Unknown';
  
  const upcomingDates = dates
    .filter(d => new Date(d.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastDates = dates
    .filter(d => new Date(d.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const DateCard: React.FC<{ date: PlannedDate }> = ({ date }) => (
     <div className="bg-secondary p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-shrink-0 text-center sm:text-left">
            <div className="text-accent text-sm uppercase font-bold">{new Date(date.date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div className="text-white text-3xl font-bold">{new Date(date.date).getDate()}</div>
            <div className="text-gray-400 text-sm">{new Date(date.date).toLocaleDateString(undefined, { month: 'short' })}</div>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l border-tertiary pt-4 sm:pt-0 sm:pl-4 flex-grow">
            <h4 className="font-bold text-lg text-white">{date.title}</h4>
            <p className="text-sm text-gray-400">with {getProfileName(date.personId)}</p>
            <p className="text-sm text-gray-300 mt-1">{new Date(date.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} at {date.location}</p>
            {date.notes && <p className="text-xs italic bg-primary p-2 rounded-md mt-2">{date.notes}</p>}
        </div>
        <button onClick={() => deleteDate(date.id)} className="bg-tertiary p-1.5 rounded-full hover:bg-accent self-start sm:self-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-6">Your Dates</h2>
        <div className="space-y-6">
            <div>
                <h3 className="text-xl text-accent font-semibold mb-3">Upcoming</h3>
                {upcomingDates.length > 0 ? (
                    <div className="space-y-4">{upcomingDates.map(d => <DateCard key={d.id} date={d}/>)}</div>
                ) : <p className="text-gray-500">No upcoming dates scheduled.</p>}
            </div>
            <div>
                 <h3 className="text-xl text-accent font-semibold mb-3">Past</h3>
                {pastDates.length > 0 ? (
                    <div className="space-y-4">{pastDates.map(d => <DateCard key={d.id} date={d}/>)}</div>
                ) : <p className="text-gray-500">No past dates yet.</p>}
            </div>
        </div>
      </div>
      <div>
        <DateForm profiles={profiles} onAddDate={addDate} />
      </div>
    </div>
  );
};

export default DatePlanner;