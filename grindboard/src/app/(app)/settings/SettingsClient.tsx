"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SettingsClient({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-4">
      <header className="mb-8">
        <h1 className="font-display-lg text-3xl font-black tracking-tight text-on-background">
          Settings
        </h1>
        <p className="text-on-surface-variant font-label-mono mt-1">
          Manage your account preferences
        </p>
      </header>

      <div className="bg-surface border border-outline shadow-panel rounded-xl p-6">
        <h2 className="font-headline-lg-mobile text-on-background tracking-tight mb-4 border-b border-outline pb-2">
          Account Details
        </h2>
        <div className="mb-4">
          <label className="block text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input 
            type="email" 
            value={email} 
            disabled 
            className="w-full bg-surface-container border border-outline rounded p-2 text-sm text-on-surface-variant cursor-not-allowed font-label-mono"
          />
        </div>
      </div>

      <div className="bg-surface border border-outline shadow-panel rounded-xl p-6">
        <h2 className="font-headline-lg-mobile text-on-background tracking-tight mb-4 border-b border-outline pb-2">
          Security
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-label-mono border border-red-200">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm font-label-mono border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">
              New Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-outline focus:border-primary rounded p-2 text-sm text-on-background focus:outline-none transition-colors"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-background border border-outline focus:border-primary rounded p-2 text-sm text-on-background focus:outline-none transition-colors"
              placeholder="Confirm new password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !password || !confirmPassword}
            className="bg-primary text-white font-label-mono text-sm px-4 py-2 rounded hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
