import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit3,
  Video,
  FileText,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Save,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { api } from "../services/api.ts";
import { ConsultationRequest, CaseItem, LawyerProfile, CaseStatus } from "../types.ts";
import { CaseTimeline } from "../components/cases/CaseTimeline.tsx";
import { DocumentManager } from "../components/documents/DocumentManager.tsx";
import { useToast } from "../context/ToastContext.tsx";

export const LawyerDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"requests" | "cases" | "clients" | "profile">("requests");
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [profile, setProfile] = useState<LawyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New Case Modal State
  const [newCaseModalOpen, setNewCaseModalOpen] = useState<boolean>(false);
  const [selectedConsultationForCase, setSelectedConsultationForCase] = useState<ConsultationRequest | null>(null);
  const [caseTitle, setCaseTitle] = useState<string>("");
  const [caseCategory, setCaseCategory] = useState<string>("");
  const [caseDescription, setCaseDescription] = useState<string>("");
  const [caseNextAction, setCaseNextAction] = useState<string>("Request lease agreement and bank deposit proof");

  // Profile Edit State
  const [editFee, setEditFee] = useState<number>(150);
  const [editBio, setEditBio] = useState<string>("");
  const [editSpecialization, setEditSpecialization] = useState<string>("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "lawyer")) {
      navigate("/auth");
    }
  }, [isAuthenticated, user, authLoading]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resCons, resCases, resMe] = await Promise.all([
        api.getMyConsultations(),
        api.getCases(),
        api.getMe(),
      ]);

      if (resCons.success) setConsultations(resCons.consultations);
      if (resCases.success) setCases(resCases.cases);
      if (resMe.success && resMe.user.lawyerProfile) {
        setProfile(resMe.user.lawyerProfile);
        setEditFee(resMe.user.lawyerProfile.consultationFee);
        setEditBio(resMe.user.lawyerProfile.bio);
        setEditSpecialization(resMe.user.lawyerProfile.specialization);
      }
    } catch (err) {
      console.error("Failed to load lawyer data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "lawyer") {
      loadData();
    }
  }, [isAuthenticated, user]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.updateConsultationStatus(id, newStatus);
      if (res.success) {
        showToast(`Request marked as '${newStatus}'`, "success");
        await loadData();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const handleOpenNewCaseModal = (consultation: ConsultationRequest) => {
    setSelectedConsultationForCase(consultation);
    setCaseTitle(`${consultation.category} - ${consultation.clientName}`);
    setCaseCategory(consultation.category);
    setCaseDescription(consultation.problemDescription);
    setNewCaseModalOpen(true);
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultationForCase) return;

    try {
      const res = await api.createCase({
        clientId: selectedConsultationForCase.clientId,
        title: caseTitle.trim(),
        category: caseCategory,
        description: caseDescription.trim(),
        nextAction: caseNextAction.trim(),
      });

      if (res.success) {
        showToast("Case file opened successfully!", "success");
        setNewCaseModalOpen(false);
        await loadData();
        setActiveTab("cases");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to create case", "error");
    }
  };

  const handleUpdateCaseStatus = async (caseId: string, status: CaseStatus, nextAction?: string) => {
    try {
      const res = await api.updateCase(caseId, { status, nextAction });
      if (res.success) {
        showToast(`Case status updated to ${status}`, "success");
        await loadData();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update case", "error");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const res = await api.updateLawyerProfile(profile._id, {
        consultationFee: editFee,
        bio: editBio,
        specialization: editSpecialization,
      });

      if (res.success) {
        showToast("Profile settings saved successfully!", "success");
        setProfile(res.lawyer);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    }
  };

  const pendingRequests = consultations.filter((c) => c.status === "Pending");
  const acceptedRequests = consultations.filter((c) => c.status === "Accepted");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl border border-slate-200 object-cover bg-slate-50"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Lawyer Practice Workspace
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Verified Counsel
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h1>
            <p className="text-xs text-slate-500">
              {profile?.specialization || "Practicing Attorney"} • ${profile?.consultationFee || 150} / consultation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("requests")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Review Pending ({pendingRequests.length})
          </button>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Inquiries</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingRequests.length}</div>
          <span className="text-[11px] text-slate-500">Requires response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Sessions</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{acceptedRequests.length}</div>
          <span className="text-[11px] text-slate-500">Confirmed consultations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Client Cases</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{cases.length}</div>
          <span className="text-[11px] text-slate-500">Managed case files</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Consultations</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{consultations.length}</div>
          <span className="text-[11px] text-slate-500">All-time volume</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "requests" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500"
          }`}
        >
          Consultation Inquiries ({consultations.length})
        </button>
        <button
          onClick={() => setActiveTab("cases")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "cases" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500"
          }`}
        >
          Case Files & Documents ({cases.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "profile" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500"
          }`}
        >
          Profile & Practice Settings
        </button>
      </div>

      {/* TAB: Consultation Inquiries */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <p className="text-sm text-slate-500">No consultation inquiries received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-base text-slate-900">{req.clientName}</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {req.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          req.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : req.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      "{req.problemDescription}"
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="font-medium text-slate-700">
                        Date: {req.preferredDate} ({req.preferredTime})
                      </span>
                      <span>Format: {req.mode}</span>
                      <span>Contact: {req.clientEmail} • {req.clientPhone || "No phone"}</span>
                    </div>

                    {req.meetingLink && (
                      <div className="text-xs text-blue-600 font-semibold">
                        Meeting Link: <a href={req.meetingLink} target="_blank" rel="noreferrer" className="underline">{req.meetingLink}</a>
                      </div>
                    )}
                  </div>

                  {/* Actions for Lawyer */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req._id, "Accepted")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req._id, "Rejected")}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {req.status === "Accepted" && (
                      <>
                        <button
                          onClick={() => handleOpenNewCaseModal(req)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Open Case File</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req._id, "Completed")}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                        >
                          Mark Completed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Cases & Timeline Management */}
      {activeTab === "cases" && (
        <div className="space-y-6">
          {cases.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Active Case Files Opened</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Accept a consultation request above and click "Open Case File" to track an ongoing legal matter.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cases.map((cs) => (
                <div key={cs._id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  {/* Case Header & Status Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">{cs.title}</h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {cs.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Client: <strong>{cs.clientName}</strong> • {cs.category} • File Created: {new Date(cs.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-slate-500">Update Phase:</label>
                      <select
                        value={cs.status}
                        onChange={(e) => handleUpdateCaseStatus(cs._id, e.target.value as CaseStatus)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="New">New File</option>
                        <option value="Consultation">Consultation Done</option>
                        <option value="Waiting for Documents">Waiting for Documents</option>
                        <option value="Active">Case Active / In Litigation</option>
                        <option value="Closed">Matter Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary & Next Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Matter Summary
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">{cs.description}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                        Current Milestone / Next Action
                      </span>
                      <p className="text-xs text-amber-950 font-medium">{cs.nextAction}</p>
                    </div>
                  </div>

                  {/* Timeline Progression */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Milestone Timeline Progression
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <CaseTimeline timeline={cs.timeline} currentStatus={cs.status} />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="pt-4 border-t border-slate-100">
                    <DocumentManager caseId={cs._id} canUpload={true} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Lawyer Profile Settings */}
      {activeTab === "profile" && profile && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Lawyer Profile & Practice Preferences</h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization Headline</label>
              <input
                type="text"
                value={editSpecialization}
                onChange={(e) => setEditSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                min="50"
                max="1000"
                step="10"
                value={editFee}
                onChange={(e) => setEditFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio & Experience</label>
              <textarea
                rows={5}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Practice Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* Create Case Modal */}
      {newCaseModalOpen && selectedConsultationForCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Open Case File for {selectedConsultationForCase.clientName}
            </h3>
            <p className="text-xs text-slate-500">
              Create an official matter file with milestone timeline tracking.
            </p>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Case Title</label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={caseCategory}
                  onChange={(e) => setCaseCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Matter Description</label>
                <textarea
                  rows={3}
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Immediate Next Action</label>
                <input
                  type="text"
                  value={caseNextAction}
                  onChange={(e) => setCaseNextAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewCaseModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Confirm & Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
