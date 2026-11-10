import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Plus,
  Send,
  Calendar,
  CheckCheck,
  X,
} from 'lucide-react';

export const Announcements: React.FC = () => {
  const { announcements, batches, createAnnouncement } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetBatchId, setTargetBatchId] = useState('all');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'event'>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const targetBatch =
      targetBatchId === 'all'
        ? { name: 'All Batches' }
        : batches.find((b) => b.id === targetBatchId) || { name: 'Specific Batch' };

    createAnnouncement({
      title,
      content,
      targetBatchId,
      targetBatchName: targetBatch.name,
      priority,
      sentBy: 'Director Office',
    });

    setTitle('');
    setContent('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Institute Announcements &amp; Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish official circulars, examination notices, and holiday announcements (WF08 auto-dispatches to WhatsApp).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} /> Broadcast Notice (WF08)
        </button>
      </div>

      {/* Announcements List: Single surface cards with 1px dividers, no nested cards (Rule 4) */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase border ${
                    anc.priority === 'urgent'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : anc.priority === 'event'
                      ? 'bg-slate-100 text-slate-800 border-slate-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {anc.priority}
                </span>
                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {anc.targetBatchName}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">{anc.title}</h3>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                {anc.date}
              </div>
            </div>

            {/* Direct text without nested card box (Rule 4) */}
            <p className="text-xs text-slate-700 leading-relaxed py-1">
              {anc.content}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Issued by: <strong className="text-slate-800">{anc.sentBy}</strong></span>
              <span className="text-slate-700 font-medium flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.75} /> Dispatched to Parent WhatsApp Chats (WF08)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
                Broadcast Circular to Parents
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
                <label className="text-xs text-slate-700 font-medium block mb-1">Target Audience</label>
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                >
                  <option value="all">All Batches (Institute-wide Broadcast)</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  placeholder="e.g. Diwali Holiday Schedule & Revision Classes"
                />
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                >
                  <option value="normal">Normal Announcement</option>
                  <option value="urgent">Urgent Notice</option>
                  <option value="event">Academy Event</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-medium block mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-slate-900"
                  placeholder="Detailed circular notice body..."
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
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Dispatch Circular (WF08)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
