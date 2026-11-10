import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-3 rounded-lg border border-slate-200 bg-white shadow-sm flex items-start justify-between gap-3 text-slate-900"
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle strokeWidth={1.75} className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />}
              {isWarning && <AlertTriangle strokeWidth={1.75} className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />}
              {isError && <AlertCircle strokeWidth={1.75} className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />}
              {!isSuccess && !isWarning && !isError && (
                <Info strokeWidth={1.75} className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />
              )}

              <div className="space-y-0.5">
                <div className="text-xs font-semibold leading-tight text-slate-900">{toast.title}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{toast.message}</div>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors duration-150 ease-out"
            >
              <X strokeWidth={1.75} className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
