import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Award,
  Calendar,
  Plus,
  Send,
  CheckCheck,
  Check,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    students,
    batches,
    attendance,
    homework,
    exams,
    examResults,
    leaveRequests,
    markAttendance,
    bulkMarkAttendance,
    addHomework,
    enterExamMarks,
    reviewLeaveRequest,
    setActiveNavTab,
    setSelectedStudentId,
  } = useApp();

  // Active Teacher: Dr. Rajesh Mehta (Physics & Science)
  const [selectedBatchId, setSelectedBatchId] = useState<string>('b-10a');
  const [activeTab, setActiveTab] = useState<'attendance' | 'homework' | 'marks' | 'leave' | 'students'>('attendance');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-09');

  // Homework Form State
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Science (Physics)');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDueDate, setHwDueDate] = useState('2026-11-13');
  const [showHwModal, setShowHwModal] = useState(false);

  // Marks Entry Form State
  const [selectedExamId, setSelectedExamId] = useState<string>('ex-001');
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState<string>('std-001');
  const [marksInputs, setMarksInputs] = useState<Record<string, number>>({
    Mathematics: 88,
    Science: 94,
    English: 82,
  });
  const [teacherRemarks, setTeacherRemarks] = useState('Solid concept mastery in Physics and Chemistry. Keep practicing numerical questions.');
  const [showMarksModal, setShowMarksModal] = useState(false);

  // Filter students for active batch
  const batchStudents = students.filter((s) => s.batchId === selectedBatchId);
  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Quick mark all present for current batch
  const handleMarkAllPresent = () => {
    const statuses: Record<string, 'present' | 'absent' | 'late'> = {};
    batchStudents.forEach((st) => {
      statuses[st.id] = 'present';
    });
    bulkMarkAttendance(selectedBatchId, selectedDate, statuses);
  };

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;

    addHomework({
      title: hwTitle,
      batchId: selectedBatchId,
      batchName: currentBatch.name,
      subject: hwSubject,
      description: hwDesc,
      assignedDate: selectedDate,
      dueDate: hwDueDate,
      assignedByTeacherId: 't-001',
      teacherName: 'Dr. Rajesh Mehta',
    });

    setHwTitle('');
    setHwDesc('');
    setShowHwModal(false);
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    enterExamMarks({
      examId: selectedExamId,
      studentId: selectedStudentForMarks,
      marks: marksInputs,
      teacherRemarks,
    });
    setShowMarksModal(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Teacher Profile & Batch Header - Single surface */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
            RM
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Dr. Rajesh Mehta</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Physics &amp; Science Faculty · 2 Assigned Batches
            </p>
          </div>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Batch:</label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-slate-500"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.timing})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs - Single dark accent */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'attendance'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckCircle strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Mark Attendance</span>
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
          <span>Homework</span>
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'marks'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Exam Marks</span>
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
          <span>Leave Requests ({leaveRequests.filter((l) => l.status === 'pending').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users strokeWidth={1.75} className="w-3.5 h-3.5" />
          <span>Students ({batchStudents.length})</span>
        </button>
      </div>

      {/* TAB 1: ATTENDANCE MARKING */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-500 font-medium">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-slate-500 font-mono"
              />
              <span className="text-xs text-slate-500">
                {batchStudents.length} Students
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
              >
                <CheckCheck strokeWidth={1.75} className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
            </div>
          </div>

          {/* Student Attendance List - Single surface table with 1px dividers */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-medium">
                  <tr>
                    <th className="px-4 py-3">Roll #</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Parent Info</th>
                    <th className="px-4 py-3">Attendance Rate</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchStudents.map((st) => {
                    const studentRecord = attendance.find(
                      (a) => a.studentId === st.id && a.date === selectedDate
                    );
                    const currentStatus = studentRecord ? studentRecord.status : 'unmarked';

                    const stAtt = attendance.filter((a) => a.studentId === st.id);
                    const presentCount = stAtt.filter((a) => a.status === 'present').length;
                    const attRate = stAtt.length > 0 ? (presentCount / stAtt.length) * 100 : 100;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors duration-150 ease-out">
                        <td className="px-4 py-3 font-mono font-medium text-slate-900">
                          #{st.rollNo}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{st.name}</div>
                          <div className="text-[11px] text-slate-500">{st.academicTarget}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-900">{st.parentName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{st.parentPhone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs tabular-nums text-slate-700">
                            {attRate.toFixed(0)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {currentStatus === 'present' ? (
                            <span className="text-[11px] font-medium text-emerald-700">
                              Present
                            </span>
                          ) : currentStatus === 'absent' ? (
                            <span className="text-[11px] font-medium text-rose-700">
                              Absent
                            </span>
                          ) : currentStatus === 'late' ? (
                            <span className="text-[11px] font-medium text-amber-700">
                              Late
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Unmarked</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => markAttendance(st.id, selectedDate, 'present')}
                              title="Mark Present"
                              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors duration-150 ease-out ${
                                currentStatus === 'present'
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              P
                            </button>
                            <button
                              onClick={() => markAttendance(st.id, selectedDate, 'absent')}
                              title="Mark Absent"
                              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors duration-150 ease-out ${
                                currentStatus === 'absent'
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              A
                            </button>
                            <button
                              onClick={() => markAttendance(st.id, selectedDate, 'late')}
                              title="Mark Late"
                              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors duration-150 ease-out ${
                                currentStatus === 'late'
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              L
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOMEWORK MANAGEMENT - Single surface, 1px dividers, NO nested cards */}
      {activeTab === 'homework' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Assigned Homework ({currentBatch.name})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Dispatched to parents via WhatsApp</p>
            </div>
            <button
              onClick={() => setShowHwModal(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
            >
              <Plus strokeWidth={1.75} className="w-3.5 h-3.5" />
              <span>Assign Homework</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {homework
              .filter((h) => h.batchId === selectedBatchId)
              .map((hw) => (
                <div key={hw.id} className="py-3.5 first:pt-1 last:pb-1 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-xs">{hw.title}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-slate-500">{hw.subject}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {hw.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs text-amber-700 font-medium">Due: {hw.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: MARKS ENTRY - Single surface, 1px dividers */}
      {activeTab === 'marks' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Examination Scorecards</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Marks automatically update report cards and notify parents
              </p>
            </div>
            <button
              onClick={() => setShowMarksModal(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
            >
              <Award strokeWidth={1.75} className="w-3.5 h-3.5" />
              <span>Enter Marks</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {examResults.map((res) => {
              const st = students.find((s) => s.id === res.studentId);
              return (
                <div key={res.id} className="py-3.5 first:pt-1 last:pb-1 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-xs">
                        {st?.name || 'Student'} · {res.examName}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                        {Object.entries(res.marks).map(([subj, score]) => (
                          <span key={subj}>
                            {subj}: <strong className="font-mono tabular-nums">{score}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-slate-900">
                        {res.percentage.toFixed(1)}% (Grade {res.grade})
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    "{res.teacherRemarks}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE REQUESTS - Single surface */}
      {activeTab === 'leave' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
            Student Leave Applications
          </h2>
          <div className="divide-y divide-slate-100">
            {leaveRequests.map((leave) => (
              <div
                key={leave.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{leave.studentName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {leave.startDate} to {leave.endDate}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700 capitalize font-medium">{leave.status}</span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    "{leave.reason}"
                  </p>
                </div>

                {leave.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => reviewLeaveRequest(leave.id, 'approved', 'Approved by Dr. Rajesh Mehta')}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors duration-150 ease-out flex items-center gap-1"
                    >
                      <Check strokeWidth={1.75} className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => reviewLeaveRequest(leave.id, 'rejected', 'Please reschedule; test on Monday.')}
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors duration-150 ease-out"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STUDENTS DIRECTORY - Single surface table */}
      {activeTab === 'students' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Roster for {currentBatch.name}</h2>
            <span className="text-xs text-slate-500">{batchStudents.length} Students</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {batchStudents.map((st) => (
              <div
                key={st.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 ease-out"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {st.name} <span className="text-slate-400 font-mono">#{st.rollNo}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Parent: {st.parentName} ({st.parentPhone})
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedStudentId(st.id);
                    setActiveNavTab('whatsapp');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-md text-xs font-medium transition-colors duration-150 ease-out"
                >
                  WhatsApp Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN HOMEWORK */}
      {showHwModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
                <span>Assign New Homework</span>
              </h3>
              <button
                onClick={() => setShowHwModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Subject</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs"
                >
                  <option value="Science (Physics)">Science (Physics)</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Homework Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Current & Ohm's Law Problems"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Submission Deadline</label>
                <input
                  type="date"
                  required
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Solve Chapter 12 numericals 1 to 15 in homework notebook..."
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowHwModal(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
                >
                  <Send strokeWidth={1.75} className="w-3.5 h-3.5" />
                  <span>Broadcast via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ENTER MARKS */}
      {showMarksModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Award strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
                <span>Enter Student Test Marks</span>
              </h3>
              <button
                onClick={() => setShowMarksModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Select Examination</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.batchName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Select Student</label>
                <select
                  value={selectedStudentForMarks}
                  onChange={(e) => setSelectedStudentForMarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs"
                >
                  {batchStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      #{st.rollNo} - {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Mathematics (100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={marksInputs['Mathematics'] ?? 85}
                    onChange={(e) =>
                      setMarksInputs({ ...marksInputs, Mathematics: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Science (100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={marksInputs['Science'] ?? 91}
                    onChange={(e) =>
                      setMarksInputs({ ...marksInputs, Science: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">English (100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={marksInputs['English'] ?? 78}
                    onChange={(e) =>
                      setMarksInputs({ ...marksInputs, English: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Teacher Remarks</label>
                <textarea
                  rows={2}
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowMarksModal(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
                >
                  <Award strokeWidth={1.75} className="w-3.5 h-3.5" />
                  <span>Save &amp; Notify Parent</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
