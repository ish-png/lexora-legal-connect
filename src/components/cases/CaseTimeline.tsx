import React from "react";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { CaseTimelineItem, CaseStatus } from "../../types.ts";

interface CaseTimelineProps {
  timeline: CaseTimelineItem[];
  currentStatus: CaseStatus;
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ timeline, currentStatus }) => {
  return (
    <div className="py-4">
      <div className="relative">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const isCompleted = step.completed;
          const isCurrent = !isCompleted && (idx === 0 || timeline[idx - 1]?.completed);

          return (
            <div key={step.id || idx} className="relative flex items-start gap-4 pb-6 last:pb-0">
              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`absolute left-3.5 top-6 bottom-0 w-0.5 -ml-px ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}

              {/* Status node */}
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-white shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-white">
                    <Circle className="w-3 h-3 text-slate-300 fill-slate-200" />
                  </div>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4
                    className={`text-sm font-semibold ${
                      isCompleted ? "text-slate-900" : isCurrent ? "text-blue-600 font-bold" : "text-slate-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : isCurrent
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.date || "Pending"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
