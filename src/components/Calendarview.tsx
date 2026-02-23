import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import type { CalendarApplication } from "../types";

// ── Local types ───────────────────────────────────────────────────────────────
type EventType = "applied" | "interview";

interface CalendarEvent {
  type:    EventType;
  title:   string;
  company: string;
  status:  string;
  app:     CalendarApplication;
}

interface CalendarViewProps {
  applications: CalendarApplication[];
}

const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

// ── Pure date helpers (no moment) ─────────────────────────────────────────────

/** How many days are in a given month (0-indexed month) */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Day-of-week (0=Sun) for the 1st of the given month */
function getFirstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Compare a date string "YYYY-MM-DD" against a specific y/m/d */
function isSameDay(dateStr: string, year: number, month: number, day: number): boolean {
  const target = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return dateStr.slice(0, 10) === target;
}

/** Today as "YYYY-MM-DD" — computed once at module load */
const todayStr = ((): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();

// ── Component ─────────────────────────────────────────────────────────────────
export default function CalendarView({ applications }: CalendarViewProps) {
  const now = new Date();
  const [year, setYear]   = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth()); // 0-indexed

  const totalDays    = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);

  const getEventsForDay = (day: number): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    applications.forEach((app) => {
      if (isSameDay(app.applied_date, year, month, day)) {
        events.push({ type: "applied",   title: app.job_title, company: app.company_name, status: app.status, app });
      }
      if (app.interview_date && isSameDay(app.interview_date, year, month, day)) {
        events.push({ type: "interview", title: app.job_title, company: app.company_name, status: app.status, app });
      }
    });
    return events;
  };

  const prevMonth = (): void => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else { setMonth((m) => m - 1); }
  };

  const nextMonth = (): void => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else { setMonth((m) => m + 1); }
  };

  const goToday = (): void => {
    const n = new Date();
    setYear(n.getFullYear());
    setMonth(n.getMonth());
  };

  const isToday = (day: number): boolean => isSameDay(todayStr, year, month, day);

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A96E]/15 to-[#C9A96E]/5 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-[#C9A96E]" />
          </div>
          <h3 className="text-base font-semibold text-[#0F1A2E]">
            {MONTHS[month]} {year}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#0F1A2E]/50 hover:text-[#0F1A2E] hover:bg-[#0F1A2E]/5 transition-all duration-300"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-2 rounded-lg hover:bg-[#0F1A2E]/5 transition-colors text-[#0F1A2E]/40 hover:text-[#0F1A2E]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="p-2 rounded-lg hover:bg-[#0F1A2E]/5 transition-colors text-[#0F1A2E]/40 hover:text-[#0F1A2E]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day labels */}
        {DAYS.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-[#0F1A2E]/30 pb-2">
            {day}
          </div>
        ))}

        {/* Leading empty cells */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day          = i + 1;
          const events       = getEventsForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.01 }}
              className={`aspect-square rounded-xl p-2 border transition-all duration-300 relative group cursor-pointer ${
                isCurrentDay
                  ? "border-[#C9A96E] bg-[#C9A96E]/5"
                  : "border-[#0F1A2E]/5 hover:border-[#C9A96E]/20 hover:bg-[#0F1A2E]/[0.02]"
              }`}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-xs font-medium mb-1 ${
                    isCurrentDay ? "text-[#C9A96E]" : "text-[#0F1A2E]/60"
                  }`}
                >
                  {day}
                </span>

                {events.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {events.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.type === "interview" ? "bg-blue-500" : "bg-[#C9A96E]"
                        }`}
                      />
                    ))}
                    {events.length > 3 && (
                      <span className="text-[8px] text-[#0F1A2E]/30 ml-0.5">
                        +{events.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Hover tooltip */}
              {events.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-64 glass rounded-xl p-3 shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none">
                  <div className="space-y-2">
                    {events.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${
                            event.type === "interview" ? "bg-blue-500" : "bg-[#C9A96E]"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0F1A2E] truncate">{event.title}</p>
                          <p className="text-[#0F1A2E]/40 truncate">{event.company}</p>
                          <p className="text-[10px] text-[#0F1A2E]/30 mt-0.5">
                            {event.type === "interview" ? "Interview" : "Applied"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[#0F1A2E]/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />
          <span className="text-xs text-[#0F1A2E]/40">Applied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs text-[#0F1A2E]/40">Interview</span>
        </div>
      </div>
    </div>
  );
}