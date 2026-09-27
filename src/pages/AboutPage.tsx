import React from "react";
import { Link } from "react-router-dom";
import { Scale, ShieldAlert, Sparkles, BookOpen, Lock, CheckCircle2 } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">About LegalConnect</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          A modern educational demonstration platform showcasing AI-assisted legal categorization, practitioner discovery, and client matter management.
        </p>
      </div>

      {/* Prominent Legal Disclaimer Callout */}
      <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 space-y-3 text-amber-950">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Platform Legal Notice & Disclaimer</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
          This platform provides general legal information and lawyer discovery services. It does not provide legal advice.
          The artificial intelligence classification feature is an educational discovery aid designed solely to suggest potential practice areas.
          It does not evaluate case merits, predict legal outcomes, or create an attorney-client relationship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Practice Area Matching</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            LegalConnect leverages Google Gemini API on the backend to parse user inquiries into standardized legal categories such as Property Law, Employment Law, or Corporate Law, while guarding against definitive legal advice.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Secure Role-Based Architecture</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Featuring JWT session authentication and role-based access control across Clients, verified Lawyers, and Administrators, with automated case milestone tracking and document exchange.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
        >
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
