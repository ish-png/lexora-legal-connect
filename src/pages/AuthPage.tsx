import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Scale, Sparkles, User, Briefcase, Shield, ArrowRight, Lock, Mail, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { useToast } from "../context/ToastContext.tsx";

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, quickDemoLogin, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const isRegisterMode = searchParams.get("mode") === "register";
  const initialRole = (searchParams.get("role") as "client" | "lawyer") || "client";

  const [mode, setMode] = useState<"login" | "register">(isRegisterMode ? "register" : "login");
  const [role, setRole] = useState<"client" | "lawyer">(initialRole);

  // Form states
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Lawyer extra fields
  const [specialization, setSpecialization] = useState<string>("Property & Real Estate Law");
  const [experience, setExperience] = useState<number>(5);
  const [location, setLocation] = useState<string>("New York, NY");
  const [consultationFee, setConsultationFee] = useState<number>(150);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    if (user.role === "lawyer") navigate("/dashboard/lawyer");
    else if (user.role === "admin") navigate("/dashboard/admin");
    else navigate("/dashboard/client");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        showToast("Welcome back!", "success");
      } else {
        await register({
          name,
          email,
          phone,
          password,
          role,
          specialization: role === "lawyer" ? specialization : undefined,
          experience: role === "lawyer" ? experience : undefined,
          location: role === "lawyer" ? location : undefined,
          consultationFee: role === "lawyer" ? consultationFee : undefined,
        });
        showToast("Account created successfully!", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Authentication failed. Check your credentials.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole: "client" | "lawyer" | "admin") => {
    setIsSubmitting(true);
    try {
      await quickDemoLogin(demoRole);
      showToast(`Logged in as Demo ${demoRole.toUpperCase()}`, "success");
    } catch {
      showToast("Demo login failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-md">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {mode === "login" ? "Sign in to LegalConnect" : "Create your LegalConnect account"}
        </h1>
        <p className="text-xs text-slate-500">
          Access your consultation requests, case files, and client documents.
        </p>
      </div>

      {/* 1-Click Demo Login Box */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Quick Evaluation (1-Click Demo Login)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickDemo("client")}
            className="py-2 px-2 text-xs font-semibold bg-white hover:bg-amber-100/50 text-slate-800 rounded-xl border border-amber-200 shadow-2xs transition-colors text-center"
          >
            Demo Client
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickDemo("lawyer")}
            className="py-2 px-2 text-xs font-semibold bg-white hover:bg-amber-100/50 text-slate-800 rounded-xl border border-amber-200 shadow-2xs transition-colors text-center"
          >
            Demo Lawyer
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickDemo("admin")}
            className="py-2 px-2 text-xs font-semibold bg-white hover:bg-amber-100/50 text-slate-800 rounded-xl border border-amber-200 shadow-2xs transition-colors text-center"
          >
            Demo Admin
          </button>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        {/* Toggle Mode */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Role Picker if Registering */}
        {mode === "register" && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors ${
                  role === "client"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Client / User</div>
                  <div className="text-[11px] text-slate-500">Looking for legal counsel</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("lawyer")}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-colors ${
                  role === "lawyer"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Briefcase className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Attorney / Lawyer</div>
                  <div className="text-[11px] text-slate-500">Provide legal consultations</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "lawyer" ? "Adv. Jane Doe" : "Jane Doe"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password *</label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Lawyer-Specific Fields on Register */}
          {mode === "register" && role === "lawyer" && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Lawyer Practice Profile Setup
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Primary Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Years of Exp.</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Session Fee ($)</label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="10"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Please wait...</span>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Complete Registration"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <h4 className="text-base font-bold text-slate-900">Demo Password Reset</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In this demo deployment, all pre-seeded accounts can be accessed using:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-800 text-left space-y-1">
              <div><strong>Clients:</strong> password123</div>
              <div><strong>Lawyers:</strong> lawyer123</div>
              <div><strong>Admin:</strong> admin123</div>
            </div>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
