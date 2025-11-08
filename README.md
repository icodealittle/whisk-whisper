# 🍳 Whisk & Whisper - Quick Start Guide

> Your hands-free voice-controlled cooking assistant

---

## 📥 Download & Setup

### Step 1: Download the Files

Create a folder called `whisk-whisper` and add these files:

```
whisk-whisper/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── data/
    └── recipes.json
```

**Download each file:**
1. Copy `index.html` from the artifacts
2. Create a `css` folder → Copy `style.css` inside
3. Create a `js` folder → Copy `app.js` inside  
4. Create a `data` folder → Copy `recipes.json` inside

**Git Clone:** 

```bash
git clone https://github.com/icodealittle/whisk-whisper.git
```

```bash
cd whisk-whisper
```

---

## 🚀 Run the App

### Option 1: VS Code Live Server (No Installation Needed!)

1. Download and install [VS Code](https://code.visualstudio.com/) (free)
2. Open `whisk-whisper` folder in VS Code
3. Install "Live Server" extension (click Extensions icon → search "Live Server")
4. Right-click `index.html` → **"Open with Live Server"**
5. Opens automatically in your browser! ✨

---

### Option 2: Python Server (If you have Python)

**Check if Python is installed:**
```bash
python3 --version
```

If you see a version number, run:
```bash
python3 -m http.server 8080
```

Then open Chrome: **http://localhost:8080**

**Don't have Python?** Download from [python.org](https://www.python.org/downloads/)

---

### Option 3: Node.js (If you have Node installed)

```bash
npx serve
```

Then open: **http://localhost:3000**

---

## ✅ Quick Test

1. **Should see**: Purple gradient background with recipe dropdown
2. **Select any recipe** → Ingredients appear on left
3. **Click "🎤 Voice Control"** → Grant microphone permission
4. **Say "start"** → Should read ingredients aloud
5. **Say "yes"** → Starts cooking instructions

---

## 🎤 Voice Commands

| Command | Action |
|---------|--------|
| **"start"** or **"start cooking"** | Begin cooking session |
| **"yes"** | Confirm ingredients |
| **"next"** | Next step |
| **"previous"** | Previous step |
| **"repeat"** | Repeat current step |
| **"tip"** | Hear cooking tip |

---

## 🌐 Browser Requirements

| Browser | Support |
|---------|---------|
| ✅ **Chrome** | Full support (recommended) |
| ✅ **Edge** | Full support |
| ⚠️ **Safari** | Limited voice features |
| ❌ **Firefox** | No voice support |

---

## 📱 Features

- 🎙️ **Voice Control** - Hands-free cooking
- 📖 **7 Recipes** - Pancakes, Pasta, Cookies, Tacos, Stir Fry, Smoothie Bowl, Scrambled Eggs
- 🔊 **Text-to-Speech** - Reads instructions aloud
- 💡 **Cooking Tips** - Pro tips for every step
- ✅ **Progress Tracking** - Know where you are in the recipe

---
**Version:** 23  
**Updated:** 2025
