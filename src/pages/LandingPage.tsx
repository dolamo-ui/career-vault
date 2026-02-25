// src/pages/Landing.tsx

import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight, Briefcase, BarChart3, Shield, Sparkles,
  CheckCircle2, TrendingUp, Calendar, Menu, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import TrustBadges from "../components/TrustBadges";
import Layout from "../components/Layout";
import CareerVaultLogo from "../components/Careervaultlogo";
import careerVaultLogo from "../assets/careervault-logo.png";
import type { JSX } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" },
  }),
};

interface Feature { icon: LucideIcon; title: string; description: string; tag: string; }

const features: Feature[] = [
  { icon: Briefcase,  title: "Track Applications",  description: "Organize every application with rich status tracking, notes, contact logs, and elegant timeline views.", tag: "Core"       },
  { icon: BarChart3,  title: "Visual Analytics",    description: "See progress at a glance with beautiful charts, conversion funnels, and weekly activity breakdowns.",    tag: "Insights"   },
  { icon: Shield,     title: "Secure & Private",    description: "Your career data stays exclusively yours — enterprise-grade encryption, zero third-party sharing.",       tag: "Privacy"    },
  { icon: Sparkles,   title: "Smart Export",        description: "Export your entire application history with one click. CSV or PDF — always ready when you need it.",     tag: "Utility"    },
  { icon: Calendar,   title: "Interview Calendar",  description: "Never miss a follow-up. Sync interview slots, set reminders, and manage every touchpoint.",               tag: "Scheduling" },
  { icon: TrendingUp, title: "Progress Milestones", description: "Celebrate wins and learn from rejections with milestone tracking that keeps your momentum strong.",        tag: "Growth"     },
];

const heroStats = [
  { label: "Applied",   count: 24, colorClass: "text-[#C9A96E]",   borderClass: "border-[#C9A96E]/25", bgClass: "bg-[#C9A96E]/5" },
  { label: "Interview", count: 8,  colorClass: "text-blue-500",    borderClass: "border-blue-200",     bgClass: "bg-blue-50"     },
  { label: "Offer",     count: 3,  colorClass: "text-emerald-500", borderClass: "border-emerald-200",  bgClass: "bg-emerald-50"  },
  { label: "Rejected",  count: 5,  colorClass: "text-red-400",     borderClass: "border-red-200",      bgClass: "bg-red-50"      },
];

const testimonials = [
  { name: "Sarah Chen",       role: "Software Engineer", company: "Tech Startup", rating: 5, quote: "CareerVault helped me land my dream role. The calendar view kept me organized through 12 simultaneous interviews — I never dropped a single ball." },
  { name: "Marcus Rodriguez", role: "Product Manager",   company: "Fortune 500",  rating: 5, quote: "Finally a job tracker that matches my professional standards. The export feature saved hours. The analytics are genuinely insightful."             },
  { name: "Emily Thompson",   role: "UX Designer",       company: "Design Agency",rating: 5, quote: "The visual analytics gave me real clarity on what was working in my applications. The luxury tool every serious job seeker deserves."               },
];

const perks    = ["No credit card required", "Unlimited applications", "Data export anytime", "Cancel anytime"];
const navLinks = [{ label:"Features", href:"#features" }, { label:"About", href:"#about" }, { label:"Testimonials", href:"#testimonials" }];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-[#C9A96E]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Landing(): JSX.Element {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const heroY       = useTransform(scrollYProgress, [0,1],    ["0%","22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0,0.65], [1,0]);

  return (
    <Layout currentPageName="Landing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-display{font-family:'Cormorant Garamond',Georgia,serif}
        .font-body{font-family:'DM Sans',system-ui,sans-serif}
        .gold-text{background:linear-gradient(130deg,#C9A96E 0%,#F0DFA8 45%,#C9A96E 100%);background-size:220% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:goldShimmer 5s linear infinite}
        @keyframes goldShimmer{0%{background-position:0% center}100%{background-position:220% center}}
        .glass-card{background:rgba(255,255,255,0.62);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.85)}
        .glass-dark{background:rgba(12,22,40,0.93);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(201,169,110,0.13)}
        .glass-nav{background:rgba(250,250,248,0.88);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}
        .dot-grid{background-image:radial-gradient(circle,rgba(201,169,110,0.17) 1px,transparent 1px);background-size:30px 30px}
        .nav-link{position:relative;color:rgba(15,26,46,0.52);font-size:0.8rem;font-weight:500;letter-spacing:0.045em;transition:color 0.22s}
        .nav-link::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1.5px;background:#C9A96E;transition:width 0.28s ease}
        .nav-link:hover{color:#0F1A2E}.nav-link:hover::after{width:100%}
        .feature-card{transition:transform 0.38s cubic-bezier(0.22,1,0.36,1),box-shadow 0.38s ease}
        .feature-card:hover{transform:translateY(-7px);box-shadow:0 28px 60px rgba(201,169,110,0.12)}
        /* Buttons */
        .btn-primary{background:#0F1A2E;color:#fff;border-radius:13px;padding:14px 30px;font-size:0.9rem;font-weight:500;font-family:'DM Sans',system-ui,sans-serif;letter-spacing:0.025em;display:inline-flex;align-items:center;gap:8px;transition:all 0.38s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden;cursor:pointer}
        .btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(130deg,rgba(201,169,110,0.18),transparent);opacity:0;transition:opacity 0.28s}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 38px rgba(15,26,46,0.28)}.btn-primary:hover::before{opacity:1}
        .btn-login{background:transparent;color:#0F1A2E;border:1.5px solid rgba(15,26,46,0.18);border-radius:13px;padding:10px 20px;font-size:0.82rem;font-weight:500;font-family:'DM Sans',system-ui,sans-serif;letter-spacing:0.02em;display:inline-flex;align-items:center;gap:6px;transition:all 0.25s;cursor:pointer}
        .btn-login:hover{border-color:#C9A96E;color:#C9A96E;background:rgba(201,169,110,0.05)}
        .btn-join{background:linear-gradient(135deg,#C9A96E 0%,#E8D5B0 100%);color:#0F1A2E;border-radius:13px;padding:11px 20px;font-size:0.82rem;font-weight:600;font-family:'DM Sans',system-ui,sans-serif;letter-spacing:0.02em;display:inline-flex;align-items:center;gap:6px;transition:all 0.35s cubic-bezier(0.22,1,0.36,1);cursor:pointer}
        .btn-join:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(201,169,110,0.38)}
        .btn-ghost{color:rgba(15,26,46,0.62);border-radius:13px;padding:14px 28px;font-size:0.9rem;font-weight:500;font-family:'DM Sans',system-ui,sans-serif;border:1.5px solid rgba(15,26,46,0.12);transition:all 0.25s;cursor:pointer}
        .btn-ghost:hover{color:#0F1A2E;background:rgba(15,26,46,0.04);border-color:rgba(15,26,46,0.22)}
        .btn-cta-gold{background:linear-gradient(135deg,#C9A96E 0%,#E8D5B0 100%);color:#0F1A2E;border-radius:14px;padding:16px 38px;font-size:0.95rem;font-weight:600;font-family:'DM Sans',system-ui,sans-serif;letter-spacing:0.02em;display:inline-flex;align-items:center;gap:8px;transition:all 0.38s cubic-bezier(0.22,1,0.36,1);cursor:pointer}
        .btn-cta-gold:hover{transform:translateY(-2px);box-shadow:0 16px 44px rgba(201,169,110,0.42)}
        .section-label{font-family:'DM Sans',system-ui,sans-serif;font-size:0.68rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#C9A96E;display:block}
        .section-heading{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;color:#0F1A2E;line-height:1.08;letter-spacing:-0.02em}
        .mobile-menu-enter{animation:menuIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards}
        @keyframes menuIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="relative overflow-x-hidden font-body bg-[#FAFAF8]">

        {/* ── NAVBAR ── */}
        <motion.nav
          initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.75, ease:[0.22,1,0.36,1] }}
          className="glass-nav fixed top-0 inset-x-0 z-50"
          style={{ borderBottom:"1px solid rgba(15,26,46,0.07)" }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[68px] flex items-center justify-between gap-6">
            <Link to="/" className="flex-shrink-0">
              <CareerVaultLogo src={careerVaultLogo} iconSize={38} showText />
            </Link>
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((l) => <a key={l.label} href={l.href} className="nav-link">{l.label}</a>)}
            </div>
            {/* ── Log In + Join Free ── */}
            <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
              <Link to="/login"    className="btn-login">Log In</Link>
              <Link to="/register" className="btn-join">Join Free <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
              style={{ background:"rgba(15,26,46,0.06)" }}
              onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4 text-[#0F1A2E]" /> : <Menu className="w-4 h-4 text-[#0F1A2E]" />}
            </button>
          </div>
          {mobileOpen && (
            <div className="mobile-menu-enter md:hidden px-6 pb-5 pt-3 flex flex-col gap-2"
              style={{ borderTop:"1px solid rgba(15,26,46,0.07)" }}>
              {navLinks.map((l) => (
                <a key={l.label} href={l.href}
                  className="text-sm font-medium text-[#0F1A2E]/58 hover:text-[#0F1A2E] py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}>{l.label}</a>
              ))}
              <div className="flex gap-2.5 pt-3">
                <Link to="/login"    className="btn-login flex-1 justify-center text-center" onClick={() => setMobileOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-join  flex-1 justify-center"             onClick={() => setMobileOpen(false)}>Join Free <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </div>
          )}
        </motion.nav>

        {/* ── HERO ── */}
        <section ref={heroRef}
          className="relative min-h-screen flex items-center justify-center px-6 pt-28 pb-20 overflow-hidden"
        >
          <div className="absolute inset-0 dot-grid opacity-55 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[750px] h-[750px] rounded-full blur-3xl pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(201,169,110,0.09),transparent 68%)" }} />
          <div className="absolute -bottom-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(15,26,46,0.055),transparent 70%)" }} />
          {[
            { style:{ top:"20%",  left:"7%"   }, size:6, delay:0,   dur:5   },
            { style:{ top:"35%",  right:"6%"  }, size:4, delay:0.9, dur:4.5 },
            { style:{ bottom:"30%",left:"10%" }, size:3, delay:1.6, dur:6   },
            { style:{ top:"62%",  right:"11%" }, size:5, delay:0.4, dur:5.5 },
          ].map((d, i) => (
            <motion.div key={i} className="absolute rounded-full bg-[#C9A96E] pointer-events-none"
              style={{ ...d.style, width:d.size, height:d.size, opacity:0.22 }}
              animate={{ y:[0,-14,0] }}
              transition={{ duration:d.dur, repeat:Infinity, delay:d.delay, ease:"easeInOut" }} />
          ))}

          <motion.div style={{ y:heroY, opacity:heroOpacity }}
            className="relative max-w-5xl mx-auto text-center w-full"
          >
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
              style={{ background:"rgba(201,169,110,0.07)", borderColor:"rgba(201,169,110,0.22)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" style={{ boxShadow:"0 0 7px #C9A96E" }} />
              <span className="text-xs font-medium text-[#C9A96E] tracking-wide">Precision-crafted for ambitious professionals</span>
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="section-heading text-6xl sm:text-7xl lg:text-[5.5rem] mb-6"
            >
              Track Your<br />
              <span className="gold-text italic">Career Journey</span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg sm:text-xl text-[#0F1A2E]/52 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              The elegant way to manage your job applications. Stay organized,
              track progress, and land your dream role with confidence.
            </motion.p>

            {/* ── HERO BUTTONS ──
                  "Start Tracking Free" → /register
                  "Explore Features"   → #features (smooth-scroll anchor)   */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
            >
              <Link to="/register" className="btn-primary">
                Start Tracking Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn-ghost">
                Explore Features
              </a>
            </motion.div>

            <motion.p variants={fadeIn} initial="hidden" animate="visible" custom={3}
              className="text-[11px] text-[#0F1A2E]/35 mb-6"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-[#C9A96E] hover:underline font-medium">Log in here →</Link>
            </motion.p>

            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={4}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            >
              {perks.map((perk) => (
                <span key={perk} className="flex items-center gap-1.5 text-[11px] text-[#0F1A2E]/38 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96E]" />{perk}
                </span>
              ))}
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="mt-20 relative"
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-2xl"
                style={{ background:"rgba(15,26,46,0.07)" }} />
              <div className="rounded-[28px] p-[1.5px] shadow-2xl"
                style={{ background:"linear-gradient(135deg,rgba(201,169,110,0.40),rgba(255,255,255,0.50),rgba(201,169,110,0.18))" }}
              >
                <div className="bg-white rounded-[26px] overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b"
                    style={{ background:"rgba(250,250,248,0.95)", borderColor:"rgba(15,26,46,0.06)" }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/65" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/65" />
                      <div className="w-3 h-3 rounded-full bg-green-400/65" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <span className="text-[10px] font-mono px-3 py-0.5 rounded-md"
                        style={{ color:"rgba(15,26,46,0.28)", background:"rgba(15,26,46,0.04)" }}>
                        careervault.app/dashboard
                      </span>
                    </div>
                    <div className="w-[52px]" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {heroStats.map((s) => (
                        <div key={s.label} className={`rounded-2xl border ${s.borderClass} ${s.bgClass} p-4 text-center`}>
                          <p className={`text-2xl sm:text-3xl font-bold font-display ${s.colorClass}`}>{s.count}</p>
                          <p className="text-[10px] text-[#0F1A2E]/33 mt-1 font-medium tracking-wider uppercase">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl p-4 border"
                      style={{ background:"rgba(250,250,248,0.8)", borderColor:"rgba(15,26,46,0.06)" }}>
                      <p className="text-[10px] font-semibold text-[#0F1A2E]/32 tracking-widest uppercase mb-3">Recent Applications</p>
                      {[
                        { company:"Stripe", role:"Sr. Frontend Engineer", status:"Interview", dot:"bg-blue-400"    },
                        { company:"Notion", role:"Product Designer",       status:"Applied",   dot:"bg-[#C9A96E]"  },
                        { company:"Linear", role:"Full Stack Engineer",    status:"Offer",     dot:"bg-emerald-400"},
                      ].map((app, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-b-0"
                          style={{ borderColor:"rgba(15,26,46,0.05)" }}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ background:"#0F1A2E" }}>{app.company[0]}</div>
                            <div className="text-left">
                              <p className="text-xs font-semibold text-[#0F1A2E]">{app.company}</p>
                              <p className="text-[10px] text-[#0F1A2E]/33">{app.role}</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color:"rgba(15,26,46,0.48)" }}>
                            <span className={`w-1.5 h-1.5 rounded-full ${app.dot}`} />{app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <TrustBadges />

        {/* ── ABOUT ── */}
        <section id="about" className="relative py-36 px-6 overflow-hidden"
          style={{ background:"linear-gradient(180deg,#FAFAF8 0%,#F3F0EA 100%)" }}>
          <div className="absolute right-0 top-0 w-[520px] h-[520px] rounded-full blur-3xl opacity-35 pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(201,169,110,0.13),transparent 70%)" }} />
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }}
                viewport={{ once:true }} transition={{ duration:0.82,ease:[0.22,1,0.36,1] }}>
                <span className="section-label mb-4">About CareerVault</span>
                <h2 className="section-heading text-4xl sm:text-5xl mb-6 mt-4">
                  Your personal command centre for{" "}
                  <span className="gold-text italic">career advancement</span>
                </h2>
                <p className="text-[15px] text-[#0F1A2E]/52 leading-relaxed mb-5 font-light">
                  CareerVault transforms the chaos of job hunting into an organized, visual journey.
                  Track every application, schedule interviews with confidence, and visualize your progress with elegant analytics.
                </p>
                <p className="text-[15px] text-[#0F1A2E]/52 leading-relaxed font-light">
                  Built for ambitious professionals who demand excellence — because your next role deserves the same care you put into your work.
                </p>
                <div className="mt-8 flex gap-3 flex-wrap">
                  <Link to="/register" className="btn-join">Get Started Free <ArrowRight className="w-3.5 h-3.5" /></Link>
                  <Link to="/login" className="btn-login">Log In</Link>
                </div>
              </motion.div>
              <motion.div initial={{ opacity:0,x:30 }} whileInView={{ opacity:1,x:0 }}
                viewport={{ once:true }} transition={{ duration:0.82,ease:[0.22,1,0.36,1],delay:0.1 }}
                className="grid grid-cols-2 gap-4">
                {[
                  { value:"10k+",label:"Applications Tracked",icon:Briefcase  },
                  { value:"94%", label:"User Satisfaction",   icon:TrendingUp },
                  { value:"3×",  label:"Faster Job Search",   icon:Sparkles   },
                  { value:"100%",label:"Data Private",        icon:Shield     },
                ].map(({ value,label,icon:Icon },i) => (
                  <motion.div key={label}
                    initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }}
                    viewport={{ once:true }} transition={{ delay:i*0.08,duration:0.6 }}
                    className="glass-card rounded-2xl p-6">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background:"rgba(201,169,110,0.1)" }}>
                      <Icon className="w-4 h-4 text-[#C9A96E]" />
                    </div>
                    <p className="section-heading text-[2rem] mb-1">{value}</p>
                    <p className="text-xs text-[#0F1A2E]/38 font-medium leading-snug">{label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="relative py-36 px-6 bg-[#FAFAF8]">
          <div className="absolute inset-0 dot-grid opacity-38 pointer-events-none" />
          <div className="relative max-w-6xl mx-auto">
            <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }} transition={{ duration:0.7 }} className="text-center mb-20">
              <span className="section-label mb-4">Features</span>
              <h2 className="section-heading text-4xl sm:text-5xl mt-4">
                Everything you need to<br /><span className="gold-text italic">own your career</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f,i) => (
                <motion.div key={f.title}
                  initial={{ opacity:0,y:32 }} whileInView={{ opacity:1,y:0 }}
                  viewport={{ once:true }} transition={{ duration:0.58,delay:i*0.07 }}
                  className="glass-card feature-card rounded-2xl p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background:"rgba(201,169,110,0.1)" }}>
                      <f.icon className="w-5 h-5 text-[#C9A96E]" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                      style={{ color:"#C9A96E",background:"rgba(201,169,110,0.1)" }}>{f.tag}</span>
                  </div>
                  <h3 className="font-semibold text-[#0F1A2E] text-[0.95rem] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#0F1A2E]/48 leading-relaxed font-light">{f.description}</p>
                </motion.div>
              ))}
            </div>
            {/* CTA below features */}
            <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6,delay:0.3 }}
              className="text-center mt-14">
              <Link to="/register" className="btn-primary inline-flex">
                Get Started — It's Free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="relative py-36 px-6 overflow-hidden"
          style={{ background:"linear-gradient(180deg,#F3F0EA 0%,#FAFAF8 100%)" }}>
          <div className="absolute left-0 top-0 w-[520px] h-[520px] rounded-full blur-3xl opacity-28 pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(201,169,110,0.15),transparent 70%)" }} />
          <div className="relative max-w-6xl mx-auto">
            <motion.div initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }} transition={{ duration:0.7 }} className="text-center mb-20">
              <span className="section-label mb-4">Testimonials</span>
              <h2 className="section-heading text-4xl sm:text-5xl mt-4">
                Trusted by ambitious<br /><span className="gold-text italic">professionals worldwide</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t,i) => (
                <motion.div key={t.name}
                  initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }}
                  viewport={{ once:true }} transition={{ duration:0.58,delay:i*0.1 }}
                  className="glass-card rounded-2xl p-7 flex flex-col">
                  <StarRating count={t.rating} />
                  <p className="text-sm text-[#0F1A2E]/58 leading-relaxed italic flex-1 mb-6 font-light">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor:"rgba(15,26,46,0.07)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background:"linear-gradient(135deg,#C9A96E,#E8D5B0)",color:"#0F1A2E" }}>
                      {t.name.split(" ").map((n)=>n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F1A2E]">{t.name}</p>
                      <p className="text-[11px] text-[#0F1A2E]/33">{t.role} · {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="relative py-36 px-6">
          <div className="absolute inset-0 dot-grid opacity-28 pointer-events-none" />
          <motion.div initial={{ opacity:0,scale:0.965 }} whileInView={{ opacity:1,scale:1 }}
            viewport={{ once:true }} transition={{ duration:0.72,ease:[0.22,1,0.36,1] }}
            className="glass-dark relative max-w-4xl mx-auto rounded-[2rem] p-14 sm:p-20 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{ background:"radial-gradient(circle,rgba(201,169,110,0.13),transparent 70%)" }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background:"radial-gradient(circle,rgba(201,169,110,0.07),transparent 70%)" }} />
            <div className="flex justify-center mb-7">
              <CareerVaultLogo src={careerVaultLogo} iconSize={58} showText={false} />
            </div>
            <h2 className="font-display font-bold text-white text-4xl sm:text-5xl mb-4 leading-tight"
              style={{ letterSpacing:"-0.02em" }}>Ready to elevate your search?</h2>
            <p className="text-white/42 text-lg mb-10 max-w-md mx-auto font-light leading-relaxed">
              Join professionals who trust CareerVault to organize and accelerate their next career move.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-cta-gold">Join Free Today <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/login" className="text-sm text-white/40 hover:text-white/70 transition-colors font-medium underline underline-offset-4 decoration-white/15">
                Already have an account? Log in
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-9">
              {perks.map((perk) => (
                <span key={perk} className="flex items-center gap-1.5 text-xs text-white/28 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A96E]/55" />{perk}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-16 px-6" style={{ borderTop:"1px solid rgba(15,26,46,0.07)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
              <div>
                <Link to="/"><CareerVaultLogo src={careerVaultLogo} iconSize={38} showText className="mb-4" /></Link>
                <p className="text-xs text-[#0F1A2E]/33 leading-relaxed font-light max-w-[180px]">
                  The luxury job application tracker for professionals who demand excellence.
                </p>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-[#0F1A2E] mb-4 tracking-widest uppercase">Product</h4>
                <ul className="space-y-2.5">
                  {["Features","Pricing","Updates","Roadmap"].map((item)=>(
                    <li key={item}><a href={item==="Features"?"#features":"#"} className="text-xs text-[#0F1A2E]/38 hover:text-[#C9A96E] transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-[#0F1A2E] mb-4 tracking-widest uppercase">Company</h4>
                <ul className="space-y-2.5">
                  {["About","Blog","Careers","Press"].map((item)=>(
                    <li key={item}><a href="#" className="text-xs text-[#0F1A2E]/38 hover:text-[#C9A96E] transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-[#0F1A2E] mb-4 tracking-widest uppercase">Account</h4>
                <ul className="space-y-2.5 mb-5">
                  <li><Link to="/login"    className="text-xs text-[#0F1A2E]/38 hover:text-[#C9A96E] transition-colors">Log In</Link></li>
                  <li><Link to="/register" className="text-xs text-[#0F1A2E]/38 hover:text-[#C9A96E] transition-colors">Create Account</Link></li>
                  <li><a href="#"          className="text-xs text-[#0F1A2E]/38 hover:text-[#C9A96E] transition-colors">Forgot Password</a></li>
                </ul>
                <div className="flex items-center gap-2">
                  {[{l:"Twitter",i:"T"},{l:"LinkedIn",i:"L"},{l:"GitHub",i:"G"}].map(({l,i})=>(
                    <a key={l} href="#" aria-label={l}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all"
                      style={{ background:"rgba(15,26,46,0.06)",color:"rgba(15,26,46,0.38)" }}
                      onMouseEnter={(e)=>{(e.currentTarget as HTMLElement).style.background="#C9A96E";(e.currentTarget as HTMLElement).style.color="#fff"}}
                      onMouseLeave={(e)=>{(e.currentTarget as HTMLElement).style.background="rgba(15,26,46,0.06)";(e.currentTarget as HTMLElement).style.color="rgba(15,26,46,0.38)"}}
                    >{i}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
              style={{ borderTop:"1px solid rgba(15,26,46,0.07)" }}>
              <p className="text-xs text-[#0F1A2E]/24">© 2026 CareerVault. Crafted with precision.</p>
              <div className="flex items-center gap-5">
                {["Privacy","Terms","Cookies"].map((item)=>(
                  <a key={item} href="#" className="text-xs text-[#0F1A2E]/24 hover:text-[#C9A96E] transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}