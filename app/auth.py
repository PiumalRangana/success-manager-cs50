from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user
from  .models import User
from . import db

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        email = (request.form.get("email") or "").strip()
        # Passwords are intentionally not stripped: spaces can be part of a
        # user's chosen password and should be checked exactly as submitted.
        password = request.form.get("password") or ""
        confirm_password = request.form.get("confirm_password") or ""

        errors = []

        # ===== Validations =====
        # 1. Required fields
        if not name:
            errors.append("Name is required.")

        if not email:
            errors.append("Email is required.")
        elif "@" not in email or "." not in email:
            errors.append("Invalid email address.")

        if not password:
            errors.append("Password is required.")
        elif len(password) < 8:
            errors.append("Password must be at least 8 characters long.")

        if not confirm_password:
            errors.append("Please confirm your password.")
        elif password != confirm_password:
            errors.append("Passwords do not match.")

        # Query only after basic email validation succeeds.
        if email and "@" in email and "." in email:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                errors.append("Email is already registered.")

        # ===== Handle errors =====
        if errors:
            return render_template("register.html", errors=errors, name=name, email=email)


        # If everything is valid
        # hash password
        password_hash = generate_password_hash(password)
        
        # create user
        new_user = User(name=name, email=email, password_hash=password_hash)

        # save user to database
        db.session.add(new_user)
        db.session.commit()

        return redirect("/login")
    
    return render_template("register.html")


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = (request.form.get("email") or "").strip()
        password = request.form.get("password") or ""

        errors = []

        # ===== Validations =====
        # 1. Required fields
        if not email:
            errors.append("Email is required.")
        elif "@" not in email or "." not in email:
            errors.append("Invalid email address.")

        if not password:
            errors.append("Password is required.")

        # ===== Handle errors =====
        if errors:
            return render_template("login.html", errors=errors, email=email)
        
        # ====== Authenticate User =====
        existing_user = User.query.filter_by(email=email).first()
        if not existing_user or not check_password_hash(existing_user.password_hash, password):
            errors.append("Invalid email or password.")

        if errors:
            return render_template("login.html", errors=errors, email=email)
        
        # Log the user in using Flask-Login
        login_user(existing_user)
        
        # Store muser info in the Flask session for easy access
        session['user_id'] = existing_user.id
        session['user_name'] = existing_user.name

        # Respect `next` param if present
        next_page = request.args.get('next')
        if next_page:
            return redirect(next_page)

        return redirect(url_for('main.home'))

    return render_template("login.html")

@auth.route('/logout')
def logout():
    # Remove our custom session keys and log the user out
    session.pop('user_id', None)
    session.pop('user_name', None)
    logout_user()
    return redirect(url_for('main.login'))
