import React, { useState } from "react";
import { UserProfile, registerUser, loginUser } from "@/lib/auth/store";
import { GoogleAccountPickerModal } from "./GoogleAccountPickerModal";
import { X, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";

interface AuthModalProps {
  mode?: "signin" | "signup";
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode = "signin",
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState(false);

  const handleGoogleClick = () => {
    setShowGoogleAccountPicker(true);
  };

  const handleSelectGoogleAccount = (googleUser: UserProfile) => {
    onSuccess(googleUser);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    let user: UserProfile;
    if (activeTab === "signup") {
      user = await registerUser(name || "New User", email);
    } else {
      user = await loginUser(email);
    }
    setIsLoading(false);
    onSuccess(user);
    onClose();
  };

  if (showGoogleAccountPicker) {
    return (
      <GoogleAccountPickerModal
        onClose={() => setShowGoogleAccountPicker(false)}
        onSelectAccount={handleSelectGoogleAccount}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeTab === "signin" ? "Welcome Back to MindMap AI" : "Create MindMap AI Account"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
                activeTab === "signin"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
                activeTab === "signup"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Continue with Google (Triggers Account Picker) */}
          <button
            onClick={handleGoogleClick}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-md group border border-slate-300 dark:border-slate-700"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-mono absolute">
              or use email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === "signup" && (
              <div>
                <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase">Full Name</label>
                <div className="relative mt-1">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase">Email Address</label>
              <div className="relative mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@mindmap.ai"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 uppercase">Password</label>
              <div className="relative mt-1">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{activeTab === "signin" ? "Sign In to Workspace" : "Create Account"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 text-center border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                const demoUser = loginUser("alex.rivera@gmail.com");
                demoUser.then((u) => {
                  onSuccess(u);
                  onClose();
                });
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors"
            >
              ⚡ Instant Demo Login as Alex Rivera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
