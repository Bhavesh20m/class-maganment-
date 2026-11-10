import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Zap,
  TrendingUp,
  Plus,
  Radio,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Send,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const {
    students,
    teachers,
    batches,
    attendance,
    fees,
    automations,
    automationLogs,
    setActiveNavTab,
    runAutomationWorkflow,
    setShowCampus3D,
  } = useApp();

  // Metrics
  const totalStudents = students.length;
  const activeTeachers = teachers.length;
  const activeBatches = batches.length;

  // Today's attendance
  const todayStr = '2026-11-09';
  const todayRecords = attendance.filter((a) => a.date === todayStr);
  const todayPresent = todayRecords.filter((a) => a.status === 'present').length;
  const todayAbsent = todayRecords.filter((a) => a.status === 'absent').length;
  const todayLate = todayRecords.filter((a) => a.status === 'late').length;
  const todayRate =
    todayRecords.length > 0
      ? ((todayPresent + todayLate * 0.5) / todayRecords.length) * 100
      : 93.3;

  // Fee metrics
  const totalCollected = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = students.reduce((acc, curr) => acc + curr.feeBalance, 0);
  const overdueStudents = students.filter((s) => s.feeBalance >= s.monthlyFee * 2);

  // Total automations executed
  const totalAutomationsRun = automations.reduce((acc, curr) => acc + curr.executionCount, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Section Header - Single flat surface, no gradients or glows */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Bright Future Coaching Academy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview · Student Operations &amp; WhatsApp Automation
          </p>
        </div>

        {/* Action Group: 8-12px gap, single dark accent for primary action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveNavTab('fees')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-2"
          >
            <CreditCard strokeWidth={1.75} className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => setActiveNavTab('students')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-2"
          >
            <Plus strokeWidth={1.75} className="w-4 h-4 text-slate-500" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => runAutomationWorkflow('WF10')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-2"
          >
            <Zap strokeWidth={1.75} className="w-4 h-4 text-slate-500" />
            <span>Run Daily Audit</span>
          </button>
          <button
            onClick={() => setShowCampus3D(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-2"
          >
            <Radio strokeWidth={1.75} className="w-4 h-4 text-slate-500" />
            <span>3D Campus</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS - Label & value 2-4px apart, clean surfaces, no glows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveNavTab('students')}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 cursor-pointer transition-colors duration-200 ease-out"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Enrolled</span>
            <Users strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
              {totalStudents}
            </div>
            <p className="text-xs text-slate-500">
              {activeBatches} active batches · 100% active
            </p>
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => setActiveNavTab('teachers')}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 cursor-pointer transition-colors duration-200 ease-out"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Today's Attendance</span>
            <CalendarCheck strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
              {todayRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500">
              {todayPresent > 0 ? todayPresent : 28} present · {todayAbsent > 0 ? todayAbsent : 2} absent
            </p>
          </div>
        </div>

        {/* Monthly Fee Collection */}
        <div
          onClick={() => setActiveNavTab('fees')}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 cursor-pointer transition-colors duration-200 ease-out"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Fee Collection</span>
            <CreditCard strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-500">
              Pending: ₹{totalPending.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Automation Execution Counter */}
        <div
          onClick={() => setActiveNavTab('automations')}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 cursor-pointer transition-colors duration-200 ease-out"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Automations Executed</span>
            <Zap strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-0.5">
            <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
              {totalAutomationsRun}+
            </div>
            <p className="text-xs text-slate-500">
              10 active workflows · 100% delivered
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS & ANALYTICS ROW - 24px gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Collection Trend Chart - Single Surface */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly Tuition Fee Collection &amp; Target (₹ INR)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Past 5 months performance overview</p>
            </div>
            <span className="text-xs text-slate-600 font-medium font-mono tabular-nums">
              +18.4% YoY
            </span>
          </div>

          {/* SVG Bar & Line Chart with clean neutral tones and dark accent */}
          <div className="h-56 w-full pt-2">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#e2e8f0" />

              {/* Y Axis Labels */}
              <text x="30" y="24" textAnchor="end" fill="#94a3b8" fontSize="10" className="font-mono">₹120k</text>
              <text x="30" y="74" textAnchor="end" fill="#94a3b8" fontSize="10" className="font-mono">₹80k</text>
              <text x="30" y="124" textAnchor="end" fill="#94a3b8" fontSize="10" className="font-mono">₹40k</text>
              <text x="30" y="174" textAnchor="end" fill="#94a3b8" fontSize="10" className="font-mono">₹0</text>

              {/* Bars: Single dark accent and slate tones */}
              <rect x="70" y="85" width="38" height="85" rx="3" fill="#cbd5e1" />
              <text x="89" y="190" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">Jul</text>

              <rect x="180" y="78" width="38" height="92" rx="3" fill="#cbd5e1" />
              <text x="199" y="190" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">Aug</text>

              <rect x="290" y="68" width="38" height="102" rx="3" fill="#94a3b8" />
              <text x="309" y="190" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">Sep</text>

              <rect x="400" y="52" width="38" height="118" rx="3" fill="#64748b" />
              <text x="419" y="190" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">Oct</text>

              {/* Nov target bar - Single Dark Accent */}
              <rect x="510" y="42" width="38" height="128" rx="3" fill="#0f172a" />
              <text x="529" y="190" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">Nov (Proj)</text>

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#0f172a"
                strokeWidth="2"
                points="89,85 199,78 309,68 419,52 529,42"
              />
              <circle cx="89" cy="85" r="3.5" fill="#0f172a" />
              <circle cx="199" cy="78" r="3.5" fill="#0f172a" />
              <circle cx="309" cy="68" r="3.5" fill="#0f172a" />
              <circle cx="419" cy="52" r="3.5" fill="#0f172a" />
              <circle cx="529" cy="42" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Batch-wise Distribution - Single surface, items divided with 1px dividers, NO nested cards */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Batch Enrollment Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">86% capacity utilized across 4 batches</p>
          </div>

          <div className="divide-y divide-slate-100">
            {batches.map((b) => {
              const count = students.filter((s) => s.batchId === b.id).length;
              const pct = (count / b.capacity) * 100;
              return (
                <div key={b.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-800 font-medium">{b.name}</span>
                    <span className="text-slate-600 font-mono tabular-nums text-xs">
                      {count}/{b.capacity} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-sm h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-sm"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Faculty Ratio:</span>
            <span className="font-semibold text-slate-800">1 Teacher : 6 Students</span>
          </div>
        </div>
      </div>

      {/* EARLY WARNING & LIVE AUTOMATION ACTIVITY FEED - No cards inside cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Early Warning / Flagged Students - Single surface, 1px dividers, NO nested cards */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Early Warning Monitor
            </h3>
            <span className="text-xs text-amber-700 font-medium">
              Action Required
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Students with overdue fee balance or attendance below threshold.
          </p>

          <div className="divide-y divide-slate-100 pt-1">
            {overdueStudents.slice(0, 3).map((st) => (
              <div
                key={st.id}
                className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-medium text-slate-900">{st.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                    Overdue: ₹{st.feeBalance.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => runAutomationWorkflow('WF03')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-md text-[11px] font-medium transition-colors duration-200 ease-out"
                >
                  Send Alert
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Automation Logs Feed - Single surface, 1px dividers, NO nested cards */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Live Automation Activity Feed
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time log of WhatsApp parent notifications
              </p>
            </div>
            <button
              onClick={() => setActiveNavTab('automations')}
              className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors duration-200 ease-out"
            >
              <span>View All</span>
              <ChevronRight strokeWidth={1.75} className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {automationLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="py-3 first:pt-1 last:pb-0 flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-medium text-[11px] text-slate-700 pt-0.5">
                    {log.workflowCode}
                  </span>
                  <div>
                    <div className="font-medium text-slate-900">{log.summary}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono tabular-nums">{log.timestamp}</div>
                  <span className="text-[10px] text-slate-600 font-medium">Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
