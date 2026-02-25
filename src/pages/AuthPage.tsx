import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, ArrowRight, Chrome, Linkedin,
  Briefcase, UserPlus, LogIn, ArrowLeft, Eye, EyeOff, MailCheck
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
} from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';

type AuthError = FirebaseError;

const friendlyError = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return '❌ Invalid email or password';
    case 'auth/email-already-in-use':
      return '⚠️ An account with this email already exists';
    case 'auth/weak-password':
      return '❌ Password must be at least 6 characters';
    case 'auth/invalid-email':
      return '❌ Please enter a valid email address';
    case 'auth/too-many-requests':
      return '⚠️ Too many attempts. Please try again later';
    case 'auth/popup-closed-by-user':
      return '⚠️ Sign-in popup was closed before completing';
    default:
      return '❌ Something went wrong. Please try again.';
  }
};

const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 7 characters',     test: (p: string) => p.length >= 7 },
  { id: 'uppercase', label: 'One uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number (0–9)',           test: (p: string) => /[0-9]/.test(p) },
  { id: 'symbol',    label: 'One symbol (!@#$%^&* etc.)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

interface AuthPageProps {
  mode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin]                           = useState(mode === 'login');
  const [isLoading, setIsLoading]                       = useState(false);
  const [email, setEmail]                               = useState('');
  const [password, setPassword]                         = useState('');
  const [confirmPassword, setConfirmPassword]           = useState('');
  const [showPassword, setShowPassword]                 = useState(false);
  const [showConfirmPassword, setShowConfirmPassword]   = useState(false);
  const [message, setMessage]                           = useState('');
  const [verificationEmail, setVerificationEmail]       = useState('');
  const [resendCooldown, setResendCooldown]             = useState(0);
  const [passwordFocused, setPasswordFocused]           = useState(false);
  const [forgotPassword, setForgotPassword]             = useState(false);
  const [resetEmail, setResetEmail]                     = useState('');
  const [resetMessage, setResetMessage]                 = useState('');
  const [resetLoading, setResetLoading]                 = useState(false);
  const [resetSent, setResetSent]                       = useState(false);

  const resetForm = () => {
    setMessage(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setMessage('❌ Please enter both email and password'); return; }
    setIsLoading(true); setMessage('');
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await reload(user);

      if (!user.emailVerified) {
        setIsLoading(false);
        setVerificationEmail(user.email ?? '');
        setMessage('⚠️ Please verify your email before logging in. Check your inbox.');
        return;
      }

      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', user.email ?? '');
      navigate('/home');
    } catch (err) {
      setIsLoading(false);
      setMessage(friendlyError(err as AuthError));
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) { setMessage('❌ Please fill in all fields'); return; }
    if (password !== confirmPassword) { setMessage('❌ Passwords do not match'); return; }
    for (const rule of PASSWORD_RULES) {
      if (!rule.test(password)) {
        setMessage(`❌ Password must include: ${rule.label.toLowerCase()}`);
        return;
      }
    }
    setIsLoading(true); setMessage('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Send verification email in the background — don't block navigation
      sendEmailVerification(user, {
        url: `${window.location.origin}/login`,
      }).catch(() => {}); // silently ignore if it fails

      // ✅ Save to localStorage and go straight to dashboard
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', user.email ?? '');
      navigate('/home');
    } catch (err) {
      setIsLoading(false);
      setMessage(friendlyError(err as AuthError));
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true); setMessage('');
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', user.email ?? '');
      navigate('/home');
    } catch (err) {
      setIsLoading(false);
      setMessage(friendlyError(err as AuthError));
    }
  };

  const handleSubmit = (e: React.FormEvent) => isLogin ? handleLogin(e) : handleRegister(e);

  // ── Forgot password ───────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) { setResetMessage('❌ Please enter your email address'); return; }
    setResetLoading(true); setResetMessage('');
    try {
      await sendPasswordResetEmail(auth, resetEmail, {
        url: `${window.location.origin}/login`,
      });
      setResetSent(true);
    } catch (err) {
      setResetMessage(friendlyError(err as AuthError));
    }
    setResetLoading(false);
  };

  // ── Resend verification ───────────────────────────────────────────────────
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/login`,
        });
        startResendCooldown();
        setMessage('✅ Verification email resent! Check your inbox.');
      }
    } catch {
      setMessage('❌ Failed to resend. Please try again shortly.');
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: Forgot Password
  // ════════════════════════════════════════════════════════════════════════════
  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <button
            onClick={() => { setForgotPassword(false); setResetEmail(''); setResetMessage(''); setResetSent(false); }}
            className="flex items-center text-[#1A1A1A]/40 text-sm font-semibold mb-8 hover:text-[#1A1A1A] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
          </button>

          {resetSent ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-6">
                <MailCheck className="w-10 h-10 text-[#C5A059]" />
              </div>
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Check your inbox</h2>
              <p className="text-[#1A1A1A]/50 mb-2">We sent a password reset link to</p>
              <p className="font-bold text-[#1A1A1A] text-lg mb-6">{resetEmail}</p>
              <p className="text-[#1A1A1A]/40 text-sm mb-10">
                Click the link in the email to choose a new password. The link expires in 1 hour.
              </p>
              <button
                onClick={() => { setForgotPassword(false); setResetEmail(''); setResetMessage(''); setResetSent(false); }}
                className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-bold shadow-xl shadow-black/10 hover:bg-[#333] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 mr-2" /> Back to Login
              </button>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <div className="w-14 h-14 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center mb-6">
                  <Lock className="w-7 h-7 text-[#C5A059]" />
                </div>
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Forgot your password?</h2>
                <p className="text-[#1A1A1A]/50">
                  No worries. Enter your email and we'll send you a reset link instantly.
                </p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
                    <input
                      required type="email" placeholder="name@company.com"
                      value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-black/[0.03] border border-black/[0.06] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 outline-none transition-all text-[#1A1A1A] placeholder:text-[#1A1A1A]/30"
                    />
                  </div>
                </div>
                {resetMessage && (
                  <div className={`p-3 rounded-xl text-sm font-semibold text-center ${
                    resetMessage.includes('✅')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {resetMessage}
                  </div>
                )}
                <button
                  disabled={resetLoading} type="submit"
                  className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-bold shadow-xl shadow-black/10 hover:bg-[#333] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-70 flex items-center justify-center"
                >
                  {resetLoading
                    ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Mail className="w-5 h-5 mr-2" /> Send Reset Link</>
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: Login / Register
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FDFCFB] overflow-hidden">
      <div className="flex min-h-screen overflow-hidden">

        {/* ── Left panel ── */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1A1A1A] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#C5A059]/5 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-12">
              <div className="w-10 h-10 bg-[#E2D1B3] rounded-xl flex items-center justify-center shadow-sm">
                <Briefcase className="text-[#1A1A1A] w-5 h-5" />
              </div>
              <span className="text-xl font-semibold tracking-tight">CareerVault</span>
            </div>
            <div className="max-w-md">
              <h1 className="text-5xl font-black mb-6 leading-tight">
                {isLogin ? 'Welcome Back to Your Journey' : 'Begin Your Professional Ascent'}
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                {isLogin
                  ? 'Continue tracking your applications and landing that dream role.'
                  : 'Join thousands of successful job seekers who use CareerVault.'}
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#C5A059]/40 bg-[#E2D1B3]/20 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-white/40">Joined by 10,000+ career builders this month</p>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 lg:p-20 justify-center bg-[#FDFCFB]">
          <div className="max-w-md w-full mx-auto">

            <button
              onClick={() => navigate('/')}
              className="flex items-center text-[#1A1A1A]/40 text-sm font-semibold mb-8 hover:text-[#1A1A1A] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
            </button>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-[#1A1A1A]/50">
                {isLogin
                  ? 'Enter your credentials to access your tracker'
                  : 'Set up your profile to start tracking today'}
              </p>
            </div>

            {/* Toggle */}
            <div className="bg-black/[0.04] p-1.5 rounded-2xl mb-8 flex relative">
              <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${
                isLogin ? 'left-1.5' : 'left-[calc(50%+1.5px)]'
              }`} />
              <button
                onClick={() => { setIsLogin(true); resetForm(); }}
                className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-200 ${isLogin ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`}
              >
                <div className="flex items-center justify-center">
                  <LogIn className="w-4 h-4 mr-2" /> Login
                </div>
              </button>
              <button
                onClick={() => { setIsLogin(false); resetForm(); }}
                className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-200 ${!isLogin ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'}`}
              >
                <div className="flex items-center justify-center">
                  <UserPlus className="w-4 h-4 mr-2" /> Register
                </div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
                  <input
                    required type="email" placeholder="name@company.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-black/[0.03] border border-black/[0.06] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 outline-none transition-all text-[#1A1A1A] placeholder:text-[#1A1A1A]/30"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-bold text-[#1A1A1A]">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => { setForgotPassword(true); setResetEmail(email); setResetMessage(''); setResetSent(false); }}
                      className="text-xs font-bold text-[#C5A059] hover:text-[#B8903F] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
                  <input
                    required type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full pl-11 pr-12 py-3 bg-black/[0.03] border border-black/[0.06] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 outline-none transition-all text-[#1A1A1A] placeholder:text-[#1A1A1A]/30"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {!isLogin && (passwordFocused || password.length > 0) && (
                  <div className="mt-3 p-3 bg-black/[0.02] border border-black/[0.05] rounded-xl space-y-1.5">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.id} className="flex items-center gap-2 text-xs font-semibold">
                          <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-200 ${
                            passed ? 'bg-emerald-500 text-white' : 'bg-black/[0.06] text-transparent'
                          }`}>✓</span>
                          <span className={`transition-colors duration-200 ${passed ? 'text-emerald-600' : 'text-[#1A1A1A]/40'}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
                    <input
                      required type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-black/[0.03] border border-black/[0.06] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 outline-none transition-all text-[#1A1A1A] placeholder:text-[#1A1A1A]/30"
                    />
                    <button
                      type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Unverified email inline warning on login */}
              {isLogin && verificationEmail && !message.includes('✅') && (
                <div className="p-3 rounded-xl text-sm bg-amber-50 border border-amber-200 text-amber-700 font-semibold flex items-center justify-between">
                  <span>Email not verified yet.</span>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0}
                    className="underline font-bold disabled:opacity-50"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend link'}
                  </button>
                </div>
              )}

              {message && (
                <div className={`p-3 rounded-xl text-sm font-semibold text-center ${
                  message.includes('✅')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {message}
                </div>
              )}

              <button
                disabled={isLoading} type="submit"
                className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-bold shadow-xl shadow-black/10 hover:bg-[#333] hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-70 flex items-center justify-center group"
              >
                {isLoading
                  ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>{isLogin ? 'Login to Dashboard' : 'Create My Account'}<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                }
              </button>
            </form>

            <div className="mt-8 text-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-4 bg-[#FDFCFB] text-[#1A1A1A]/30">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleSignIn} disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-black/[0.06] rounded-xl hover:bg-black/[0.03] transition-colors font-semibold text-[#1A1A1A]/60 disabled:opacity-60"
              >
                <Chrome className="w-5 h-5 mr-2 text-[#C5A059]" /> Google
              </button>
              <button
                disabled title="LinkedIn OAuth requires a backend"
                className="flex items-center justify-center px-4 py-3 border border-black/[0.06] rounded-xl font-semibold text-[#1A1A1A]/30 cursor-not-allowed"
              >
                <Linkedin className="w-5 h-5 mr-2 text-[#1A1A1A]/30" /> LinkedIn
              </button>
            </div>

            <p className="mt-10 text-center text-[#1A1A1A]/40 text-sm">
              {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLogin(!isLogin); resetForm(); }}
                className="ml-1.5 font-bold text-[#C5A059] hover:text-[#B8903F] transition-colors hover:underline"
              >
                {isLogin ? 'Sign up for free' : 'Log in here'}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;