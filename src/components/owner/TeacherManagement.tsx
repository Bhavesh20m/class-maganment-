import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plus,
  Mail,
  Phone,
  X,
} from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  const { teachers, batches, addTeacher } = useApp();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 ',
    subjects: ['Mathematics'],
    assignedBatchIds: ['b-10a'],
    qualification: 'M.Sc. B.Ed',
    joinDate: '2023-06-01',
    status: 'active' as 'active' | 'on_leave',
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addTeacher(formData);
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Faculty &amp; Teaching Staff
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage subject specialists, batch assignments, and faculty schedules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} /> Appoint Faculty Member
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const assignedBatches = batches.filter((b) =>
            teacher.assignedBatchIds.includes(b.id)
          );

          return (
            <div
              key={teacher.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {teacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{teacher.name}</h3>
                    <div className="text-[11px] text-slate-500 mt-0.5">{teacher.qualification}</div>
                  </div>
                </div>

                <span className="text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md uppercase">
                  {teacher.status}
                </span>
              </div>

              {/* Subjects */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">
                  Subjects Taught
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Batches - 1px hairline divider instead of cards in cards (Rule 4) */}
              <div className="space-y-1.5 py-3 border-t border-b border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">
                  Assigned Batches ({assignedBatches.length})
                </span>
                <div className="divide-y divide-slate-100 text-xs">
                  {assignedBatches.map((b) => (
                    <div
                      key={b.id}
                      className="py-1.5 flex justify-between items-center"
                    >
                      <span className="font-medium text-slate-800">{b.name}</span>
                      <span className="text-[11px] text-slate-500">{b.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD TEACHER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
                Appoint New Faculty Member
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Faculty Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  placeholder="e.g. Dr. Kavita Nair"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="kavita.n@brightfuture.demo"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="+91 98..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Academic Qualifications</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  placeholder="e.g. M.Sc. Mathematics, B.Ed"
                />
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
                  Appoint Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
