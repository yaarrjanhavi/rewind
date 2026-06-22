# 📼 REWIND OS v1.0.0
> **An AI-Powered Interactive Historical Music Time Machine.**

Explore the sounds, headlines, tech, and lifestyles of human history from **1900 to present day**, wrapped in a nostalgic 1990s desktop operating system environment. 

---

## 📺 Project Vision & Experience

**Rewind** is not a standard SaaS dashboard. It is a full-stack, production-ready interactive simulation of a retro computer terminal that somehow has access to the entire history of music and culture. 

Every major section resides in a draggable, stackable retro window featuring:
* Double-pixel embossed shadows.
* Classic Windows 95 control bars.
* Moving scanlines, vignette curves, and adjustable CRT monitors.
* Tactile micro-interactions (spinning records, rotating cassette tapes, cursor sparkler trails).

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS (v4), Framer Motion
* **Backend:** Next.js API Routes
* **AI Core:** Google Gemini API (`gemini-2.5-flash` model via `@google/genai`)
* **Open Datasets:** MusicBrainz API, Wikipedia REST API, Cover Art Archive

---

## 🚀 Core Features

### 1. 🕰️ Time Machine Search Console
Enter any year between 1900 and today to initiate a time travel warp. The retro cassette reels spin at high speed while loading, before generating a complete cultural profile of the target era.

### 2. 📰 Historical Headlines Window
Browse world news, political movements, scientific breakthroughs, and pop culture milestones from the year, complete with record numbers and categories.

### 3. 💿 Audio Archive & Cover Art
Displays top artists of the decade, musical movements, and notable releases of the year. The system dynamically queries MusicBrainz to fetch real metadata and grabs front cover artwork from the Cover Art Archive.

### 4. 🧠 AI Immersive Narrative
Generates an evocative, cinematic paragraph summarizing the "vibe" and feeling of the year:
> *"1977 was loud, rebellious, and transformative. Punk rock exploded across urban landscapes while Star Wars redefined cinema and personal computers slowly entered homes."*

### 5. 🎴 Time Capsule Cards
Collectible playing cards mapping average salary, popular jobs, fashion trends, consumer tech, music habits, and typical lifestyle pastimes of the year.

### 6. 🗺️ Connection Matrix Graph
An interactive node network connecting the year, primary genres, popular musicians, and historical occurrences. Hovering over nodes highlights relations and traces paths.

### 7. 📊 Genre Evolution Analytics
A Neon SVG Area Chart mapping popularity weights of major genres (Rock, Jazz, Pop, Hip-Hop, Disco, Electronic) across decades. Includes checkboxes to filter genres and interactive decadal detail tooltips.

### 8. ⚖️ Era Compare Engine
Compare two eras (e.g., 1980 vs. 2000) side-by-side. Renders double windows comparing music, atmosphere, and lifestyle changes, complete with an AI comparative report.

---

## 🎮 Easter Eggs to Find
* Enter **`1989`**: Triggers a cassette explosion sending cascading musical notes floating across your screen.
* Enter **`1969`**: Activates a shifting psychedelic visual filter across the entire desktop.
* Enter **`2000`**: Prompts a Y2K Millennium Date registers overflow alert popup!

---

## ⚙️ Installation & Local Setup

### Prerequisites
* **Node.js** (v18.x or v20.x+ recommended)
* **NPM**

### Step-by-step Setup
1. **Clone/Navigate to the repository:**
   ```bash
   cd rewind
   ```
2. **Configure API Keys (Optional):**
   To leverage live Gemini content generations, create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is specified, Rewind automatically loads in offline mode, utilizing pre-compiled datasets for milestone years and a robust procedural generator fallback!*
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Boot up the developer environment:**
   ```bash
   npm run dev
   ```
5. **Open local endpoint:**
   Go to [http://localhost:3000](http://localhost:3000) to begin time travel.

---

## 📦 Vercel Production Deployment

Rewind is optimized for instant deployment on Vercel:

1. Push your local codebase to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and import the repository.
3. Add `GEMINI_API_KEY` to the **Environment Variables** panel.
4. Click **Deploy**.
