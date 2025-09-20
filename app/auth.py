from flask import Blueprint, render_template, request

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
            for err in errors:
                print("=== Registration Error ===")
                print(err)
            return render_template("register.html", errors=errors, name=name, email=email)


        # If everything is valid
        return "Registration successful!"
    
    return render_template("register.html")
