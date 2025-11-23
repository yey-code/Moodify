// Mood to music attributes mapping
const MOOD_ATTRIBUTES = {
  happy: {
    energy: 0.75,
    valence: 0.85,
    danceability: 0.7,
    tempo: { min: 120, max: 140 },
    genres: ['pop', 'dance', 'disco', 'funk']
  },
  sad: {
    energy: 0.3,
    valence: 0.2,
    danceability: 0.3,
    tempo: { min: 60, max: 90 },
    genres: ['acoustic', 'indie', 'piano', 'singer-songwriter']
  },
  energetic: {
    energy: 0.9,
    valence: 0.7,
    danceability: 0.85,
    tempo: { min: 140, max: 180 },
    genres: ['electronic', 'edm', 'house', 'techno']
  },
  chill: {
    energy: 0.4,
    valence: 0.6,
    danceability: 0.4,
    tempo: { min: 80, max: 110 },
    genres: ['chill', 'ambient', 'lo-fi', 'downtempo']
  },
  focused: {
    energy: 0.5,
    valence: 0.5,
    danceability: 0.3,
    tempo: { min: 90, max: 120 },
    genres: ['instrumental', 'classical', 'study', 'ambient']
  },
  angry: {
    energy: 0.95,
    valence: 0.3,
    danceability: 0.5,
    tempo: { min: 130, max: 180 },
    genres: ['metal', 'rock', 'hardcore', 'punk']
  },
  romantic: {
    energy: 0.4,
    valence: 0.75,
    danceability: 0.5,
    tempo: { min: 70, max: 100 },
    genres: ['soul', 'r-n-b', 'jazz', 'acoustic']
  },
  motivated: {
    energy: 0.85,
    valence: 0.8,
    danceability: 0.7,
    tempo: { min: 130, max: 160 },
    genres: ['rock', 'hip-hop', 'pop', 'electronic']
  },
  relaxed: {
    energy: 0.35,
    valence: 0.65,
    danceability: 0.35,
    tempo: { min: 70, max: 100 },
    genres: ['jazz', 'bossa-nova', 'acoustic', 'soft-rock']
  },
  anxious: {
    energy: 0.6,
    valence: 0.35,
    danceability: 0.4,
    tempo: { min: 100, max: 130 },
    genres: ['ambient', 'minimal', 'indie', 'alternative']
  }
};

// Hobby to genre mapping
const HOBBY_GENRES = {
  gym: ['workout', 'electronic', 'hip-hop', 'edm', 'power-pop'],
  gaming: ['electronic', 'edm', 'dubstep', 'drum-and-bass', 'synthwave'],
  studying: ['classical', 'instrumental', 'lo-fi', 'ambient', 'study'],
  yoga: ['ambient', 'chill', 'world-music', 'meditation', 'new-age'],
  running: ['electronic', 'edm', 'hip-hop', 'rock', 'dance'],
  cooking: ['indie', 'pop', 'jazz', 'world-music', 'soul'],
  reading: ['classical', 'jazz', 'ambient', 'acoustic', 'instrumental'],
  party: ['dance', 'pop', 'edm', 'latin', 'disco'],
  traveling: ['world-music', 'indie', 'alternative', 'folk', 'reggae'],
  working: ['lo-fi', 'electronic', 'instrumental', 'jazz', 'classical'],
  cleaning: ['pop', 'dance', 'indie', 'rock', 'funk'],
  driving: ['rock', 'indie', 'pop', 'hip-hop', 'alternative']
};

// Sentiment scores to music attributes
function sentimentToAttributes(sentiment) {
  // sentiment: positive (0.6-1.0), neutral (0.4-0.6), negative (0.0-0.4)
  return {
    valence: sentiment,
    energy: sentiment > 0.6 ? 0.7 : (sentiment < 0.4 ? 0.4 : 0.55),
    danceability: sentiment > 0.6 ? 0.7 : 0.5
  };
}

// Simple sentiment analysis (basic implementation)
// For production, use HuggingFace API or better ML model
function analyzeSentimentLocal(text) {
  const positiveWords = ['happy', 'love', 'great', 'awesome', 'excellent', 'good', 'best', 'wonderful', 'fantastic', 'amazing', 'joy', 'excited', 'glad'];
  const negativeWords = ['sad', 'hate', 'bad', 'worst', 'terrible', 'awful', 'horrible', 'angry', 'upset', 'depressed', 'hurt', 'pain'];
  
  const lowerText = text.toLowerCase();
  let score = 0.5; // neutral
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 0.05;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 0.05;
  });
  
  return Math.max(0, Math.min(1, score));
}

// HuggingFace API sentiment analysis (free tier)
async function analyzeSentimentHuggingFace(text) {
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  if (!HUGGINGFACE_API_KEY) {
    console.log('⚠️  No HuggingFace API key, using local sentiment analysis');
    return analyzeSentimentLocal(text);
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: text })
      }
    );

    const result = await response.json();
    
    if (result && result[0]) {
      // Convert to 0-1 scale
      const labels = result[0];
      const positive = labels.find(l => l.label === 'positive')?.score || 0;
      const negative = labels.find(l => l.label === 'negative')?.score || 0;
      const neutral = labels.find(l => l.label === 'neutral')?.score || 0;
      
      // Weighted score
      return (positive * 1.0 + neutral * 0.5 + negative * 0.0);
    }
  } catch (error) {
    console.error('HuggingFace API error:', error.message);
  }
  
  return analyzeSentimentLocal(text);
}

// Main AI analysis function
export async function analyzeUserInputs(inputs) {
  const { mood, genres, artists, socialReview, hobbies, listeningTime, tempoPreference } = inputs;
  
  // 1. Get base attributes from mood
  const moodAttributes = MOOD_ATTRIBUTES[mood?.toLowerCase()] || MOOD_ATTRIBUTES.happy;
  
  // 2. Analyze sentiment if provided
  let sentimentScore = 0.5;
  if (socialReview && socialReview.trim().length > 0) {
    sentimentScore = await analyzeSentimentHuggingFace(socialReview);
  }
  const sentimentAttributes = sentimentToAttributes(sentimentScore);
  
  // 3. Collect genres from hobbies
  let hobbyGenres = [];
  if (hobbies && Array.isArray(hobbies)) {
    hobbies.forEach(hobby => {
      const hobbyKey = hobby.toLowerCase();
      if (HOBBY_GENRES[hobbyKey]) {
        hobbyGenres.push(...HOBBY_GENRES[hobbyKey]);
      }
    });
  }
  
  // 4. Merge all genres
  const allGenres = [
    ...moodAttributes.genres,
    ...(genres || []),
    ...hobbyGenres
  ];
  const uniqueGenres = [...new Set(allGenres)].slice(0, 5);
  
  // 5. Blend attributes (weighted average)
  const finalAttributes = {
    energy: (moodAttributes.energy * 0.6 + sentimentAttributes.energy * 0.4),
    valence: (moodAttributes.valence * 0.5 + sentimentAttributes.valence * 0.5),
    danceability: (moodAttributes.danceability * 0.6 + sentimentAttributes.danceability * 0.4),
    tempo: moodAttributes.tempo
  };
  
  // 6. Adjust based on tempo preference
  if (tempoPreference === 'slow') {
    finalAttributes.tempo = { min: 60, max: 100 };
  } else if (tempoPreference === 'fast') {
    finalAttributes.tempo = { min: 130, max: 180 };
  }
  
  // 7. Time-based adjustments
  if (listeningTime === 'morning') {
    finalAttributes.energy = Math.min(1.0, finalAttributes.energy + 0.1);
  } else if (listeningTime === 'night') {
    finalAttributes.energy = Math.max(0.0, finalAttributes.energy - 0.2);
    finalAttributes.valence = Math.max(0.0, finalAttributes.valence - 0.1);
  }
  
  return {
    attributes: finalAttributes,
    genres: uniqueGenres,
    artists: artists || [],
    sentimentScore,
    mood,
    description: generatePlaylistDescription(mood, sentimentScore, hobbies)
  };
}

function generatePlaylistDescription(mood, sentimentScore, hobbies) {
  const sentimentText = sentimentScore > 0.6 ? 'uplifting' : (sentimentScore < 0.4 ? 'reflective' : 'balanced');
  const hobbyText = hobbies && hobbies.length > 0 ? ` Perfect for ${hobbies.join(', ')}.` : '';
  
  return `AI-generated ${mood} playlist with ${sentimentText} vibes.${hobbyText} Created by Moodify 🎵`;
}

// Export mood and hobby mappings for frontend
export const MOODS = Object.keys(MOOD_ATTRIBUTES);
export const HOBBIES = Object.keys(HOBBY_GENRES);
