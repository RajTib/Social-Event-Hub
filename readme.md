# AI-Powered Social Event Hub — DevJams '25

## 🚀 Team Members
- **Raj Tibarewala** – Backend & AI Integration  
- **Vaidehi Goel** – Frontend + UI/UX  
- **Ammar Abdullah** – Database & API Integration  
- **Harvee** – Demo Flow & Testing  

---

## 🎯 Problem Statement
Many people, especially introverts or newcomers in cities, struggle to find events that match their comfort level.  
Current platforms:
- Focus mostly on mainstream/popular events.
- Lack emotional understanding — they don’t adapt to the user’s mood or anxiety level.
- Provide limited interactivity before events, leaving people hesitant to join.

**Result:** Reduced social participation, missed networking, weaker community bonding.

---

## 💡 Solution (MVP)
We’re building an **AI-powered event hub** that:
- Recommends events based on **user mood & interests**.  
- Shows events on **interactive maps**.  
- Lets users click **“I’m Interested”** to RSVP quickly.  
- Generates **AI-driven icebreakers** to ease social interaction.  

> The hackathon MVP focuses on the full loop: Mood → Event Recommendations → Map → Interested Button → Icebreaker.

---

## 🏗 Tech Stack
- **Frontend:** React + Vite (Tailwind optional)  
- **Backend:** Flask (Python) + Flask-CORS  
- **Database:** SQLite (easy for hackathon, switchable to Postgres)  
- **AI/NLP:** OpenAI GPT-3.5 / Hugging Face (for sentiment & icebreakers)  
- **Mapping:** Folium (event heatmaps)  
- **Deployment (optional):** Render/Heroku (backend) + Vercel/Netlify (frontend)

---

## 📂 Repo Structure
AI Powered Social Event Hub/
├─ README.md
├─ .gitignore
├─ .env.example
├─ backend/
│ ├─ app.py
│ └─ requirements.txt
└─ frontend/
├─ package.json
├─ index.html
└─ src/
├─ main.jsx
└─ App.jsx


---

## ⚡ Quick Setup

### Backend
cd backend
python -m venv venv

# activate venv
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# copy environment file (edit as needed)
cp ../.env.example .env  

# run backend
set FLASK_APP=app.py      # Windows CMD

flask run


### Frontend
cd frontend
npm install
npm run dev

