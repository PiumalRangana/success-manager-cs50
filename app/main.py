from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def land():
    return render_template('landing.html')

@main.route("/about")
def about():
    return render_template("about.html")

@main.route("/contact")
def contact():
    return render_template("contact.html")

@main.route("/login")
def login():
    return render_template("login.html")

@login_required
@main.route('/home')
def home():
    user = {'user_id': current_user.id, 'user_name': current_user.name}
    return render_template('index.html', user=user)