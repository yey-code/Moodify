import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MoodSelector from './pages/MoodSelector';
import PlaylistGenerator from './pages/PlaylistGenerator';
import PlaylistPreview from './pages/PlaylistPreview';
import Library from './pages/Library';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood" element={<MoodSelector />} />
            <Route path="/generate" element={<PlaylistGenerator />} />
            <Route path="/preview" element={<PlaylistPreview />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
