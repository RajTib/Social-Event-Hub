# AI-Powered Social Event Hub — DevJams '25

## 🚀 Team Members
- **Raj Tibarewala**
- **Vaidehi Goel**  
- **Ammar Abdullah**  
- **Harvee Jain**  

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
AI Powered Social Event Hub/<br>
├─ README.md<br>
├─ .gitignore<br>
├─ .env.example<br>
├─ backend/<br>
│ ├─ app.py<br>
│ └─ requirements.txt<br>
└─ frontend/<br>
├─ package.json<br>
├─ index.html<br>
└─ src/<br>
├─ main.jsx<br>
└─ App.jsx<br>


---

## ⚡ Quick Setup

### Backend
cd backend
<br>
python -m venv venv

### Activate venv
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

### Copy environment file (edit as needed)
cp ../.env.example .env  

### Run backend
set FLASK_APP=app.py
<br>
flask run


## Frontend
cd frontend
<br>
npm install
<br>
npm run dev

