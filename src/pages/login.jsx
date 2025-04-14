import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("✅ User is logged in, navigating to /home...");
      navigate('/home');
    }
  }, [user]);
  
  /*

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
      const user = data?.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, email }]); // make sure `id` is used if that's your PK
  
        if (profileError) {
          console.error("❌ Failed to insert into profiles:", profileError);
          setError("Could not complete signup.");
          return;
        }
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
if (error) return setError(error.message);

alert("Check your email to confirm your account.");

      alert("Check your email to confirm your account.");
    }
  };
  */


  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
  
      alert("Check your email to confirm your account.");
    }
  };
  
    
      return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-rose-700">
        {isLogin ? 'Sign In to Bookle' : 'Create an Account'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        {isLogin ? 'New here?' : 'Already have an account?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-rose-600 hover:underline"
        >
          {isLogin ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};


export default LoginPage;
