import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Search,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';

export const ParentCommunication: React.FC = () => {
  const {
    students,
    whatsappMessages,
    setSelectedStudentId,
    setActiveNavTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');

  // Filter messages
  const filteredMessages = whatsappMessages.filter((msg) => {
    const student = students.find((s) => s.id === msg.conversationId);
    if (!student) return false;

    const matchesSearch =
      msg.text.toLowerCase().includes(search.toLowerCase()) ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.parentName.toLowerCase().includes(search.toLowerCase());

    const matchesStudent =
      selectedStudentFilter === 'all' || student.id === selectedStudentFilter;

    return matchesSearch && matchesStudent;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-900" strokeWidth={1.75} /> Parent WhatsApp Communication Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit simulated 24/7 parent chatbot interactions, attendance alerts, and automated receipts across all students.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedStudentId('std-001');
            setActiveNavTab('whatsapp');
          }}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" strokeWidth={1.75} /> Open WhatsApp Simulator
        </button>
      </div>

      {/* Search and Filters (Single surface) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search message text, student name or parent phone..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Filter by Student:</label>
          <select
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-slate-900"
          >
            <option value="all">All Student Chats ({whatsappMessages.length} Messages)</option>
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                #{st.rollNo} - {st.name} ({st.parentName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Feed: Single surface with 1px dividers (Rule 4) */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-xs">
        {filteredMessages.map((msg) => {
          const student = students.find((s) => s.id === msg.conversationId);
          const isParent = msg.sender === 'parent';

          return (
            <div
              key={msg.id}
              className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                    isParent
                      ? 'bg-slate-100 border-slate-200 text-slate-900'
                      : 'bg-slate-900 border-slate-900 text-white'
                  }`}
                >
                  {isParent ? <User className="w-4 h-4" strokeWidth={1.75} /> : <Bot className="w-4 h-4" strokeWidth={1.75} />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">
                      {isParent ? `${student?.parentName} (Parent)` : 'AUTOMEXA Assistant'}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                      Student: {student?.name} (#{student?.rollNo})
                    </span>
                    {msg.workflowId && (
                      <span className="text-[10px] bg-slate-50 text-slate-700 font-mono font-medium px-1.5 py-0.5 rounded-md border border-slate-200">
                        {msg.workflowId.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed pt-1">
                    {msg.text}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 text-right">
                <span className="text-[11px] font-mono text-slate-400">{msg.timestamp}</span>
                <button
                  onClick={() => {
                    setSelectedStudentId(msg.conversationId);
                    setActiveNavTab('whatsapp');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Chat</span>
                  <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
