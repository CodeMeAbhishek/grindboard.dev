"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
 const router = useRouter();
 const supabase = createClient();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isSignUp, setIsSignUp] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [awaitingOtp, setAwaitingOtp] = useState(false);
 const [otp, setOtp] = useState("");
 const [isForgotPassword, setIsForgotPassword] = useState(false);
 const [awaitingResetOtp, setAwaitingResetOtp] = useState(false);
 const [resetNewPassword, setResetNewPassword] = useState("");
 const [resetConfirmPassword, setResetConfirmPassword] = useState("");
 const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
 const [showPassword, setShowPassword] = useState(false);

 const handleAuth = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 if (isSignUp) {
 const { error } = await supabase.auth.signUp({
 email,
 password,
 });
 if (error) throw error;
 setAwaitingOtp(true);
 } else {
 const { error } = await supabase.auth.signInWithPassword({
 email,
 password,
 });
 if (error) throw error;
 router.push("/feed");
 router.refresh();
 }
 } catch (err: any) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 const handleVerifyOtp = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 const { error } = await supabase.auth.verifyOtp({
 email,
 token: otp,
 type: 'signup',
 });
 if (error) throw error;
 router.push("/feed");
 router.refresh();
 } catch (err: any) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setAwaitingResetOtp(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });
      if (error) throw error;
      setAwaitingResetOtp(false);
      setIsSettingNewPassword(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecoveredPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: resetNewPassword });
      if (error) throw error;
      router.push("/feed");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 const handleGithubSignIn = async () => {
 const { error } = await supabase.auth.signInWithOAuth({
 provider: 'github',
 options: {
 redirectTo: `${window.location.origin}/api/auth/callback`,
 },
 });
 if (error) setError(error.message);
 };

 return (
 <div className="flex min-h-screen bg-surface transition-colors">
 {/* Left Side - FOMO Messaging */}
 <div className="hidden lg:flex lg:w-1/2 bg-[#10B981] text-white p-12 flex-col justify-between relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-br from-[#059669] to-[#10B981] opacity-90 z-0" />
 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
 
 <div className="relative z-10">
 <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity w-fit">
 <div className="w-10 h-10 rounded-lg bg-surface/20 flex items-center justify-center">
 <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
 track_changes
 </span>
 </div>
 <span className="font-bold text-2xl text-white tracking-tight">grindboard.dev</span>
 </Link>
 <h2 className="text-4xl font-display-xl tracking-tight leading-tight mb-8">
 The inner circle for top-tier engineers.
 </h2>
 <div className="space-y-6 text-white/90 text-lg font-medium">
 <div className="flex items-start gap-4">
 <span className="material-symbols-outlined mt-1 text-[#FEF3C7]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
 <p>Keep accountability with top competitive programmers.</p>
 </div>
 <div className="flex items-start gap-4">
 <span className="material-symbols-outlined mt-1 text-[#DBEAFE]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
 <p>Get advice and mentorship from engineers at FAANG.</p>
 </div>
 <div className="flex items-start gap-4">
 <span className="material-symbols-outlined mt-1 text-[#F3E8FF]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
 <p>Participate in contests together and dominate.</p>
 </div>
 <div className="flex items-start gap-4">
 <span className="material-symbols-outlined mt-1 text-[#DCFCE7]" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
 <p>Earn direct referrals by proving your consistency.</p>
 </div>
 </div>
 </div>
 
  <div className="relative z-10 bg-surface/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 mt-12">
  <p className="italic mb-4 text-white/90">"I built this platform because preparing alone is hard. Grinding with an elite community is how you actually crack top-tier companies. Don't grind in silence."</p>
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white overflow-hidden border border-white/30">
    <img src="/creator_avatar.jpeg" alt="Abhishek Gupta" className="w-full h-full object-cover" />
  </div>
  <div>
  <div className="font-bold text-sm">Abhishek Gupta</div>
  <div className="text-xs text-white/70">Founder, Grindboard</div>
  </div>
  </div>
  </div>
 </div>

 {/* Right Side - Form */}
 <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background transition-colors">
 <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-sm border border-outline transition-colors">
 <h1 className="mb-2 text-2xl font-bold text-on-background ">
 Welcome to Grindboard
 </h1>
  <p className="mb-8 text-sm text-on-surface-variant ">
    {isSettingNewPassword ? "Set a new password to secure your account." : 
     awaitingResetOtp ? "Verify the code sent to your email." : 
     isForgotPassword ? "Enter your email to receive a recovery code." : 
     isSignUp ? "Create an account to join the elite." : 
     "Sign in to resume your grind."}
  </p>

 {error && (
 <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
 {error}
 </div>
 )}

  {isSettingNewPassword ? (
    <form onSubmit={handleUpdateRecoveredPassword} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={resetNewPassword}
            onChange={(e) => setResetNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 pr-10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-on-background"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Confirm New Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={resetConfirmPassword}
            onChange={(e) => setResetConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 pr-10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-on-background"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-bold text-white transition-all hover:bg-[#059669] hover:shadow-md hover:-translate-y-0.5 mt-2"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  ) : awaitingResetOtp ? (
    <form onSubmit={handleVerifyResetOtp} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">6-Digit Code</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="000000"
          className="w-full text-center tracking-[0.5em] font-mono text-2xl rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
          required
          maxLength={6}
        />
        <p className="text-xs text-on-surface-variant mt-3">
          We've sent a password reset code to <strong>{email}</strong>. Please enter it above.
        </p>
      </div>
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-bold text-white transition-all hover:bg-[#059669] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 mt-2"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => { setAwaitingResetOtp(false); setIsForgotPassword(false); }}
          className="text-sm font-bold text-on-surface-variant hover:text-on-background transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  ) : isForgotPassword ? (
    <form onSubmit={handleSendResetOtp} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading || !email}
        className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-bold text-white transition-all hover:bg-[#059669] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 mt-2"
      >
        {loading ? "Sending..." : "Send Reset Code"}
      </button>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setIsForgotPassword(false)}
          className="text-sm font-bold text-on-surface-variant hover:text-on-background transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  ) : awaitingOtp ? (
 <form onSubmit={handleVerifyOtp} className="space-y-4">
 <div>
 <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">6-Digit Code</label>
 <input
 type="text"
 value={otp}
 onChange={(e) => setOtp(e.target.value)}
 placeholder="000000"
 className="w-full text-center tracking-[0.5em] font-mono text-2xl rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
 required
 maxLength={6}
 />
 <p className="text-xs text-on-surface-variant mt-3">
 We've sent a verification code to <strong>{email}</strong>. Please enter it above.
 </p>
 </div>
 <button
 type="submit"
 disabled={loading || otp.length !== 6}
 className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-bold text-white transition-all hover:bg-[#059669] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none mt-2"
 >
 {loading ? "Verifying..." : "Verify & Join"}
 </button>
 <div className="text-center mt-4">
 <button
 type="button"
 onClick={() => setAwaitingOtp(false)}
 className="text-sm font-bold text-on-surface-variant hover:text-on-background transition-colors"
 >
 Back to Sign Up
 </button>
 </div>
 </form>
 ) : (
 <>
 <form onSubmit={handleAuth} className="space-y-4">
 <div>
 <label className="mb-1.5 block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="your@email.com"
 className="w-full rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
 required
 />
 </div>
  <div>
    <div className="flex justify-between items-center mb-1.5">
      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
      {!isSignUp && (
        <button
          type="button"
          onClick={() => setIsForgotPassword(true)}
          className="text-xs font-bold text-[#10B981] hover:text-[#059669] transition-colors"
        >
          Forgot password?
        </button>
      )}
    </div>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full rounded-lg bg-surface text-on-background border border-outline px-4 py-2.5 pr-10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-colors outline-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-on-background"
        tabIndex={-1}
      >
        <span className="material-symbols-outlined text-[20px]">
          {showPassword ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full rounded-lg bg-[#10B981] px-4 py-3 font-bold text-white transition-all hover:bg-[#059669] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none mt-2"
 >
 {loading ? "Please wait..." : isSignUp ? "Claim Your Spot" : "Sign In to Grind"}
 </button>
 </form>

 <div className="relative my-8">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-outline "></div>
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="bg-surface px-4 text-on-surface-variant ">or continue with</span>
 </div>
 </div>

 <button
 type="button"
 onClick={handleGithubSignIn}
 className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline bg-surface px-4 py-3 font-bold text-on-background transition-all hover:bg-gray-50 dark:hover:bg-surface/5"
 >
 Continue with GitHub
 </button>

  <p className="mt-8 text-center text-sm text-on-surface-variant ">
    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
    <button
      type="button"
      onClick={() => {
        setIsSignUp(!isSignUp);
        setIsForgotPassword(false);
        setAwaitingOtp(false);
        setAwaitingResetOtp(false);
        setIsSettingNewPassword(false);
        setOtp("");
      }}
      className="font-bold text-[#10B981] hover:text-[#059669] transition-colors"
    >
      {isSignUp ? "Sign In" : "Sign Up"}
    </button>
  </p>
 </>
 )}


 </div>
 </div>
 </div>
 );
}
