"use client";

import { Email } from "../types";
import ReplyComposer from "./ReplyComposer";

interface EmailDetailProps {
  email: Email;
  allEmails: Email[];
  onMarkRead: (id: number) => void;
  onArchive: (id: number) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "#6366F1", "#8B5CF6", "#EC4899", "#EF4444",
    "#F97316", "#EAB308", "#22C55E", "#14B8A6",
    "#06B6D4", "#3B82F6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDetailDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + " " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

export default function EmailDetail({ email, allEmails, onMarkRead, onArchive }: EmailDetailProps) {
  return (
    <div className="email-detail-panel">
      <div className="email-detail-scroll">
        {/* Header */}
        <div className="email-detail-header">
          <div className="email-detail-sender">
            <div
              className="email-detail-avatar"
              style={{ background: getAvatarColor(email.sender.name) }}
            >
              {getInitials(email.sender.name)}
            </div>
            <div className="email-detail-sender-info">
              <div className="email-detail-sender-row">
                <span className="email-detail-sender-name">{email.sender.name}</span>
                <span className="email-detail-sender-email">{email.sender.email}</span>
              </div>
              <div className="email-detail-recipient">
                <span>To:</span>
                <span className="email-detail-recipient-name">{email.recipient.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
          <div className="email-detail-header-right">
            <span className="email-detail-date">{formatDetailDate(email.date)}</span>
            <div className="email-detail-actions">
              <button className="detail-action-btn" title="Mark as read" onClick={() => onMarkRead(email.id)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
              <button className="detail-action-btn" title="Archive" onClick={() => onArchive(email.id)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              </button>
              <button className="detail-action-btn" title="Forward">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="15 17 20 12 15 7" />
                  <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
                </svg>
              </button>
              <button className="detail-action-btn" title="More">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Subject */}
        <h2 className="email-detail-subject">{email.subject}</h2>

        {/* Body */}
        <div className="email-detail-body">
          {email.body.split("\n").map((line, i) => (
            <p key={i}>{line || <br />}</p>
          ))}
        </div>

        {/* Attachments */}
        {email.attachments.length > 0 && (
          <div className="email-attachments">
            {email.attachments.map((att) => (
              <div key={att.id} className="attachment-card">
                <div className="attachment-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="attachment-info">
                  <span className="attachment-name">{att.filename}</span>
                  <span className="attachment-meta">
                    {att.size} &middot; <a href={att.url} className="attachment-download">Download</a>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Composer */}
      <ReplyComposer
        recipientName={email.sender.name}
        recipientEmail={email.sender.email}
        allEmails={allEmails}
      />
    </div>
  );
}
