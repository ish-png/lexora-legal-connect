import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Video, Phone, Users, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { LawyerProfile } from "../../types.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { useToast } from "../../context/ToastContext.tsx";
import { api } from "../../services/api.ts";
import { useNavigate } from "react-router-dom";

interface ConsultationModalProps {
  lawyer: LawyerProfile | null;
  initialCategory?: string;
  initialDescription?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  lawyer,
  initialCategory,
  initialDescription,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isAuthenticated, quickDemoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [category, setCategory] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredTime, setPreferredTime] = useState<string>("10:00 AM");
  const [mode, setMode] = useState<"Video Call" | "Phone Call" | "In-Person">("Video Call");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (lawyer) {
      setCategory(initialCategory || lawyer.categories[0] || "Civil Law");
      setMode(lawyer.consultationModes[0] || "Video Call");
    }
    if (initialDescription) {
      setProblemDescription(initialDescription);
    }
    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split("T")[0]);
    setSubmittedSuccess(false);
  }, [lawyer, initialCategory, initialDescription, isOpen]);

  if (!isOpen || !lawyer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast("Please sign in or use a demo account to submit a request.", "error");
      return;
    }

    if (!problemDescription.trim() || problemDescription.trim().length < 10) {
      showToast("Please provide a more detailed problem description (at least 10 characters).", "error");
      return;
    }

    if (!preferredDate) {
      showToast("Please choose a preferred consultation date.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.requestConsultation({
        lawyerId: lawyer._id,
        category,
        problemDescription: problemDescription.trim(),
        preferredDate,
        preferredTime,
        mode,
        notes: notes.trim(),
      });

      if (res.success) {
        setSubmittedSuccess(true);
        showToast("Consultation request submitted successfully!", "success");
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to submit consultation request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickClientLogin = async () => {
    try {
      await quickDemoLogin("client");
      showToast("Logged in as Demo Client: Sarah Jenkins", "success");
    } catch {
      showToast("Quick login failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={lawyer.avatarUrl}
              alt={lawyer.name}
              className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">{lawyer.name}</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-400/30">
                  Demo
                </span>
              </div>
              <p className="text-xs text-slate-300">{lawyer.specialization} • ${lawyer.consultationFee}/consult</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Consultation Request Submitted!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your request has been forwarded to <strong>{lawyer.name}</strong>. You can track this request and view next steps from your Client Dashboard.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/dashboard/client");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  View in Dashboard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isAuthenticated && (
                <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold block">Sign in required to request consultation</span>
                    <span className="text-xs text-amber-800">You can use your account or log in with one click as Demo Client.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickClientLogin}
                    className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-xs"
                  >
                    1-Click Demo Client
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Legal Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Applicable Legal Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {lawyer.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Describe Your Situation / Inquiry *
                  </label>
                  <textarea
                    rows={3}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Briefly state key facts, timeline, and what assistance you are looking for..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="text-[11px] text-slate-500">Do not include confidential secrets or credit card details.</span>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Time *
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Consultation Mode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Consultation Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {lawyer.consultationModes.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-xl border transition-colors ${
                          mode === m
                            ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {m === "Video Call" && <Video className="w-3.5 h-3.5" />}
                        {m === "Phone Call" && <Phone className="w-3.5 h-3.5" />}
                        {m === "In-Person" && <Users className="w-3.5 h-3.5" />}
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Additional Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Can provide copy of notice before call"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Legal Non-engagement Disclaimer */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                  <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Submitting this form notifies the lawyer of your interest. It does not establish a formal attorney-client relationship until both parties execute an engagement letter.
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
