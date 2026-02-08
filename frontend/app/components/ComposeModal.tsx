"use client";

import { useState } from "react";

interface ComposeModalProps {
  onSend: (data: { recipient_name: string; recipient_email: string; subject: string; body: string }) => void;
  onClose: () => void;
}

export default function ComposeModal({ onSend, onClose }: ComposeModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!recipientEmail.trim() || !subject.trim()) return;
    setSending(true);
    onSend({
      recipient_name: recipientName.trim() || recipientEmail.trim(),
      recipient_email: recipientEmail.trim(),
      subject: subject.trim(),
      body: body.trim(),
    });
  }

  return (
    <div className="compose-overlay" onClick={onClose}>
      <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compose-header">
          <h2 className="compose-title">New Message</h2>
          <button className="compose-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="compose-fields">
          <div className="compose-field">
            <label className="compose-label">To (name)</label>
            <input
              type="text"
              className="compose-input"
              placeholder="Jane Doe"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
          <div className="compose-field">
            <label className="compose-label">To (email)</label>
            <input
              type="email"
              className="compose-input"
              placeholder="jane.doe@business.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <div className="compose-field">
            <label className="compose-label">Subject</label>
            <input
              type="text"
              className="compose-input"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <textarea
            className="compose-body"
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
          />
        </div>
        <div className="compose-footer">
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={sending || !recipientEmail.trim() || !subject.trim()}
          >
            {sending ? "Sending..." : "Send Now"}
          </button>
          <button className="compose-discard" onClick={onClose}>Discard</button>
        </div>
      </div>
    </div>
  );
}
