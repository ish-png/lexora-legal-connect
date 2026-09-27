import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Scale, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, Shield, Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.tsx";
import { useToast } from "../../context/ToastContext.tsx";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/auth";
    if (user.role === "lawyer") return "/dashboard/lawyer";
    if (user.role === "admin") return "/dashboard/admin";
    return "/dashboard/client";
  };

  const handleQuickLogin = async (role: "client" | "lawyer" | "admin") => {
    setDemoMenuOpen(false);
    try {
      await quickDemoLogin(role);
      showToast(`Switched to Demo ${role.toUpperCase()}: ${role === "client" ? "Sarah Jenkins" : role === "lawyer" ? "Adv. Marcus Vance" : "Admin"}`, "success");
      if (role === "client") navigate("/dashboard/client");
      else if (role === "lawyer") navigate("/dashboard/lawyer");
      else navigate("/dashboard/admin");
    } catch {
      showToast("Demo login failed. Please try again.", "error");
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Signed out successfully.", "info");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Disclaimer Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>Educational Demo:</strong> This platform provides general legal information and lawyer discovery. It does not provide legal advice.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-colors">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Legal<span className="text-blue-600">Connect</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">LegalTech Directory</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/lawyers"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/lawyers") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Find a Lawyer
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/categories") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Legal Categories
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/how-it-works") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/for-lawyers"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/for-lawyers") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              For Lawyers
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Demo Quick Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                title="Quickly test with demo roles"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Demo Login
                  </div>
                  <button
                    onClick={() => handleQuickLogin("client")}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">Demo Client</div>
                      <div className="text-xs text-slate-500">Sarah Jenkins (Deposit dispute)</div>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">Client</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin("lawyer")}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">Demo Lawyer</div>
                      <div className="text-xs text-slate-500">Adv. Marcus Vance (Property)</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">Lawyer</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin("admin")}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">Demo Admin</div>
                      <div className="text-xs text-slate-500">Full platform management</div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-medium">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated State */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Dashboard</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/lawyers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Find a Lawyer
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Legal Categories
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </Link>
          <Link
            to="/for-lawyers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            For Lawyers
          </Link>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Quick Demo Login</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickLogin("client");
                }}
                className="px-2 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
              >
                Demo Client
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickLogin("lawyer");
                }}
                className="px-2 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
              >
                Demo Lawyer
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuickLogin("admin");
                }}
                className="px-2 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg border border-purple-200"
              >
                Demo Admin
              </button>
            </div>

            {isAuthenticated ? (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white"
                >
                  Open Dashboard ({user?.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-rose-600 bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
