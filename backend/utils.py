from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models import Feedback, Comment


def count_feedbacks_last_week(db: Session, student_id: int) -> int:
    """Counts last-week feedbacks"""
    """
    GETS FEEDBACKS NOT OLDER THAN 1 WEEK
    """
    
    # Hols the date and time exactly 7 days ago
    one_week_ago = datetime.now(timezone.utc) - timedelta(weeks=1)
    return (
        db.query(Feedback)
          .filter(
              Feedback.student_id == student_id,
              Feedback.created_at >= one_week_ago
          ).count()
    )

def count_comments_today(db: Session, student_id: int) -> int:
    """Counts comments created since midnight today"""
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    return (
        db.query(Comment)
          .filter(
              Comment.student_id == student_id,
              Comment.created_at >= today_start
          ).count()
    )