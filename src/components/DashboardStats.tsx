import React, { useEffect, useRef, useState } from 'react';
import { Send, CalendarCheck, Trophy, XCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface DashboardStatsProps {
  stats: {
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
}

const STATS_CONFIG = [
  {
    key: 'applied'    as const,
    label: 'Applied',
    icon: Send,
    color: 'text-[#C5A059]',
    bg:   'bg-[#C5A059]/10',
  },
  {
    key: 'interviews' as const,
    label: 'Interviews',
    icon: CalendarCheck,
    color: 'text-[#4A90E2]',
    bg:   'bg-[#4A90E2]/10',
  },
  {
    key: 'offers'     as const,
    label: 'Offers',
    icon: Trophy,
    color: 'text-[#6BCB77]',
    bg:   'bg-[#6BCB77]/10',
  },
  {
    key: 'rejected'   as const,
    label: 'Rejected',
    icon: XCircle,
    color: 'text-[#FF6B6B]',
    bg:   'bg-[#FF6B6B]/10',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Count-up hook — starts when triggered, eases out cubically
function useCountUp(target: number, active: boolean, duration = 1000): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, active, duration]);

  return count;
}

interface StatCardProps {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  value: number;
  index: number;
}

function StatCard({ label, icon: Icon, color, bg, value, index }: StatCardProps) {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, amount: 0.3 });
  const count   = useCountUp(value, inView, 900 + index * 80);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-lg hover:shadow-black/5 transition-shadow duration-300 cursor-default"
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-[18px] h-[18px] ${color}`} strokeWidth={2.2} />
      </div>

      {/* Label */}
      <p className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-wider mb-1">
        {label}
      </p>

      {/* Animated count */}
      <p className={`text-3xl font-black tabular-nums ${color}`}>
        {count}
      </p>
    </motion.div>
  );
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_CONFIG.map(({ key, label, icon, color, bg }, i) => (
        <StatCard
          key={label}
          label={label}
          icon={icon}
          color={color}
          bg={bg}
          value={stats[key]}
          index={i}
        />
      ))}
    </div>
  );
};

export default DashboardStats;