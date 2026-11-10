import React from 'react';
import { useApp } from '../../context/AppContext';
import { INSTITUTE_INFO } from '../../data/initialData';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle,
  Building2,
  Calendar,
  CreditCard,
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, students } = useApp();

  if (!activeReceipt) return null;

  const student = students.find((s) => s.id === activeReceipt.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-xl shadow-xl space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText strokeWidth={1.75} className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-semibold text-slate-900">
              Payment Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors duration-150 ease-out"
              title="Print Receipt"
            >
              <Printer strokeWidth={1.75} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveReceipt(null)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors duration-150 ease-out"
            >
              <X strokeWidth={1.75} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5 border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-700" />
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {INSTITUTE_INFO.name}
                </h2>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{INSTITUTE_INFO.tagline}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{INSTITUTE_INFO.address}</p>
              <p className="text-[10px] text-slate-500">Reg: {INSTITUTE_INFO.registrationNo} • Phone: {INSTITUTE_INFO.phone}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                {activeReceipt.receiptNo}
              </span>
              <div className="text-[10px] text-slate-500 mt-1">Date: {activeReceipt.paymentDate}</div>
            </div>
          </div>

          {/* Student & Parent Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Student Details
              </span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {activeReceipt.studentName}
              </div>
              <div className="text-slate-600 text-[11px]">
                Roll #{student?.rollNo || '101'} • {student?.batchName || 'Foundation Batch'}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Payer / Parent
              </span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {student?.parentName || 'Parent'}
              </div>
              <div className="text-slate-600 text-[11px] font-mono">
                {student?.parentPhone || '+91 98201 54321'}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2.5">Description</th>
                <th className="p-2.5">Payment Mode</th>
                <th className="p-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5">
                  <div className="font-semibold text-slate-900">{activeReceipt.notes || 'Tuition Fee Installment'}</div>
                  <div className="text-[10px] text-slate-500">Collected by {activeReceipt.collectedBy}</div>
                </td>
                <td className="p-2.5 text-slate-700 font-medium">{activeReceipt.paymentMode}</td>
                <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                  ₹{activeReceipt.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
              <tr>
                <td colSpan={2} className="p-2.5 text-slate-700 text-right">Total Amount Received:</td>
                <td className="p-2.5 text-right font-mono text-indigo-700 text-sm">
                  ₹{activeReceipt.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Status stamp */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
              <CheckCircle strokeWidth={1.75} className="w-4 h-4 text-emerald-600" />
              <span>Verified Paid Transaction</span>
            </div>

            <div className="text-right text-[10px] text-slate-400">
              Computer Generated Digital Receipt
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500">
            Receipt dispatched to parent WhatsApp
          </p>
          <button
            onClick={() => setActiveReceipt(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
