import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Pencil, Trash2, ExternalLink, Brain } from 'lucide-react';
import type { JobApplication } from '../types';

// ── Props ─────────────────────────────────────────────────────────────────────
interface JobCardProps {
  job:      JobApplication;
  onEdit:   (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

interface JobGridProps {
  jobs:           JobApplication[];
  isLoading:      boolean;
  hasFilters:     boolean;
  onEdit:         (job: JobApplication) => void;
  onDelete:       (id: string) => void;
  onClearFilters: () => void;
}

// ── Status styles ─────────────────────────────────────────────────────────────
const statusStyles: Record<string, { pill: string; dot: string }> = {
  Applied:   { pill: 'bg-blue-50 text-blue-700 border-blue-100',          dot: 'bg-blue-400'    },
  Interview: { pill: 'bg-amber-50 text-amber-700 border-amber-100',       dot: 'bg-amber-400'   },
  Offer:     { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-400' },
  Rejected:  { pill: 'bg-rose-50 text-rose-700 border-rose-100',          dot: 'bg-rose-400'    },
  Hired:     { pill: 'bg-purple-50 text-purple-700 border-purple-100',    dot: 'bg-purple-400'  },
};

// ── JobCard ───────────────────────────────────────────────────────────────────
const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const style = statusStyles[job.status] ?? {
    pill: 'bg-black/[0.04] text-[#1A1A1A]/60 border-black/[0.06]',
    dot:  'bg-[#1A1A1A]/30',
  };

  // ✅ Passes the full job object to InterviewPrep via route state
  const handleInterviewPrep = (): void => {
    navigate('/interview-prep', { state: { job } });
  };

  return (
    <div className="bg-[#FDFCFB] rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group flex flex-col">
      <div className="p-6 flex flex-col flex-1">

        {/* Header */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#1A1A1A] truncate group-hover:text-[#C5A059] transition-colors duration-200">
              {job.title}
            </h3>
            <p className="text-[#1A1A1A]/50 font-medium text-sm truncate">{job.company}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {job.status}
          </span>
        </div>

        {/* Meta info */}
        <div className="space-y-2 mb-4">
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
              <DollarSign className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/50">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
            <span>
              Applied{' '}
              {new Date(job.dateApplied).toLocaleDateString('en-US', {
                month: 'short',
                day:   'numeric',
                year:  'numeric',
              })}
            </span>
          </div>
          {job.jobUrl && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A059] hover:underline truncate font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View listing
              </a>
            </div>
          )}
        </div>

        {/* Notes */}
        {job.notes && (
          <p className="text-sm text-[#1A1A1A]/40 mb-4 line-clamp-2 flex-1 italic">
            {job.notes}
          </p>
        )}

        {/* ✅ AI Interview Prep button → navigates to /interview-prep */}
        <button
          onClick={handleInterviewPrep}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mb-3 rounded-xl bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5 hover:from-[#C5A059]/20 hover:to-[#C5A059]/10 border border-[#C5A059]/15 hover:border-[#C5A059]/30 text-xs font-semibold text-[#C5A059] hover:text-[#B8903F] transition-all duration-300"
        >
          <Brain className="w-3.5 h-3.5" />
          AI Interview Prep
        </button>

        {/* Edit / Delete */}
        <div className="flex gap-2 pt-4 border-t border-black/[0.05] mt-auto">
          <button
            onClick={() => onEdit(job)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#1A1A1A]/60 bg-black/[0.03] rounded-xl hover:bg-black/[0.07] hover:text-[#1A1A1A] transition-all duration-200"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-rose-500/70 bg-rose-50/60 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

// ── JobGrid ───────────────────────────────────────────────────────────────────
const JobGrid: React.FC<JobGridProps> = ({
  jobs, isLoading, hasFilters, onEdit, onDelete, onClearFilters,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-[3px] border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#1A1A1A]/40 text-sm font-medium">Loading applications…</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#FDFCFB] rounded-3xl border-2 border-dashed border-black/[0.07]">
        <div className="w-14 h-14 bg-[#F0EBE1] rounded-2xl flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-[#C5A059]" />
        </div>
        <h3 className="text-lg font-bold text-[#1A1A1A]">No applications found</h3>
        <p className="text-[#1A1A1A]/40 mt-1.5 max-w-xs text-center text-sm">
          {hasFilters
            ? 'No matches for your current search or filters.'
            : 'Add your first job application using the button above.'}
        </p>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="mt-5 px-5 py-2 text-sm font-semibold text-[#C5A059] border border-[#C5A059]/30 rounded-xl hover:bg-[#C5A059]/[0.06] transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JobGrid;