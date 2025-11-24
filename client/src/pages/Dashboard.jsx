import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playlist } from '../utils/api';
import { DEMO_PLAYLISTS } from '../utils/demoData';
import { FaMusic, FaTheaterMasks, FaRobot, FaBook, FaLightbulb, FaSpotify } from 'react-icons/fa';
import { HiArrowRight, HiInformationCircle } from 'react-icons/hi2';

export default function Dashboard() {
  const { user, loading, logout, isDemo } = useAuth();
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
      // Use demo data if in demo mode
      if (isDemo) {
        setPlaylists(DEMO_PLAYLISTS);
        setLoadingPlaylists(false);
        return;
      }
      
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
      <header className="bg-dark-light p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <FaMusic /> Moodify
          </Link>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
            <span className="text-gray-400 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">Welcome, {user.display_name}</span>
            <div className="flex gap-3">
              <Link to="/library" className="btn-secondary text-sm sm:text-base">Library</Link>
              <button onClick={logout} className="btn-secondary text-sm sm:text-base">Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-4 flex items-start gap-3">
            <HiInformationCircle className="text-2xl text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-blue-300 mb-1">Demo Mode Active</h3>
              <p className="text-sm text-gray-300">
                You're exploring Moodify with sample data. Playlists won't be created in Spotify. 
                <Link to="/" onClick={logout} className="text-primary hover:underline ml-1">
                  Login with Spotify
                </Link> for full features (limited slots available).
              </p>
            </div>
          </div>
        )}

        {/* Hero Card */}
        {/* Hero Card */}
        <div className="card mb-6 sm:mb-8 bg-gradient-to-r from-primary to-blue-500 text-black">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 flex-wrap">
                Ready to create magic? <FaSpotify />
              </h1>
              <p className="text-sm sm:text-base md:text-lg opacity-90">Generate personalized playlists based on your mood and preferences</p>
            </div>
            <Link to="/mood" className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-900 transition text-sm sm:text-base w-full sm:w-auto text-center whitespace-nowrap">
              Create Playlist
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Recent Playlists</h2>
            <Link to="/library" className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm sm:text-base">
              View All <HiArrowRight />
            </Link>
          </div>

          {loadingPlaylists ? (
            <div className="text-center py-8 text-gray-400 text-sm sm:text-base">Loading playlists...</div>
          ) : playlists.length === 0 ? (
            <div className="card text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4 flex justify-center text-primary">
                <FaMusic />
              </div>
              <p className="text-lg sm:text-xl text-gray-400 mb-4">No playlists yet</p>
              <Link to="/mood" className="btn-primary inline-block text-sm sm:text-base">
                Create Your First Playlist
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {playlists.map((pl) => (
                <div key={pl.id} className="card hover:bg-gray-dark transition cursor-pointer">
                  <div className="mb-4">
                    {pl.cover_image ? (
                      <img src={pl.cover_image} alt={pl.name} className="w-full h-40 sm:h-48 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-40 sm:h-48 bg-gray-dark rounded-lg flex items-center justify-center text-4xl sm:text-6xl text-primary">
                        <FaMusic />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 truncate">{pl.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">{pl.track_count} tracks</p>
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
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" /> Tips for Better Playlists
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
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
