import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  CreditCard,
  Award,
  Calendar,
  X,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const {
    students,
    batches,
    attendance,
    fees,
    examResults,
    addStudent,
    updateStudent,
    deleteStudent,
    setSelectedStudentId,
    setActiveNavTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [activeProfileStudent, setActiveProfileStudent] = useState<Student | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    gender: 'male' as 'male' | 'female' | 'other',
    batchId: 'b-10a',
    parentName: '',
    parentPhone: '+91 ',
    parentEmail: '',
    monthlyFee: 3000,
    discount: 0,
    dateOfBirth: '2011-01-01',
    address: 'Pune, Maharashtra',
    status: 'active' as 'active' | 'inactive',
    academicTarget: 'Board Merit',
    emergencyContact: '+91 ',
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search) ||
      s.parentName.toLowerCase().includes(search.toLowerCase()) ||
      s.parentPhone.includes(search);
    const matchesBatch =
      selectedBatchFilter === 'all' || s.batchId === selectedBatchFilter;
    return matchesSearch && matchesBatch;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      rollNo: `${100 + students.length + 1}`,
      gender: 'male',
      batchId: 'b-10a',
      parentName: '',
      parentPhone: '+91 98',
      parentEmail: '',
      monthlyFee: 3000,
      discount: 0,
      dateOfBirth: '2011-05-15',
      address: 'Pune, Maharashtra',
      status: 'active',
      academicTarget: 'Top 5 in Board Exams',
      emergencyContact: '+91 98',
    });
    setEditingStudent(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      gender: student.gender,
      batchId: student.batchId,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      monthlyFee: student.monthlyFee,
      discount: student.discount,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      status: student.status,
      academicTarget: student.academicTarget || '',
      emergencyContact: student.emergencyContact,
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find((b) => b.id === formData.batchId);
    const batchName = batch ? batch.name : 'General Batch';

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData,
        batchName,
      });
    } else {
      addStudent({
        ...formData,
        batchName,
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Student Directory &amp; Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage student registrations, assigned batches, parent contacts, and fees.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} /> Enroll New Student
        </button>
      </div>

      {/* Filters and Search Bar (Single surface) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, roll number, or parent phone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Batch Filter:</label>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-slate-900"
          >
            <option value="all">All Batches ({students.length})</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Roll #</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Assigned Batch</th>
                <th className="px-4 py-3 font-semibold">Parent Info</th>
                <th className="px-4 py-3 font-semibold">Monthly Fee</th>
                <th className="px-4 py-3 font-semibold">Fee Balance</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr
                  key={st.id}
                  className="hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => setActiveProfileStudent(st)}
                >
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-900">
                    #{st.rollNo}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{st.name}</span>
                      {st.id === 'std-001' && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                          Demo Student
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{st.academicTarget}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-700 font-medium">{st.batchName}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-900 font-medium">{st.parentName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{st.parentPhone}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-800">
                    ₹{st.monthlyFee.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`font-medium font-mono px-2 py-0.5 rounded-md text-xs border ${
                        st.feeBalance > 0
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {st.feeBalance === 0 ? 'Fully Paid' : `₹${st.feeBalance.toLocaleString('en-IN')}`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedStudentId(st.id);
                          setActiveNavTab('whatsapp');
                        }}
                        title="Open WhatsApp Chat"
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-slate-900 transition cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(st)}
                        title="Edit Student"
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-900 transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => deleteStudent(st.id)}
                        title="Delete Student"
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE DRAWER */}
      {activeProfileStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full overflow-y-auto p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {activeProfileStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{activeProfileStudent.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Roll #{activeProfileStudent.rollNo} • {activeProfileStudent.batchName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveProfileStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Quick WhatsApp Action Button */}
            <button
              onClick={() => {
                setSelectedStudentId(activeProfileStudent.id);
                setActiveNavTab('whatsapp');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
              Open Parent WhatsApp Conversation
            </button>

            {/* Parent Details: Single surface with 1px dividers (Rule 4) */}
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50 font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                Parent &amp; Emergency Contact
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Parent Name:</span>
                <span className="font-medium text-slate-900">{activeProfileStudent.parentName}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono text-slate-900">{activeProfileStudent.parentPhone}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="text-slate-800 truncate max-w-[250px]">{activeProfileStudent.address}</span>
              </div>
            </div>

            {/* Fee Status: Single surface with 1px dividers (Rule 4) */}
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50 font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                Fee Account Summary
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Monthly Tuition:</span>
                <span className="font-mono text-slate-900">₹{activeProfileStudent.monthlyFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-mono text-slate-900 font-medium">₹{activeProfileStudent.totalPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 flex justify-between font-medium">
                <span className="text-slate-700">Pending Balance:</span>
                <span className={activeProfileStudent.feeBalance > 0 ? 'text-amber-800' : 'text-slate-900'}>
                  ₹{activeProfileStudent.feeBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Recent Payments for this Student */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                Payment History
              </h3>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                {fees
                  .filter((f) => f.studentId === activeProfileStudent.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 flex justify-between items-center hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{p.receiptNo}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{p.paymentDate} • {p.paymentMode}</div>
                      </div>
                      <div className="font-mono font-medium text-slate-900">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
                {editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="e.g. Rohan Gavaskar"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Assign Batch</label>
                <select
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Parent Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="Father/Mother name"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Parent WhatsApp Mobile</label>
                  <input
                    type="text"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                    placeholder="+91 98200 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Monthly Tuition Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Academic Target</label>
                  <input
                    type="text"
                    value={formData.academicTarget}
                    onChange={(e) => setFormData({ ...formData, academicTarget: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="e.g. CBSE 95%+"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
