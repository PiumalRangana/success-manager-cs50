from flask import Blueprint, render_template, redirect, url_for, request, session, flash
from flask_login import login_required, current_user
from app.helpers import task_text_color
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

#add task route
@login_required
@main.route('/add_task',methods=["GET", "POST"])
def add_task():
    if request.method == "POST":
        task_text = request.form.get("task_txt")
        is_daily = request.form.get("is_daily")
        task_color = request.form.get("tsk_color")
        
        # Save to data base
        new_task = Task(user_id = session["user_id"], task_text = task_text, 
                        is_daily = bool(is_daily), color = task_color)

        db.session.add(new_task)
        db.session.commit()
        flash("Task aded successfuly.")

    return render_template("add_tasks.html")

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

    # get tasks from database
    tasks = Task.query.filter_by(user_id=current_user.id, is_complete = 0).all()

    return render_template('index.html', user=user, tasks=tasks)

# Delete task route
@login_required
@main.route('/delete_task/<int:task_id>',methods=["POST"] )
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task and task.user_id == current_user.id:
        db.session.delete(task)
        db.session.commit()
    return redirect(url_for('main.home'))

# edit task route
@login_required
@main.route('/edit_task/<int:task_id>', methods=["GET","POST"])
def edit_task(task_id):
    # Send to edit task page if user task's user id == current user's id
    task = Task.query.get(task_id)
    if request.method == "GET":
        if task and task.user_id == current_user.id:
            return render_template('edit_task.html',task=task)
    
    # If method == post
        # get the values for the task
    task_text = request.form.get("task_txt")
    is_daily = request.form.get("is_daily")
    task_color = request.form.get("tsk_color")
    # Verify task ownership
    if not task or task.user_id != current_user.id:
        flash("Task not found or you're not authorized to edit it.")
        return redirect(url_for('main.home'))

    # Update fields
    task.task_text = task_text
    task.is_daily = bool(is_daily)
    task.color = task_color

    db.session.commit()
    flash("Task updated successfully.")

    return redirect(url_for('main.home'))

# mark complete route
@login_required
@main.route('/complete_task/<int:task_id>', methods=["POST"])
def complete_task(task_id):
    task = Task.query.get(task_id)
    if not task or task.user_id != current_user.id:
        flash("Task not found or you're not authorized to edit it.")
        return redirect(url_for('main.home'))
    
    task.is_complete = True
    db.session.commit()

        
    return redirect(url_for('main.home'))

# Completed tasks get
@login_required
@main.route('/completed_tasks', methods=["GET"])
def completed_tasks():
    completed_tasks = Task.query.filter_by(user_id=current_user.id, is_complete = 1).all()
    return render_template("completed_tasks.html", completed_tasks = completed_tasks)

# Completed tasks post
@login_required
@main.route('/completed_tasks_undo/<int:task_id>', methods=["POST"])
def completed_tasks_undo(task_id):
    if task_id:           
        task = Task.query.get(task_id)
        task.is_complete = False
        db.session.commit()
    return redirect(url_for('main.home'))

