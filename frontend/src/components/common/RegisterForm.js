import React, { useState } from 'react';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== reenterPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Pass the actual form values to onRegister
    onRegister(email, password, name);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
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
        <input
          type="password"
          placeholder="Re-enter Password"
          value={reenterPassword}
          onChange={(e) => setReenterPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </form>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <button onClick={onSwitchToLogin} className="text-indigo-600 hover:underline text-sm font-medium">
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
