# Moodify UI Components Guide

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
primary: #1DB954        /* Spotify Green */
primary-dark: #1ed760   /* Hover state */

/* Background Colors */
dark: #191414          /* Main background */
dark-light: #282828    /* Card background */
gray-dark: #404040     /* Hover background */

/* Text Colors */
white: #FFFFFF         /* Primary text */
gray-400: #9CA3AF     /* Secondary text */
```

### Typography

```css
/* Headers */
text-6xl: 3.75rem (60px)  /* Hero titles */
text-4xl: 2.25rem (36px)  /* Page titles */
text-2xl: 1.5rem (24px)   /* Section headers */
text-xl: 1.25rem (20px)   /* Subsections */

/* Body */
text-base: 1rem (16px)    /* Regular text */
text-sm: 0.875rem (14px)  /* Small text */
text-xs: 0.75rem (12px)   /* Tiny text */
```

---

## 🧩 Reusable Components

### Button Styles

#### Primary Button
```jsx
<button className="btn-primary">
  Get Started
</button>
```
**Usage**: Main CTAs, important actions
**Appearance**: Spotify green, rounded-full, hover scale effect

#### Secondary Button
```jsx
<button className="btn-secondary">
  Back to Dashboard
</button>
```
**Usage**: Navigation, less important actions
**Appearance**: Dark gray, rounded-full

### Card Component
```jsx
<div className="card">
  <h3 className="text-xl font-bold mb-3">Card Title</h3>
  <p className="text-gray-400">Card content goes here</p>
</div>
```
**Appearance**: Dark-light background, rounded corners, padding, shadow

### Input Field
```jsx
<input 
  type="text" 
  className="input" 
  placeholder="Enter text..."
/>
```
**Appearance**: Gray background, rounded, focus ring

### Mood Badge
```jsx
{/* Selected */}
<span className="mood-badge mood-badge-selected">
  Happy
</span>

{/* Unselected */}
<span className="mood-badge mood-badge-unselected">
  Sad
</span>
```

---

## 📄 Page Components

### 1. Home Page (`pages/Home.jsx`)

**Structure:**
```
┌─────────────────────────────────┐
│  Navigation Bar                 │
│  [Logo]              [Login]    │
├─────────────────────────────────┤
│                                 │
│     Hero Section                │
│   "Your Mood, Your Music"       │
│   [CTA Button]                  │
│                                 │
├─────────────────────────────────┤
│  Features Section               │
│  [Icon] [Icon] [Icon]           │
├─────────────────────────────────┤
│  Feature Details                │
│  • Mood-based                   │
│  • Sentiment Analysis           │
│  • Hobby Mapping                │
├─────────────────────────────────┤
│  Footer                         │
└─────────────────────────────────┘
```

**Key Elements:**
- Gradient text for hero title
- Three-column feature grid
- Hover effects on cards

---

### 2. Dashboard (`pages/Dashboard.jsx`)

**Structure:**
```
┌─────────────────────────────────┐
│  Header                         │
│  [Logo]  User   [Library] [Out] │
├─────────────────────────────────┤
│  Action Card (Primary)          │
│  "Ready to create magic?"       │
│  [Create Playlist]              │
├─────────────────────────────────┤
│  Quick Actions (3 cards)        │
│  [Mood]  [Advanced]  [Library]  │
├─────────────────────────────────┤
│  Recent Playlists               │
│  [Playlist] [Playlist] ...      │
├─────────────────────────────────┤
│  Tips Card                      │
└─────────────────────────────────┘
```

**States:**
- **No playlists**: Show empty state with CTA
- **With playlists**: Display grid of 3-6 recent items

---

### 3. Mood Selector (`pages/MoodSelector.jsx`)

**Structure:**
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Title: "How are you feeling?"  │
├─────────────────────────────────┤
│  Mood Grid (2x5)                │
│  [😊] [😢] [⚡] [😌] [🎯]      │
│  [😠] [💕] [💪] [🧘] [😰]      │
├─────────────────────────────────┤
│  Selected Mood Display          │
│  (when mood selected)           │
├─────────────────────────────────┤
│  [Continue] [Quick Generate]    │
└─────────────────────────────────┘
```

**Interactions:**
- Click mood → highlight with green
- Show confirmation card below
- Enable continue button

---

### 4. Playlist Generator (`pages/PlaylistGenerator.jsx`)

**Structure:**
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Title: "Customize Playlist"    │
├─────────────────────────────────┤
│  Form Sections:                 │
│                                 │
│  [1] Mood Input                 │
│  [2] Genre Selection            │
│  [3] Social Review Textarea     │
│  [4] Hobby Checkboxes           │
│  [5] Listening Time Dropdown    │
│  [6] Tempo Preference           │
│  [7] Use Top Artists Toggle     │
│                                 │
├─────────────────────────────────┤
│  [Generate Playlist Button]     │
└─────────────────────────────────┘
```

**Form Fields:**
- Text input for mood
- Tag-based genre selector
- Large textarea for sentiment
- Grid of checkboxes for hobbies
- Dropdowns for time/tempo
- Toggle switch for top artists

---

### 5. Playlist Preview (`pages/PlaylistPreview.jsx`)

**Structure:**
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Title: "Preview Your Playlist" │
├─────────────────────────────────┤
│  Playlist Info Card             │
│  [Name Input]                   │
│  Description                    │
├─────────────────────────────────┤
│  AI Analysis Stats (4 cards)    │
│  [Energy] [Positivity] [Dance]  │
├─────────────────────────────────┤
│  Genre Tags                     │
│  [pop] [dance] [electronic]     │
├─────────────────────────────────┤
│  Track List (scrollable)        │
│  1. Song Name - Artist          │
│  2. Song Name - Artist          │
│  ...                            │
├─────────────────────────────────┤
│  [← Regenerate] [Create ✨]     │
└─────────────────────────────────┘
```

**States:**
- **Preview**: Show tracks and stats
- **Creating**: Button shows "Creating..."
- **Success**: Show success screen with Spotify link

---

### 6. Library (`pages/Library.jsx`)

**Structure:**
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Title + [Create New]           │
├─────────────────────────────────┤
│  Filter Tags                    │
│  [All] [Happy] [Sad] [Chill]    │
├─────────────────────────────────┤
│  Playlist Grid (4 columns)      │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ 🎵  │ │ 🎵  │ │ 🎵  │       │
│  │Title│ │Title│ │Title│       │
│  └─────┘ └─────┘ └─────┘       │
├─────────────────────────────────┤
│  Stats Section (3 cards)        │
│  [Total] [Tracks] [Moods]       │
└─────────────────────────────────┘
```

**States:**
- **Empty**: Show empty state with CTA
- **Filtered**: Show filtered results
- **Hover**: Reveal Spotify open button

---

## 🎭 Mood Emoji Mapping

```javascript
const moodEmojis = {
  happy: '😊',
  sad: '😢',
  energetic: '⚡',
  chill: '😌',
  focused: '🎯',
  angry: '😠',
  romantic: '💕',
  motivated: '💪',
  relaxed: '🧘',
  anxious: '😰'
};
```

---

## 🎨 Animation & Transitions

### Hover Effects

```css
/* Button hover */
.btn-primary:hover {
  scale: 1.05;
  transition: transform 200ms;
}

/* Card hover */
.card:hover {
  background-color: #404040;
  transition: background-color 200ms;
}
```

### Loading States

```jsx
{loading ? (
  <div className="text-center py-8 text-gray-400">
    Loading...
  </div>
) : (
  // Content
)}
```

### Disabled States

```jsx
<button
  disabled={!selectedMood}
  className={`btn-primary ${!selectedMood && 'opacity-50 cursor-not-allowed'}`}
>
  Continue
</button>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
```

### Grid Layouts

```jsx
{/* Mobile: 2 cols, Desktop: 4 cols */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

{/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🧭 Navigation Flow

```
Home
 ├─→ Login → Spotify OAuth → Dashboard
 │
Dashboard
 ├─→ Mood Selector → Generator → Preview → Success
 ├─→ Advanced Generator → Preview → Success
 └─→ Library → View Playlists
      └─→ Open in Spotify (external)
```

---

## 💫 Interactive Elements

### Track List Item

```jsx
<div className="flex items-center gap-4 p-3 bg-dark rounded-lg hover:bg-gray-dark transition">
  <div className="text-gray-400 w-8">1</div>
  <img src={albumArt} className="w-12 h-12 rounded" />
  <div className="flex-1 min-w-0">
    <div className="font-semibold truncate">Song Name</div>
    <div className="text-sm text-gray-400 truncate">Artist Name</div>
  </div>
  <div className="text-sm text-gray-400">3:45</div>
</div>
```

### Playlist Card

```jsx
<div className="card hover:bg-gray-dark transition cursor-pointer group">
  <div className="mb-4 relative">
    <img src={cover} className="w-full h-48 object-cover rounded-lg" />
    {/* Spotify icon appears on hover */}
    <a className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
      🎵
    </a>
  </div>
  <h3 className="font-bold text-lg">{name}</h3>
  <p className="text-gray-400">{trackCount} tracks</p>
</div>
```

---

## 🎯 Component Props Pattern

### Example: PlaylistCard Component

```jsx
function PlaylistCard({ 
  id, 
  name, 
  coverImage, 
  trackCount, 
  mood, 
  spotifyUrl,
  onClick 
}) {
  return (
    <div className="card" onClick={onClick}>
      {coverImage ? (
        <img src={coverImage} alt={name} />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary to-blue-500">
          🎵
        </div>
      )}
      <h3>{name}</h3>
      <p>{trackCount} tracks</p>
      {mood && <span className="mood-badge">{mood}</span>}
    </div>
  );
}
```

---

## 🔔 User Feedback

### Success Message

```jsx
<div className="text-center">
  <div className="text-8xl mb-6">🎉</div>
  <h1 className="text-4xl font-bold mb-4">Playlist Created!</h1>
  <p className="text-xl text-gray-400">
    Your playlist is now in your Spotify account
  </p>
</div>
```

### Error Message

```jsx
<div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg">
  {errorMessage}
</div>
```

### Empty State

```jsx
<div className="card text-center py-16">
  <div className="text-6xl mb-4">🎵</div>
  <h2 className="text-2xl font-bold mb-4">No playlists yet</h2>
  <p className="text-gray-400 mb-6">Start creating amazing playlists</p>
  <button className="btn-primary">Create Your First Playlist</button>
</div>
```

---

## 📐 Layout Containers

### Max-Width Container

```jsx
<div className="max-w-7xl mx-auto p-6">
  {/* Content */}
</div>
```

**Sizes:**
- `max-w-4xl`: Forms, focused content
- `max-w-6xl`: Dashboard sections
- `max-w-7xl`: Full-width layouts

### Centered Content

```jsx
<div className="min-h-screen flex items-center justify-center">
  {/* Vertically and horizontally centered */}
</div>
```

---

## 🎬 Page Transitions

Currently using React Router without transitions. To add:

```jsx
// Install framer-motion
npm install framer-motion

// Wrap page content
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {/* Page content */}
</motion.div>
```

---

Made with ❤️ for developers building Moodify
