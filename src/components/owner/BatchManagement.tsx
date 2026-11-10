import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Clock,
  MapPin,
  X,
} from 'lucide-react';

export const BatchManagement: React.FC = () => {
  const { batches, students, teachers, addBatch } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '11th',
    stream: 'Science',
    timing: '05:00 PM - 07:00 PM (Mon-Sat)',
    room: 'Hall 203',
    teacherIds: ['t-001'],
    capacity: 35,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addBatch(formData);
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Academic Batches &amp; Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure classrooms, batch capacities, daily schedule timings, and assigned faculty.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} /> Create New Batch
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((batch) => {
          const enrolledCount = students.filter((s) => s.batchId === batch.id).length;
          const assignedTeachers = teachers.filter((t) =>
            t.assignedBatchIds.includes(batch.id)
          );
          const occupancy = Math.round((enrolledCount / batch.capacity) * 100);

          return (
            <div
              key={batch.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                    {batch.grade} • {batch.stream}
                  </span>
                  <h3 className="font-semibold text-slate-900 text-base mt-2">{batch.name}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-medium text-slate-900">
                    {enrolledCount} / {batch.capacity} Seats
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{occupancy}% Occupancy</span>
                </div>
              </div>

              {/* Progress Bar (Single dark accent, no gradients) */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(occupancy, 100)}%` }}
                />
              </div>

              {/* Schedule and Room - Hairline divider instead of cards inside cards */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-slate-100 text-xs">
                <div className="space-y-1">
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} /> Daily Schedule
                  </div>
                  <div className="font-medium text-slate-900">{batch.timing}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} /> Classroom Location
                  </div>
                  <div className="font-medium text-slate-900">{batch.room}</div>
                </div>
              </div>

              {/* Assigned Faculty */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block">
                  Assigned Subject Faculty ({assignedTeachers.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {assignedTeachers.map((t) => (
                    <span
                      key={t.id}
                      className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded-md border border-slate-200 text-xs"
                    >
                      {t.name} ({t.subjects[0]})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE BATCH MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
                Configure New Academic Batch
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
                <label className="text-xs text-slate-700 font-medium block mb-1">Batch Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  placeholder="e.g. Class 11-A (JEE Advanced Foundation)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Target Grade</label>
                  <input
                    type="text"
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="e.g. 11th"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Max Student Capacity</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={100}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Daily Timings</label>
                  <input
                    type="text"
                    required
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="e.g. 05:00 PM - 07:00 PM"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Classroom / Hall</label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="e.g. Hall 203 (2nd Floor)"
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
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
