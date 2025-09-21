# backend/app.py
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import openai
import folium
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# MODELS
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    category = db.Column(db.String(100))
    popularity = db.Column(db.Integer, default=0)

class Interested(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    user_id = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class UserPreferences(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100))
    category = db.Column(db.String(100))


with app.app_context():
    db.create_all()
    # seed lightweight sample events if DB empty
    if Event.query.count() == 0:
        samples = [
            {"title":"Indie Art Night", "lat":12.9716, "lon":77.5946, "category":"art"},
            {"title":"Lo-fi Coffee Meetup", "lat":12.9352, "lon":77.6245, "category":"meetup"},
            {"title":"Campus Coding Jam", "lat":12.9722, "lon":77.5937, "category":"workshop"},
            {"title":"Open Mic - Chill Vibes", "lat":12.9718, "lon":77.6412, "category":"music"},
            {"title":"Anime & Chill", "lat":13.0358, "lon":77.5970, "category":"anime"}
        ]
        for s in samples:
            db.session.add(Event(title=s["title"], lat=s["lat"], lon=s["lon"], category=s["category"]))
        db.session.commit()

# simple mood -> category mapping
MOOD_MAP = {
    "calm": ["art","meetup"],
    "energetic": ["music","workshop"],
    "anxious": ["meetup","workshop"]
}

# --- PREFERENCES ---
@app.route("/api/preferences", methods=["POST"])
def save_preferences():
    data = request.json or {}
    user_id = data.get("user_id", "anon")
    categories = data.get("categories", [])

    # Delete existing preferences for this user (optional)
    UserPreferences.query.filter_by(user_id=user_id).delete()

    # Save new preferences
    for cat in categories:
        pref = UserPreferences(user_id=user_id, category=cat)
        db.session.add(pref)
    
    db.session.commit()

    print(f"Saved preferences for user {user_id}: {categories}")
    return jsonify({"status": "success"})

# --- EVENTS ---
@app.route("/api/events")
def get_events():
    mood = (request.args.get('mood') or "").lower()
    if mood and mood in MOOD_MAP:
        cats = MOOD_MAP[mood]
        events = Event.query.filter(Event.category.in_(cats)).all()
    else:
        events = Event.query.all()
    out = []
    for e in events:
        out.append({
            "id": e.id, "title": e.title, "lat": e.lat, "lon": e.lon,
            "category": e.category, "popularity": e.popularity
        })
    return jsonify(out)

# --- INTERESTED ---
@app.route("/api/interested", methods=["POST"])
def mark_interested():
    data = request.json or {}
    event_id = data.get("event_id")
    user_id = data.get("user_id", "anon")
    if not event_id:
        return jsonify({"error":"missing event_id"}), 400
    rec = Interested(event_id=event_id, user_id=user_id)
    event = Event.query.get(event_id)
    if event:
        event.popularity = (event.popularity or 0) + 1
    db.session.add(rec)
    db.session.commit()
    return jsonify({"ok": True})

# --- ICEBREAKER ---
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
    except Exception as e:
        # fallback
        text = (f"1) What's a must-watch {interest} recommendation? 🎬\n"
                f"2) Which {interest} surprised you recently? 🤯\n"
                f"3) Any hidden gems around here related to {interest}?")
    return jsonify({"icebreaker": text})

# --- MAP ---
@app.route("/map")
def folium_map():
    events = Event.query.all()
    start_loc = [12.97, 77.59]
    m = folium.Map(location=start_loc, zoom_start=12)
    for e in events:
        folium.CircleMarker(
            location=[e.lat, e.lon],
            radius=6 + (e.popularity or 0) * 0.5,
            popup=f"{e.title} ({e.category})",
        ).add_to(m)
    return m._repr_html_()

# --- HOME ---
@app.route("/")
def home():
    return "<h1>Backend Running!</h1>"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)