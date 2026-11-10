import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Plus,
  Search,
  Download,
  Receipt,
  Zap,
  Info,
  X,
} from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const {
    students,
    fees,
    recordFeePayment,
    runAutomationWorkflow,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('std-002');
  const [amount, setAmount] = useState<number>(3000);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque'>('UPI');
  const [discount, setDiscount] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [notes, setNotes] = useState('Tuition fee for November 2026');

  // Summary Metrics
  const totalCollected = fees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = students.reduce((acc, curr) => acc + curr.feeBalance, 0);
  const overdueStudents = students.filter((s) => s.feeBalance >= s.monthlyFee * 2);

  // Filter students based on fee tab
  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.rollNo.includes(search) ||
      st.parentName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'pending') return st.feeBalance > 0 && st.feeBalance < st.monthlyFee * 2;
    if (filterType === 'overdue') return st.feeBalance >= st.monthlyFee * 2;
    if (filterType === 'paid') return st.feeBalance === 0;
    return true;
  });

  const handleOpenRecordPayment = (studentId?: string) => {
    const targetId = studentId || (students.find((s) => s.feeBalance > 0)?.id || students[0].id);
    const targetStudent = students.find((s) => s.id === targetId);
    setSelectedStudentId(targetId);
    setAmount(targetStudent ? targetStudent.monthlyFee : 3000);
    setDiscount(0);
    setLateFee(0);
    setNotes('Tuition fee for November 2026');
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    recordFeePayment({
      studentId: selectedStudentId,
      amount,
      paymentMode,
      discount,
      lateFee,
      notes,
    });
    setShowPaymentModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Student Name', 'Amount', 'Date', 'Mode', 'Notes'];
    const rows = fees.map((f) => [
      f.receiptNo,
      f.studentName,
      f.amount,
      f.paymentDate,
      f.paymentMode,
      f.notes || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fee_collection_report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Fee Collection &amp; Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record tuition payments, generate digital receipts, and trigger automated WhatsApp confirmations (WF04).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runAutomationWorkflow('WF03')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            title="Dispatches fee reminders to parents with pending dues"
          >
            <Zap className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.75} /> Dispatch Reminders (WF03)
          </button>
          <button
            onClick={() => handleOpenRecordPayment()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.75} /> Record Payment (WF04)
          </button>
        </div>
      </div>

      {/* Metrics Section: Single surface with 1px dividers (Rule 4) */}
      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-xs">
        <div className="p-5 space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Fees Collected</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            {fees.length} Verified Digital Receipts Issued
          </div>
        </div>

        <div className="p-5 space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Pending Dues</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {students.filter((s) => s.feeBalance > 0).length} Enrolled Students
          </div>
        </div>

        <div className="p-5 space-y-1">
          <div className="text-xs text-slate-500 font-medium">Critical Overdue (&gt;60 Days)</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {overdueStudents.length} Students
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-1">
            Requires Management Telephonic Follow-up
          </div>
        </div>
      </div>

      {/* Filter Tabs and Actions (Single surface) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filterType === 'pending'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pending Fees ({students.filter((s) => s.feeBalance > 0 && s.feeBalance < s.monthlyFee * 2).length})
          </button>
          <button
            onClick={() => setFilterType('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filterType === 'overdue'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overdue (&gt;2 Mos) ({overdueStudents.length})
          </button>
          <button
            onClick={() => setFilterType('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filterType === 'paid'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Fully Paid ({students.filter((s) => s.feeBalance === 0).length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" strokeWidth={1.75} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or roll..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-slate-900"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} /> Export CSV
          </button>
        </div>
      </div>

      {/* Students Fee Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Roll #</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Batch</th>
                <th className="px-4 py-3 font-semibold">Monthly Fee</th>
                <th className="px-4 py-3 font-semibold">Total Paid</th>
                <th className="px-4 py-3 font-semibold">Outstanding Balance</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-900">
                    #{st.rollNo}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Parent: {st.parentName} ({st.parentPhone})</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{st.batchName}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-800">
                    ₹{st.monthlyFee.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-800 font-medium">
                    ₹{st.totalPaid.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`font-mono font-medium px-2 py-0.5 rounded-md text-xs border ${
                        st.feeBalance === 0
                          ? 'bg-slate-50 text-slate-700 border-slate-200'
                          : st.feeBalance >= st.monthlyFee * 2
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {st.feeBalance === 0 ? 'Fully Paid' : `₹${st.feeBalance.toLocaleString('en-IN')}`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenRecordPayment(st.id)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                      Collect Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
                Record Fee Payment (WF04)
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedStudentId(id);
                    const st = students.find((s) => s.id === id);
                    if (st) setAmount(st.feeBalance > 0 ? st.feeBalance : st.monthlyFee);
                  }}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      #{st.rollNo} - {st.name} ({st.batchName}) • Due: ₹{st.feeBalance}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Payment Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono font-medium focus:outline-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / PayTM)</option>
                    <option value="Cash">Cash (Desk Receipt)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cheque">Bank Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Discount Applied (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Late Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={lateFee}
                    onChange={(e) => setLateFee(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Receipt Notes / Description</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                <span>
                  Clicking <strong>"Generate Receipt &amp; Notify Parent"</strong> will create a digital receipt number and dispatch a WhatsApp payment confirmation to the registered parent.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Generate Receipt &amp; Notify (WF04)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
