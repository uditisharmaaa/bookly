import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';
import { useUser } from '../AuthContext'; // ✅ import user context

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image_url, setImageUrl] = useState('');
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ get the current user

  const handleSubmit = async (e) => {
    console.log(user.id);

    e.preventDefault();
  
    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }
  
    console.log('📤 Submitting post with data:', {
      title,
      content,
      image_url,
      user_id: user.id,
    });
  
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          image_url,
          user_id: user.id,
        },
      ])
      .select(); // Helps to log inserted rows
  
    if (error) {
      console.error('❌ Supabase insert failed:', error);
      alert('Failed to publish: ' + error.message);
    } else {
      console.log('✅ Post created successfully:', data);
      navigate('/home');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center text-neutral-800 mb-10 tracking-tight">
        Create a New Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gradient-to-br from-white via-neutral-50 to-white shadow-xl border border-neutral-200 rounded-2xl p-8"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          required
          className="w-full border border-neutral-300 rounded-md p-3 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something beautiful..."
          required
          className="w-full border border-neutral-300 rounded-md p-3 h-40 resize-none text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="text"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full border border-neutral-300 rounded-md p-3 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full bg-[#2d5930] text-white text-lg font-medium py-3 rounded-md hover:bg-[#244926] transition duration-200"
        >
          ✨ Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
