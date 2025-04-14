import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';
import { useUser } from '../AuthContext';

const PostPage = () => {
  const { id: stringId } = useParams();
  const id = parseInt(stringId, 10);
  const navigate = useNavigate();
  const { user } = useUser();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [triggerUpvotes, setTriggerUpvotes] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');

  const fetchPostAndComments = async () => {
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          email
        )
      `)
      .eq('id', id)
      .single();
  
    const { data: commentsData, error: commentError } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          email
        )
      `)
      .eq('post_id', id);
  
    if (postError || commentError) {
      console.error("🛑 Supabase Fetch Error:", postError || commentError);
      return;
    }
  
    setPost(postData);
    setComments(commentsData);
  };
    

  useEffect(() => {
    fetchPostAndComments();
  }, [id, trigger, triggerUpvotes]);

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', post.id)
      .select();

    if (!error && data?.length > 0) {
      setPost(data[0]);
      setTriggerUpvotes(prev => !prev);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to comment.');
      return;
    }

    const { data } = await supabase.from('comments').insert([
      {
        content: newComment,
        post_id: id,
        user_id: user.id,
      },
    ]);

    if (data) {
      setNewComment('');
      setTrigger(prev => !prev);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedImageUrl(post.image_url);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await supabase
      .from('posts')
      .update({
        title: editedTitle,
        content: editedContent,
        image_url: editedImageUrl,
      })
      .eq('id', id);
    setIsEditMode(false);
    navigate('/home');
  };

  const handleDelete = async () => {
    await supabase.from('posts').delete().eq('id', id);
    navigate('/home');
  };

  if (isEditMode) {
    return (
      <form onSubmit={handleEditSubmit} className="max-w-xl mx-auto mt-10 space-y-4">
        <input type="text" className="w-full border p-3 rounded" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} placeholder="Edit Title" />
        <textarea className="w-full border p-3 rounded" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} placeholder="Edit Content" />
        <input type="text" className="w-full border p-3 rounded" value={editedImageUrl} onChange={(e) => setEditedImageUrl(e.target.value)} placeholder="Edit Image URL" />
        <div className="flex gap-4 justify-center">
          <button type="submit" className="bg-rose-600 text-white px-5 py-2 rounded-full">Save</button>
          <button type="button" onClick={() => setIsEditMode(false)} className="bg-gray-300 px-5 py-2 rounded-full">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {post && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h1 className="text-3xl font-bold text-rose-800 mb-2 text-center">{post.title}</h1>
            <p className="text-sm text-gray-500 text-center mb-4">
              Posted by: <span className="font-medium">{post.profiles?.email || 'Unknown'}</span>
            </p>
            <p className="text-gray-700 mb-4 text-center">{post.content}</p>
            {post.image_url && (
              <div className="flex justify-center mb-4">
                <img src={post.image_url} alt={post.title} className="rounded-lg max-h-96 object-contain" />
              </div>
            )}
            <div className="flex justify-center gap-4">
              <button onClick={handleUpvote} className="bg-rose-500 text-white px-4 py-2 rounded-full">Upvote ({post.upvotes})</button>
              <button onClick={handleEdit} className="bg-indigo-500 text-white px-4 py-2 rounded-full">Edit</button>
              <button onClick={handleDelete} className="bg-gray-600 text-white px-4 py-2 rounded-full">Delete</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full border p-3 rounded" />
              <div className="flex justify-end">
                <button type="submit" className="bg-rose-600 text-white px-5 py-2 rounded-full">Comment</button>
              </div>
            </form>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Comments</h3>
            <div className="space-y-3 mt-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-l-4 border-rose-400 pl-4 py-2 bg-rose-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">
                    {comment.profiles?.email || 'Anonymous'}
                  </p>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
