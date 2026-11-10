import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CreditCard,
  Award,
  CheckCircle,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { students, attendance, fees, examResults } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'attendance' | 'fees' | 'exams'>('attendance');

  const handleExportCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Institute Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Export certified daily attendance summaries, fee ledgers, and academic scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" strokeWidth={1.75} /> Print Report
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveReportTab('attendance')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
            activeReportTab === 'attendance'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
          Attendance Audit Report
        </button>
        <button
          onClick={() => setActiveReportTab('fees')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
            activeReportTab === 'fees'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" strokeWidth={1.75} />
          Fee Collection &amp; Dues
        </button>
        <button
          onClick={() => setActiveReportTab('exams')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
            activeReportTab === 'exams'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" strokeWidth={1.75} />
          Academic Marks Ledger
        </button>
      </div>

      {/* REPORT CONTENT */}
      {activeReportTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Monthly Attendance Summary (Nov 2026)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Total 30 Enrolled Students</p>
            </div>
            <button
              onClick={() => {
                const rows = students.map((s) => {
                  const att = attendance.filter((a) => a.studentId === s.id);
                  const p = att.filter((a) => a.status === 'present').length;
                  const ab = att.filter((a) => a.status === 'absent').length;
                  const rate = att.length > 0 ? (p / att.length) * 100 : 100;
                  return [s.rollNo, s.name, s.batchName, p, ab, `${rate.toFixed(1)}%`];
                });
                handleExportCSV('attendance_report_2026', ['Roll', 'Name', 'Batch', 'Present', 'Absent', 'Percentage'], rows);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.75} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200 font-semibold tracking-wider">
                <tr>
                  <th className="p-3">Roll #</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Working Days</th>
                  <th className="p-3">Present</th>
                  <th className="p-3">Absent</th>
                  <th className="p-3 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const att = attendance.filter((a) => a.studentId === st.id);
                  const pres = att.filter((a) => a.status === 'present').length;
                  const abs = att.filter((a) => a.status === 'absent').length;
                  const rate = att.length > 0 ? (pres / att.length) * 100 : 100;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-medium text-slate-900">#{st.rollNo}</td>
                      <td className="p-3 font-semibold text-slate-900">{st.name}</td>
                      <td className="p-3 text-slate-600">{st.batchName}</td>
                      <td className="p-3 font-mono">{att.length}</td>
                      <td className="p-3 font-mono text-slate-900 font-medium">{pres}</td>
                      <td className="p-3 font-mono text-slate-500">{abs}</td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-900">
                        {rate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReportTab === 'fees' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Fee Transactions &amp; Receipts Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">{fees.length} Verified Digital Receipts</p>
            </div>
            <button
              onClick={() => {
                const rows = fees.map((f) => [f.receiptNo, f.studentName, f.amount, f.paymentDate, f.paymentMode]);
                handleExportCSV('fee_ledger_2026', ['Receipt No', 'Student', 'Amount', 'Date', 'Mode'], rows);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.75} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200 font-semibold tracking-wider">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-medium text-slate-900">{f.receiptNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{f.studentName}</td>
                    <td className="p-3 font-mono font-medium text-slate-900">₹{f.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-slate-500">{f.paymentDate}</td>
                    <td className="p-3 text-slate-700">{f.paymentMode}</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.75} />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReportTab === 'exams' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Assessment &amp; Mock Exam Marks Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">Class 10-A Science Foundation</p>
            </div>
            <button
              onClick={() => {
                const rows = examResults.map((r) => [r.examName, r.studentId, r.totalMarks, r.maxMarks, `${r.percentage.toFixed(2)}%`, r.grade]);
                handleExportCSV('exam_report_2026', ['Exam', 'StudentId', 'Total', 'Max', 'Percentage', 'Grade'], rows);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.75} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200 font-semibold tracking-wider">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Exam Name</th>
                  <th className="p-3">Math</th>
                  <th className="p-3">Science</th>
                  <th className="p-3">English</th>
                  <th className="p-3">Total Score</th>
                  <th className="p-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examResults.map((r) => {
                  const student = students.find((s) => s.id === r.studentId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-semibold text-slate-900">{student?.name || 'Student'}</td>
                      <td className="p-3 text-slate-600">{r.examName}</td>
                      <td className="p-3 font-mono">{r.marks['Mathematics'] ?? '-'}</td>
                      <td className="p-3 font-mono">{r.marks['Science'] ?? '-'}</td>
                      <td className="p-3 font-mono">{r.marks['English'] ?? '-'}</td>
                      <td className="p-3 font-mono font-medium text-slate-900">
                        {r.totalMarks} / {r.maxMarks} ({r.percentage.toFixed(1)}%)
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-medium text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                          {r.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
