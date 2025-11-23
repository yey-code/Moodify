import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../moodify.db');

let db;

async function initDB() {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

// Helper to save database to file
export function saveDatabase() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, data);
  }
}

// Wrapper for exec
export function execSQL(sql) {
  db.exec(sql);
  saveDatabase();
}

// Wrapper for prepare + get (single row)
export function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return result;
}

// Wrapper for prepare + all (multiple rows)
export function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Wrapper for insert/update/delete
export function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDatabase();
  
  // Get the last inserted row ID - sql.js specific approach
  let lastId = null;
  if (sql.trim().toUpperCase().startsWith('INSERT')) {
    const result = db.exec('SELECT last_insert_rowid() as id');
    if (result.length > 0 && result[0].values.length > 0) {
      lastId = result[0].values[0][0];
    }
  }
  
  return { lastInsertRowid: lastId };
}

export async function initializeDatabase() {
  await initDB();
  
  // Users table
  execSQL(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spotify_id TEXT UNIQUE NOT NULL,
      display_name TEXT,
      email TEXT,
      profile_image TEXT,
      access_token TEXT,
      refresh_token TEXT,
      token_expires_at INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Preferences table
  db.exec(`
    CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      favorite_genres TEXT, -- JSON array
      favorite_artists TEXT, -- JSON array
      favorite_tracks TEXT, -- JSON array
      mood_history TEXT, -- JSON array
      hobby_tags TEXT, -- JSON array
      listening_time_preference TEXT, -- morning, afternoon, evening, night
      tempo_preference TEXT, -- slow, medium, fast
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Playlists table
  db.exec(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      spotify_playlist_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      mood TEXT,
      energy REAL,
      valence REAL,
      danceability REAL,
      tempo INTEGER,
      track_count INTEGER DEFAULT 0,
      cover_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Listening history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS listening_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      track_id TEXT NOT NULL,
      track_name TEXT,
      artist_name TEXT,
      mood_context TEXT,
      hobby_context TEXT,
      listened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Generated recommendations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      playlist_id INTEGER,
      input_data TEXT, -- JSON of all inputs
      ai_analysis TEXT, -- JSON of AI output
      spotify_params TEXT, -- JSON of Spotify API params
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
    )
  `);

  console.log('✅ Database initialized successfully');
}

export { db };
