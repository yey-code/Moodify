import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { FaMusic, FaTheaterMasks, FaRobot, FaSpotify, FaHeart, FaBullseye } from 'react-icons/fa';
import { HiSparkles, HiChatBubbleLeftRight, HiChartBar, HiPaintBrush, HiBolt } from 'react-icons/hi2';

export default function Home() {
  const { user, login } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <FaMusic className="text-primary" />
          Moodify
        </div>
        {error && (
          <div className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded">
            Authentication failed. Please try again.
          </div>
        )}
        {user ? (
          <Link to="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        ) : (
          <button onClick={login} className="btn-secondary">
            Login
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Animated Sound Waves Background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="sound-wave-container">
            <div className="sound-bar" style={{ animationDelay: '0s', left: '10%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.1s', left: '15%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.2s', left: '20%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.15s', left: '25%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.3s', left: '30%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.05s', left: '35%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.25s', left: '40%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.4s', left: '45%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.2s', left: '50%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.35s', left: '55%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.1s', left: '60%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.3s', left: '65%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.45s', left: '70%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.15s', left: '75%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.25s', left: '80%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.05s', left: '85%' }}></div>
            <div className="sound-bar" style={{ animationDelay: '0.4s', left: '90%' }}></div>
          </div>
        </div>

        <div className="max-w-4xl text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent leading-tight">
            Your Mood, Your Music
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
            AI-powered playlist generation based on your emotions, preferences, and lifestyle
          </p>
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Moodify analyzes your mood, listening habits, social sentiment, and hobbies to create perfectly tailored Spotify playlists just for you.
          </p>
          
          <div className="flex gap-4 justify-center items-center mt-8">
            {user ? (
              <Link to="/mood" className="btn-primary text-lg px-10 py-4 flex items-center gap-3 shadow-xl hover:shadow-2xl">
                <FaSpotify className="text-xl" />
                Start Creating Playlists
              </Link>
            ) : (
              <button onClick={login} className="btn-primary text-lg px-10 py-4 flex items-center gap-3 shadow-xl hover:shadow-2xl">
                <FaSpotify className="text-xl" />
                Get Started with Spotify
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6 bg-dark-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4 text-primary flex justify-center">
                <FaTheaterMasks />
              </div>
              <h3 className="text-xl font-bold mb-3">Select Your Mood</h3>
              <p className="text-gray-400">
                Choose from happy, sad, energetic, chill, focused, and more
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4 text-primary flex justify-center">
                <FaRobot />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
              <p className="text-gray-400">
                Our AI analyzes your inputs, sentiment, and preferences
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4 text-primary flex justify-center">
                <FaSpotify />
              </div>
              <h3 className="text-xl font-bold mb-3">Perfect Playlist</h3>
              <p className="text-gray-400">
                Get a personalized playlist created in your Spotify account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-2xl text-primary">
                <HiSparkles />
              </div>
              <div>
                <h4 className="font-bold mb-2">Mood-Based Generation</h4>
                <p className="text-gray-400">Select from 10+ mood options for perfect musical matches</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-primary">
                <HiChatBubbleLeftRight />
              </div>
              <div>
                <h4 className="font-bold mb-2">Sentiment Analysis</h4>
                <p className="text-gray-400">AI analyzes text from your reviews or social posts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-primary">
                <FaBullseye />
              </div>
              <div>
                <h4 className="font-bold mb-2">Hobby Mapping</h4>
                <p className="text-gray-400">Match music to your activities: gym, studying, gaming, etc.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-primary">
                <HiChartBar />
              </div>
              <div>
                <h4 className="font-bold mb-2">Learning Algorithm</h4>
                <p className="text-gray-400">Improves recommendations based on your listening history</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-primary">
                <HiPaintBrush />
              </div>
              <div>
                <h4 className="font-bold mb-2">Preference Customization</h4>
                <p className="text-gray-400">Save favorite genres, artists, and tempo preferences</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl text-primary">
                <HiBolt />
              </div>
              <div>
                <h4 className="font-bold mb-2">Instant Creation</h4>
                <p className="text-gray-400">Playlists appear directly in your Spotify account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 bg-dark-light text-center text-gray-500">
        <p className="flex items-center justify-center gap-2">
          Made with <FaHeart className="text-red-500" /> for music lovers • Powered by Spotify & AI
        </p>
      </footer>
    </div>
  );
}
