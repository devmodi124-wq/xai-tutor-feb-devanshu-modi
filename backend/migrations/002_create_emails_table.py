"""
Migration: Create emails and attachments tables
Version: 002
Description: Creates the emails and attachments tables with seed data
"""

import sqlite3
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH

MIGRATION_NAME = "002_create_emails_table"


def upgrade():
    """Apply the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", (MIGRATION_NAME,))
    if cursor.fetchone():
        print(f"Migration {MIGRATION_NAME} already applied. Skipping.")
        conn.close()
        return

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_name TEXT NOT NULL,
            sender_email TEXT NOT NULL,
            sender_avatar TEXT,
            recipient_name TEXT NOT NULL DEFAULT 'Richard Brown',
            recipient_email TEXT NOT NULL DEFAULT 'richard.brown@business.com',
            subject TEXT NOT NULL,
            preview TEXT NOT NULL,
            body TEXT NOT NULL,
            date TEXT NOT NULL,
            is_read INTEGER NOT NULL DEFAULT 0,
            is_archived INTEGER NOT NULL DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS attachments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            size TEXT NOT NULL,
            url TEXT NOT NULL,
            FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
        )
    """)

    emails = [
        (
            "Michael Lee", "michael.lee@business.com", None,
            "John Smith", "john.smith@business.com",
            "Follow-Up: Product Demo Feedba...",
            "Hi John, Thank you for attending the product...",
            "Hi John,\n\nThank you for attending the product demo yesterday. I wanted to follow up on the feedback you shared during the session.\n\nYour insights about the user interface were particularly valuable. We've already started discussing potential improvements based on your suggestions.\n\nI'd love to schedule a brief call this week to dive deeper into your thoughts on the integration capabilities. Would Thursday or Friday work for you?\n\nBest regards,\nMichael Lee",
            "2024-12-12T09:00:00",
            0, 0
        ),
        (
            "Jane Doe", "jane.doe@business.com", None,
            "John Smith", "john.smith@business.com",
            "Proposal for Partnership\U0001f389",
            "Hi John, Hope this email finds you well. I'm rea...",
            "Hi John,\n\nhope this message finds you well! I'm reaching out to explore a potential partnership between our companies. At Jane Corp, which could complement your offerings at John Organisation Corp.\n\nI've attached a proposal detailing how we envision our collaboration, including key benefits, timelines, and implementation strategies. I believe this partnership could unlock exciting opportunities for both of us!\n\nLet me know your thoughts or a convenient time to discuss this further. I'm happy to schedule a call or meeting at your earliest convenience.Looking forward to hearing from you!\n\nWarm regards,\nJane Doe",
            "2024-12-10T09:00:00",
            0, 0
        ),
        (
            "Support Team", "support@business.com", None,
            "John Smith", "john.smith@business.com",
            "Contract Renewal Due \U0001f4e8",
            "Dear John,This is a reminder that the contract...",
            "Dear John,\n\nThis is a reminder that the contract for your current subscription is due for renewal on December 31, 2024.\n\nPlease review the terms and conditions attached to this email. If you have any questions or would like to discuss modifications to the contract, please don't hesitate to reach out.\n\nWe value your continued partnership and look forward to serving you in the coming year.\n\nBest regards,\nSupport Team",
            "2024-12-11T10:30:00",
            0, 0
        ),
        (
            "Sarah Connor", "sarah.connor@business.com", None,
            "John Smith", "john.smith@business.com",
            "Meeting Recap: Strategies for 2...",
            "Hi John, Thank you for your insights during ye...",
            "Hi John,\n\nThank you for your insights during yesterday's strategy meeting. Here's a quick recap of the key points discussed:\n\n1. Q1 targets and milestones\n2. New market expansion opportunities\n3. Team restructuring proposals\n4. Budget allocation for 2025\n\nPlease review and share any additional thoughts by end of week.\n\nBest regards,\nSarah Connor",
            "2024-12-11T14:00:00",
            0, 0
        ),
        (
            "Downe Johnson", "downe.johnson@business.com", None,
            "John Smith", "john.smith@business.com",
            "Invitation: Annual Client Appreci...",
            "Dear John. We are delighted to invite you to o...",
            "Dear John,\n\nWe are delighted to invite you to our Annual Client Appreciation Gala on January 15, 2025. This exclusive event is our way of thanking valued partners like you.\n\nThe evening will feature networking opportunities, a keynote address, and entertainment. Please RSVP by December 20th.\n\nWe look forward to celebrating with you!\n\nWarm regards,\nDowne Johnson",
            "2024-12-11T09:00:00",
            0, 0
        ),
        (
            "Lily Alexa", "lily.alexa@business.com", None,
            "John Smith", "john.smith@business.com",
            "Technical Support Update",
            "Dear John, Your issue regarding server conne...",
            "Dear John,\n\nYour issue regarding server connectivity has been resolved. Our engineering team identified the root cause and implemented a permanent fix.\n\nIf you experience any further issues, please don't hesitate to reach out. We're here to help 24/7.\n\nBest regards,\nLily Alexa\nTechnical Support",
            "2024-12-10T16:00:00",
            0, 0
        ),
        (
            "Natasha Brown", "natasha.brown@business.com", None,
            "John Smith", "john.smith@business.com",
            "Happy Holidays from Kozuki tea...",
            "Hi John, As the holiday season approaches, w...",
            "Hi John,\n\nAs the holiday season approaches, we wanted to take a moment to express our gratitude for your continued support and partnership throughout 2024.\n\nWishing you and your team a wonderful holiday season and a prosperous New Year!\n\nWarm regards,\nNatasha Brown",
            "2024-12-10T11:00:00",
            0, 0
        ),
        (
            "Downe Johnson", "downe.johnson@business.com", None,
            "John Smith", "john.smith@business.com",
            "Invitation: Annual Client Appreci...",
            "Dear John. We are delighted to invite you to o...",
            "Dear John,\n\nWe are delighted to invite you to our Annual Client Appreciation Dinner on February 5, 2025. This intimate gathering celebrates our most valued partners.\n\nThe evening includes a three-course dinner, live music, and exclusive previews of our 2025 product lineup. Please RSVP by January 15th.\n\nLooking forward to your presence!\n\nBest regards,\nDowne Johnson",
            "2024-12-11T08:00:00",
            0, 0
        ),
    ]

    cursor.executemany("""
        INSERT INTO emails (
            sender_name, sender_email, sender_avatar,
            recipient_name, recipient_email,
            subject, preview, body, date, is_read, is_archived
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, emails)

    # Add attachment to Jane Doe's email (id=2)
    cursor.execute("""
        INSERT INTO attachments (email_id, filename, size, url)
        VALUES (2, 'Proposal Partnership.pdf', '1.5 MB', '/attachments/proposal-partnership.pdf')
    """)

    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", (MIGRATION_NAME,))

    conn.commit()
    conn.close()
    print(f"Migration {MIGRATION_NAME} applied successfully.")


def downgrade():
    """Revert the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("DROP TABLE IF EXISTS attachments")
    cursor.execute("DROP TABLE IF EXISTS emails")
    cursor.execute("DELETE FROM _migrations WHERE name = ?", (MIGRATION_NAME,))

    conn.commit()
    conn.close()
    print(f"Migration {MIGRATION_NAME} reverted successfully.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run database migration")
    parser.add_argument(
        "action",
        choices=["upgrade", "downgrade"],
        help="Migration action to perform",
    )

    args = parser.parse_args()

    if args.action == "upgrade":
        upgrade()
    elif args.action == "downgrade":
        downgrade()
