from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.database import get_db

router = APIRouter(prefix="/emails", tags=["emails"])


# --- Pydantic Models ---

class Sender(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None


class Recipient(BaseModel):
    name: str
    email: str


class Attachment(BaseModel):
    id: int
    filename: str
    size: str
    url: str


class EmailResponse(BaseModel):
    id: int
    sender: Sender
    recipient: Recipient
    subject: str
    preview: str
    body: str
    date: str
    is_read: bool
    is_archived: bool
    attachments: list[Attachment] = []


class EmailCreate(BaseModel):
    recipient_name: str
    recipient_email: str
    subject: str
    body: str
    preview: Optional[str] = None


class EmailUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_archived: Optional[bool] = None
    subject: Optional[str] = None
    body: Optional[str] = None


# --- Helper ---

def _row_to_email(row, attachments: list[dict] | None = None) -> dict:
    return {
        "id": row["id"],
        "sender": {
            "name": row["sender_name"],
            "email": row["sender_email"],
            "avatar": row["sender_avatar"],
        },
        "recipient": {
            "name": row["recipient_name"],
            "email": row["recipient_email"],
        },
        "subject": row["subject"],
        "preview": row["preview"],
        "body": row["body"],
        "date": row["date"],
        "is_read": bool(row["is_read"]),
        "is_archived": bool(row["is_archived"]),
        "attachments": attachments or [],
    }


# --- Routes ---

@router.get("")
def list_emails(filter: str = Query(default="all")):
    """List all emails with optional filter."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            if filter == "unread":
                cursor.execute(
                    "SELECT * FROM emails WHERE is_read = 0 ORDER BY date DESC"
                )
            elif filter == "archived":
                cursor.execute(
                    "SELECT * FROM emails WHERE is_archived = 1 ORDER BY date DESC"
                )
            else:
                cursor.execute("SELECT * FROM emails ORDER BY date DESC")

            rows = cursor.fetchall()
            emails = []
            for row in rows:
                cursor.execute(
                    "SELECT id, filename, size, url FROM attachments WHERE email_id = ?",
                    (row["id"],),
                )
                att_rows = cursor.fetchall()
                attachments = [
                    {"id": a["id"], "filename": a["filename"], "size": a["size"], "url": a["url"]}
                    for a in att_rows
                ]
                emails.append(_row_to_email(row, attachments))

            return {"emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{email_id}")
def get_email(email_id: int):
    """Get a single email by ID with attachments."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Email not found")

            cursor.execute(
                "SELECT id, filename, size, url FROM attachments WHERE email_id = ?",
                (email_id,),
            )
            att_rows = cursor.fetchall()
            attachments = [
                {"id": a["id"], "filename": a["filename"], "size": a["size"], "url": a["url"]}
                for a in att_rows
            ]

            return _row_to_email(row, attachments)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("", status_code=201)
def create_email(email: EmailCreate):
    """Create a new email (sent by Richard Brown)."""
    try:
        preview = email.preview or email.body[:80] + "..." if len(email.body) > 80 else email.body
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO emails (
                    sender_name, sender_email, sender_avatar,
                    recipient_name, recipient_email,
                    subject, preview, body, date, is_read, is_archived
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 1, 0)""",
                (
                    "Richard Brown", "richard.brown@business.com", None,
                    email.recipient_name, email.recipient_email,
                    email.subject, preview, email.body,
                ),
            )
            email_id = cursor.lastrowid
            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            row = cursor.fetchone()
            return _row_to_email(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{email_id}")
def update_email(email_id: int, email: EmailUpdate):
    """Partially update an email."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Email not found")

            updates = []
            values = []
            if email.is_read is not None:
                updates.append("is_read = ?")
                values.append(int(email.is_read))
            if email.is_archived is not None:
                updates.append("is_archived = ?")
                values.append(int(email.is_archived))
            if email.subject is not None:
                updates.append("subject = ?")
                values.append(email.subject)
            if email.body is not None:
                updates.append("body = ?")
                values.append(email.body)

            if updates:
                values.append(email_id)
                cursor.execute(
                    f"UPDATE emails SET {', '.join(updates)} WHERE id = ?", values
                )

            cursor.execute("SELECT * FROM emails WHERE id = ?", (email_id,))
            updated = cursor.fetchone()

            cursor.execute(
                "SELECT id, filename, size, url FROM attachments WHERE email_id = ?",
                (email_id,),
            )
            att_rows = cursor.fetchall()
            attachments = [
                {"id": a["id"], "filename": a["filename"], "size": a["size"], "url": a["url"]}
                for a in att_rows
            ]

            return _row_to_email(updated, attachments)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{email_id}", status_code=204)
def delete_email(email_id: int):
    """Delete an email."""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM emails WHERE id = ?", (email_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Email not found")
            cursor.execute("DELETE FROM attachments WHERE email_id = ?", (email_id,))
            cursor.execute("DELETE FROM emails WHERE id = ?", (email_id,))
            return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
