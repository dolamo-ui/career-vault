import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, Briefcase, BarChart3, Shield, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import TrustBadges from "../components/TrustBadges";
import Layout from "../components/Layout";
import type { JSX } from 'react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }
  })
};

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Briefcase,
    title: "Track Applications",
    description: "Organize every application with status tracking, notes, and timeline views."
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "See your progress at a glance with beautiful charts and status breakdowns."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your career data stays private with enterprise-grade security."
  },
  {
    icon: Sparkles,
    title: "Smart Export",
    description: "Export your application history anytime with one-click CSV download."
  }
];

interface Stat {
  label: string;
  count: number;
  color: string;
  border: string;
}

const heroStats: Stat[] = [
  { label: "Applied", count: 24, color: "bg-[#C9A96E]/10 text-[#C9A96E]", border: "border-[#C9A96E]/20" },
  { label: "Interview", count: 8, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  { label: "Hired", count: 3, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
  { label: "Rejected", count: 5, color: "bg-red-50 text-red-500", border: "border-red-100" }
];

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Tech Startup",
    quote: "CareerVault helped me land my dream role. The calendar view kept me organized through 12 interviews!"
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Manager",
    company: "Fortune 500",
    quote: "Finally, a job tracker that matches my professional standards. The export feature saved me during my search."
  },
  {
    name: "Emily Thompson",
    role: "UX Designer",
    company: "Design Agency",
    quote: "The visual analytics gave me clarity on my progress. This is the luxury tool every job seeker deserves."
  }
];

const socialLinks: string[] = ["Twitter", "LinkedIn", "GitHub"];

export default function Landing(): JSX.Element {
  return (
    <Layout currentPageName="Landing">
      <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[#C9A96E]/8 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#0F1A2E]/5 to-transparent blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-[#C9A96E]/30" />
          <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#C9A96E]/20" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-[#C9A96E]/40" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center pt-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1A2E]/5 text-[#0F1A2E] text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            Precision-crafted for ambitious professionals
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0F1A2E] leading-[1.1] tracking-tight mb-6"
          >
            Track Your
            <br />
            <span className="gold-shimmer">Career Journey</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg sm:text-xl text-[#0F1A2E]/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The elegant way to manage your job applications. Stay organized,
            track progress, and land your dream role with confidence.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0F1A2E] text-white text-base font-medium hover:bg-[#1A2A45] transition-all duration-500 hover:shadow-2xl hover:shadow-[#0F1A2E]/20 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-2xl text-[#0F1A2E]/70 text-base font-medium hover:text-[#0F1A2E] hover:bg-[#0F1A2E]/5 transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-20 relative"
          >
            <div className="glass rounded-3xl p-1 shadow-2xl shadow-[#0F1A2E]/5">
              <div className="bg-white rounded-[20px] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  <div className="flex-1" />
                  <span className="text-xs text-[#0F1A2E]/30 font-mono">careervault.app</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {heroStats.map((stat: Stat) => (
                    <div key={stat.label} className={`rounded-2xl border ${stat.border} p-4 text-center`}>
                      <p className={`text-2xl sm:text-3xl font-bold ${stat.color.split(" ")[1]}`}>{stat.count}</p>
                      <p className="text-xs text-[#0F1A2E]/40 mt-1 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#0F1A2E]/5 blur-2xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* About Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent to-[#0F1A2E]/3">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold text-[#C9A96E] tracking-widest uppercase mb-4">About</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1A2E] tracking-tight mb-6">
              Your personal command center for
              <br />
              <span className="text-[#C9A96E]">career advancement</span>
            </h2>
            <p className="text-lg text-[#0F1A2E]/60 leading-relaxed max-w-2xl mx-auto">
              CareerVault transforms the chaos of job hunting into an organized, visual journey.
              Track every application, schedule interviews with confidence, and visualize your progress
              with elegant analytics. Built for ambitious professionals who demand excellence in every
              aspect of their career search.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm font-semibold text-[#C9A96E] tracking-widest uppercase mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1A2E] tracking-tight">
              Everything you need to
              <br />
              <span className="text-[#C9A96E]">own your career</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature: Feature, i: number) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass rounded-3xl p-8 hover:shadow-xl hover:shadow-[#C9A96E]/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A96E]/10 to-[#C9A96E]/5 flex items-center justify-center mb-5 group-hover:from-[#C9A96E]/20 group-hover:to-[#C9A96E]/10 transition-all duration-500">
                  <feature.icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-base font-semibold text-[#0F1A2E] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#0F1A2E]/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-[#0F1A2E]/3 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm font-semibold text-[#C9A96E] tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F1A2E] tracking-tight">
              Trusted by ambitious
              <br />
              <span className="text-[#C9A96E]">professionals worldwide</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial: Testimonial, i: number) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass rounded-3xl p-8 hover:shadow-xl hover:shadow-[#C9A96E]/5 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#E8D5B0] flex items-center justify-center">
                    <span className="text-[#0F1A2E] font-bold text-sm">
                      {testimonial.name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F1A2E]">{testimonial.name}</h4>
                    <p className="text-xs text-[#0F1A2E]/40">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm text-[#0F1A2E]/60 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 pt-4 border-t border-[#0F1A2E]/5">
                  <p className="text-xs text-[#0F1A2E]/30">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto glass-dark rounded-[2rem] p-12 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C9A96E]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#C9A96E]/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to elevate your search?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
              Join professionals who trust CareerVault to organize their next career move.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A96E] to-[#E8D5B0] text-[#0F1A2E] text-base font-semibold hover:shadow-2xl hover:shadow-[#C9A96E]/30 transition-all duration-500 hover:-translate-y-1"
            >
              Start Tracking
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[#0F1A2E]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A96E] to-[#E8D5B0] flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-[#0F1A2E]" />
                </div>
                <span className="text-base font-semibold text-[#0F1A2E]">
                  Career<span className="text-[#C9A96E]">Vault</span>
                </span>
              </div>
              <p className="text-xs text-[#0F1A2E]/40 leading-relaxed">
                The luxury job application tracker for professionals who demand excellence.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1A2E] mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-[#0F1A2E]/40 hover:text-[#C9A96E] transition-colors">Features</a></li>
                <li><a href="#" className="text-xs text-[#0F1A2E]/40 hover:text-[#C9A96E] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-xs text-[#0F1A2E]/40 hover:text-[#C9A96E] transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1A2E] mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-[#0F1A2E]/40 hover:text-[#C9A96E] transition-colors">About</a></li>
                <li><a href="#" className="text-xs text-[#0F1A2E]/40 hover:text-[#C9A96E] transition-colors">Blog</a></li>
                <li><a href="#" className="text-xs text-[#0F1A2E]/40 hover:text-[#C9A96E] transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#0F1A2E] mb-3">Connect</h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social: string) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-[#0F1A2E]/5 hover:bg-[#C9A96E] flex items-center justify-center transition-all duration-300 group"
                    aria-label={social}
                  >
                    <span className="text-xs text-[#0F1A2E]/40 group-hover:text-white transition-colors">
                      {social[0]}
                    </span>
                  </a>
                ))}
              </div>
              <p className="text-xs text-[#0F1A2E]/40 mt-4">hello@careervault.app</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#0F1A2E]/5">
            <p className="text-xs text-[#0F1A2E]/30">© 2026 CareerVault. Crafted with precision.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-[#0F1A2E]/30 hover:text-[#C9A96E] transition-colors">Privacy</a>
              <a href="#" className="text-xs text-[#0F1A2E]/30 hover:text-[#C9A96E] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </Layout>
  );
}