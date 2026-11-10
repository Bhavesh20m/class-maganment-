import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Search,
  CheckCheck,
  Bot,
  Paperclip,
  Smile,
  CalendarCheck,
  Calendar,
  CreditCard,
  BookOpen,
  Clock,
  Bell,
  ArrowLeft,
  FileText,
  AlertCircle,
  Award,
} from 'lucide-react';

export const WhatsAppSimulator: React.FC = () => {
  const {
    students,
    whatsappMessages,
    sendParentWhatsAppMessage,
    isBotTyping,
    selectedStudentId,
    setSelectedStudentId,
    setActiveReceipt,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active student conversation
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Filter conversations
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery)
  );

  // Messages for active conversation
  const activeMessages = whatsappMessages.filter(
    (m) => m.conversationId === currentStudent.id
  );

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isBotTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendParentWhatsAppMessage(currentStudent.id, text.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Rule 2: Consistent Lucide line icons, strokeWidth 1.75, 16px. ZERO EMOJIS.
  const quickChips = [
    { label: "Today's Attendance", icon: CalendarCheck, query: 'Is my child present today?' },
    { label: 'Monthly Attendance', icon: Calendar, query: 'What is monthly attendance?' },
    { label: 'Pending Fees', icon: CreditCard, query: 'What are the pending fees?' },
    { label: 'Fee Receipt', icon: FileText, query: 'Show my latest fee receipt' },
    { label: 'Latest Results', icon: Award, query: 'Show latest exam marks' },
    { label: "Today's Homework", icon: BookOpen, query: 'What is today\'s homework?' },
    { label: 'Timetable', icon: Clock, query: 'What is the class timetable?' },
    { label: 'Announcements', icon: Bell, query: 'Show latest announcements' },
  ];

  return (
    <div className="flex h-[calc(100vh-56px)] bg-white overflow-hidden font-sans border-t border-slate-200">
      {/* LEFT PANEL: CONVERSATION LIST */}
      <div
        className={`w-full md:w-[360px] lg:w-[400px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 ${
          mobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Left Header */}
        <div className="p-3 bg-[#f0f2f5] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-xs">
              WA
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Parent Inquiries
              </div>
              <p className="text-[11px] text-slate-500">Automated Parent Desk</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 bg-white border-b border-slate-200">
          <div className="relative">
            <Search strokeWidth={1.75} className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parent or student name..."
              className="w-full bg-[#f0f2f5] border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Conversation Items - 1px hairline dividers, no thick left borders */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredStudents.map((st) => {
            const isSelected = st.id === currentStudent.id;
            const msgs = whatsappMessages.filter((m) => m.conversationId === st.id);
            const lastMsg = msgs[msgs.length - 1];

            return (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStudentId(st.id);
                  setMobileChatOpen(true);
                }}
                className={`w-full text-left p-3 flex items-start gap-3 transition-colors duration-200 ease-out ${
                  isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-medium text-xs">
                    {st.name.charAt(0)}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {st.parentName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {lastMsg ? lastMsg.timestamp : 'Active'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate mb-0.5">
                    {st.name} · Roll #{st.rollNo}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {lastMsg ? lastMsg.text.substring(0, 48) : 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center">
          Simulated Parent Channel · Real-time Dynamic Response
        </div>
      </div>

      {/* RIGHT PANEL: CHAT WINDOW */}
      <div
        className={`flex-1 bg-[#efeae2] flex flex-col h-full ${
          !mobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Chat Header */}
        <div className="p-3 bg-[#f0f2f5] border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileChatOpen(false)}
              className="md:hidden p-1 text-slate-600 hover:text-slate-900 transition-colors duration-150 ease-out"
            >
              <ArrowLeft strokeWidth={1.75} className="w-4 h-4" />
            </button>

            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-xs">
              {currentStudent.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">
                  {currentStudent.parentName} ({currentStudent.parentPhone})
                </span>
                <span className="text-[10px] text-slate-500">
                  {currentStudent.batchName}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Student: {currentStudent.name} · Roll #{currentStudent.rollNo}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs">
              <span className="text-slate-500">Fee Balance:</span>
              <span className="font-semibold text-slate-900 font-mono tabular-nums">
                ₹{currentStudent.feeBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* CHAT MESSAGES CANVAS */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2] relative"
        >
          {/* Security Banner */}
          <div className="flex justify-center my-1">
            <div className="bg-white/80 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 max-w-md text-center flex items-center justify-center gap-1.5">
              <AlertCircle strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>
                Simulated parent channel for <strong className="text-slate-900">{currentStudent.name}</strong>.
              </span>
            </div>
          </div>

          {activeMessages.map((msg) => {
            const isParent = msg.sender === 'parent';
            const isInstituteAlert = msg.sender === 'institute';

            return (
              <div
                key={msg.id}
                className={`flex ${isParent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isParent
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                      : isInstituteAlert
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}
                >
                  {/* Sender label */}
                  {!isParent && (
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-semibold text-slate-900">
                      <Bot strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-600" />
                      <span>
                        {isInstituteAlert ? 'Institute Broadcast' : 'Automated Assistant'}
                      </span>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans text-xs text-slate-800">
                    {msg.text}
                  </div>

                  {/* Digital Receipt Card (if attached to message) */}
                  {msg.receiptData && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText strokeWidth={1.75} className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-semibold text-slate-900 text-[11px] font-mono">
                            {msg.receiptData.receiptNo}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                            Amount: ₹{msg.receiptData.amount?.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveReceipt(msg.receiptData as any)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-medium rounded-md transition-colors duration-200 ease-out"
                      >
                        View Receipt
                      </button>
                    </div>
                  )}

                  {/* Timestamp & Status */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400 font-mono tabular-nums">
                    <span>{msg.timestamp}</span>
                    {isParent && (
                      <CheckCheck strokeWidth={1.75} className="w-3.5 h-3.5 text-sky-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bot Typing Indicator - No looping animations */}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                <Bot strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px]">Retrieving student records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTIONS CAROUSEL - Rule 2: Lucide line icons, no emojis */}
        <div className="bg-white px-3 py-2 border-t border-slate-200 overflow-x-auto flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap mr-1">
            Inquiries:
          </span>
          {quickChips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 ease-out whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
              >
                <Icon strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-500" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* INPUT BAR */}
        <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleSend('Hello')}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md transition-colors duration-150 ease-out"
            title="Send Greeting"
          >
            <Smile strokeWidth={1.75} className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSend('Show my fee receipt')}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md transition-colors duration-150 ease-out"
            title="Inquire Receipt"
          >
            <Paperclip strokeWidth={1.75} className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${currentStudent.name}'s attendance, fees, marks, homework...`}
            className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-white rounded-lg transition-colors duration-200 ease-out flex items-center justify-center"
          >
            <Send strokeWidth={1.75} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
