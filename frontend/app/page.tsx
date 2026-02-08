"use client";

import { useEffect, useState } from "react";
import { Email } from "./types";
import { fetchEmails, updateEmail, createEmail } from "./api";
import Sidebar from "./components/Sidebar";
import EmailList from "./components/EmailList";
import EmailDetail from "./components/EmailDetail";
import ComposeModal from "./components/ComposeModal";

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "archived">("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  useEffect(() => {
    loadEmails(activeFilter);
  }, [activeFilter]);

  async function loadEmails(filter: "all" | "unread" | "archived") {
    try {
      const data = await fetchEmails(filter);
      setEmails(data);
      if (data.length > 0 && (!selectedId || !data.find((e) => e.id === selectedId))) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load emails:", err);
    }
  }

  async function handleMarkRead(id: number) {
    try {
      const email = emails.find((e) => e.id === id);
      if (!email) return;
      const updated = await updateEmail(id, { is_read: !email.is_read });
      setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      console.error("Failed to update email:", err);
    }
  }

  async function handleArchive(id: number) {
    try {
      const email = emails.find((e) => e.id === id);
      if (!email) return;
      const updated = await updateEmail(id, { is_archived: !email.is_archived });
      setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      console.error("Failed to archive email:", err);
    }
  }

  function handleSelectEmail(id: number) {
    setSelectedId(id);
    const email = emails.find((e) => e.id === id);
    if (email && !email.is_read) {
      handleMarkRead(id);
    }
  }

  async function handleSendEmail(data: { recipient_name: string; recipient_email: string; subject: string; body: string }) {
    try {
      const created = await createEmail(data);
      setEmails((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setComposeOpen(false);
    } catch (err) {
      console.error("Failed to send email:", err);
    }
  }

  const selectedEmail = emails.find((e) => e.id === selectedId) || null;

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-content">
        {/* Shared top header spanning email list + detail */}
        <div className="main-header">
          <h1 className="main-header-title">Emails</h1>
          <div className="main-header-actions">
            <div className="search-email-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search Email" className="search-email-input" readOnly />
            </div>
            <button className="new-message-btn" onClick={() => setComposeOpen(true)}>+ New Message</button>
          </div>
        </div>
        {/* Two-column area below the header */}
        <div className="main-body">
          <EmailList
            emails={emails}
            selectedId={selectedId}
            activeFilter={activeFilter}
            onSelectEmail={handleSelectEmail}
            onFilterChange={setActiveFilter}
            onArchive={handleArchive}
          />
          {selectedEmail ? (
            <EmailDetail
              key={selectedEmail.id}
              email={selectedEmail}
              allEmails={emails}
              onMarkRead={handleMarkRead}
              onArchive={handleArchive}
            />
          ) : (
            <div className="email-detail-panel email-detail-empty">
              <p>Select an email to view</p>
            </div>
          )}
        </div>
      </div>
      {composeOpen && (
        <ComposeModal onSend={handleSendEmail} onClose={() => setComposeOpen(false)} />
      )}
    </div>
  );
}
