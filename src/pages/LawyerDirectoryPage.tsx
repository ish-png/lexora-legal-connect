import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Briefcase,
  MapPin,
  CheckCircle2,
  DollarSign,
  Languages,
} from "lucide-react";
import { api } from "../services/api.ts";
import { LawyerProfile } from "../types.ts";
import { LawyerCard } from "../components/lawyers/LawyerCard.tsx";
import { ConsultationModal } from "../components/consultation/ConsultationModal.tsx";

const CATEGORIES = [
  "All Categories",
  "Divorce & Family Law",
  "Criminal Law",
  "Property Law",
  "Civil Law",
  "Corporate & Business Law",
  "Employment & Labour Law",
  "Consumer Law",
  "Cyber Law",
  "Tax Law",
  "Intellectual Property",
  "Immigration Law",
  "Banking & Finance",
  "Motor Vehicle / Accident Claims",
  "Real Estate Law",
];

const LANGUAGES = ["All Languages", "English", "Spanish", "French", "Arabic", "Russian", "Mandarin"];

export const LawyerDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states from URL or defaults
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "All Categories");
  const [location, setLocation] = useState<string>("");
  const [minExp, setMinExp] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(350);
  const [language, setLanguage] = useState<string>("All Languages");
  const [mode, setMode] = useState<string>("All Modes");
  const [sort, setSort] = useState<string>("default");

  // Data
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Sync category param if URL changes
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setCategory(catParam);
    }
  }, [searchParams]);

  const fetchLawyers = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== "All Categories") params.category = category;
      if (location.trim()) params.location = location.trim();
      if (minExp > 0) params.minExp = minExp;
      if (maxFee < 350) params.maxFee = maxFee;
      if (language && language !== "All Languages") params.language = language;
      if (mode && mode !== "All Modes") params.mode = mode;
      if (sort) params.sort = sort;

      const res = await api.getLawyers(params);
      if (res.success) {
        setLawyers(res.lawyers);
      }
    } catch (err) {
      console.error("Failed to fetch lawyers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLawyers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, location, minExp, maxFee, language, mode, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("");
    setMinExp(0);
    setMaxFee(350);
    setLanguage("All Languages");
    setMode("All Modes");
    setSort("default");
    setSearchParams({});
  };

  const handleOpenConsultation = (lawyer: LawyerProfile) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find an Attorney
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified demo legal practitioners by specialization, fee, language, and consultation format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Recommended (Verified First)</option>
            <option value="experience_desc">Experience (Highest First)</option>
            <option value="fee_asc">Consultation Fee (Low to High)</option>
            <option value="fee_desc">Consultation Fee (High to Low)</option>
            <option value="name_asc">Lawyer Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filters sidebar + Lawyer grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Controls Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Search Filters</span>
            </h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search by Name / Keyword */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Attorney name or topic..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Legal Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Legal Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value === "All Categories") {
                  searchParams.delete("category");
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ category: e.target.value });
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location / City
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, Chicago..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Minimum Experience */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Min. Experience
              </label>
              <span className="text-xs font-bold text-blue-600">{minExp} yrs+</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="2"
              value={minExp}
              onChange={(e) => setMinExp(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Any</span>
              <span>10 yrs</span>
              <span>20+ yrs</span>
            </div>
          </div>

          {/* Maximum Consultation Fee */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Max Fee
              </label>
              <span className="text-xs font-bold text-blue-600">${maxFee}</span>
            </div>
            <input
              type="range"
              min="100"
              max="350"
              step="25"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$100</span>
              <span>$225</span>
              <span>$350</span>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Language Spoken
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Format
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Modes">All Formats</option>
              <option value="Video Call">Video Call</option>
              <option value="Phone Call">Phone Call</option>
              <option value="In-Person">In-Person</option>
            </select>
          </div>
        </div>

        {/* Lawyer List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{lawyers.length}</strong> available legal practitioners
            </span>
            {category !== "All Categories" && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                Category: {category}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : lawyers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Attorneys Match Your Filters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Try widening your search terms, raising the maximum consultation fee, or selecting "All Categories" to view all available practitioners.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer._id}
                  lawyer={lawyer}
                  onRequestConsultation={handleOpenConsultation}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        lawyer={selectedLawyer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
