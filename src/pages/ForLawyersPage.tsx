import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ShieldCheck,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Video,
} from "lucide-react";

export const ForLawyersPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Practice Growth for Legal Practitioners
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Connect with clients who need your exact legal expertise.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          LegalConnect matches people facing specific legal issues with qualified attorneys. Filter inquiries, accept bookings, manage case files, and share documents in a streamlined workspace.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/auth?mode=register&role=lawyer"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Join as an Attorney
          </Link>
          <Link
            to="/lawyers"
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
          >
            Explore Directory
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Pre-Categorized Leads</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our AI analysis matches inquiries with your declared practice areas so you only receive relevant case inquiries.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Custom Scheduling & Fees</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Set your own consultation rates and choose whether you offer video meetings, phone consultations, or in-person sessions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Full Case Progression Tracking</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Open dedicated client files, update milestones on a visual timeline, and share agreements and court records securely.
          </p>
        </div>
      </div>

      {/* Verification Process */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Quality Standards</span>
          <h2 className="text-2xl sm:text-3xl font-bold">Verification & Credential Audit</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every legal practitioner on LegalConnect is verified by platform administrators against state bar registers before appearing in public directory searches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Bar License Verification</h4>
              <p className="text-xs text-slate-400 mt-0.5">Proof of active bar standing in your jurisdiction.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Encrypted Document Exchange</h4>
              <p className="text-xs text-slate-400 mt-0.5">Secure client uploads directly into your matter dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
