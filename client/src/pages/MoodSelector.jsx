import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mood } from '../utils/api';
import { FaMusic, FaSmile, FaSadTear, FaBolt, FaLeaf, FaBullseye, FaFire, FaHeart, FaDumbbell, FaSpa, FaExclamationTriangle } from 'react-icons/fa';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';

const moodIcons = {
  happy: <FaSmile />,
  sad: <FaSadTear />,
  energetic: <FaBolt />,
  chill: <FaLeaf />,
  focused: <FaBullseye />,
  angry: <FaFire />,
  romantic: <FaHeart />,
  motivated: <FaDumbbell />,
  relaxed: <FaSpa />,
  anxious: <FaExclamationTriangle />
};

export default function MoodSelector() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
    loadMoods();
  }, [user, loading, navigate]);

  const loadMoods = async () => {
    try {
      const response = await mood.getMoods();
      setMoods(response.data.moods);
    } catch (error) {
      console.error('Error loading moods:', error);
      // Fallback to default moods
      setMoods(['happy', 'sad', 'energetic', 'chill', 'focused', 'angry', 'romantic', 'motivated', 'relaxed', 'anxious']);
    }
  };

  const handleContinue = () => {
    if (selectedMood) {
      navigate(`/generate?mood=${selectedMood}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-light p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
            <FaMusic /> Moodify
          </Link>
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <HiArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">How are you feeling?</h1>
          <p className="text-xl text-gray-400">Select a mood to start generating your perfect playlist</p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {moods.map((moodOption) => (
            <button
              key={moodOption}
              onClick={() => setSelectedMood(moodOption)}
              className={`card text-center py-8 transition transform hover:scale-105 ${
                selectedMood === moodOption
                  ? 'bg-primary text-black'
                  : 'bg-dark-light hover:bg-gray-dark'
              }`}
            >
              <div className="text-5xl mb-3 flex justify-center">
                {moodIcons[moodOption] || <FaMusic />}
              </div>
              <div className="font-bold capitalize">{moodOption}</div>
            </button>
          ))}
        </div>

        {/* Selected Mood Display */}
        {selectedMood && (
          <div className="card bg-gradient-to-r from-primary to-blue-500 text-black text-center mb-8">
            <div className="text-6xl mb-3 flex justify-center">
              {moodIcons[selectedMood]}
            </div>
            <h2 className="text-2xl font-bold mb-2">You're feeling {selectedMood}!</h2>
            <p className="text-lg opacity-90">Let's create the perfect playlist for this mood</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleContinue}
            disabled={!selectedMood}
            className={`btn-primary flex items-center gap-2 ${!selectedMood && 'opacity-50 cursor-not-allowed'}`}
          >
            Continue to Customization <HiArrowRight />
          </button>
        </div>

        {/* Quick Generate */}
        {selectedMood && (
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-3">Or skip customization and generate instantly</p>
            <button
              onClick={() => navigate(`/generate?mood=${selectedMood}&quick=true`)}
              className="btn-secondary"
            >
              Quick Generate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
