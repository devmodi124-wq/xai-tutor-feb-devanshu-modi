"use client";

import { useState, useRef, useEffect } from "react";
import { Email } from "../types";

interface ReplyComposerProps {
  recipientName: string;
  recipientEmail: string;
  allEmails: Email[];
}

export default function ReplyComposer({ recipientName, recipientEmail, allEmails }: ReplyComposerProps) {
  const [selectedRecipient, setSelectedRecipient] = useState({ name: recipientName, email: recipientEmail });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [body, setBody] = useState(getDefaultBody(recipientName));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique senders as potential recipients
  const recipients = Array.from(
    new Map(
      allEmails.map((e) => [e.sender.email, { name: e.sender.name, email: e.sender.email }])
    ).values()
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getDefaultBody(name: string) {
    const firstName = name.split(" ")[0];
    return `Hi ${firstName},\n\nThank you for reaching out and for sharing your proposal! \u{1F389} After reviewing the attached document, I'm impressed by the alignment between our companies' strengths, particularly in driving customer retention through innovative solutions.\n\nI'd like to explore this further and discuss how we can tailor the partnership to maximize mutual benefits. Are you available for a call or meeting next week? I'm free on Friday 20 Dec, but I can adjust to fit your schedule if needed. Looking forward to diving deeper into this exciting opportunity!\n\nWarm regards,\nJohn Smith`;
  }

  function handleSelectRecipient(r: { name: string; email: string }) {
    setSelectedRecipient(r);
    setDropdownOpen(false);
  }

  return (
    <div className="reply-composer">
      <div className="reply-header">
        <div className="reply-to" ref={dropdownRef}>
          <span>To:</span>
          <button
            className="reply-recipient-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="reply-recipient">{selectedRecipient.name}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="recipient-dropdown">
              {recipients.map((r) => (
                <button
                  key={r.email}
                  className={`recipient-option ${r.email === selectedRecipient.email ? "recipient-option-active" : ""}`}
                  onClick={() => handleSelectRecipient(r)}
                >
                  <span className="recipient-option-name">{r.name}</span>
                  <span className="recipient-option-email">{r.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="reply-header-actions">
          <button className="reply-action-btn" title="Expand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <button className="reply-action-btn" title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <textarea
        className="reply-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
      />
      <div className="reply-footer">
        <div className="reply-footer-left">
          <button className="send-btn">Send Now</button>
          <button className="schedule-btn" title="Schedule">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        </div>
        <div className="reply-footer-right">
          <button className="reply-toolbar-btn" title="Attach file">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <button className="reply-toolbar-btn" title="Emoji">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>
          <button className="reply-toolbar-btn" title="Template">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 8h20" />
              <path d="M6 4v4" />
            </svg>
          </button>
          <button className="reply-toolbar-btn" title="More">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
