import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playlist } from '../utils/api';
import { FaMusic } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';

export default function Library() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
    if (user) {
      loadPlaylists();
    }
  }, [user, loading, navigate]);

  const loadPlaylists = async () => {
    try {
      const response = await playlist.getHistory();
      setPlaylists(response.data.playlists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const filteredPlaylists = filter === 'all' 
    ? playlists 
    : playlists.filter(p => p.mood === filter);

  const moods = [...new Set(playlists.map(p => p.mood).filter(Boolean))];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-light p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaMusic /> Moodify
          </Link>
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <HiArrowLeft /> Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Library</h1>
            <p className="text-gray-400">All your AI-generated playlists</p>
          </div>
          <Link to="/mood" className="btn-primary">
            + Create New
          </Link>
        </div>

        {/* Filters */}
        {moods.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`mood-badge ${filter === 'all' ? 'mood-badge-selected' : 'mood-badge-unselected'}`}
              >
                All
              </button>
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setFilter(mood)}
                  className={`mood-badge capitalize ${filter === mood ? 'mood-badge-selected' : 'mood-badge-unselected'}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Playlist Grid */}
        {loadingPlaylists ? (
          <div className="text-center py-12 text-gray-400">Loading playlists...</div>
        ) : filteredPlaylists.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4 flex justify-center text-primary">
              <FaMusic />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {filter === 'all' ? 'No playlists yet' : `No ${filter} playlists found`}
            </h2>
            <p className="text-gray-400 mb-6">Start creating amazing playlists with AI</p>
            <Link to="/mood" className="btn-primary inline-block">
              Create Your First Playlist
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlaylists.map((pl) => (
                <div key={pl.id} className="card hover:bg-gray-dark transition cursor-pointer group">
                  <div className="mb-4 relative">
                    {pl.cover_image ? (
                      <img 
                        src={pl.cover_image} 
                        alt={pl.name} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center text-6xl">
                        <FaMusic />
                      </div>
                    )}
                    {pl.spotify_playlist_id && (
                      <a
                        href={`https://open.spotify.com/playlist/${pl.spotify_playlist_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-black bg-opacity-70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 truncate" title={pl.name}>
                    {pl.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{pl.track_count} tracks</span>
                    <span>{new Date(pl.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {pl.mood && (
                    <span className="inline-block bg-primary text-black text-xs px-3 py-1 rounded-full font-semibold capitalize">
                      {pl.mood}
                    </span>
                  )}
                  
                  {pl.description && (
                    <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                      {pl.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-4xl mb-2 flex justify-center text-primary"><FaMusic /></div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {playlists.length}
                </div>
                <div className="text-gray-400">Total Playlists</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-2 flex justify-center text-primary"><FaMusic /></div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {playlists.reduce((sum, p) => sum + (p.track_count || 0), 0)}
                </div>
                <div className="text-gray-400">Total Tracks</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-2">🎭</div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {moods.length}
                </div>
                <div className="text-gray-400">Different Moods</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
