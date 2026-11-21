import os
from datetime import datetime, timezone
from functools import wraps

import bcrypt
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, session
from pymongo import MongoClient

from pymongo.errors import DuplicateKeyError

# ----- Setup -----
# Load .env from the same folder as app.py, wherever you run it from
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
...
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
print("Secret key loaded:", bool(app.secret_key))

client = MongoClient(os.getenv("mongodb://localhost:27017/"))
db = client["learnova"]
users = db["users"]
users.create_index("email", unique=True)  # no two accounts with the same email


# ----- Helper: protect pages that need login -----
def login_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapper


# ----- Pages -----
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if "user_id" in session:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")

        # Server-side checks (never trust only the browser)
        error = None
        if not name:
            error = "Please enter your name."
        elif "@" not in email or "." not in email:
            error = "Please enter a valid email address."
        elif len(password) < 6:
            error = "Password must be at least 6 characters."
        elif password != confirm:
            error = "Passwords do not match."
        elif users.find_one({"email": email}):
            error = "An account with this email already exists."

        if error:
            return render_template("signup.html", error=error, name=name, email=email)

        # Hash the password, never store it as plain text
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        try:
            result = users.insert_one({
                "name": name,
                "email": email,
                "password": hashed,
                "created_at": datetime.now(timezone.utc),
            })
        except DuplicateKeyError:
            return render_template("signup.html",
                                   error="An account with this email already exists.",
                                   name=name, email=email)

        # Log the new user in straight away
        session["user_id"] = str(result.inserted_id)
        session["name"] = name
        return redirect(url_for("dashboard"))

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if "user_id" in session:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = users.find_one({"email": email})

        # Same message for wrong email or wrong password (safer)
        if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            return render_template("login.html", error="Incorrect email or password.", email=email)

        session["user_id"] = str(user["_id"])
        session["name"] = user["name"]
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", name=session["name"])


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)