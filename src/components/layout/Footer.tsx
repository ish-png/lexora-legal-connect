import React from "react";
import { Link } from "react-router-dom";
import { Scale, ShieldAlert, Sparkles, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Scale className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Legal<span className="text-blue-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering individuals and businesses to discover specialized legal professionals and schedule transparent consultations.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              © {new Date().getFullYear()} LegalConnect. Educational / Demo Platform.
            </div>
          </div>

          {/* Quick Practice Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Practice Areas</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/lawyers?category=Property%20Law" className="hover:text-white transition-colors">
                  Property & Tenancy
                </Link>
              </li>
              <li>
                <Link to="/lawyers?category=Corporate%20%26%20Business%20Law" className="hover:text-white transition-colors">
                  Corporate & Business
                </Link>
              </li>
              <li>
                <Link to="/lawyers?category=Divorce%20%26%20Family%20Law" className="hover:text-white transition-colors">
                  Family & Divorce
                </Link>
              </li>
              <li>
                <Link to="/lawyers?category=Employment%20%26%20Labour%20Law" className="hover:text-white transition-colors">
                  Employment & Labor
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  View All 14 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/lawyers" className="hover:text-white transition-colors">
                  Browse Lawyers
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How Consultation Works
                </Link>
              </li>
              <li>
                <Link to="/for-lawyers" className="hover:text-white transition-colors">
                  Join as a Lawyer
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethics & Demo Notice */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Compliance & Ethics</h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Non-Advisory Platform</span>
              </div>
              <p>
                LegalConnect does not operate as a law firm and does not provide legal representation. AI issue categorization is purely assistive.
              </p>
            </div>
          </div>
        </div>

        {/* Highlighted Mandatory Regulatory Disclaimer */}
        <div className="pt-8 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed flex flex-col md:flex-row items-start md:items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-400 font-bold tracking-wide shrink-0 border border-amber-800/50">
              IMPORTANT LEGAL NOTICE
            </span>
            <p className="flex-1">
              This platform provides general legal information and lawyer discovery services. It does not provide legal advice, predictions, guarantees, or claims about case outcomes. The artificial intelligence assistant does not act as a licensed attorney. All attorney credentials displayed on this demonstration deployment are simulated demo profiles.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
