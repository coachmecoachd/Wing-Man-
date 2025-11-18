
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-primary font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          <span className="text-accent">Wing</span> Man
        </h1>
        <p className="text-lg text-gray-400 mb-8">Your Personal Dating AI Assistant</p>
        
        <div className="bg-secondary p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your username to access your profile.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-tertiary border border-tertiary rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter a username"
              />
              <p className="text-xs text-gray-500 mt-3">
                No password required. All data is stored securely on this device.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-500 font-bold transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
         <footer className="text-center p-4 mt-8">
          <p className="text-sm text-gray-500">
             Wing Man &copy; {new Date().getFullYear()}
          </p>
      </footer>
      </div>
    </div>
  );
};

export default Login;
