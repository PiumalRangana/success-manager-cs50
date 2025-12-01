from flask import Blueprint, render_template, redirect, url_for, request, session
from flask_login import login_required, current_user
from  .models import Task
from . import db

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
@main.route('/home',methods=["GET", "POST"])
def home():
    if request.method == "POST":
        task_text = request.form.get("task_txt")
        is_daily = request.form.get("is_daily")
        task_color = request.form.get("tsk_color")
        
        # Save to data base
        new_task = Task(user_id = session["user_id"], task_text = task_text, 
                        is_daily = bool(is_daily), color = task_color)

        db.session.add(new_task)
        db.session.commit()

    user = {'user_id': current_user.id, 'user_name': current_user.name}
    return render_template('index.html', user=user)