import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

const HomePage = ({ searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState('created');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*');
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortMethod === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const filteredPosts = searchTerm
    ? sortedPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sortedPosts;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="w-full px-6 py-12">
      <h1 className="text-center text-4xl font-semibold text-[#2d5930] mb-10">📚 Bookle</h1>

      {/* Sort Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setSortMethod('created')}
          className="bg-[#3B6A3E] hover:bg-[#2f5130] text-white px-6 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Sort by New
        </button>
        <button
          onClick={() => setSortMethod('upvotes')}
          className="bg-[#3B6A3E] hover:bg-[#2f5130] text-white px-6 py-2 rounded-full shadow transition transform hover:scale-105"
        >
          Sort by Upvotes
        </button>
      </div>

      {/* Post Cards */}
      {filteredPosts.map((post) => (
        <Link to={`/post/${post.id}`} key={post.id}>
          <div className="w-[95%] mx-auto bg-white rounded-xl p-8 mb-6 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>📅 {formatDate(post.created_at)}</span>
              <span>👍 {post.upvotes || 0}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#2d5930] mb-2">{post.title}</h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed line-clamp-2">{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomePage;
