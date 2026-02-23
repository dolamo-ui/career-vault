import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  search: string;
  status: string;
  sort: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const STATUSES = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Hired'];

const SORT_OPTIONS = [
  { value: 'asc',  label: 'Company A–Z' },
  { value: 'desc', label: 'Company Z–A' },
];

const FilterBar: React.FC<Props> = ({ search, status, sort, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  // ✅ "All" maps to status='', any other label maps to its own value
  const handleStatusClick = (value: string) => {
    const syntheticEvent = {
      target: { name: 'status', value: value === 'All' ? '' : value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onFilterChange(syntheticEvent);
  };

  return (
    <div className="mb-6 space-y-3">

      {/* ── Search row ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
          <input
            type="text"
            name="search"
            value={search}
            onChange={onFilterChange}
            placeholder="Search by title or company..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 focus:outline-none focus:border-[#C5A059]/40 focus:ring-2 focus:ring-[#C5A059]/10 transition-all duration-300"
          />
        </div>

        <select
          name="sort"
          value={sort}
          onChange={onFilterChange}
          className="py-3 px-4 rounded-xl bg-white border border-black/[0.08] text-sm text-[#1A1A1A]/60 focus:outline-none focus:border-[#C5A059]/40 focus:ring-2 focus:ring-[#C5A059]/10 transition-all duration-300 cursor-pointer"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-all duration-300 ${
            showFilters
              ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg shadow-black/10'
              : 'bg-white border-black/[0.08] text-[#1A1A1A]/40 hover:border-[#C5A059]/30 hover:text-[#C5A059]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* ── Status pills (animated) ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-1">
              {STATUSES.map((s) => {
                // ✅ "All" pill is active when status === '', others match exactly
                const isActive = s === 'All' ? status === '' : status === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleStatusClick(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10'
                        : 'bg-white border border-black/[0.08] text-[#1A1A1A]/50 hover:border-[#C5A059]/30 hover:text-[#C5A059]'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FilterBar;