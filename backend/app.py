# backend/app.py
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import openai
import folium
from dotenv import load_dotenv
from serpapi import GoogleSearch

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# -------------------------
# DATABASE CONFIG
# -------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# =========================
# DATABASE MODELS
# =========================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True)
    city = db.Column(db.String(100))
    interests = db.Column(db.ARRAY(db.String))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    location = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    location_name = db.Column(db.String(200))
    event_time = db.Column(db.String(100))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    category = db.Column(db.String(100))
    popularity = db.Column(db.Integer, default=0)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))

class Interested(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Icebreaker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))

class UserEventLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    action = db.Column(db.String(50))  # "viewed", "clicked_interested"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# =========================
# MOOD -> CATEGORY MAP
# =========================
MOOD_MAP = {
    "calm": ["art", "meetup", "date"],
    "energetic": ["music", "workshop"],
    "social": ["meetup", "workshop", "comedy", "date"]
}

# =========================
# ROUTES
# =========================
@app.route("/")
def home():
    return "<h1>Backend Running!</h1>"

# ---------- EVENTS ----------
@app.route("/api/events")
def get_events():
    mood = (request.args.get('mood') or "").lower()

    if mood and mood in MOOD_MAP:
        cats = [c.lower() for c in MOOD_MAP[mood]]
        events = Event.query.filter(db.func.lower(Event.category).in_(cats)).all()
    else:
        events = Event.query.all()

    out = []
    for e in events:
        out.append({
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "location_name": e.location_name,
            "event_time": e.event_time,
            "lat": e.lat,
            "lon": e.lon,
            "category": e.category,
            "popularity": e.popularity
        })
    return jsonify(out)

# ---------- USER ----------
@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.json or {}
    if not data.get("name") or not data.get("email"):
        return jsonify({"error":"Name and Email required"}), 400
    user = User(
        name=data["name"],
        email=data["email"],
        city=data.get("city"),
        interests=data.get("interests", [])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"ok": True, "user_id": user.id})

# ---------- ICEBREAKERS ----------
@app.route("/api/icebreakers/all", methods=["GET"])
def get_all_icebreakers():
    icebreakers = Icebreaker.query.all()
    questions = [ib.question for ib in icebreakers]
    return jsonify({"icebreakers": questions})

@app.route("/api/icebreakers", methods=["POST"])
def add_icebreaker():
    data = request.json or {}
    question = data.get("question")
    category = data.get("category")
    if not question or not category:
        return jsonify({"error": "question and category required"}), 400
    ib = Icebreaker(question=question, category=category)
    db.session.add(ib)
    db.session.commit()
    return jsonify({"ok": True, "id": ib.id})

# ---------- USER QUIZ ----------
@app.route("/api/users/quiz", methods=["POST"])
def user_quiz():
    data = request.json or {}
    user_id = data.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        user.age = int(data.get("age", user.age))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid age"}), 400

    user.gender = str(data.get("gender", user.gender))
    user.city = str(data.get("city", user.city))
    interests = data.get("interests")
    if isinstance(interests, list):
        user.interests = interests

    db.session.commit()
    return jsonify({"ok": True})

# ---------- INTEREST ----------
@app.route("/api/interested", methods=["POST"])
def mark_interested():
    data = request.json or {}
    event_id = data.get("event_id")
    user_id = data.get("user_id")
    if not event_id or not user_id:
        return jsonify({"error":"missing event_id or user_id"}), 400
    rec = Interested(event_id=event_id, user_id=user_id)
    event = Event.query.get(event_id)
    if event:
        event.popularity = (event.popularity or 0) + 1
    log = UserEventLog(user_id=user_id, event_id=event_id, action="clicked_interested")
    db.session.add_all([rec, log])
    db.session.commit()
    return jsonify({"ok": True})

# ---------- ICEBREAKERS AI ----------
@app.route("/api/icebreaker", methods=["POST"])
def icebreaker():
    data = request.json or {}
    interest = data.get("interest", "something cool")
    prompt = (f"Generate 3 short friendly icebreakers (1-2 lines each) for a small group "
              f"who share an interest in '{interest}'. Keep them casual and emoji-friendly.")
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        if openai.api_key:
            resp = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role":"user","content": prompt}],
                max_tokens=150, temperature=0.8
            )
            text = resp['choices'][0]['message']['content'].strip()
        else:
            raise RuntimeError("no OPENAI_API_KEY set")
    except Exception:
        text = (f"1) What's a must-watch {interest} recommendation? 🎬\n"
                f"2) Which {interest} surprised you recently? 🤯\n"
                f"3) Any hidden gems around here related to {interest}?")
    return jsonify({"icebreaker": text})

# ---------- MAP ----------
@app.route("/map")
def folium_map():
    mood = (request.args.get("mood") or "").lower()
    if mood and mood in MOOD_MAP:
        cats = MOOD_MAP[mood]
        events = Event.query.filter(Event.category.in_(cats)).all()
    else:
        events = Event.query.all()

    start_loc = [12.97, 77.59]
    m = folium.Map(location=start_loc, zoom_start=12)
    for e in events:
        folium.CircleMarker(
            location=[e.lat, e.lon],
            radius=6 + (e.popularity or 0) * 0.5,
            popup=f"{e.title} ({e.category})",
            color='blue' if e.category == 'general' else 'green',
            fill=True,
            fill_color='blue' if e.category == 'general' else 'green',
            fill_opacity=0.7
        ).add_to(m)
    return m._repr_html_()

# =========================
# SERPAPI INTEGRATION
# =========================
def map_event_category(serpapi_type: str, title: str) -> str:
    serpapi_type = (serpapi_type or "").lower()
    title = (title or "").lower()
    if any(k in serpapi_type for k in ["concert", "music", "gig"]) or "music" in title:
        return "music"
    elif any(k in serpapi_type for k in ["art", "exhibition", "gallery"]) or "art" in title:
        return "art"
    elif any(k in serpapi_type for k in ["workshop", "class", "training"]) or "workshop" in title:
        return "workshop"
    elif any(k in serpapi_type for k in ["meetup", "network", "community"]) or "meetup" in title:
        return "meetup"
    elif any(k in serpapi_type for k in ["sports", "game", "tournament"]) or "sports" in title:
        return "sports"
    elif "date" in serpapi_type or "date" in title:
        return "date"
    elif "comedy" in serpapi_type or "comedy" in title:
        return "comedy"
    else:
        return "general"

def fetch_serpapi_events(location="Bangalore", num_events=20):
    serpapi_key = os.getenv("SERPAPI_API_KEY")
    if not serpapi_key:
        print("❌ No SERPAPI_API_KEY set in .env")
        return

    params = {
        "engine": "google_events",
        "q": "events",
        "location": location,
        "hl": "en",
        "api_key": serpapi_key
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    events = results.get("events_results", [])

    added_count = 0

    for ev in events[:num_events]:
        title = ev.get("title") or "Untitled Event"
        description = ev.get("description") or ev.get("snippet") or "No description"

        # Location
        loc_data = ev.get("location") or {}
        location_name = loc_data.get("name") or ev.get("location_name") or "Unknown Venue"
        lat = float(loc_data.get("latitude") or ev.get("latitude") or 12.97)
        lon = float(loc_data.get("longitude") or ev.get("longitude") or 77.59)

        
        import re
        import ast

        dates_str = ev.get("dates")  # raw string from SerpAPI
        event_time = ""

        if dates_str:
            # Remove trailing stuff like " -" or any non-dict characters
            dates_str = re.search(r"\{.*\}", dates_str)
            if dates_str:
                try:
                    # Convert string dict to actual dict
                    dates_dict = ast.literal_eval(dates_str.group())
                    event_time = dates_dict.get("when", "")
                except Exception:
                    event_time = ""

        # Category
        serp_type = ev.get("type") or ""
        category = map_event_category(serp_type, title)

        # Avoid duplicates
        exists = Event.query.filter_by(title=title, lat=lat, lon=lon).first()
        if not exists:
            db.session.add(Event(
                title=title,
                description=description,
                location_name=location_name,
                lat=lat,
                lon=lon,
                category=category,
                event_time=event_time
            ))
            added_count += 1
        else:
            if exists.category == "general" and category != "general":
                exists.category = category
            if not exists.event_time and event_time:
                exists.event_time = event_time
            if not exists.location_name or exists.location_name == "Unknown Venue":
                exists.location_name = location_name
            if not exists.lat or not exists.lon:
                exists.lat = lat
                exists.lon = lon

    db.session.commit()
    print(f"✅ Stored {added_count} new events from SerpApi (total events in DB: {Event.query.count()})")

# =========================
# MAIN
# =========================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        try:
            fetch_serpapi_events(location="Bangalore", num_events=20)
        except Exception as e:
            print("SerpApi fetch failed:", e)

    app.run(debug=True, host="0.0.0.0", port=5000)
