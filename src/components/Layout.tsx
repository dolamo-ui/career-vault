import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import type { JSX } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

const fadeDown = {
  hidden: { opacity: 0, y: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Layout({ children, currentPageName }: LayoutProps): JSX.Element {
  const isLanding = currentPageName === "Landing";
  const navigate = useNavigate();

  function onSignIn(): void {
    navigate('/login');
  }

  function onStart(): void {
    navigate('/register');
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans">
      <style>{`
        :root {
          --navy: #0F1A2E;
          --navy-light: #1A2A45;
          --gold: #C9A96E;
          --gold-light: #E8D5B0;
          --ivory: #FAFAF8;
          --ivory-dark: #F0EDE6;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        .gold-shimmer {
          background: linear-gradient(90deg, #C9A96E, #E8D5B0, #C9A96E);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(201, 169, 110, 0.15);
        }

        .glass-dark {
          background: rgba(15, 26, 46, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #C9A96E transparent;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .fade-edges {
          position: relative;
        }

        .fade-edges::before,
        .fade-edges::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 200px;
          z-index: 10;
          pointer-events: none;
        }

        .fade-edges::before {
          left: 0;
          background: linear-gradient(to right, #FAFAF8, transparent);
        }

        .fade-edges::after {
          right: 0;
          background: linear-gradient(to left, #FAFAF8, transparent);
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLanding ? "bg-transparent" : "glass shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A96E] to-[#E8D5B0] flex items-center justify-center shadow-lg shadow-[#C9A96E]/20 group-hover:shadow-[#C9A96E]/40 transition-shadow duration-300">
              <Briefcase className="w-4 h-4 text-[#0F1A2E]" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#0F1A2E]">
              Career<span className="text-[#C9A96E]">Vault</span>
            </span>
          </Link>

          {/* Auth buttons */}
          <motion.div
            variants={fadeDown}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex items-center gap-3"
          >
            {/* Log In */}
            <button
              onClick={onSignIn}
              className="px-5 py-2.5 text-sm font-semibold text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors duration-200"
            >
              Log In
            </button>

            {/* Join Free */}
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1A1A1A] text-white shadow-lg shadow-black/10 hover:bg-[#333] transition-colors duration-300"
            >
              Join Free
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}