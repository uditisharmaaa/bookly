import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import LoginPage from './pages/login';
import { useUser } from './AuthContext'; // ✅

function App() {
  const { user } = useUser(); // ✅ get current user
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <Routes>
        {/* Dynamic root route */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        {user && (
          <>
            <Route path="/home" element={<HomePage searchTerm={searchTerm} />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
          </>
        )}

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
