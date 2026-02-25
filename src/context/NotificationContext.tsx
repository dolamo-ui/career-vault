import React, {
  createContext, useContext, useState, useCallback, useEffect, useRef,
} from 'react';
import type { JobApplication } from '../types';

export type NotifType = 'interview';

export interface Notification {
  id:        string;
  type:      NotifType;
  title:     string;
  message:   string;
  timestamp: Date;
  read:      boolean;
  jobId?:    string;
}

export interface Toast {
  id:        string;
  type:      NotifType;
  title:     string;
  message:   string;
  exiting?:  boolean; // ✅ tracks slide-out animation state
}

interface NotificationContextValue {
  notifications:   Notification[];
  unreadCount:     number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead:     () => void;
  markRead:        (id: string) => void;
  dismiss:         (id: string) => void;
  toasts:          Toast[];
  dismissToast:    (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts]               = useState<Toast[]>([]);

  // ✅ Graceful dismiss: marks toast as "exiting" first, then removes after animation
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350); // matches slideDown animation duration
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const id   = crypto.randomUUID();
      const full: Notification = { ...n, id, timestamp: new Date(), read: false };
      setNotifications((prev) => [full, ...prev].slice(0, 50));

      const toast: Toast = { id, type: n.type, title: n.title, message: n.message };
      setToasts((prev) => [...prev, toast]);

      // ✅ Auto-dismiss after 5s using the graceful dismiss (with animation)
      setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast],
  );

  const markAllRead = useCallback(() =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);

  const markRead = useCallback((id: string) =>
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)), []);

  const dismiss = useCallback((id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id)), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, addNotification,
      markAllRead, markRead, dismiss, toasts, dismissToast,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ── Hook: fires interview-tomorrow notifications ───────────────────────────────
export function useJobNotifications(jobs: JobApplication[]) {
  const { addNotification } = useNotifications();

  // ✅ Persist fired keys in localStorage so they survive re-renders and page refreshes
  const firedRef = useRef<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('firedNotifications') ?? '[]') as string[])
  );

  useEffect(() => {
    if (!jobs.length) return;

    // ✅ Use local date parts to avoid timezone shift bugs with new Date(string)
    const now      = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    const tomorrow      = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr   = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;

    jobs.forEach((job) => {
      if (!job.interviewDate) return;

      // ✅ Parse the date safely — handles both "2024-01-15" strings and Date objects
      const raw          = new Date(job.interviewDate);
      // Shift by timezone offset to get local date, not UTC date
      const local        = new Date(raw.getTime() + raw.getTimezoneOffset() * 60000);
      const interviewStr = `${local.getFullYear()}-${local.getMonth()}-${local.getDate()}`;

      const key = `interview-tomorrow-${job.id}-${tomorrowStr}`;

      if (interviewStr === tomorrowStr && !firedRef.current.has(key)) {
        firedRef.current.add(key);

        // ✅ Persist to localStorage so it won't re-fire on refresh
        localStorage.setItem(
          'firedNotifications',
          JSON.stringify([...firedRef.current])
        );

        addNotification({
          type:    'interview',
          title:   '📅 Interview Tomorrow!',
          message: `Your interview for ${job.title} at ${job.company} is tomorrow. Good luck!`,
          jobId:   job.id,
        });
      }

      // ✅ Also fire a "today" notification
      const todayKey = `interview-today-${job.id}-${todayStr}`;
      if (interviewStr === todayStr && !firedRef.current.has(todayKey)) {
        firedRef.current.add(todayKey);
        localStorage.setItem(
          'firedNotifications',
          JSON.stringify([...firedRef.current])
        );
        addNotification({
          type:    'interview',
          title:   '🔔 Interview Today!',
          message: `Your interview for ${job.title} at ${job.company} is today. Best of luck!`,
          jobId:   job.id,
        });
      }
    });
  }, [jobs, addNotification]);
}