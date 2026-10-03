import React, { useState } from "react";
import { UserProfile, setCurrentUser } from "@/lib/auth/store";
import { X, User } from "lucide-react";

interface GoogleAccountPickerModalProps {
  onClose: () => void;
  onSelectAccount: (user: UserProfile) => void;
}

export const PRESET_GOOGLE_ACCOUNTS: UserProfile[] = [
  {
    id: "user-google-alex",
    name: "Alex Rivera",
    email: "alex.rivera@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-google-[#1]",
    name: "Demo Student Account",
    email: "student@university.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString()
  }
];

export const GoogleAccountPickerModal: React.FC<GoogleAccountPickerModalProps> = ({
  onClose,
  onSelectAccount
}) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  const handleChoose = (acc: UserProfile) => {
    setCurrentUser(acc);
    onSelectAccount(acc);
    onClose();
  };

  const handleCreateCustomGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const newGoogleUser: UserProfile = {
      id: `user-google-${Date.now()}`,
      name: customName || customEmail.split("@")[0],
      email: customEmail.includes("@") ? customEmail : `${customEmail}@gmail.com`,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newGoogleUser);
    onSelectAccount(newGoogleUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121316] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 relative font-sans">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Account Rows List */}
          <div className="space-y-0 divide-y divide-slate-800/80">
            {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleChoose(acc)}
                className="w-full text-left py-3.5 px-2 hover:bg-slate-800/50 transition-colors flex items-center gap-4 group rounded-xl"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {acc.avatar ? (
                    <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                  ) : (
                    acc.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-base text-white tracking-wide truncate">
                    {acc.name}
                  </div>
                  <div className="text-sm text-slate-400 font-normal truncate">
                    {acc.email}
                  </div>
                </div>
              </button>
            ))}

            {/* "Use another account" Form */}
            {showAddCustom ? (
              <form onSubmit={handleCreateCustomGoogle} className="py-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Enter Google Account Email</div>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Full Name (e.g. Alex Rivera)"
                  className="w-full bg-[#1c1d22] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[#1c1d22] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddCustom(true)}
                className="w-full text-left py-4 px-2 hover:bg-slate-800/50 transition-colors flex items-center gap-4 text-white text-base font-semibold group rounded-xl"
              >
                <div className="w-9 h-9 rounded-full border border-slate-600 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <span>Use another account</span>
              </button>
            )}
          </div>

          <div className="border-t border-slate-800/80 pt-6">
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Before using this app, you can review MindMap AI's{" "}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-400 hover:underline font-semibold">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-400 hover:underline font-semibold">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
