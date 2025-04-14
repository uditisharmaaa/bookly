import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../AuthContext';
import supabase from '../utils/supabaseClient';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; // force redirect
  };

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <Link to="/home" className="text-lg font-semibold text-neutral-800 hover:text-indigo-600 transition">
            📚 Bookle
          </Link>
          <Link to="/create-post" className="text-sm text-neutral-600 hover:text-indigo-500 transition">
            + New Post
          </Link>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search posts..."
            className="w-full sm:w-72 border border-neutral-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
