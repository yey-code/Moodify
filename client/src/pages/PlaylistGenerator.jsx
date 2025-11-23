import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playlist as playlistApi, mood as moodApi } from '../utils/api';
import { FaMusic, FaSpotify } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';

export default function PlaylistGenerator() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    mood: searchParams.get('mood') || '',
    genres: [],
    artists: [],
    socialReview: '',
    hobbies: [],
    listeningTime: 'any',
    tempoPreference: 'medium',
    useTopArtists: true
  });

  const [hobbies, setHobbies] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
    loadHobbies();
    
    // Auto-generate if quick mode
    if (searchParams.get('quick') === 'true' && formData.mood) {
      handleGenerate();
    }
  }, [user, loading, navigate]);

  const loadHobbies = async () => {
    try {
      const response = await moodApi.getHobbies();
      setHobbies(response.data.hobbies);
    } catch (error) {
      console.error('Error loading hobbies:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'hobbies') {
        setFormData(prev => ({
          ...prev,
          hobbies: checked 
            ? [...prev.hobbies, value]
            : prev.hobbies.filter(h => h !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenreAdd = (genre) => {
    if (!formData.genres.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genre]
      }));
    }
  };

  const handleGenreRemove = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const handleGenerate = async () => {
    if (!formData.mood) {
      setError('Please select a mood');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await playlistApi.generate(formData);
      setGeneratedTracks(response.data);
      
      // Navigate to preview with data
      navigate('/preview', { state: { 
        tracks: response.data.tracks,
        analysis: response.data.analysis,
        formData
      }});
    } catch (error) {
      console.error('Generate error:', error);
      setError(error.response?.data?.error || 'Failed to generate playlist');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const popularGenres = ['pop', 'rock', 'hip-hop', 'electronic', 'jazz', 'classical', 'indie', 'r-n-b'];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-light p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaMusic /> Moodify
          </Link>
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <HiArrowLeft /> Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center">Customize Your Playlist</h1>
        <p className="text-center text-gray-400 mb-12">The more details you provide, the better your playlist</p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Mood */}
          <div className="card">
            <label className="block text-lg font-bold mb-3">Mood *</label>
            <input
              type="text"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              placeholder="e.g., happy, sad, energetic"
              className="input"
              required
            />
          </div>

          {/* Genres */}
          <div className="card">
            <label className="block text-lg font-bold mb-3">Favorite Genres</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {popularGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreAdd(genre)}
                  className="mood-badge mood-badge-unselected"
                >
                  {genre}
                </button>
              ))}
            </div>
            {formData.genres.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map(genre => (
                    <span
                      key={genre}
                      className="mood-badge mood-badge-selected cursor-pointer"
                      onClick={() => handleGenreRemove(genre)}
                    >
                      {genre} ×
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Review / Sentiment */}
          <div className="card">
            <label className="block text-lg font-bold mb-3">Social Review or Personal Note</label>
            <textarea
              name="socialReview"
              value={formData.socialReview}
              onChange={handleChange}
              placeholder="Share your thoughts or paste a social media post for sentiment analysis..."
              className="input min-h-[100px]"
              rows={4}
            />
            <p className="text-sm text-gray-400 mt-2">AI will analyze the sentiment to fine-tune your playlist</p>
          </div>

          {/* Hobbies */}
          <div className="card">
            <label className="block text-lg font-bold mb-3">Hobbies & Activities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hobbies.map(hobby => (
                <label key={hobby} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hobbies"
                    value={hobby}
                    checked={formData.hobbies.includes(hobby)}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="capitalize">{hobby}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Listening Time */}
          <div className="card">
            <label className="block text-lg font-bold mb-3">Listening Time</label>
            <select
              name="listeningTime"
              value={formData.listeningTime}
              onChange={handleChange}
              className="input"
            >
              <option value="any">Any time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>

          {/* Tempo Preference */}
          <div className="card">
            <label className="block text-lg font-bold mb-3">Tempo Preference</label>
            <select
              name="tempoPreference"
              value={formData.tempoPreference}
              onChange={handleChange}
              className="input"
            >
              <option value="slow">Slow & Calm</option>
              <option value="medium">Medium Pace</option>
              <option value="fast">Fast & Upbeat</option>
            </select>
          </div>

          {/* Use Top Artists */}
          <div className="card">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="useTopArtists"
                checked={formData.useTopArtists}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <div>
                <div className="font-bold">Include my top artists</div>
                <div className="text-sm text-gray-400">Use your Spotify listening history for better recommendations</div>
              </div>
            </label>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleGenerate}
              disabled={generating || !formData.mood}
              className="btn-primary text-xl px-12"
            >
              {generating ? 'Generating...' : '🎵 Generate Playlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
