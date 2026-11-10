import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnquiryLead } from '../../types';
import {
  Users,
  Plus,
  Clock,
  CheckCircle,
  UserPlus,
  X,
} from 'lucide-react';

export const LeadManagement: React.FC = () => {
  const { leads, addLead, updateLeadStage, addStudent, addToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '+91 ',
    email: '',
    interestedCourse: 'Class 10 CBSE Foundation',
    grade: '10th',
    leadStage: 'new' as EnquiryLead['leadStage'],
    followUpDate: '2026-11-12',
    notes: '',
  });

  const stages: { stage: EnquiryLead['leadStage']; label: string }[] = [
    { stage: 'new', label: 'New Enquiry' },
    { stage: 'contacted', label: 'Contacted' },
    { stage: 'demo_scheduled', label: 'Demo Scheduled' },
    { stage: 'followup', label: 'Follow-Up Needed' },
    { stage: 'admitted', label: 'Admitted' },
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim()) return;

    addLead(formData);
    setShowAddModal(false);
  };

  const handleConvertToStudent = (lead: EnquiryLead) => {
    addStudent({
      rollNo: `${Math.floor(200 + Math.random() * 50)}`,
      name: lead.studentName,
      gender: 'male',
      batchId: 'b-10a',
      batchName: 'Class 10-A (Science Foundation)',
      parentName: lead.parentName,
      parentPhone: lead.phone,
      parentEmail: lead.email,
      monthlyFee: 3000,
      discount: 0,
      dateOfBirth: '2011-06-01',
      address: 'Pune, Maharashtra',
      status: 'active',
      academicTarget: 'Board Merit',
      emergencyContact: lead.phone,
    });

    updateLeadStage(lead.id, 'admitted');
    addToast('success', 'Lead Enrolled', `${lead.studentName} converted from prospective lead to enrolled student.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Admissions &amp; Enquiries CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track prospective parent leads from initial inquiry to trial demo and final enrollment.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} /> Add Walk-in / Phone Lead
        </button>
      </div>

      {/* PIPELINE KANBAN COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
        {stages.map(({ stage, label }) => {
          const stageLeads = leads.filter((l) => l.leadStage === stage);
          return (
            <div
              key={stage}
              className="bg-white border border-slate-200 rounded-xl flex flex-col min-w-[220px] shadow-xs overflow-hidden"
            >
              <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50">
                <span className="text-xs font-semibold text-slate-800">
                  {label}
                </span>
                <span className="text-xs font-medium text-slate-500 font-mono">
                  {stageLeads.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 italic">No leads</div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 space-y-2 hover:bg-slate-50/50 transition"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{lead.studentName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Parent: {lead.parentName}</div>
                      </div>

                      <div className="text-[11px] text-slate-700 font-medium">
                        {lead.interestedCourse}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" strokeWidth={1.75} /> Follow-up: <span className="text-slate-800 font-medium">{lead.followUpDate}</span>
                      </div>

                      {lead.notes && (
                        <p className="text-xs text-slate-600 border-l-2 border-slate-300 pl-2 italic leading-relaxed">
                          "{lead.notes}"
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        {stage !== 'admitted' ? (
                          <>
                            <button
                              onClick={() => handleConvertToStudent(lead)}
                              className="text-[11px] font-medium text-slate-900 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <UserPlus className="w-3 h-3" strokeWidth={1.75} /> Admit
                            </button>

                            <select
                              value={lead.leadStage}
                              onChange={(e) => updateLeadStage(lead.id, e.target.value as any)}
                              className="bg-white border border-slate-200 text-[10px] text-slate-700 rounded px-1.5 py-0.5 focus:outline-slate-900"
                            >
                              <option value="new">Move: New</option>
                              <option value="contacted">Contacted</option>
                              <option value="demo_scheduled">Demo</option>
                              <option value="followup">Follow-Up</option>
                              <option value="admitted">Admit</option>
                            </select>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-700 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-slate-700" strokeWidth={1.75} /> Enrolled
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
                Record Admissions Enquiry Lead
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="Candidate name"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Parent Name</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                    placeholder="Father / Mother"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:outline-slate-900"
                    placeholder="+91 98..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-medium block mb-1">Target Course</label>
                  <select
                    value={formData.interestedCourse}
                    onChange={(e) => setFormData({ ...formData, interestedCourse: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  >
                    <option value="Class 10 CBSE Foundation">Class 10 CBSE Foundation</option>
                    <option value="Class 10 Commerce & Math">Class 10 Commerce &amp; Math</option>
                    <option value="Class 12 IIT-JEE PCM 2-Year Program">Class 12 IIT-JEE PCM</option>
                    <option value="Class 12 NEET Medical PCB">Class 12 NEET Medical PCB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Follow-Up Date</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Counsellor Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  placeholder="e.g. Attended physics trial class. Requested fee concession."
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
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
