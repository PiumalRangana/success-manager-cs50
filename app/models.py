from . import db
from flask_login import UserMixin
from datetime import datetime


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    confirmed = db.Column(db.Boolean, default=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('tasks', lazy=True))

    task_text = db.Column(db.String(256), nullable=False)
    time_spent = db.Column(db.Integer, default=0)
    is_complete = db.Column(db.Boolean, default=False, nullable=False)
    is_daily = db.Column(db.Boolean, default=False, nullable=False)
    color = db.Column(db.String(50))
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)

class TimeSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    task = db.relationship('Task', backref=db.backref('time_sessions', lazy=True))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('time_sessions', lazy=True))
    
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50),  default='running')


class AIInsightGeneration(db.Model):
    """A successful AI response, stored for request limits and result caching."""

    __tablename__ = 'ai_insight_generation'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    user = db.relationship('User', backref=db.backref('ai_insight_generations', lazy=True))

    # The hash identifies a specific user, date range, and dashboard payload.
    payload_hash = db.Column(db.String(64), nullable=False, index=True)
    response_json = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now, index=True)
