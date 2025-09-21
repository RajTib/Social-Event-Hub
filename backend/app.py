# ==========================================
# Backend Server (Flask + SQLAlchemy)
# ==========================================
# Handles:
#   - Auth & User Profiles
#   - Events & Interests
#   - Preferences & Quiz
#   - Icebreakers (AI powered)
#   - Location + Folium Map
#   - SERPAPI Event Fetching
# ==========================================

import os
import re
import ast
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import openai
import folium
from serpapi import GoogleSearch

# ==========================================
# CONFIG
# ==========================================
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///data.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# File uploads
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db = SQLAlchemy(app)

# ==========================================
# MODELS
# ==========================================
class User(db.Model):
    """User profile & login"""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=True)

    # Profile info
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    dob = db.Column(db.String(20))
    bio = db.Column(db.Text)
    social_links = db.Column(db.Text)
    city = db.Column(db.String(100))
    interests = db.Column(db.Text)

    # Location & profile image
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    profile_image = db.Column(db.String(200))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

class Event(db.Model):
    """Event info"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    location_name = db.Column(db.String(200))
    event_time = db.Column(db.String(100))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    category = db.Column(db.String(100))
    popularity = db.Column(db.Integer, default=0)
    created_by = db.Column(db.Integer, db.ForeignKey("user.id"))

class Interested(db.Model):
    """User marked interest in event"""
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class UserPreferences(db.Model):
    """User category preferences"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    category = db.Column(db.String(100))

class UserQuizAnswer(db.Model):
    """Quiz answers per user"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    question = db.Column(db.String(500))
    answer = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class UserEventLog(db.Model):
    """User event logs"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    event_id = db.Column(db.Integer)
    action = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Icebreaker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))

# ==========================================
# DATABASE INIT (sample events)
# ==========================================
with app.app_context():
    db.create_all()
    if Event.query.count() == 0:
        samples = [
            {"title": "Indie Art Night", "lat": 12.9716, "lon": 77.5946, "category": "art"},
            {"title": "Lo-fi Coffee Meetup", "lat": 12.9352, "lon": 77.6245, "category": "meetup"},
            {"title": "Campus Coding Jam", "lat": 12.9722, "lon": 77.5937, "category": "workshop"},
            {"title": "Open Mic - Chill Vibes", "lat": 12.9718, "lon": 77.6412, "category": "music"},
            {"title": "Anime & Chill", "lat": 13.0358, "lon": 77.5970, "category": "anime"},
        ]
        db.session.bulk_insert_mappings(Event, samples)
        db.session.commit()

# ==========================================
# MOOD MAP
# ==========================================
MOOD_MAP = {
    "calm": ["art", "meetup", "date"],
    "energetic": ["music", "workshop"],
    "anxious": ["meetup", "workshop"],
    "social": ["meetup", "workshop", "comedy", "date"]
}

# ==========================================
# AUTH ROUTES
# ==========================================
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json or {}
    email, password, name = data.get("email"), data.get("password"), data.get("name")

    if not email or not password or not name:
        return jsonify({"error": "Missing fields"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(email=email, name=name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "success", "user_id": user.id})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    email, password = data.get("email"), data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"status": "success", "user_id": user.id})

# ==========================================
# USER PROFILE
# ==========================================
@app.route("/api/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "dob": user.dob,
        "bio": user.bio,
        "social_links": user.social_links,
        "lat": user.lat,
        "lon": user.lon,
        "city": user.city,
        "interests": user.interests,
        "profile_image": user.profile_image,
    })

@app.route("/api/user/update", methods=["PATCH"])
def update_user():
    data = request.json or {}
    user = User.query.get(data.get("user_id"))
    if not user:
        return jsonify({"error": "User not found"}), 404

    for field in ["name","age","gender","dob","bio","social_links","lat","lon","city","interests"]:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return jsonify({"status": "success"})

@app.route("/api/profile/upload", methods=["POST"])
def upload_profile_image():
    user_id = request.form.get("user_id")
    file = request.files.get("profile_image")
    if not file:
        return {"error": "No file uploaded"}, 400

    filename = secure_filename(file.filename)
    filename = f"{user_id}_{int(datetime.utcnow().timestamp())}_{filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    user.profile_image = filepath
    db.session.commit()
    return {"status": "success", "profile_image": filepath}

# ==========================================
# PREFERENCES
# ==========================================
@app.route("/api/preferences", methods=["POST"])
def save_preferences():
    data = request.json or {}
    user_id, categories = data.get("user_id"), data.get("categories", [])
    UserPreferences.query.filter_by(user_id=user_id).delete()
    db.session.bulk_insert_mappings(
        UserPreferences, [{"user_id": user_id, "category": c} for c in categories]
    )
    db.session.commit()
    return jsonify({"status": "success"})

# ==========================================
# EVENTS & INTERESTS
# ==========================================
@app.route("/api/events")
def get_events():
    mood = (request.args.get("mood") or "").lower()
    if mood and mood in MOOD_MAP:
        events = Event.query.filter(Event.category.in_(MOOD_MAP[mood])).all()
    else:
        events = Event.query.all()
    return jsonify([{
        "id": e.id,
        "title": e.title,
        "description": getattr(e, "description", ""),
        "location_name": getattr(e, "location_name", ""),
        "event_time": getattr(e, "event_time", ""),
        "lat": e.lat,
        "lon": e.lon,
        "category": e.category,
        "popularity": e.popularity
    } for e in events])

@app.route("/api/interested", methods=["POST"])
def mark_interested():
    data = request.json or {}
    event_id, user_id = data.get("event_id"), data.get("user_id")
    if not event_id or not user_id:
        return jsonify({"error": "Missing data"}), 400

    rec = Interested(event_id=event_id, user_id=user_id)
    event = Event.query.get(event_id)
    if event:
        event.popularity = (event.popularity or 0) + 1

    log = UserEventLog(user_id=user_id, event_id=event_id, action="clicked_interested")
    db.session.add_all([rec, log])
    db.session.commit()
    return jsonify({"ok": True})

# ==========================================
# QUIZ
# ==========================================
@app.route("/api/quiz/questions")
def get_quiz_questions():
    return jsonify([
        {"id": 1, "question": "Pick your vibe today", "options": ["Calm", "Energetic", "Anxious"]},
        {"id": 2, "question": "Choose a music genre you like", "options": ["Lo-fi", "Indie", "Electronic", "Classical"]},
        {"id": 3, "question": "Do you prefer small meetups or big events?", "options": ["Small", "Big"]},
        {"id": 4, "question": "Favorite time of day to hang out?", "options": ["Morning", "Afternoon", "Night"]},
    ])

@app.route("/api/quiz/answer", methods=["POST"])
def submit_quiz_answer():
    data = request.json or {}
    user_id, question, answer = data.get("user_id"), data.get("question"), data.get("answer")
    if not user_id or not question or not answer:
        return jsonify({"error": "Missing fields"}), 400

    db.session.add(UserQuizAnswer(user_id=user_id, question=question, answer=answer))
    db.session.commit()
    return jsonify({"status": "success"})

@app.route("/api/quiz/done", methods=["POST"])
def quiz_done():
    return jsonify({"status": "finished"})

# ==========================================
# ICEBREAKER (AI)
# ==========================================
@app.route("/api/icebreaker", methods=["POST"])
def icebreaker():
    data = request.json or {}
    interest = data.get("interest", "something cool")
    prompt = (
        f"Generate 3 short friendly icebreakers (1-2 lines each) for a small group "
        f"who share an interest in '{interest}'. Keep them casual and emoji-friendly."
    )

    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        if not openai.api_key:
            raise RuntimeError("OPENAI_API_KEY not set")

        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.8,
        )
        text = resp["choices"][0]["message"]["content"].strip()
    except Exception:
        text = (
            f"1) What's a must-watch {interest} recommendation? 🎬\n"
            f"2) Which {interest} surprised you recently? 🤯\n"
            f"3) Any hidden gems around here related to {interest}?"
        )

    return jsonify({"icebreaker": text})

# ==========================================
# FOLIUM MAP
# ==========================================
@app.route("/map")
def folium_map():
    events = Event.query.all()
    m = folium.Map(location=[12.97, 77.59], zoom_start=12)
    for e in events:
        folium.CircleMarker(
            location=[e.lat, e.lon],
            radius=6 + (e.popularity or 0) * 0.5,
            popup=f"{e.title} ({e.category})",
        ).add_to(m)
    return m._repr_html_()

# ==========================================
# SERPAPI INTEGRATION
# ==========================================
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
        loc_data = ev.get("location") or {}
        location_name = loc_data.get("name") or ev.get("location_name") or "Unknown Venue"
        lat = float(loc_data.get("latitude") or ev.get("latitude") or 12.97)
        lon = float(loc_data.get("longitude") or ev.get("longitude") or 77.59)
        dates_str = ev.get("dates")
        event_time = ""
        if dates_str:
            dates_str = re.search(r"\{.*\}", dates_str)
            if dates_str:
                try:
                    dates_dict = ast.literal_eval(dates_str.group())
                    event_time = dates_dict.get("when", "")
                except:
                    event_time = ""
        category = map_event_category(ev.get("type"), title)
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
    print(f"✅ Stored {added_count} new events from SerpApi (total events: {Event.query.count()})")

# ==========================================
# MAIN
# ==========================================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        try:
            fetch_serpapi_events(location="Bangalore", num_events=20)
        except Exception as e:
            print("SerpApi fetch failed:", e)

    app.run(debug=True, host="0.0.0.0", port=5000)
