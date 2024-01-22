import os
import re
from datetime import datetime
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import error, login_required

# Configure application
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

game = ["multiply", "tiles"]

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///rethink.db")

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    users = db.execute("SELECT username, MAX(score) FROM users JOIN scores ON users.id=scores.user_id GROUP BY user_id ORDER BY MAX(score) DESC LIMIT 10")
    return render_template("index.html", users=users)

@app.route("/tiles", methods=["GET", "POST"])
@login_required
def tiles():
    script = "/static/tiles.js"  

    lastResult = db.execute("SELECT max_level, max_round FROM scores WHERE user_id = ? AND game = ? ORDER BY date DESC LIMIT 1", session["user_id"], game[1])
    lastLevel = lastResult[0]['max_level'] if lastResult else 0
    lastRound = lastResult[0]['max_round'] if lastResult else 0
    lastAttempt = "Level:" + str(lastLevel) + " Round:" + str(lastRound) 

    maxLevel = db.execute("SELECT MAX(max_level) FROM scores WHERE user_id = ? AND game = ?", session["user_id"], game[1])
    maxLevel = maxLevel[0]['MAX(max_level)'] if maxLevel and maxLevel[0]['MAX(max_level)'] is not None else 0
    maxRound = db.execute("SELECT MAX(max_round) FROM scores WHERE user_id = ? AND game = ?", session["user_id"], game[1])
    maxRound = maxRound[0]['MAX(max_round)'] if maxRound and maxRound[0]['MAX(max_round)'] is not None else 0
    
    return render_template("tiles.html", script=script, lastAttempt=lastAttempt, maxLevel=maxLevel, maxRound=maxRound)

@app.route("/get-tiles-level")
@login_required
def get_tiles_level():
    lastResult = db.execute("SELECT max_level, max_round FROM scores WHERE user_id = ? AND game = ? ORDER BY date DESC LIMIT 1", session["user_id"], game[1])
    lastLevel = lastResult[0]['max_level'] if lastResult and lastResult[0]['max_level'] is not None else 0
    lastRound = lastResult[0]['max_round'] if lastResult and lastResult[0]['max_round'] is not None else 0
    return {"lastLevel": lastLevel, "lastRound": lastRound}

@app.route("/record-tiles-score", methods=["GET", "POST"])
@login_required
def end_tiles_round():
    if request.method == "POST":
        user_id = session["user_id"]
        data = request.get_json()
        maxLevel = data["maxLevel"]
        maxRound = data["maxRound"]
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        db.execute("INSERT INTO scores (user_id, game, max_level, max_round, date) VALUES (?, ?, ?, ?, ?)", user_id, game[1], maxLevel, maxRound, date)
        return redirect("/tiles")
    else:
        return redirect("/tiles")

@app.route("/multiply")
@login_required
def multiply():
    script = "/static/multiply.js"  
    result = db.execute("SELECT score FROM scores WHERE user_id = ? AND game = ? ORDER BY date DESC LIMIT 1", session["user_id"], game[0])
    lastScore = result[0]['score'] if result else 0
    highScore = db.execute("SELECT MAX(score) FROM scores WHERE user_id = ? AND game = ?", session["user_id"], game[0])[0]['MAX(score)']
    totalSolved = db.execute("SELECT SUM(score) FROM scores WHERE user_id = ? AND game = ? AND score > 0", session["user_id"], game[0])[0]['SUM(score)']

    return render_template("multiply.html", script=script, lastScore=lastScore, highScore=highScore, totalSolved= totalSolved)

@app.route("/record-multiply-score", methods=["GET", "POST"])
@login_required
def end_multiply_round():
    if request.method == "POST":
        user_id = session["user_id"]
        data = request.get_json()
        score = data["score"]
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db.execute("INSERT INTO scores (user_id, game, score, date) VALUES (?, ?, ?, ?)", user_id, game[0], score, date)
        return redirect("/multiply")
    else:
        return redirect("/multiply")


@app.route("/changepass", methods=["GET", "POST"])
@login_required
def changepass():
    if request.method == "POST":
        newpassword = request.form.get("password")
        if not newpassword:
            return error("must provide new password", 400)
        elif not newpassword == request.form.get("confirmation"):
            return error("passwords not equal", 400)
        new_hash = generate_password_hash(newpassword)
        db.execute("UPDATE users SET hash = ? WHERE id = ?", new_hash, session["user_id"])
        return redirect("/login")
    else:
        return render_template("changepass.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return error("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return error("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return error("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")

        if not username:
            return error("must provide username", 400)
        registered_users = db.execute("SELECT COUNT(username) FROM users WHERE username = ?", username)
        if registered_users[0]["COUNT(username)"] == 1:
            return error("This username not allowed", 400)
        if not request.form.get("password"):
            return error("must provide password", 400)
        if not request.form.get("password") == request.form.get("confirmation"):
            return error("passwords not equal", 400)

        password_hash = generate_password_hash(request.form.get("password"))
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", request.form.get("username"), password_hash)
        return redirect("/login")
    else:
        return render_template("register.html")

