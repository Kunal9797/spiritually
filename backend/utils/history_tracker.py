from sqlalchemy.orm import Session
import models

async def track_user_action(
    db: Session,
    user_id: int,
    action_type: str,
    details: dict
):
    history_entry = models.UserHistory(
        user_id=user_id,
        action_type=action_type,
        details=details
    )
    db.add(history_entry)
    db.commit()
    return history_entry