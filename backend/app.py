# ==========================================
# Backend Server (Flask + SQLAlchemy)
# ==========================================
# Handles:
#   - User Auth & Profiles
#   - Events & Interests
#   - User Preferences & Quiz
#   - Icebreakers (AI powered)
#   - Location + Folium Map
# ==========================================

import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import openai
import folium

# ==========================================
# CONFIG
# ==========================================
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# File uploads
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)


# ==========================================
# MODELS
# ==========================================
class User(db.Model):
    """User profile and login details"""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)          
    gender = db.Column(db.String(20))    
    lat = db.Column(db.Float)            
    lon = db.Column(db.Float)            
    profile_image = db.Column(db.String(200))  

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Event(db.Model):
    """Event information"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    category = db.Column(db.String(100))
    popularity = db.Column(db.Integer, default=0)


class Interested(db.Model):
    """Tracks user interests in events"""
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    user_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class UserPreferences(db.Model):
    """Stores categories a user likes"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    category = db.Column(db.String(100))


class UserQuizAnswer(db.Model):
    """Stores quiz answers per user"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    question = db.Column(db.String(500))
    answer = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# ==========================================
# DATABASE INIT (Seed with sample events)
# ==========================================
with app.app_context():
    db.create_all()
    if Event.query.count() == 0:
        samples = [
            {"title": "Indie Art Night", "lat": 12.9716, "lon": 77.5946, "category": "art"},
            {"title": "Lo-fi Coffee Meetup", "lat": 12.9352, "lon": 77.6245, "category": "meetup"},
            {"title": "Campus Coding Jam", "lat": 12.9722, "lon": 77.5937, "category": "workshop"},
            {"title": "Open Mic - Chill Vibes", "lat": 12.9718, "lon": 77.6412, "category": "music"},
            {"title": "Anime & Chill", "lat": 13.0358, "lon": 77.5970, "category": "anime"}
        ]
        for s in samples:
            db.session.add(Event(**s))
        db.session.commit()


# ==========================================
# MOOD MAP (Event filtering logic)
# ==========================================
MOOD_MAP = {
    "calm": ["art", "meetup"],
    "energetic": ["music", "workshop"],
    "anxious": ["meetup", "workshop"]
}


# ==========================================
# AUTH ROUTES
# ==========================================
@app.route("/api/register", methods=["POST"])
def register():
    """Register new user"""
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
    """Login user"""
    data = request.json or {}
    email, password = data.get("email"), data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"status": "success", "user_id": user.id})


# ==========================================
# USER PROFILE ROUTES
# ==========================================
@app.route("/api/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Fetch user profile"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "lat": user.lat,
        "lon": user.lon,
        "profile_image": user.profile_image
    })


@app.route("/api/user/update", methods=["PATCH"])
def update_user():
    """Update user profile"""
    data = request.json or {}
    user = User.query.get(data.get("user_id"))
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.age = data.get("age", user.age)
    user.gender = data.get("gender", user.gender)
    user.lat = data.get("lat", user.lat)
    user.lon = data.get("lon", user.lon)

    db.session.commit()
    return jsonify({"status": "success"})


@app.route("/api/profile/upload", methods=["POST"])
def upload_profile_image():
    """Upload user profile image"""
    user_id = request.form.get("user_id")
    file = request.files.get("profile_image")
    if not file:
        return {"error": "No file uploaded"}, 400

    filename = secure_filename(file.filename)
    filename = f"{user_id}_{int(datetime.utcnow().timestamp())}_{filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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
    """Save user preferences"""
    data = request.json or {}
    user_id = data.get("user_id")
    categories = data.get("categories", [])

    UserPreferences.query.filter_by(user_id=user_id).delete()
    for cat in categories:
        db.session.add(UserPreferences(user_id=user_id, category=cat))
    
    db.session.commit()
    return jsonify({"status": "success"})


# ==========================================
# EVENTS & INTERESTS
# ==========================================
@app.route("/api/events")
def get_events():
    """Get events, optionally filtered by mood"""
    mood = (request.args.get('mood') or "").lower()
    if mood and mood in MOOD_MAP:
        events = Event.query.filter(Event.category.in_(MOOD_MAP[mood])).all()
    else:
        events = Event.query.all()

    return jsonify([
        {"id": e.id, "title": e.title, "lat": e.lat, "lon": e.lon,
         "category": e.category, "popularity": e.popularity}
        for e in events
    ])


@app.route("/api/interested", methods=["POST"])
def mark_interested():
    """Mark event as 'interested' for user"""
    data = request.json or {}
    event_id, user_id = data.get("event_id"), data.get("user_id")
    if not event_id or not user_id:
        return jsonify({"error": "Missing data"}), 400

    rec = Interested(event_id=event_id, user_id=user_id)
    event = Event.query.get(event_id)
    if event:
        event.popularity = (event.popularity or 0) + 1

    db.session.add(rec)
    db.session.commit()
    return jsonify({"ok": True})


# ==========================================
# ICEBREAKER (AI)
# ==========================================
@app.route("/api/icebreaker", methods=["POST"])
def icebreaker():
    """Generate friendly icebreakers"""
    data = request.json or {}
    interest = data.get("interest", "something cool")
    prompt = (
        f"Generate 3 short friendly icebreakers (1-2 lines each) for a small group "
        f"who share an interest in '{interest}'. Keep them casual and emoji-friendly."
    )

    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        if openai.api_key:
            resp = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.8
            )
            text = resp['choices'][0]['message']['content'].strip()
        else:
            raise RuntimeError("OPENAI_API_KEY not set")
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
    """Generate folium map of events"""
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
# QUIZ
# ==========================================
@app.route("/api/quiz/questions")
def get_quiz_questions():
    """Return quiz questions (expandable)"""
    return jsonify([
        {"id": 1, "question": "Pick your vibe today", "options": ["Calm", "Energetic", "Anxious"]},
        {"id": 2, "question": "Choose a music genre you like", "options": ["Lo-fi", "Indie", "Electronic", "Classical"]},
        {"id": 3, "question": "Do you prefer small meetups or big events?", "options": ["Small", "Big"]},
        {"id": 4, "question": "Favorite time of day to hang out?", "options": ["Morning", "Afternoon", "Night"]}
    ])


@app.route("/api/quiz/answer", methods=["POST"])
def submit_quiz_answer():
    """Store user answer for quiz"""
    data = request.json or {}
    user_id, question, answer = data.get("user_id"), data.get("question"), data.get("answer")

    if not user_id or not question or not answer:
        return jsonify({"error": "Missing fields"}), 400

    db.session.add(UserQuizAnswer(user_id=user_id, question=question, answer=answer))
    db.session.commit()
    return jsonify({"status": "success"})


@app.route("/api/quiz/done", methods=["POST"])
def quiz_done():
    """Finalize quiz for user"""
    return jsonify({"status": "finished"})


# ==========================================
# ROOT
# ==========================================
@app.route("/")
def home():
    return "<h1>🚀 Backend Running!</h1>"


# ==========================================
# MAIN
# ==========================================
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)