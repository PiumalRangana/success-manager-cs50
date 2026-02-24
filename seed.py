from datetime import datetime, timedelta
import random
from faker import Faker

from app import create_app, db
from app.models import User, Task, TimeSession

fake = Faker()
app = create_app()

TASK_NAMES = [
    "Backend Practice",
    "Frontend Styling",
    "System Design Study"
]

COLORS = ["#ff6384", "#36a2eb", "#cc65fe"]

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
        base_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

        # Define fixed durations for clarity
        durations = [60, 30, None]  # minutes; last one is ongoing

        for i, task in enumerate(tasks):
            start_time = base_time + timedelta(hours=i*2)  # gap of 2 hours between tasks

            if durations[i] is None:
                # Ongoing session (no end_time)
                end_time = None
                status = "running"
            else:
                end_time = start_time + timedelta(minutes=durations[i])
                status = "stopped"

            session = TimeSession(
                task_id=task.id,
                user_id=user.id,
                start_time=start_time,
                end_time=end_time,
                status=status
            )

            if end_time:
                task.time_spent += durations[i]

            db.session.add(session)
            total_sessions += 1

        db.session.commit()
        print(f"✅ Created {total_sessions} time sessions")
        print("🎉 Seeding complete!")

if __name__ == "__main__":
    seed()