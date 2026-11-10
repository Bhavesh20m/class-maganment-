import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Play,
  CheckCircle,
  Radio,
  Search,
  CheckCheck,
} from 'lucide-react';

export const AutomationCenter: React.FC = () => {
  const {
    automations,
    automationLogs,
    runAutomationWorkflow,
    toggleWorkflow,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Attendance' | 'Fees' | 'Academics' | 'General'>('All');
  const [logSearch, setLogSearch] = useState('');

  const filteredWorkflows = automations.filter(
    (wf) => activeCategory === 'All' || wf.category === activeCategory
  );

  const filteredLogs = automationLogs.filter(
    (l) =>
      l.summary.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.workflowCode.toLowerCase().includes(logSearch.toLowerCase()) ||
      (l.studentName && l.studentName.toLowerCase().includes(logSearch.toLowerCase()))
  );

  const totalExecutions = automations.reduce((acc, curr) => acc + curr.executionCount, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header - Single flat surface, no gradients */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Automation Workflows
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous event triggers connecting faculty actions to instant WhatsApp parent broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Total Dispatches</span>
            <span className="text-xl font-semibold text-slate-900 font-mono tabular-nums">
              {totalExecutions}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Filter Bar - Single dark accent for active */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        {(['All', 'Attendance', 'Fees', 'Academics', 'General'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out ${
              activeCategory === cat
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat} Workflows
          </button>
        ))}
      </div>

      {/* WORKFLOWS LIST - Single surface, 1px dividers, NO nested cards inside cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">
            Registered Workflows ({filteredWorkflows.length})
          </h2>
          <span className="text-xs text-slate-500">Auto-dispatched via WhatsApp</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              className="py-4 first:pt-2 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-xs text-slate-700">
                    {wf.code}
                  </span>
                  <span className="text-slate-300">·</span>
                  <h3 className="font-medium text-slate-900 text-xs">{wf.name}</h3>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-500">{wf.category}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {wf.description}
                </p>
                <div className="text-[11px] text-slate-400">
                  Trigger: <span className="text-slate-600 font-medium">{wf.triggerEvent}</span> · Total runs: <span className="font-mono tabular-nums text-slate-700">{wf.executionCount}</span>
                </div>
              </div>

              {/* Status and Action Controls */}
              <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors duration-150 ease-out ${
                    wf.enabled
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {wf.enabled ? 'Active' : 'Paused'}
                </button>

                <button
                  onClick={() => runAutomationWorkflow(wf.code)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-md text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
                >
                  <Play strokeWidth={1.75} className="w-3.5 h-3.5" />
                  <span>Run Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE AUDIT LOGS - Single surface, 1px dividers, NO nested cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Radio strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
              <span>Execution History &amp; Dispatch Log</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological record of automated WhatsApp broadcasts and student triggers
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search strokeWidth={1.75} className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search execution logs..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono font-medium text-[11px] text-slate-700 mt-0.5">
                  {log.workflowCode}
                </span>
                <div>
                  <div className="font-medium text-slate-900">{log.summary}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Target: {log.studentName} · {log.details}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right self-end sm:self-auto flex-shrink-0">
                <span className="text-[11px] font-mono tabular-nums text-slate-400">{log.timestamp}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                  <CheckCheck strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-500" /> Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
