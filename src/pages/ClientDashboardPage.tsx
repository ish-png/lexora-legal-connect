import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { api } from "../services/api.ts";
import { ConsultationRequest, CaseItem, ConsultationStatus } from "../types.ts";
import { CaseTimeline } from "../components/cases/CaseTimeline.tsx";
import { DocumentManager } from "../components/documents/DocumentManager.tsx";
import { useToast } from "../context/ToastContext.tsx";

export const ClientDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "consultations" | "cases" | "documents">("overview");
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resCons, resCases] = await Promise.all([
        api.getMyConsultations(),
        api.getCases(),
      ]);

      if (resCons.success) setConsultations(resCons.consultations);
      if (resCases.success) {
        setCases(resCases.cases);
        if (resCases.cases.length > 0 && !selectedCase) {
          setSelectedCase(resCases.cases[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load client data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleCancelConsultation = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this consultation request?")) return;
    try {
      const res = await api.updateConsultationStatus(id, "Cancelled");
      if (res.success) {
        showToast("Consultation request cancelled.", "info");
        await loadData();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to cancel request.", "error");
    }
  };

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case "Pending":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>;
      case "Accepted":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Accepted</span>;
      case "Rejected":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Declined</span>;
      case "Completed":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Completed</span>;
      case "Cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">Cancelled</span>;
    }
  };

  const pendingCount = consultations.filter((c) => c.status === "Pending").length;
  const acceptedCount = consultations.filter((c) => c.status === "Accepted").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Client Portal</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              Account Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor consultation requests, review case file progressions, and access your legal documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/lawyers"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find an Attorney</span>
          </Link>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Requests</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{pendingCount}</div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting lawyer response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Consults</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{acceptedCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Scheduled & confirmed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Case Files</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{cases.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Under active counsel</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Interactions</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{consultations.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Historical records</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Consultation Requests ({consultations.length})
        </button>
        <button
          onClick={() => setActiveTab("cases")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "cases"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          My Cases & Timeline ({cases.length})
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "documents"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Legal Documents
        </button>
      </div>

      {/* Tab: Consultations Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading consultation requests...</div>
          ) : consultations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Consultation Requests Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Search our network of verified attorneys to submit an inquiry or schedule an introductory session.
              </p>
              <Link
                to="/lawyers"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs"
              >
                <span>Browse Lawyers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">{c.lawyerName}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {c.category}
                      </span>
                      {getStatusBadge(c.status)}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      "{c.problemDescription}"
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {c.preferredDate} at {c.preferredTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-blue-500" />
                        {c.mode}
                      </span>
                      <span className="text-slate-400">
                        Requested: {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {c.meetingLink && c.status === "Accepted" && (
                      <div className="pt-2">
                        <a
                          href={c.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Join Video Consultation Room</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.status === "Pending" && (
                      <button
                        onClick={() => handleCancelConsultation(c._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                      >
                        Cancel Request
                      </button>
                    )}
                    <Link
                      to={`/lawyers/${c.lawyerId}`}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                    >
                      View Lawyer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Cases & Timeline */}
      {activeTab === "cases" && (
        <div className="space-y-6">
          {cases.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Active Case Files</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When a lawyer accepts your consultation and opens a case file, you will be able to track every stage of the matter here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Case selector list */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Select Case File
                </span>
                {cases.map((cs) => (
                  <button
                    key={cs._id}
                    onClick={() => setSelectedCase(cs)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedCase?._id === cs._id
                        ? "border-blue-600 bg-blue-50/50 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{cs.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {cs.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{cs.lawyerName} • {cs.category}</p>
                  </button>
                ))}
              </div>

              {/* Case Details & Timeline Viewer */}
              {selectedCase && (
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{selectedCase.title}</h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {selectedCase.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Represented by: <strong>{selectedCase.lawyerName}</strong> • {selectedCase.category}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Case Description</h3>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedCase.description}
                    </p>
                  </div>

                  {selectedCase.nextAction && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <span className="font-bold block mb-0.5">Next Required Action:</span>
                      <span>{selectedCase.nextAction}</span>
                    </div>
                  )}

                  {/* Interactive Visual Timeline */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Case Progression Timeline
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <CaseTimeline
                        timeline={selectedCase.timeline}
                        currentStatus={selectedCase.status}
                      />
                    </div>
                  </div>

                  {/* Case Documents Section */}
                  <div className="pt-4 border-t border-slate-100">
                    <DocumentManager caseId={selectedCase._id} canUpload={true} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: General Legal Documents */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <DocumentManager canUpload={true} />
        </div>
      )}
    </div>
  );
};
