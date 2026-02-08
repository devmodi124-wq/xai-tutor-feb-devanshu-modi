"use client";

import { Email } from "../types";

interface EmailListProps {
  emails: Email[];
  selectedId: number | null;
  activeFilter: "all" | "unread" | "archived";
  onSelectEmail: (id: number) => void;
  onFilterChange: (filter: "all" | "unread" | "archived") => void;
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  }

  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function EmailList({
  emails,
  selectedId,
  activeFilter,
  onSelectEmail,
  onFilterChange,
  onArchive,
}: EmailListProps) {
  return (
    <div className="email-list-panel">
      {/* Filter tabs */}
      <div className="email-filter-tabs">
        <button
          className={`filter-tab ${activeFilter === "all" ? "filter-tab-active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          All Mails
        </button>
        <button
          className={`filter-tab ${activeFilter === "unread" ? "filter-tab-active" : ""}`}
          onClick={() => onFilterChange("unread")}
        >
          Unread
        </button>
        <button
          className={`filter-tab ${activeFilter === "archived" ? "filter-tab-active" : ""}`}
          onClick={() => onFilterChange("archived")}
        >
          Archive
        </button>
        <button className="filter-more">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Email items */}
      <div className="email-items">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`email-item ${selectedId === email.id ? "email-item-selected" : ""}`}
            onClick={() => onSelectEmail(email.id)}
          >
            <div className="email-item-avatar" style={{ background: getAvatarColor(email.sender.name) }}>
              {getInitials(email.sender.name)}
            </div>
            <div className="email-item-content">
              <div className="email-item-top">
                <span className="email-item-sender">{email.sender.name}</span>
                <span className="email-item-date">{formatDate(email.date)}</span>
              </div>
              <div className="email-item-subject">{email.subject}</div>
              <div className="email-item-preview">{email.preview}</div>
            </div>
            {!email.is_read && <span className="unread-dot" />}
            <div className="email-item-actions">
              <button
                className="email-action-btn"
                title="Archive"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(email.id);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
              </button>
              <button className="email-action-btn" title="Forward">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="15 17 20 12 15 7" />
                  <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
                </svg>
              </button>
              <button className="email-action-btn" title="More">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="email-list-footer">
        <div className="storage-info">
          <div className="storage-bar-inline">
            <div className="storage-track">
              <div className="storage-fill" style={{ width: "62%" }} />
            </div>
          </div>
          <span className="storage-text-inline">6.2GB of 10GB has been used</span>
        </div>
        <span className="pagination-text">1-20 of 2,312</span>
      </div>
    </div>
  );
}
