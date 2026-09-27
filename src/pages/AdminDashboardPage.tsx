import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderOpen,
  Scale,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { api } from "../services/api.ts";
import { User, LawyerProfile, LegalCategoryInfo } from "../types.ts";
import { useToast } from "../context/ToastContext.tsx";

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalLawyers: 0,
    pendingApprovals: 0,
    totalConsultations: 0,
    activeCases: 0,
  });

  const [usersList, setUsersList] = useState<User[]>([]);
  const [lawyersList, setLawyersList] = useState<LawyerProfile[]>([]);
  const [categoriesList, setCategoriesList] = useState<LegalCategoryInfo[]>([]);
  const [activeTab, setActiveTab] = useState<"lawyers" | "users" | "categories">("lawyers");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/auth");
    }
  }, [isAuthenticated, user, authLoading]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [resStats, resUsers, resLawyers, resCats] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getLawyers(),
        api.getCategories(),
      ]);

      if (resStats.success) setStats(resStats.stats);
      if (resUsers.success) setUsersList(resUsers.users);
      if (resLawyers.success) setLawyersList(resLawyers.lawyers);
      if (resCats.success) setCategoriesList(resCats.categories);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      loadAdminData();
    }
  }, [isAuthenticated, user]);

  const handleLawyerVerification = async (lawyerId: string, status: "verified" | "rejected") => {
    try {
      const res = await api.setLawyerVerification(lawyerId, status);
      if (res.success) {
        showToast(`Lawyer status updated to '${status}'.`, "success");
        await loadAdminData();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update lawyer.", "error");
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await api.toggleUserStatus(userId, nextStatus);
      if (res.success) {
        showToast(`User status toggled to '${nextStatus}'.`, "info");
        await loadAdminData();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update user.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Super Admin Console
            </span>
            <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded font-bold">
              Root Permissions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Platform Operations</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Lawyer verification approvals, user moderation, legal category tracking, and system health.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</div>
          <span className="text-[11px] text-slate-500">Clients & Lawyers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Lawyers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalLawyers}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Directory profiles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.pendingApprovals}</div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting audit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consultations</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.totalConsultations}</div>
          <span className="text-[11px] text-blue-600 font-medium">Platform requests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cases</span>
          <div className="text-2xl font-black text-purple-600 mt-1">{stats.activeCases}</div>
          <span className="text-[11px] text-purple-600 font-medium">Ongoing matters</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("lawyers")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "lawyers" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500"
          }`}
        >
          Lawyer Verification ({lawyersList.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "users" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500"
          }`}
        >
          User Accounts ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "categories" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-slate-500"
          }`}
        >
          Practice Categories ({categoriesList.length})
        </button>
      </div>

      {/* TAB: Lawyers Verification */}
      {activeTab === "lawyers" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Attorney</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lawyersList.map((lawyer) => (
                  <tr key={lawyer._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={lawyer.avatarUrl}
                          alt={lawyer.name}
                          className="w-9 h-9 rounded-full object-cover bg-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{lawyer.name}</div>
                          <div className="text-[11px] text-slate-500">{lawyer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{lawyer.specialization}</td>
                    <td className="px-4 py-3 text-slate-600">{lawyer.location}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">${lawyer.consultationFee}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          lawyer.verificationStatus === "verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : lawyer.verificationStatus === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {lawyer.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lawyer.verificationStatus !== "verified" && (
                          <button
                            onClick={() => handleLawyerVerification(lawyer._id, "verified")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {lawyer.verificationStatus !== "rejected" && (
                          <button
                            onClick={() => handleLawyerVerification(lawyer._id, "rejected")}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: User Accounts */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            u.status === "active"
                              ? "text-rose-600 border border-rose-200 hover:bg-rose-50"
                              : "text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {u.status === "active" ? "Suspend" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Categories */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoriesList.map((cat) => (
            <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                  {cat.lawyerCount || 0} Lawyers
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
