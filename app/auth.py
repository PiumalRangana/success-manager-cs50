from flask import Blueprint, render_template, request, redirect
from werkzeug.security import generate_password_hash
from  .models import User
from . import db

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        errors = []

        # ===== Validations =====
        # 1. Required fields
        if not name or not email or not password or not confirm_password:
            errors.append("All fields are required.")

        # 2. Email format check (very simple)
        if "@" not in email or "." not in email:
            errors.append("Invalid email address.")

        # 3. Password length
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long.")

        # 4. Password confirmation
        if password != confirm_password:
            errors.append("Passwords do not match.")

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
