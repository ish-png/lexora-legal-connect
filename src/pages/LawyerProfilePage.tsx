import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Clock,
  Video,
  Phone,
  Users,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  Shield,
  Send,
  DollarSign,
} from "lucide-react";
import { api } from "../services/api.ts";
import { LawyerProfile } from "../types.ts";
import { ConsultationModal } from "../components/consultation/ConsultationModal.tsx";

export const LawyerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.getLawyerById(id);
        if (res.success) {
          setLawyer(res.lawyer);
        }
      } catch (err) {
        console.error("Error loading lawyer profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading lawyer profile...</p>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Lawyer Profile Not Found</h2>
        <p className="text-sm text-slate-600">The legal practitioner profile you requested does not exist or has been removed.</p>
        <Link
          to="/lawyers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lawyer Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/lawyers"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search Directory</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Details (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={lawyer.avatarUrl}
                alt={lawyer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 border-slate-100 object-cover bg-slate-50 shadow-sm"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {lawyer.name}
                  </h1>
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Verified Demo Lawyer
                  </span>
                </div>
                <p className="text-sm font-bold text-blue-700">{lawyer.specialization}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {lawyer.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {lawyer.experience} Years in Practice
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              {lawyer.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Bio & Background Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Professional Background</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {lawyer.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  Education & Credentials
                </span>
                <p className="text-sm font-semibold text-slate-800">{lawyer.education}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-slate-500" />
                  Languages Spoken
                </span>
                <p className="text-sm font-semibold text-slate-800">{lawyer.languages.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Practice & Scheduling Hours */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Standard Availability</span>
            </h3>
            <div className="space-y-2">
              {lawyer.availability.map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs text-slate-700">
                  <span className="font-semibold">{slot}</span>
                  <span className="text-emerald-700 font-bold">Open for Bookings</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Consultation Booking Card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-500 block">Consultation Fee</span>
                <span className="text-3xl font-extrabold text-slate-900">${lawyer.consultationFee}</span>
                <span className="text-xs text-slate-400"> / session</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Fixed Rate
              </span>
            </div>

            {/* Consultation Modes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Available Formats
              </span>
              <div className="space-y-2">
                {lawyer.consultationModes.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    {m === "Video Call" && <Video className="w-4 h-4 text-blue-600" />}
                    {m === "Phone Call" && <Phone className="w-4 h-4 text-emerald-600" />}
                    {m === "In-Person" && <Users className="w-4 h-4 text-purple-600" />}
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking CTA */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Consultation</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 leading-tight">
                No upfront credit card required. Free cancellation up to 12 hours before call.
              </p>
            </div>

            {/* Platform disclaimer pill */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
              <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Demo evaluation profile. Real client inquiries are simulated on this deployment.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        lawyer={lawyer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
