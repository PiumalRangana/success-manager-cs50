from . import db
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    confirmed = db.Column(db.Boolean, default=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)#explain
    user = db.relationship('User', backref=db.backref('tasks', lazy=True))#explain
    task_text = db.Column(db.String(256), nullable=False)
    time_spent = db.Column(db.Integer, default=0)
    is_complete = db.Column(db.Boolean, default=False, nullable=False)
    is_daily = db.Column(db.Boolean, default=False, nullable=False)
    color = db.Column(db.String(50))
