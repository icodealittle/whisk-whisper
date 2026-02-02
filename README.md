# Whisk & Whisper - Quick Start Guide

- Version: v27+ (Natural Flow + Reactive Glow Edition)
- Tech Stack: HTML, CSS, JavaScript (Frontend) + Node.js/Express (Backend for OpenAI Voice)


## Project Structure

```
whisk-whisper/
├── css/
│   └── style.css              # UI styling (cards, buttons, glow effect)
├── data/
│   └── recipes.json           # Recipe library
├── js/
│   └── app.js                 # Core front-end logic + voice control
├── server/
│   ├── node_modules/
│   ├── index.js               # Node/Express server for OpenAI voice synthesis
│   ├── package.json
│   └── .env                   # API key for OpenAI
├── index.html                 # Main web app interface
├── README.md                  # (you’re reading this!)
└── test.mp3                   # Sample audio output (for local testing)
```

## Setup Instructions

**Git Clone and Install:** 

```bash
git clone https://github.com/your-username/whisk-whisper.git
cd whisk-whisper/server
npm install
```
---

**Create a .env File**

Inside the /server folder, add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-xxxxxx
PORT=3000
```

**Run the Backend**

```bash
cd server
node index.js
```

You should see:
```
Server running on http://localhost:3000
OpenAI voice endpoint ready: /api/speak
```

**Run the Frontend**

***Option 1***

Use Python’s Simple HTTP Server

```
cd ..
python3 -m http.server 5500
```

Then open <http://localhost:5500>

Your app should load at /index.html.

***Option 2***

Use Node’s built-in HTTP server (if you have Node but not Python)

```
npx http-server .
```
Then visit the URL it prints (usually <http://127.0.0.1:8080>).

***Option 3***

Use VS Code Live Server

```
Right-click on index.html → “Open with Live Server”
```

## Quick Test

1. **Should see**: Purple gradient background with recipe dropdown
2. **Select any recipe** → Ingredients appear on left
3. **Click "🎤 Voice Control"** → Grant microphone permission
4. **Say "start"** → Should read ingredients aloud
5. **Say "yes"** → Starts cooking instructions

## Voice Commands

| Command | Action |
|---------|--------|
| **"start"** or **"start cooking"** | Begin cooking session |
| **"yes"** | Confirm ingredients |
| **"next"** | Next step |
| **"previous"** | Previous step |
| **"repeat"** | Repeat current step |
| **"tip"** | Hear cooking tip |


## Browser Requirements

| Browser | Support |
|---------|---------|
| **Chrome** | Full support (recommended) |
| **Edge** | Full support |
| **Safari** | Limited voice features |
| **Firefox** | No voice support |


## Features

- **Voice Control** - Hands-free cooking
- **7 Recipes** - Pancakes, Pasta, Cookies, Tacos, Stir Fry, Smoothie Bowl, Scrambled Eggs
- **Text-to-Speech** - Reads instructions aloud
- **Cooking Tips** - Pro tips for every step
- **Progress Tracking** - Know where you are in the recipe


**Version:** 27  
**Updated:** 2025
