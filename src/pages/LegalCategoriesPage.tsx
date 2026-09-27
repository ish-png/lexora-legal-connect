import React from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  Building,
  Home,
  Briefcase,
  Users,
  ShieldCheck,
  Globe,
  FileSpreadsheet,
  Car,
  Landmark,
  BadgePercent,
  Cpu,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Divorce & Family Law",
    desc: "Child custody, legal separation, divorce proceedings, alimony, adoption, and domestic relations agreements.",
    examples: ["Contested divorce", "Custody arrangements", "Prenuptial agreements", "Child support modification"],
    count: 3,
  },
  {
    name: "Criminal Law",
    desc: "Defense counsel for state and federal allegations, citations, police questioning, bail hearings, and appeals.",
    examples: ["DUI defense", "White collar allegations", "State misdemeanor citations", "Arrest warrants"],
    count: 2,
  },
  {
    name: "Property Law",
    desc: "Landlord-tenant disputes, residential leases, security deposit recovery, eviction defense, and property ownership.",
    examples: ["Withheld security deposits", "Commercial lease review", "Unlawful evictions", "Boundary disputes"],
    count: 4,
  },
  {
    name: "Civil Law",
    desc: "Dispute resolution between private individuals or companies, breach of contract, torts, and damage claims.",
    examples: ["Contract enforcement", "Defamation actions", "Debt recovery", "Negligence claims"],
    count: 5,
  },
  {
    name: "Corporate & Business Law",
    desc: "Company incorporation, founder equity, commercial contracts, regulatory compliance, and joint ventures.",
    examples: ["LLC/C-Corp setup", "Shareholder agreements", "M&A negotiation", "Vendor contracts"],
    count: 5,
  },
  {
    name: "Employment & Labour Law",
    desc: "Workplace disputes, wrongful dismissal, severance negotiations, non-compete agreements, and wage compliance.",
    examples: ["Severance package review", "Wrongful termination", "Unpaid overtime", "Workplace harassment"],
    count: 3,
  },
  {
    name: "Consumer Law",
    desc: "Protection against deceptive marketing, defective products, warranty fraud, and fair debt collection practices.",
    examples: ["Faulty product claims", " predatory lending", "Billing fraud", "Warranty refusal"],
    count: 2,
  },
  {
    name: "Cyber Law",
    desc: "Digital privacy breaches, internet fraud, cryptocurrency theft, ransomware incidents, and terms of service.",
    examples: ["Online account takeover", "Data breach notification", "Crypto recovery assistance", "Domain disputes"],
    count: 2,
  },
  {
    name: "Tax Law",
    desc: "IRS audits, state tax disputes, corporate tax structuring, penalty abatement, and international tax compliance.",
    examples: ["Unfiled tax returns", "IRS audit representation", "Payroll tax controversy", "Offshore disclosures"],
    count: 2,
  },
  {
    name: "Intellectual Property",
    desc: "Trademark registration, patent filings, trade secret protection, and copyright infringement enforcement.",
    examples: ["Brand name trademarking", "Software copyright", "Cease & desist letters", "IP licensing deals"],
    count: 2,
  },
  {
    name: "Immigration Law",
    desc: "Employment visas, green card petitions, permanent residency, naturalization, and deportation defense.",
    examples: ["H-1B & O-1 visas", "Spousal green cards", "EB-5 investment", "Citizenship appeals"],
    count: 2,
  },
  {
    name: "Banking & Finance",
    desc: "Lending agreements, debt restructuring, regulatory banking compliance, loan workouts, and security interests.",
    examples: ["Commercial loan terms", "Mortgage refinancing review", "Debtor-creditor workouts", "Fintech compliance"],
    count: 2,
  },
  {
    name: "Motor Vehicle / Accident Claims",
    desc: "Bodily injury claims, traffic collisions, insurance liability settlement, and catastrophic accident recovery.",
    examples: ["Rear-end collision claims", "Commercial truck accidents", "Insurance dispute negotiation", "Medical cost recovery"],
    count: 2,
  },
  {
    name: "Real Estate Law",
    desc: "Commercial and residential title examination, closing representation, zoning variances, and deed transfers.",
    examples: ["Property closing escrow", "Title defect remediation", "Zoning permits", "Easement agreements"],
    count: 2,
  },
];

export const LegalCategoriesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Practice Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Legal Practice Categories
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Explore specialized disciplines of law. Select a practice area to discover verified attorneys with focused domain experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {cat.count} Lawyers
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Common Inquiries:
                </span>
                <div className="flex flex-wrap gap-1">
                  {cat.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to={`/lawyers?category=${encodeURIComponent(cat.name)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <span>Find {cat.name} Attorneys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
