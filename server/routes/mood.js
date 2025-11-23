import express from 'express';
import { analyzeUserInputs, MOODS, HOBBIES } from '../services/aiService.js';
import { UserModel } from '../models/models.js';

const router = express.Router();

// Middleware to check authentication
function requireAuth(req, res, next) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
}

// Analyze mood and generate playlist parameters
router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const {
      mood,
      genres,
      artists,
      socialReview,
      hobbies,
      listeningTime,
      tempoPreference
    } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Perform AI analysis
    const analysis = await analyzeUserInputs({
      mood,
      genres,
      artists,
      socialReview,
      hobbies,
      listeningTime,
      tempoPreference
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple sentiment analysis endpoint
router.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Import the sentiment function
    const { analyzeSentimentLocal } = await import('../services/aiService.js');
    const sentimentScore = analyzeSentimentLocal(text);

    let sentiment;
    if (sentimentScore > 0.6) sentiment = 'positive';
    else if (sentimentScore < 0.4) sentiment = 'negative';
    else sentiment = 'neutral';

    res.json({
      sentiment,
      score: sentimentScore,
      text: text.substring(0, 100)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available moods
router.get('/moods', (req, res) => {
  res.json({ moods: MOODS });
});

// Get available hobbies
router.get('/hobbies', (req, res) => {
  res.json({ hobbies: HOBBIES });
});

export default router;
