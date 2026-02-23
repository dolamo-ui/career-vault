import type { JSX } from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onSignIn?: () => void;
  onStart?: () => void;
}

const NAV_LINKS = [
  { label: 'Features',     href: '#features'    },
  { label: 'About',        href: '#about'        },
  { label: 'Testimonials', href: '#testimonials' },
];

const fadeDown = {
  hidden: { opacity: 0, y: -10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Navbar({ onSignIn, onStart }: NavbarProps): JSX.Element {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          variants={fadeDown}
          initial="hidden"
          animate="visible"
          custom={0}
          className="flex items-center gap-2.5"
        >
          <div className="w-10 h-10 bg-[#E2D1B3] rounded-xl flex items-center justify-center shadow-sm">
            <Briefcase className="w-5 h-5 text-[#1A1A1A]" />
          </div>
          <span className="text-xl font-semibold tracking-tight">CareerVault</span>
        </motion.div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }, i) => (
            <motion.a
              key={href}
              href={href}
              variants={fadeDown}
              initial="hidden"
              animate="visible"
              custom={i + 1}
              className="text-sm font-medium text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors duration-200"
            >
              {label}
            </motion.a>
          ))}
        </div>

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
  );
}