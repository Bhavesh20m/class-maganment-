import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Calendar,
  CreditCard,
  Award,
  BookOpen,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send,
  PhoneCall,
  CalendarCheck,
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const {
    students,
    attendance,
    fees,
    examResults,
    homework,
    announcements,
    leaveRequests,
    submitLeaveRequest,
    setActiveReceipt,
    setActiveNavTab,
    addToast,
  } = useApp();

  // Primary demo student for parent is Rahul Sharma (std-001)
  const student = students.find((s) => s.id === 'std-001') || students[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'fees' | 'homework' | 'leave'>('overview');

  // Leave Form
  const [leaveStart, setLeaveStart] = useState('2026-11-16');
  const [leaveEnd, setLeaveEnd] = useState('2026-11-17');
  const [leaveReason, setLeaveReason] = useState('');

  // Callback request form
  const [callbackTeacher, setCallbackTeacher] = useState('Dr. Rajesh Mehta (Physics)');
  const [callbackTime, setCallbackTime] = useState('Evening 5:00 PM - 6:00 PM');

  // Student metrics
  const studentAtt = attendance.filter((a) => a.studentId === student.id);
  const presentDays = studentAtt.filter((a) => a.status === 'present').length;
  const absentDays = studentAtt.filter((a) => a.status === 'absent').length;
  const lateDays = studentAtt.filter((a) => a.status === 'late').length;
  const totalDays = studentAtt.length;
  const attRate = totalDays > 0 ? ((presentDays + lateDays * 0.5) / totalDays) * 100 : 100;

  // Today's attendance
  const todayRecord = studentAtt.find((a) => a.date === '2026-11-09');

  // Latest exam
  const latestResult = examResults.find((r) => r.studentId === student.id);

  // Student payments
  const studentPayments = fees.filter((f) => f.studentId === student.id);

  // Student homework
  const studentHw = homework.filter((h) => h.batchId === student.batchId);

  // Leave requests for Rahul
  const studentLeaves = leaveRequests.filter((l) => l.studentId === student.id);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    submitLeaveRequest({
      studentId: student.id,
      studentName: student.name,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
    });

    setLeaveReason('');
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Callback Requested', `A phone discussion with ${callbackTeacher} has been scheduled.`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      {/* Student Overview Header - Single surface, no gradients or glows */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {student.name}
              </h1>
              <span className="text-xs text-slate-500 font-mono">
                Roll #{student.rollNo}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {student.batchName} · Parent: {student.parentName}
            </p>
          </div>
        </div>

        {/* Action Button - Single dark accent */}
        <div>
          <button
            onClick={() => setActiveNavTab('whatsapp')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs transition-colors duration-200 ease-out flex items-center justify-center gap-2"
          >
            <MessageSquare strokeWidth={1.75} className="w-4 h-4 text-slate-300" />
            <span>Open WhatsApp Assistant</span>
          </button>
        </div>
      </div>

      {/* Tabs - Single surface, outer rounded-lg, padding 4px -> inner rounded-md 4px */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('academics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'academics'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Scorecard</span>
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'fees'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Fees &amp; Receipts ({studentPayments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('homework')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'homework'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Homework ({studentHw.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'leave'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Request Leave</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Stat Cards - Label & value 2-4px apart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Today's Attendance */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>Today's Status</span>
                <Calendar strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-semibold text-slate-900 flex items-center gap-1.5">
                  {todayRecord?.status === 'present' ? (
                    <>
                      <CheckCircle strokeWidth={1.75} className="w-4 h-4 text-emerald-600" />
                      <span>Present</span>
                    </>
                  ) : todayRecord?.status === 'absent' ? (
                    <>
                      <XCircle strokeWidth={1.75} className="w-4 h-4 text-rose-600" />
                      <span>Absent</span>
                    </>
                  ) : (
                    <span>Present in Class</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Monday, 09 Nov 2026</p>
              </div>
            </div>

            {/* Monthly Attendance */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>Monthly Attendance</span>
                <CheckCircle strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
                  {attRate.toFixed(1)}%
                </div>
                <p className="text-xs text-slate-500">
                  {presentDays} present · {absentDays} absent of {totalDays} days
                </p>
              </div>
            </div>

            {/* Fee Balance */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>Fee Balance</span>
                <CreditCard strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
                  ₹{student.feeBalance.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500">
                  {student.feeBalance === 0 ? 'All dues cleared' : 'Due by 10th Nov'}
                </p>
              </div>
            </div>

            {/* Latest Result */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>Latest Mock Score</span>
                <Award strokeWidth={1.75} className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
                  {latestResult ? `${latestResult.percentage.toFixed(1)}%` : '88.0%'}
                </div>
                <p className="text-xs text-slate-500">
                  Grade: {latestResult ? latestResult.grade : 'A'} · Rank: Top 5
                </p>
              </div>
            </div>
          </div>

          {/* Quick Notice & Timetable - Single surfaces, 1px dividers, NO nested cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Timetable */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Clock strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
                  <span>Class Schedule &amp; Timings</span>
                </h3>
                <span className="text-xs text-slate-500">Room: Hall 101</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 first:pt-1 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-900">Monday to Saturday Regular Classes</div>
                    <div className="text-slate-500 text-[11px]">04:00 PM – 06:00 PM</div>
                  </div>
                  <span className="text-[11px] text-slate-700 font-medium">Regular</span>
                </div>
                <div className="py-2.5 last:pb-0 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-900">Sunday Doubt Clearing Session</div>
                    <div className="text-slate-500 text-[11px]">10:00 AM – 01:00 PM</div>
                  </div>
                  <span className="text-[11px] text-slate-700 font-medium">Optional</span>
                </div>
              </div>
            </div>

            {/* Academy Announcements */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Bell strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
                  <span>Recent Circulars</span>
                </h3>
                <span className="text-xs text-slate-500">Updated</span>
              </div>

              <div className="divide-y divide-slate-100">
                {announcements.slice(0, 2).map((anc) => (
                  <div key={anc.id} className="py-2.5 first:pt-1 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 text-xs">{anc.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums">{anc.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMICS / RESULTS - No nested cards */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Academic Performance &amp; Progress Card
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Certified assessment results for Board Foundation batch.
                </p>
              </div>
              <span className="text-xs text-slate-800 font-semibold">
                Overall Grade: A (88.0%)
              </span>
            </div>

            {latestResult && (
              <div className="space-y-4">
                <div className="divide-y divide-slate-100">
                  {Object.entries(latestResult.marks).map(([subject, mark]) => (
                    <div key={subject} className="py-3 first:pt-1 last:pb-0 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900">{subject}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono tabular-nums text-slate-900 font-semibold">{mark} / 100</span>
                        <span className="text-[11px] text-slate-500 w-24 text-right">
                          {mark >= 90 ? 'Outstanding' : mark >= 80 ? 'Very Good' : 'Satisfactory'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-800 block mb-1">Faculty Remarks:</span>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{latestResult.teacherRemarks}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FEES & RECEIPTS - Single surface table with 1px dividers */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Outstanding Balance</div>
              <div className="text-2xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
                ₹{student.feeBalance.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Monthly Fee: ₹{student.monthlyFee.toLocaleString('en-IN')} · Total Paid: ₹{student.totalPaid.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToast('info', 'Demo Payment Portal', 'To demonstrate fee recording, please switch to the Owner Admin role and click "Record Payment".')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out"
              >
                Pay via UPI / NetBanking
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold text-xs text-slate-900">
              Payment Receipts History
            </div>
            <div className="divide-y divide-slate-100">
              {studentPayments.map((pay) => (
                <div
                  key={pay.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 ease-out"
                >
                  <div className="flex items-center gap-3">
                    <FileText strokeWidth={1.75} className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900 text-xs font-mono">{pay.receiptNo}</div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {pay.paymentDate} · {pay.paymentMode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 text-xs font-mono tabular-nums">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Paid
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveReceipt(pay)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-md text-xs font-medium transition-colors duration-150 ease-out"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOMEWORK - Single surface, 1px dividers, NO nested cards */}
      {activeTab === 'homework' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Assigned Homework &amp; Tasks</h2>
          <div className="divide-y divide-slate-100">
            {studentHw.map((hw) => (
              <div key={hw.id} className="py-3.5 first:pt-1 last:pb-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{hw.title}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{hw.subject}</span>
                  </div>
                  <span className="text-xs text-amber-700 font-medium">Due: {hw.dueDate}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {hw.description}
                </p>
                <div className="text-[11px] text-slate-400">
                  Assigned by {hw.teacherName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: LEAVE & CALLBACK - Single surface per section, NO nested cards */}
      {activeTab === 'leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Leave Application */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calendar strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
              <span>Submit Leave Note</span>
            </h3>

            <form onSubmit={handleLeaveSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Mild fever, doctor advised rest..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center justify-center gap-1.5"
              >
                <Send strokeWidth={1.75} className="w-3.5 h-3.5" />
                <span>Submit to Faculty</span>
              </button>
            </form>

            {/* Leave History - 1px dividers */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-semibold text-slate-700">Previous Leave Notes</h4>
              <div className="divide-y divide-slate-100">
                {studentLeaves.map((l) => (
                  <div key={l.id} className="py-2 first:pt-0 last:pb-0 text-xs flex justify-between items-center">
                    <div>
                      <div className="text-slate-900 font-medium">
                        {l.startDate} to {l.endDate}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                        {l.reason}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 capitalize">
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Request Teacher Callback */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <PhoneCall strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
              <span>Schedule Teacher Callback</span>
            </h3>
            <p className="text-xs text-slate-500">
              Request a 10-minute telephonic discussion regarding academic progress.
            </p>

            <form onSubmit={handleCallbackSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Subject Faculty</label>
                <select
                  value={callbackTeacher}
                  onChange={(e) => setCallbackTeacher(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                >
                  <option value="Dr. Rajesh Mehta (Physics)">Dr. Rajesh Mehta (Physics &amp; Science)</option>
                  <option value="Sneha Kulkarni (Mathematics)">Sneha Kulkarni (Mathematics)</option>
                  <option value="Amit Saxena (Chemistry)">Amit Saxena (Chemistry)</option>
                  <option value="Vikram Nair (English)">Vikram Nair (English)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Preferred Time Window</label>
                <select
                  value={callbackTime}
                  onChange={(e) => setCallbackTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                >
                  <option value="Evening 5:00 PM - 6:00 PM">Evening 5:00 PM – 6:00 PM</option>
                  <option value="Morning 11:00 AM - 12:00 PM">Morning 11:00 AM – 12:00 PM</option>
                  <option value="Saturday 2:00 PM - 3:00 PM">Saturday 2:00 PM – 3:00 PM</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center justify-center gap-1.5"
              >
                <PhoneCall strokeWidth={1.75} className="w-3.5 h-3.5" />
                <span>Request Call</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
