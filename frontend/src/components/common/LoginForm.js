import React, { useState } from 'react';

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password); // ← pass values here
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me</label>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <button onClick={onSwitchToRegister} className="text-indigo-600 hover:underline text-sm font-medium">
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
