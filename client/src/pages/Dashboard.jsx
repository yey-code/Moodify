import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playlist } from '../utils/api';
import { FaMusic, FaTheaterMasks, FaRobot, FaBook, FaLightbulb, FaSpotify } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    try {
      const response = await playlist.getHistory();
      setPlaylists(response.data.playlists.slice(0, 6));
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-light p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaMusic /> Moodify
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-gray-400">Welcome, {user.display_name}</span>
            <Link to="/library" className="btn-secondary">Library</Link>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Card */}
        <div className="card mb-8 bg-gradient-to-r from-primary to-blue-500 text-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Ready to create magic? <FaSpotify />
              </h1>
              <p className="text-lg opacity-90">Generate personalized playlists based on your mood and preferences</p>
            </div>
            <Link to="/mood" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition">
              Create Playlist
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/mood" className="card hover:bg-gray-dark transition cursor-pointer">
            <div className="text-4xl mb-3 text-primary flex">
              <FaTheaterMasks />
            </div>
            <h3 className="text-xl font-bold mb-2">Mood Selector</h3>
            <p className="text-gray-400">Start with your current mood</p>
          </Link>
          
          <Link to="/generate" className="card hover:bg-gray-dark transition cursor-pointer">
            <div className="text-4xl mb-3 text-primary flex">
              <FaRobot />
            </div>
            <h3 className="text-xl font-bold mb-2">Advanced Generator</h3>
            <p className="text-gray-400">Full customization options</p>
          </Link>
          
          <Link to="/library" className="card hover:bg-gray-dark transition cursor-pointer">
            <div className="text-4xl mb-3 text-primary flex">
              <FaBook />
            </div>
            <h3 className="text-xl font-bold mb-2">Your Library</h3>
            <p className="text-gray-400">View past playlists</p>
          </Link>
        </div>

        {/* Recent Playlists */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Playlists</h2>
            <Link to="/library" className="text-primary hover:text-primary-dark flex items-center gap-1">
              View All <HiArrowRight />
            </Link>
          </div>

          {loadingPlaylists ? (
            <div className="text-center py-8 text-gray-400">Loading playlists...</div>
          ) : playlists.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4 flex justify-center text-primary">
                <FaMusic />
              </div>
              <p className="text-xl text-gray-400 mb-4">No playlists yet</p>
              <Link to="/mood" className="btn-primary inline-block">
                Create Your First Playlist
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {playlists.map((pl) => (
                <div key={pl.id} className="card hover:bg-gray-dark transition cursor-pointer">
                  <div className="mb-4">
                    {pl.cover_image ? (
                      <img src={pl.cover_image} alt={pl.name} className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-48 bg-gray-dark rounded-lg flex items-center justify-center text-6xl text-primary">
                        <FaMusic />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{pl.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{pl.track_count} tracks</p>
                  {pl.mood && (
                    <span className="inline-block bg-primary text-black text-xs px-3 py-1 rounded-full font-semibold">
                      {pl.mood}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card bg-dark-light">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" /> Tips for Better Playlists
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Be specific about your mood and preferences</li>
            <li>• Add social review text for sentiment-based recommendations</li>
            <li>• Select hobbies to match music with your activities</li>
            <li>• Use tempo preferences for fine-tuned results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
