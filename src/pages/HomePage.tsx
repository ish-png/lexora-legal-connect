import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  Scale,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  FileText,
  Users,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { api } from "../services/api.ts";
import { LawyerProfile, AIClassificationResult } from "../types.ts";
import { LawyerCard } from "../components/lawyers/LawyerCard.tsx";
import { ConsultationModal } from "../components/consultation/ConsultationModal.tsx";
import { useToast } from "../context/ToastContext.tsx";

const DEMO_PROMPTS = [
  "My landlord has refused to return my security deposit after I moved out.",
  "I was fired after reporting unsafe workplace practices to my manager.",
  "A competitor launched an app using our brand name and stolen logo.",
  "I was rear-ended at a red light and the insurance company is denying my injury claim.",
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [problemDescription, setProblemDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [classification, setClassification] = useState<AIClassificationResult | null>(null);
  const [isLowConfidence, setIsLowConfidence] = useState<boolean>(false);
  const [matchedLawyers, setMatchedLawyers] = useState<LawyerProfile[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const query = (textToAnalyze ?? problemDescription).trim();
    if (!query || query.length < 5) {
      showToast("Please enter a brief description of your legal situation.", "error");
      return;
    }

    setIsAnalyzing(true);
    setClassification(null);
    setMatchedLawyers([]);

    try {
      const res = await api.classifyProblem(query);
      if (res.success) {
        setClassification(res.classification);
        setIsLowConfidence(res.isLowConfidence);
        setMatchedLawyers(res.matchingLawyers || []);
        showToast("Issue analyzed. Possible legal category identified.", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to analyze situation.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setProblemDescription(prompt);
    handleAnalyze(prompt);
  };

  const handleOpenConsultation = (lawyer: LawyerProfile) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-w-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Assisted Legal Practice Area Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find the right legal professional for your situation.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Describe your problem in plain language. Our AI assistant identifies the relevant legal category and connects you with verified legal practitioners for consultation.
          </p>

          {/* Legal Problem Input Box */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-200 text-slate-900 text-left max-w-3xl mx-auto transition-all">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              What legal issue are you facing?
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="e.g. My landlord has refused to return my security deposit after I moved out on time with no damages..."
                className="w-full p-3 text-sm text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Quick Demo Chips */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Examples:</span>
              {DEMO_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPrompt(prompt)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200 text-left truncate max-w-xs"
                >
                  "{prompt.slice(0, 36)}..."
                </button>
              ))}
            </div>

            {/* Button Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Private & confidential inquiry</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/lawyers"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors text-center"
                >
                  Browse All Lawyers
                </Link>
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => handleAnalyze()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing Issue...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Find Relevant Lawyers</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Result Section (Appears conditionally) */}
      {classification && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12 relative z-20">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header Banner */}
            <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    AI Issue Classification
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    Confidence: {(classification.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Possible Legal Category: <span className="text-amber-400">{classification.category}</span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">{classification.subCategory}</p>
              </div>

              <div className="shrink-0 bg-slate-800/80 p-3 rounded-xl border border-slate-700 max-w-xs text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Important Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {classification.disclaimer || "This classification is informational and is not legal advice."}
                </p>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Contextual Analysis
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed max-w-3xl">
                {classification.summary}
              </p>

              {isLowConfidence && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    We couldn't confidently classify your issue. You may browse all lawyer categories or consult a qualified legal professional directly.
                  </span>
                </div>
              )}
            </div>

            {/* Matching Lawyers Grid */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verified Practitioners in {classification.category} ({matchedLawyers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Attorneys experienced with {classification.subCategory.toLowerCase()}.
                  </p>
                </div>
                <Link
                  to={`/lawyers?category=${encodeURIComponent(classification.category)}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Filter all in this category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {matchedLawyers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No demo lawyers matched this exact category. Browse all available lawyers to find representation.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {matchedLawyers.slice(0, 3).map((lawyer) => (
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
        </section>
      )}

      {/* Main Feature Cards: Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore by Legal Practice Area</h2>
            <p className="text-sm text-slate-600 mt-1">Browse practitioners dedicated to specific legal specializations.</p>
          </div>
          <Link
            to="/categories"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>All 14 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "Property Law",
              desc: "Tenant rights, leases, eviction defense, boundary disputes",
              count: "4 Verified",
              category: "Property Law",
            },
            {
              name: "Corporate & Business Law",
              desc: "Contracts, entity incorporation, M&A, founder agreements",
              count: "5 Verified",
              category: "Corporate & Business Law",
            },
            {
              name: "Divorce & Family Law",
              desc: "Child custody, marital separation, prenuptials, adoptions",
              count: "3 Verified",
              category: "Divorce & Family Law",
            },
            {
              name: "Employment & Labour Law",
              desc: "Severance review, wrongful termination, wage claims",
              count: "3 Verified",
              category: "Employment & Labour Law",
            },
            {
              name: "Cyber Law & Digital Assets",
              desc: "Data breach, online fraud recovery, privacy compliance",
              count: "2 Verified",
              category: "Cyber Law",
            },
            {
              name: "Criminal Law",
              desc: "State defense, investigations, traffic citations, hearings",
              count: "2 Verified",
              category: "Criminal Law",
            },
            {
              name: "Intellectual Property",
              desc: "Trademarks, copyright enforcement, patent filings",
              count: "2 Verified",
              category: "Intellectual Property",
            },
            {
              name: "Tax Law",
              desc: "IRS audits, state appeals, business tax controversy",
              count: "2 Verified",
              category: "Tax Law",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={`/lawyers?category=${encodeURIComponent(item.category)}`}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {item.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center gap-1">
                <span>View Attorneys</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How LegalConnect Works (3-Step Educational Flow) */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple & Transparent</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How LegalConnect Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              From issue description to video consultation in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Describe Your Problem</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain what happened in everyday language. Our backend Gemini AI categorizes your issue into the appropriate legal discipline without making claims or guarantees.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Compare & Select an Attorney</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified demo practitioner credentials, bar experience, consultation fees, and languages. Filter by video call, phone call, or in-person preferences.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Schedule Consultation & Track Case</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose a time slot, attach necessary agreements, and receive an instant confirmation. Track case status and documents directly in your client dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Demo Lawyers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Top Practitioners</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Featured Legal Counsel</h2>
            <p className="text-sm text-slate-600">Sample verified demo attorneys available for immediate consultations.</p>
          </div>
          <Link
            to="/lawyers"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore All 20 Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Demo Lawyer Sample Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LawyerCard
            lawyer={{
              _id: "prof_lawyer_01",
              userId: "usr_lawyer_01",
              name: "Adv. Marcus Vance",
              email: "marcus.vance@demo.legalconnect.com",
              phone: "+1 (555) 301-1001",
              specialization: "Tenancy & Landlord-Tenant Disputes",
              categories: ["Property Law", "Real Estate Law", "Civil Law"],
              experience: 14,
              location: "New York, NY",
              languages: ["English", "Spanish"],
              education: "J.D., Columbia Law School",
              bio: "Adv. Vance is an experienced civil litigator dedicated to residential and commercial tenancy disputes, lease negotiations, and security deposit recovery.",
              consultationFee: 150,
              consultationModes: ["Video Call", "Phone Call", "In-Person"],
              availability: ["Mon-Fri 09:00 - 16:00"],
              verificationStatus: "verified",
              avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Adv.%20Marcus%20Vance",
              isDemo: true,
              createdAt: "2026-01-01",
            }}
            onRequestConsultation={handleOpenConsultation}
          />
          <LawyerCard
            lawyer={{
              _id: "prof_lawyer_02",
              userId: "usr_lawyer_02",
              name: "Adv. Elena Rostova",
              email: "elena.rostova@demo.legalconnect.com",
              phone: "+1 (555) 301-1002",
              specialization: "Corporate Formation & Venture Financing",
              categories: ["Corporate & Business Law", "Intellectual Property"],
              experience: 11,
              location: "San Francisco, CA",
              languages: ["English", "Russian"],
              education: "LL.M., Stanford Law School",
              bio: "Specializing in early-stage tech startup advisory, cross-border commercial contracts, venture debt financing, and IP licensing.",
              consultationFee: 250,
              consultationModes: ["Video Call", "Phone Call"],
              availability: ["Tue-Thu 10:00 - 17:00"],
              verificationStatus: "verified",
              avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Adv.%20Elena%20Rostova",
              isDemo: true,
              createdAt: "2026-01-01",
            }}
            onRequestConsultation={handleOpenConsultation}
          />
          <LawyerCard
            lawyer={{
              _id: "prof_lawyer_03",
              userId: "usr_lawyer_03",
              name: "Adv. Tariq Al-Mansoor",
              email: "tariq.almansoor@demo.legalconnect.com",
              phone: "+1 (555) 301-1003",
              specialization: "Divorce & Child Custody Mediation",
              categories: ["Divorce & Family Law", "Civil Law"],
              experience: 16,
              location: "Chicago, IL",
              languages: ["English", "Arabic"],
              education: "J.D., University of Chicago Law School",
              bio: "Compassionate domestic relations advocate focusing on amicable divorce mediation, equitable marital asset distribution, and child welfare.",
              consultationFee: 180,
              consultationModes: ["Video Call", "In-Person"],
              availability: ["Mon-Fri 09:30 - 16:30"],
              verificationStatus: "verified",
              avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Adv.%20Tariq%20Al-Mansoor",
              isDemo: true,
              createdAt: "2026-01-01",
            }}
            onRequestConsultation={handleOpenConsultation}
          />
        </div>
      </section>

      {/* For Lawyers Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">For Legal Professionals</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Expand your practice with verified client consultations.</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect with clients seeking your exact specialization. Manage consultation requests, client files, and legal documents in a centralized dashboard.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/for-lawyers"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-colors text-center"
            >
              Learn More
            </Link>
            <Link
              to="/auth?mode=register&role=lawyer"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors text-center shadow-sm"
            >
              Register as Lawyer
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-slate-100/50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Understanding our platform policies, limits, and technology.</p>
          </div>

          {[
            {
              q: "Does LegalConnect provide legal advice or predict case outcomes?",
              a: "No. LegalConnect is strictly an educational and discovery platform. We do not provide legal advice, representation, or outcome guarantees. The AI classification tool solely identifies broad legal practice areas to assist you in discovering qualified attorneys.",
            },
            {
              q: "Is the AI acting as a licensed attorney?",
              a: "No. The AI system acts exclusively as a classification assistant. It evaluates the keywords and context in your issue description to point you toward relevant specialties like Property Law or Employment Law.",
            },
            {
              q: "Does requesting a consultation establish an attorney-client relationship?",
              a: "No. Submitting a consultation request is an invitation to discuss your case. An attorney-client relationship is only created when you and the lawyer mutually execute a formal engagement contract and agree to representation terms.",
            },
            {
              q: "What are the demo accounts used for?",
              a: "LegalConnect is seeded with full realistic demo data so you can test every capability of the platform. You can log in as a Client, a Lawyer, or an Administrator with 1-click from the top navigation bar.",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        lawyer={selectedLawyer}
        initialCategory={classification?.category}
        initialDescription={problemDescription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
