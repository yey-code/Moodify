import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { playlist as playlistApi } from '../utils/api';
import { FaMusic, FaBolt, FaSmile, FaGuitar, FaSpotify } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';

export default function PlaylistPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tracks, analysis, formData } = location.state || {};
  
  const [playlistName, setPlaylistName] = useState(
    `${analysis?.mood || 'My'} Vibes - ${new Date().toLocaleDateString()}`
  );
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] = useState(null);

  if (!tracks || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No playlist data found</p>
          <Link to="/mood" className="btn-primary">
            Create a Playlist
          </Link>
        </div>
      </div>
    );
  }

  const handleCreate = async () => {
    setCreating(true);

    try {
      const trackUris = tracks.map(t => t.uri);
      
      const response = await playlistApi.create({
        name: playlistName,
        description: analysis.description,
        tracks: trackUris,
        mood: analysis.mood,
        energy: analysis.attributes.energy,
        valence: analysis.attributes.valence,
        danceability: analysis.attributes.danceability,
        tempo: (analysis.attributes.tempo.min + analysis.attributes.tempo.max) / 2,
        isPublic: false,
        aiAnalysis: analysis,
        spotifyParams: formData
      });

      setCreatedPlaylist(response.data.playlist);
      setCreated(true);
    } catch (error) {
      console.error('Create playlist error:', error);
      alert('Failed to create playlist: ' + (error.response?.data?.error || error.message));
    } finally {
      setCreating(false);
    }
  };

  if (created && createdPlaylist) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold mb-4">Playlist Created!</h1>
          <p className="text-xl text-gray-400 mb-8">
            Your playlist "{createdPlaylist.name}" with {createdPlaylist.trackCount} tracks is now in your Spotify account
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <a
              href={createdPlaylist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Open in Spotify
            </a>
            <Link to="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>

          <Link to="/mood" className="text-primary hover:text-primary-dark">
            Create Another Playlist →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-light p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaMusic /> Moodify
          </Link>
          <Link to="/generate" className="btn-secondary flex items-center gap-2">
            <HiArrowLeft /> Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Preview Your Playlist</h1>
          <p className="text-xl text-gray-400">Review and customize before creating</p>
        </div>

        {/* Playlist Info */}
        <div className="card mb-8 bg-gradient-to-r from-primary to-blue-500 text-black">
          <div className="mb-4">
            <label className="block font-bold mb-2">Playlist Name</label>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-black bg-white bg-opacity-90"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Description</label>
            <p className="opacity-90">{analysis.description}</p>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl mb-2 text-primary flex justify-center"><FaBolt /></div>
            <div className="text-sm text-gray-400">Energy</div>
            <div className="text-2xl font-bold">{Math.round(analysis.attributes.energy * 100)}%</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2 text-primary flex justify-center"><FaSmile /></div>
            <div className="text-sm text-gray-400">Positivity</div>
            <div className="text-2xl font-bold">{Math.round(analysis.attributes.valence * 100)}%</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2 text-primary flex justify-center"><FaGuitar /></div>
            <div className="text-sm text-gray-400">Danceability</div>
            <div className="text-2xl font-bold">{Math.round(analysis.attributes.danceability * 100)}%</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2 text-primary flex justify-center"><FaMusic /></div>
            <div className="text-sm text-gray-400">Tracks</div>
            <div className="text-2xl font-bold">{tracks.length}</div>
          </div>
        </div>

        {/* Genres */}
        <div className="card mb-8">
          <h3 className="font-bold mb-3">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.genres.map(genre => (
              <span key={genre} className="mood-badge mood-badge-selected">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Track List */}
        <div className="card mb-8">
          <h3 className="font-bold text-xl mb-4">Tracks ({tracks.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tracks.map((track, index) => (
              <div key={track.id} className="flex items-center gap-4 p-3 bg-dark rounded-lg hover:bg-gray-dark transition">
                <div className="text-gray-400 w-8">{index + 1}</div>
                {track.albumArt && (
                  <img src={track.albumArt} alt={track.name} className="w-12 h-12 rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{track.name}</div>
                  <div className="text-sm text-gray-400 truncate">{track.artists}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {Math.floor(track.duration / 60000)}:{String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <HiArrowLeft /> Regenerate
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="btn-primary text-xl px-12 flex items-center gap-2 justify-center"
          >
            {creating ? 'Creating...' : <><FaSpotify /> Create Playlist in Spotify</>}
          </button>
        </div>
      </div>
    </div>
  );
}
