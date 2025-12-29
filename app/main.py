from flask import Blueprint, render_template, redirect, url_for, request, session, flash, jsonify
from flask_login import login_required, current_user
from app.helpers import task_text_color
from  .models import Task, TimeSession
from . import db
from datetime import datetime, timedelta

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
        return redirect(url_for('main.home'))

    return render_template("add_tasks.html")

@login_required
@main.route('/home',methods=["GET"])
def home():

    user = {'user_id': current_user.id, 'user_name': current_user.name}

    # get tasks from database
    tasks = Task.query.filter_by(user_id=current_user.id, is_complete=0, is_deleted=0).all()

    return render_template('index.html', user=user, tasks=tasks)

# Delete task route
@login_required
@main.route('/delete_task/<int:task_id>',methods=["POST"] )
def delete_task(task_id):
    task = Task.query.get(task_id)
    if task and task.user_id == current_user.id:
        
        #check for timer sessions
        timer_sessions_for_task = TimeSession.query.filter_by(user_id=current_user.id, task_id=task.id).first()
        #if timer sessions exisists
        if timer_sessions_for_task:
            #soft delete
            task.is_deleted = True
            db.session.commit()
            return redirect(url_for('main.home'))
        

        # if no timer sessions hard telete
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

# start timer
@login_required
@main.route('/timer/start', methods=['POST'])
def start_timer():
    data = request.json
    task_id = data['task_id']

    start_time = datetime.now()

    # save to DB
    new_time_session = TimeSession(
        task_id = task_id,
        user_id = session["user_id"],
        start_time = start_time
    )

    db.session.add(new_time_session)
    db.session.commit()

    return jsonify({
        'timer_id': new_time_session.id,
        'start_time': start_time.isoformat()
    }), 200

# stop timer
@login_required
@main.route('/timer/stop', methods=['POST'])
def stop_timer():
    data = request.json
    timer_id = data["time_session_id"]

    # get the time session
    time_session = TimeSession.query.filter_by(id=timer_id, user_id=current_user.id, status='running').first()

    if not time_session:
        return jsonify({"error": "No running timer found"}), 400


    stop_time = datetime.now()
    current_task_id = time_session.task_id

    # Stop timer in db
    time_session.end_time = stop_time
    time_session.status = "stopped"
    db.session.commit()

    # get all time session data from data base
    task_time_sessions = TimeSession.query.filter_by(task_id=current_task_id, user_id=current_user.id, status='stopped')
    # calculate all the time spent in that task

    duration = timedelta(0)
    for session in task_time_sessions:
        duration += (session.end_time - session.start_time)
    
    duration_seconds = int(duration.total_seconds())
    print(duration_seconds)

    # send it.

    return jsonify({
        'message': "timer stopped",
        'duration': duration_seconds
    }), 200