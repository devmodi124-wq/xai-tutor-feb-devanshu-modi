import { Email } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchEmails(
  filter: "all" | "unread" | "archived" = "all"
): Promise<Email[]> {
  const res = await fetch(`${BASE_URL}/emails?filter=${filter}`);
  if (!res.ok) throw new Error("Failed to fetch emails");
  const data = await res.json();
  return data.emails;
}

export async function fetchEmail(id: number): Promise<Email> {
  const res = await fetch(`${BASE_URL}/emails/${id}`);
  if (!res.ok) throw new Error("Failed to fetch email");
  return res.json();
}

export async function createEmail(data: {
  recipient_name: string;
  recipient_email: string;
  subject: string;
  body: string;
}): Promise<Email> {
  const res = await fetch(`${BASE_URL}/emails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create email");
  return res.json();
}

export async function updateEmail(
  id: number,
  data: { is_read?: boolean; is_archived?: boolean }
): Promise<Email> {
  const res = await fetch(`${BASE_URL}/emails/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update email");
  return res.json();
}

export async function deleteEmail(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/emails/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete email");
}
