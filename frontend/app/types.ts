export interface Sender {
  name: string;
  email: string;
  avatar: string | null;
}

export interface Recipient {
  name: string;
  email: string;
}

export interface Attachment {
  id: number;
  filename: string;
  size: string;
  url: string;
}

export interface Email {
  id: number;
  sender: Sender;
  recipient: Recipient;
  subject: string;
  preview: string;
  body: string;
  date: string;
  is_read: boolean;
  is_archived: boolean;
  attachments: Attachment[];
}
