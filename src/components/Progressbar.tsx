import type { JSX } from 'react';
import { motion } from 'framer-motion';

interface Application {
  status: 'Applied' | 'Interview' | 'Hired' | 'Rejected';
}

interface ProgressBarProps {
  applications: Application[];
}

interface Segment {
  status: string;
  count: number;
  color: string;
}

export default function ProgressBar({ applications }: ProgressBarProps): JSX.Element | null {
  const total = applications.length;
  if (total === 0) return null;

  const counts: Record<string, number> = {
    Applied:   0,
    Interview: 0,
    Hired:     0,
    Rejected:  0,
  };

  applications.forEach((app: Application) => {
    if (counts[app.status] !== undefined) counts[app.status]++;
  });

  const segments: Segment[] = [
    { status: 'Hired',     count: counts.Hired,     color: 'bg-[#6BCB77]'  },
    { status: 'Interview', count: counts.Interview,  color: 'bg-[#4A90E2]'  },
    { status: 'Applied',   count: counts.Applied,    color: 'bg-[#C5A059]'  },
    { status: 'Rejected',  count: counts.Rejected,   color: 'bg-[#FF6B6B]'  },
  ].filter((s: Segment) => s.count > 0);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Journey Progress</h3>
        <span className="text-xs text-[#1A1A1A]/40">{total} total</span>
      </div>

      {/* Progress bar */}
      <div className="flex rounded-full h-3 overflow-hidden bg-black/[0.04]">
        {segments.map((seg: Segment, i: number) => (
          <motion.div
            key={seg.status}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.count / total) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`${seg.color} first:rounded-l-full last:rounded-r-full`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {segments.map((seg: Segment) => (
          <div key={seg.status} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${seg.color}`} />
            <span className="text-xs text-[#1A1A1A]/50">
              {seg.status} ({seg.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}