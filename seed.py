"""
Development-only seed script.

Creates demo users, tasks, and time sessions
for testing charts and analytics.

⚠ Do NOT run in production.
"""


from datetime import datetime, timedelta
import random
from faker import Faker

from app import create_app
from app import db
from app.models import User, Task, TimeSession

fake = Faker()
app = create_app()

TASK_NAMES = [
    "Backend Practice",
    "Frontend Styling",
    "Job Applications",
    "System Design Study",
    "Bug Fixing"
]

COLORS = ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0"]


def seed():
    with app.app_context():

        print("🌱 Seeding database...")

        # ---- USER ----
        user = User.query.first()
        if not user:
            user = User(
                name="Demo User",
                email="demo@example.com",
                password_hash="not-a-real-hash",
                confirmed=True
            )
            db.session.add(user)
            db.session.commit()
            print("✅ Created demo user")
        else:
            print("ℹ️ Using existing user")

        # ---- TASKS ----
        tasks = []
        for i, name in enumerate(TASK_NAMES):
            task = Task(
                user_id=user.id,
                task_text=name,
                is_daily=random.choice([True, False]),
                color=COLORS[i % len(COLORS)]
            )
            db.session.add(task)
            tasks.append(task)

        db.session.commit()
        print(f"✅ Created {len(tasks)} tasks")

        # ---- TIME SESSIONS ----
        total_sessions = 0

        for task in tasks:
            sessions_count = random.randint(6, 14)

            for _ in range(sessions_count):
                days_ago = random.randint(0, 13)
                start_hour = random.randint(6, 22)
                duration_minutes = random.randint(20, 120)

                start_time = (
                    datetime.now()
                    - timedelta(days=days_ago)
                ).replace(hour=start_hour, minute=0, second=0, microsecond=0)

                end_time = start_time + timedelta(minutes=duration_minutes)

                session = TimeSession(
                    task_id=task.id,
                    user_id=user.id,
                    start_time=start_time,
                    end_time=end_time,
                    status="stopped"
                )

                task.time_spent += duration_minutes

                db.session.add(session)
                total_sessions += 1

        db.session.commit()

        print(f"✅ Created {total_sessions} time sessions")
        print("🎉 Seeding complete!")


if __name__ == "__main__":
    seed()
