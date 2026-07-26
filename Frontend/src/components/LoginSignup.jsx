import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, ArrowRight, BookOpen, GraduationCap, ChevronRight, User, Mail, Phone, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import genroLogo from '../genro-logo.jpg';

export default function LoginSignup({ onLogin, initialMode = 'signup' }) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [step, setStep] = useState(1); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Animation loop frame state
  const [frame, setFrame] = useState(1);

  // Form States
  const [username, setUsername] = useState(''); // Used for Login (Email/Username)
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class 11');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');

  const [isLoading, setIsLoading] = useState(false);

  const formColumnRef = useRef(null);
  const otpRef0 = useRef(null);
  const otpRef1 = useRef(null);
  const otpRef2 = useRef(null);
  const otpRef3 = useRef(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

  // Preload all 150 animation frames to ensure smooth, flicker-free playback
  useEffect(() => {
    for (let i = 1; i <= 150; i++) {
      const img = new Image();
      img.src = `/ezgif-73489313f0313338-png-split/ezgif-frame-${String(i).padStart(3, '0')}.png`;
    }
  }, []);

  // Frame sequence loop (25 FPS)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev % 150) + 1);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAuthMode(initialMode);
    setStep(1);
  }, [initialMode]);

  useEffect(() => {
    // Entrance animations
    gsap.fromTo(formColumnRef.current,
      { opacity: 0, scale: 0.96, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, [authMode, step]);

  const toggleAuthMode = () => {
    const nextMode = authMode === 'login' ? 'signup' : 'login';
    setAuthMode(nextMode);
    setStep(1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('https://genro-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      
      const data = await res.json();
      setIsLoading(false);
      
      if (!res.ok) {
        alert(data.message || data.error || 'Login failed. Invalid credentials.');
        return;
      }
      
      const userData = data.data || {};
      const uName = userData.full_name || username.split('@')[0];
      const uClass = userData.class_level || 'Class 12';
      const uBoard = userData.board || 'CBSE';
      const uId = userData.user_id;
      const uEmail = userData.email || username;
      
      onLogin(uName, uClass, uBoard, uId, uEmail);
    } catch (error) {
      setIsLoading(false);
      alert("Network error. Please try again.");
    }
  };

  const handleSignupStep1 = (e) => {
    e.preventDefault();
    if (!mobile || !email || !password || password !== confirmPassword) {
      alert("Please fill all fields and ensure passwords match.");
      return;
    }
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) return;
    setStep(3);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://genro-backend.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          mobile_no: mobile,
          email: email,
          password: password,
          class_level: selectedClass.toUpperCase(),
          board: selectedBoard
        })
      });
      
      const data = await res.json();
      setIsLoading(false);
      
      if (!res.ok) {
        alert(data.message || data.error || 'Signup failed.');
        return;
      }

      onLogin(name, selectedClass, selectedBoard, data.user_id, email);
    } catch (error) {
      setIsLoading(false);
      alert("Network error during signup. Please try again.");
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-cover bg-center text-white relative font-sans"
      style={{ backgroundImage: "url('/signup-bg.jpg')" }}
    >
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Main Unified Glassmorphic Card containing both Video & Form */}
      <div 
        ref={formColumnRef} 
        className="w-full max-w-[850px] glass-panel rounded-[32px] border border-white/10 bg-white/[0.02] shadow-[0_45px_90px_-25px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>

        {/* Left Column: Video Animation Loop inside the Card (5 cols) */}
        <div className="hidden md:block md:col-span-5 relative overflow-hidden bg-black/30 border-r border-white/5 select-none pointer-events-none">
          <img 
            src={`/ezgif-73489313f0313338-png-split/ezgif-frame-${String(frame).padStart(3, '0')}.png`} 
            alt="Genro App Demo Video" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Form Container inside the Card (7 cols) */}
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center p-8 md:p-10 space-y-6 relative z-10">
          
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <img 
              src={genroLogo} 
              className="w-12 h-12 rounded-full object-cover border border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.12)] animate-float" 
              alt="Genro Otter Mascot" 
            />
            <h2 className="text-xl font-black tracking-widest text-white">
              GENRO
            </h2>
            <p className="text-slate-400 text-[10px] font-medium max-w-xs leading-normal">
              Master curriculum, track learning gaps & test dynamically.
            </p>
          </div>

          {/* Form blocks placed directly on the background */}
          <div className="space-y-5">
            {authMode === 'login' && step === 1 && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-white">Sign in to your account</h3>
                  <p className="text-xs text-slate-400 font-medium">Enter your email below to sign in</p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-slate-300">Email</label>
                    <input 
                      type="email" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="m@example.com" 
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white shadow-sm transition-shadow placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" 
                        className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-3 pr-10 py-3 text-sm text-white shadow-sm transition-shadow placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-slate-500 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-white cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {authMode === 'signup' && step === 1 && (
              <form onSubmit={handleSignupStep1} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-white">Create an account</h3>
                  <p className="text-xs text-slate-400 font-medium">Enter your details below to sign up</p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Mobile No</label>
                    <input 
                      type="tel" 
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91" 
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white shadow-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="m@example.com" 
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white shadow-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="grid gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password" 
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-3 pr-10 py-3 text-sm text-white shadow-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-slate-500 hover:text-white transition"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Confirm</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Password" 
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-3 pr-10 py-3 text-sm text-white shadow-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-slate-500 hover:text-white transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-white cursor-pointer mt-2"
                >
                  Send OTP
                </button>
              </form>
            )}

            {authMode === 'signup' && step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-2">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Verify Phone Number</h3>
                  <p className="text-xs text-slate-400">Enter the 4-digit code sent to <strong className="text-white">{mobile}</strong></p>
                </div>

                <div className="flex justify-center gap-3.5 py-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500/60 transition"
                    />
                  ))}
                </div>

                <button 
                  type="submit" 
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-white cursor-pointer"
                >
                  Verify & Continue
                </button>
                
                <div className="text-center">
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white transition cursor-pointer font-bold">
                    Edit Details
                  </button>
                </div>
              </form>
            )}

            {authMode === 'signup' && step === 3 && (
              <form onSubmit={handleOnboardingSubmit} className="space-y-5">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-white">Profile Setup</h3>
                  <p className="text-xs text-slate-400 font-medium">Help us customize your dashboard</p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" 
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white shadow-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-300">Class</label>
                      <div className="relative">
                        <select 
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 appearance-none font-medium cursor-pointer"
                        >
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-300">Board</label>
                      <div className="relative">
                        <select 
                          value={selectedBoard}
                          onChange={(e) => setSelectedBoard(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 appearance-none font-medium cursor-pointer"
                        >
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="State Board">State Board</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-white cursor-pointer mt-2 disabled:opacity-50"
                >
                  {isLoading ? 'Onboarding...' : 'Enter Study Dashboard'}
                </button>
              </form>
            )}

            {/* Toggle Footer */}
            {step === 1 && (
              <div className="pt-4 text-center text-sm text-slate-400 space-y-4">
                <p>
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button 
                    type="button" 
                    onClick={toggleAuthMode}
                    className="inline-flex items-center justify-center rounded-md text-xs font-bold text-white underline-offset-4 hover:underline pl-1 cursor-pointer"
                  >
                    {authMode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button 
                  type="button" 
                  onClick={() => console.log("UI: Google button clicked")}
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-white cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" className="mr-2 h-4 w-4" />
                  Continue with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
