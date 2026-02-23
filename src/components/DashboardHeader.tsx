import React from 'react';
import { Plus, Download } from 'lucide-react';

interface DashboardHeaderProps {
  onAddApplication: () => void;
  onExport: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddApplication, onExport }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#1A1A1A]/50 mt-1">Track and manage your professional opportunities.</p>
      </div>

      <div className="flex items-center gap-3 sm:w-auto w-full">
        {/* Export button */}
        <button
          onClick={onExport}
          className="flex items-center justify-center px-8 py-2 bg-white text-[#1A1A1A] rounded-xl font-semibold border border-black/[0.08] shadow-sm hover:bg-[#F8F7F4] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 w-full sm:w-auto"
        >
          <Download className="w-5 h-5 mr-3 text-[#C5A059]" />
          Export
        </button>

        {/* Add Application button */}
        <button
          onClick={onAddApplication}
          className="flex items-center justify-center px-6 py-2 bg-[#1A1A1A] text-white rounded-xl font-semibold shadow-xl shadow-black/10 hover:bg-[#333] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Application
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;