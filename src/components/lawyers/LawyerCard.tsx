import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Languages,
  CheckCircle2,
  Calendar,
  Video,
  Phone,
  Users,
  ChevronRight,
} from "lucide-react";
import { LawyerProfile } from "../../types.ts";

interface LawyerCardProps {
  lawyer: LawyerProfile;
  onRequestConsultation?: (lawyer: LawyerProfile) => void;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, onRequestConsultation }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top bar: Avatar, Name, Verification, Fee */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3.5">
            <div className="relative">
              <img
                src={lawyer.avatarUrl}
                alt={lawyer.name}
                className="w-14 h-14 rounded-2xl border border-slate-200 object-cover bg-slate-100 shadow-xs"
              />
              {lawyer.verificationStatus === "verified" && (
                <div
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs"
                  title="Verified Demo Lawyer"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {lawyer.name}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Demo
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">{lawyer.specialization}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {lawyer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {lawyer.experience} yrs exp
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-bold text-slate-900">${lawyer.consultationFee}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Per Session</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {lawyer.bio}
        </p>

        {/* Categories Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lawyer.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200/70"
            >
              {cat}
            </span>
          ))}
          {lawyer.categories.length > 3 && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
              +{lawyer.categories.length - 3} more
            </span>
          )}
        </div>

        {/* Modes & Languages */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {lawyer.consultationModes.includes("Video Call") && (
              <span className="flex items-center gap-1" title="Video Call Available">
                <Video className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px]">Video</span>
              </span>
            )}
            {lawyer.consultationModes.includes("Phone Call") && (
              <span className="flex items-center gap-1" title="Phone Consultation">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px]">Phone</span>
              </span>
            )}
            {lawyer.consultationModes.includes("In-Person") && (
              <span className="flex items-center gap-1" title="In-Person Available">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[11px]">Office</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span>{lawyer.languages.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
        <Link
          to={`/lawyers/${lawyer._id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shadow-2xs"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={() => onRequestConsultation && onRequestConsultation(lawyer)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1"
        >
          <span>Book Consult</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
