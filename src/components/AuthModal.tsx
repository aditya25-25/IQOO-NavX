import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Cloud,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { authService } from '../services/supabase/authService';
import { User } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await authService.signUp(email.trim(), password);
        if (error) {
          setErrorMessage(error);
        } else {
          if (data?.session) {
            setSuccessMessage('Account created and signed in successfully!');
            onAuthSuccess(data.user);
            setTimeout(() => onClose(), 1200);
          } else {
            setSuccessMessage('Sign-up submitted! If confirmation is required, please check your email.');
          }
        }
      } else {
        const { data, error } = await authService.signIn(email.trim(), password);
        if (error) {
          setErrorMessage(error);
        } else if (data?.user) {
          setSuccessMessage(`Welcome back, ${data.user.email?.split('@')[0]}!`);
          onAuthSuccess(data.user);
          setTimeout(() => onClose(), 1000);
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await authService.signOut();
    if (error) {
      setErrorMessage(error);
    } else {
      onAuthSuccess(null);
      setSuccessMessage('Signed out successfully.');
      setTimeout(() => onClose(), 800);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#111315] border border-[#2B2F33] rounded-3xl p-5 shadow-2xl space-y-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#191C1F] text-[#A4A9AE] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/30 text-[#FFD400]">
            <Cloud size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7F8] font-display">
              {currentUser ? 'Supabase Account' : isSignUp ? 'Create NavX Account' : 'Sign In to IQOO NavX'}
            </h2>
            <p className="text-[11px] text-[#A4A9AE]">
              {currentUser ? 'Connected to cloud sync' : 'Sync saved places & preferences'}
            </p>
          </div>
        </div>

        {/* User is Already Logged In */}
        {currentUser ? (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33] space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#22C55E] font-semibold">
                <ShieldCheck size={16} />
                <span>Cloud Sync Active (RLS Protected)</span>
              </div>
              <div className="text-xs text-[#F5F7F8] font-mono flex items-center gap-2">
                <UserIcon size={14} className="text-[#A4A9AE]" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="text-[10px] text-[#A4A9AE]">
                User ID: <span className="font-mono text-[9px]">{currentUser.id}</span>
              </div>
            </div>

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/40 text-[#EF4444] font-bold text-xs flex items-center justify-center gap-2 transition-colors font-display"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Authentication Form (Sign In / Sign Up) */
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#A4A9AE] block tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F757B]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#191C1F] border border-[#2B2F33] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none focus:border-[#FFD400]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#A4A9AE] block tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F757B]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#191C1F] border border-[#2B2F33] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F5F7F8] placeholder-[#6F757B] focus:outline-none focus:border-[#FFD400]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6bf00] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-colors font-display shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus size={15} />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-[#A4A9AE] hover:text-[#FFD400] transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
