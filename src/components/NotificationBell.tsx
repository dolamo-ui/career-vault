import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── Toast Stack ───────────────────────────────────────────────────────────────
export const ToastStack: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();

  return (
    <>
      {/* ✅ Raised z-index + clear of mobile nav (bottom-20 instead of bottom-6) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            // ✅ Uses exiting flag to play slide-down before removal
            style={{
              animation: t.exiting
                ? 'slideDown 0.35s ease forwards'
                : 'slideUp 0.35s ease forwards',
            }}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border border-blue-100 bg-blue-50 min-w-[280px] max-w-[360px]"
          >
            <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-blue-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-blue-700">{t.title}</p>
              <p className="text-xs text-blue-600/70 mt-0.5 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="flex-shrink-0 text-blue-300 hover:text-blue-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes slideDown {
            from { opacity: 1; transform: translateY(0);    }
            to   { opacity: 0; transform: translateY(16px); }
          }
        `}</style>
      </div>
    </>
  );
};

// ── Bell + Dropdown ───────────────────────────────────────────────────────────
const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAllRead, markRead, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);

  // ✅ Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ✅ Mark all read automatically when the dropdown is opened
  useEffect(() => {
    if (open && unreadCount > 0) {
      markAllRead();
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>

      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 rounded-full transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {/* ✅ Dot only shows when dropdown is closed AND there are unreads */}
        {unreadCount > 0 && !open && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full border-2 border-[#FDFCFB] animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#FDFCFB] rounded-2xl shadow-2xl border border-black/[0.06] z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1A1A1A]">Notifications</h3>
              {/* ✅ Show total count, not just unread */}
              {notifications.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A]/50 text-[10px] font-bold leading-none">
                  {notifications.length}
                </span>
              )}
            </div>
            {/* ✅ Show "clear all" button instead of "mark all read" since opening already marks read */}
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[10px] font-semibold text-[#C5A059] hover:text-[#B8903F] transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-black/[0.04]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell className="w-8 h-8 text-[#1A1A1A]/10" />
                <p className="text-xs text-[#1A1A1A]/30 font-medium">No notifications yet</p>
                <p className="text-[10px] text-[#1A1A1A]/20">
                  Interview reminders will appear here
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-black/[0.02] ${
                    !n.read ? 'bg-[#C5A059]/[0.03]' : ''
                  }`}
                >
                  {/* ✅ Unread indicator dot — gold when unread, grey when read */}
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-colors ${
                      n.read ? 'bg-[#1A1A1A]/10' : 'bg-[#C5A059]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${n.read ? 'text-[#1A1A1A]/50' : 'text-[#1A1A1A]'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#1A1A1A]/25 mt-1">{timeAgo(n.timestamp)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    className="flex-shrink-0 text-[#1A1A1A]/20 hover:text-rose-400 transition-colors mt-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;