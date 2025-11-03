from flask import Blueprint, render_template, session, redirect, url_for
from .models import User

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

@main.route('/home')
def home():
    user_id = session.get('user_id')
    userName = session.get('user_name')
    if not user_id:
        return redirect(url_for('auth.login'))
    
    user = {'user_id': user_id, 'user_name': userName}  
    return render_template('index.html', user=user)