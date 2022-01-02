export interface Notification {
  id: string;
  receiverId: UniqueId;
  content: string;
  sentAt: string;
  note: string;
  seen: boolean;
}
