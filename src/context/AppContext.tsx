import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Role,
  Student,
  Teacher,
  Batch,
  AttendanceRecord,
  FeePayment,
  Exam,
  ExamResult,
  Homework,
  Announcement,
  WhatsAppMessage,
  AutomationWorkflow,
  AutomationLog,
  EnquiryLead,
  LeaveRequest,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_BATCHES,
  INITIAL_FEES,
  INITIAL_EXAMS,
  INITIAL_EXAM_RESULTS,
  INITIAL_HOMEWORK,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUTOMATIONS,
  INITIAL_AUTOMATION_LOGS,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_LEADS,
  INITIAL_LEAVE_REQUESTS,
  generateInitialAttendance,
} from '../data/initialData';
import { generateBotResponse } from '../utils/whatsappBot';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Role & navigation
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  showCampus3D: boolean;
  setShowCampus3D: (show: boolean) => void;

  // Data
  students: Student[];
  teachers: Teacher[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  exams: Exam[];
  examResults: ExamResult[];
  homework: Homework[];
  announcements: Announcement[];
  whatsappMessages: WhatsAppMessage[];
  automations: AutomationWorkflow[];
  automationLogs: AutomationLog[];
  leads: EnquiryLead[];
  leaveRequests: LeaveRequest[];

  // Bot typing state
  isBotTyping: boolean;

  // UI helpers
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Receipt Modal
  activeReceipt: FeePayment | null;
  setActiveReceipt: (receipt: FeePayment | null) => void;

  // Guided Live Demo Presentation
  guidedDemoStep: number | null; // null = inactive, 1..15 = active
  startGuidedDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitGuidedDemo: () => void;

  // Actions
  markAttendance: (studentId: string, date: string, status: 'present' | 'absent' | 'late', remarks?: string) => void;
  bulkMarkAttendance: (batchId: string, date: string, statuses: Record<string, 'present' | 'absent' | 'late'>) => void;
  addHomework: (data: Omit<Homework, 'id' | 'status'>) => void;
  recordFeePayment: (payment: {
    studentId: string;
    amount: number;
    paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
    discount?: number;
    lateFee?: number;
    notes?: string;
  }) => FeePayment;
  enterExamMarks: (data: {
    examId: string;
    studentId: string;
    marks: Record<string, number>;
    teacherRemarks: string;
  }) => void;
  createAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => void;
  sendParentWhatsAppMessage: (studentId: string, text: string) => void;
  runAutomationWorkflow: (workflowCode: string) => void;
  toggleWorkflow: (id: string) => void;
  
  // Entity CRUD
  addStudent: (student: Omit<Student, 'id' | 'totalPaid' | 'feeBalance'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  updateBatch: (batch: Batch) => void;
  addLead: (lead: Omit<EnquiryLead, 'id' | 'createdAt'>) => void;
  updateLeadStage: (id: string, stage: EnquiryLead['leadStage']) => void;
  submitLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'requestedAt' | 'status'>) => void;
  reviewLeaveRequest: (id: string, status: 'approved' | 'rejected', remarks?: string) => void;

  // Reset demo
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'automexa_db_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Role
  const [currentRole, setCurrentRole] = useState<Role>('owner');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-001'); // Default: Rahul Sharma
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');
  const [showCampus3D, setShowCampus3D] = useState<boolean>(false);

  // Core Data loaded from localStorage if available
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teachers`);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_batches`);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : generateInitialAttendance();
  });

  const [fees, setFees] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_fees`);
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exam_results`);
    return saved ? JSON.parse(saved) : INITIAL_EXAM_RESULTS;
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_homework`);
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_whatsapp_messages`);
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_MESSAGES;
  });

  const [automations, setAutomations] = useState<AutomationWorkflow[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_automations`);
    return saved ? JSON.parse(saved) : INITIAL_AUTOMATIONS;
  });

  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_automation_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUTOMATION_LOGS;
  });

  const [leads, setLeads] = useState<EnquiryLead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leave_requests`);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<FeePayment | null>(null);
  const [guidedDemoStep, setGuidedDemoStep] = useState<number | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY}_batches`, JSON.stringify(batches));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY}_fees`, JSON.stringify(fees));
      localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
      localStorage.setItem(`${STORAGE_KEY}_exam_results`, JSON.stringify(examResults));
      localStorage.setItem(`${STORAGE_KEY}_homework`, JSON.stringify(homework));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
      localStorage.setItem(`${STORAGE_KEY}_whatsapp_messages`, JSON.stringify(whatsappMessages));
      localStorage.setItem(`${STORAGE_KEY}_automations`, JSON.stringify(automations));
      localStorage.setItem(`${STORAGE_KEY}_automation_logs`, JSON.stringify(automationLogs));
      localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${STORAGE_KEY}_leave_requests`, JSON.stringify(leaveRequests));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [students, teachers, batches, attendance, fees, exams, examResults, homework, announcements, whatsappMessages, automations, automationLogs, leads, leaveRequests]);

  // Toast Helpers
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: Increment workflow execution count and add log
  const recordWorkflowExecution = (code: string, studentName: string, parentPhone: string, summary: string, details?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];
    const timestamp = `${dateStr} ${timeStr}`;

    setAutomations((prev) =>
      prev.map((wf) => {
        if (wf.code === code) {
          return {
            ...wf,
            executionCount: wf.executionCount + 1,
            successCount: wf.successCount + 1,
            lastExecutedAt: now.toISOString(),
          };
        }
        return wf;
      })
    );

    const targetWf = automations.find((w) => w.code === code);
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      workflowId: targetWf?.id || code,
      workflowCode: code,
      workflowName: targetWf?.name || code,
      timestamp,
      status: 'success',
      studentName,
      parentPhone,
      summary,
      details,
    };

    setAutomationLogs((prev) => [newLog, ...prev]);
  };

  // ACTION 1: Mark Attendance (Interconnected to WF01)
  const markAttendance = (studentId: string, date: string, status: 'present' | 'absent' | 'late', remarks?: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const existingIdx = attendance.findIndex((a) => a.studentId === studentId && a.date === date);
    const nowIso = new Date().toISOString();
    const updatedRecord: AttendanceRecord = {
      id: existingIdx >= 0 ? attendance[existingIdx].id : `att-${studentId}-${date}`,
      studentId,
      date,
      status,
      markedByTeacherId: 't-001',
      markedByName: 'Dr. Rajesh Mehta',
      timestamp: nowIso,
      remarks,
    };

    if (existingIdx >= 0) {
      setAttendance((prev) => {
        const copy = [...prev];
        copy[existingIdx] = updatedRecord;
        return copy;
      });
    } else {
      setAttendance((prev) => [updatedRecord, ...prev]);
    }

    // IF ABSENT: TRIGGER WF01 AUTOMATION
    if (status === 'absent') {
      const parentMsgText = `[DEMO MESSAGE] 🚨 *Absent Student Notification*\n\nDear Parent, *${student.name}* (Roll: ${student.rollNo}, ${student.batchName}) has been marked *ABSENT* today (${date}).\n\nPlease contact Bright Future Academy front desk if this absence was unexpected or submit a leave note.`;
      
      const newMsg: WhatsAppMessage = {
        id: `wm-absent-${Date.now()}`,
        conversationId: student.id,
        sender: 'institute',
        text: parentMsgText,
        timestamp: 'Just now',
        status: 'delivered',
        isDemo: true,
        workflowId: 'wf-001',
      };

      setWhatsappMessages((prev) => [...prev, newMsg]);
      recordWorkflowExecution(
        'WF01',
        student.name,
        student.parentPhone,
        `Absent alert dispatched to ${student.parentName}`,
        `Student was marked absent during morning roll-call for date ${date}. Automated WhatsApp notification generated.`
      );

      addToast(
        'warning',
        'WF01: Absent Alert Triggered',
        `Automated WhatsApp message delivered to ${student.parentName} (${student.name}).`
      );
    } else {
      addToast('success', 'Attendance Saved', `${student.name} marked ${status.toUpperCase()} for ${date}.`);
    }
  };

  // Bulk Attendance
  const bulkMarkAttendance = (batchId: string, date: string, statuses: Record<string, 'present' | 'absent' | 'late'>) => {
    Object.entries(statuses).forEach(([studentId, status]) => {
      markAttendance(studentId, date, status);
    });
    addToast('success', 'Batch Attendance Finalized', `Attendance recorded for all students in batch.`);
  };

  // ACTION 2: Add Homework (Interconnected to WF05)
  const addHomework = (data: Omit<Homework, 'id' | 'status'>) => {
    const newHw: Homework = {
      ...data,
      id: `hw-${Date.now()}`,
      status: 'assigned',
    };

    setHomework((prev) => [newHw, ...prev]);

    // Send WhatsApp notification to all students in that batch
    const targetStudents = students.filter((s) => s.batchId === data.batchId);
    
    targetStudents.forEach((st) => {
      const msg: WhatsAppMessage = {
        id: `wm-hw-${st.id}-${Date.now()}`,
        conversationId: st.id,
        sender: 'institute',
        text: `[DEMO MESSAGE] 📝 *New Homework Assigned*\n\nSubject: *${data.subject}*\nTopic: *${data.title}*\nAssigned By: ${data.teacherName}\nDue Date: *${data.dueDate}*\n\nInstructions: ${data.description}\n\nPlease ensure your child completes this on time.`,
        timestamp: 'Just now',
        status: 'delivered',
        isDemo: true,
        workflowId: 'wf-005',
      };
      setWhatsappMessages((prev) => [...prev, msg]);
    });

    recordWorkflowExecution(
      'WF05',
      `${data.batchName} (${targetStudents.length} Students)`,
      'Batch Broadcast',
      `Homework "${data.title}" assigned by ${data.teacherName}`,
      `Dispatched WhatsApp notification to ${targetStudents.length} student parent chats with due date ${data.dueDate}.`
    );

    addToast(
      'info',
      'WF05: Homework Broadcasted',
      `WhatsApp homework alert delivered to parents in ${data.batchName}.`
    );
  };

  // ACTION 3: Record Fee Payment (Interconnected to WF04)
  const recordFeePayment = (paymentData: {
    studentId: string;
    amount: number;
    paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
    discount?: number;
    lateFee?: number;
    notes?: string;
  }) => {
    const student = students.find((s) => s.id === paymentData.studentId);
    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = '2026-11-09';
    const discount = paymentData.discount || 0;
    const lateFee = paymentData.lateFee || 0;

    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      receiptNo,
      studentId: paymentData.studentId,
      studentName: student ? student.name : 'Unknown Student',
      amount: paymentData.amount,
      paymentDate: todayStr,
      paymentMode: paymentData.paymentMode,
      discount,
      lateFee,
      notes: paymentData.notes || 'Tuition fee installment',
      collectedBy: 'Finance Desk',
      status: 'confirmed',
    };

    setFees((prev) => [newPayment, ...prev]);

    // Update student balance
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === paymentData.studentId) {
          const newBal = Math.max(0, s.feeBalance - paymentData.amount);
          return {
            ...s,
            feeBalance: newBal,
            totalPaid: s.totalPaid + paymentData.amount,
          };
        }
        return s;
      })
    );

    // Send WhatsApp confirmation to parent
    if (student) {
      const newBal = Math.max(0, student.feeBalance - paymentData.amount);
      const msg: WhatsAppMessage = {
        id: `wm-fee-${Date.now()}`,
        conversationId: student.id,
        sender: 'institute',
        text: `[DEMO MESSAGE] 💳 *Fee Payment Confirmation*\n\nDear Parent, payment received successfully for *${student.name}*!\n\n• Receipt No: *${receiptNo}*\n• Amount Paid: *₹${paymentData.amount.toLocaleString('en-IN')}*\n• Mode: *${paymentData.paymentMode}*\n• Date: *${todayStr}*\n• Remaining Balance: *₹${newBal.toLocaleString('en-IN')}*\n\nThank you for choosing Bright Future Coaching Academy.`,
        timestamp: 'Just now',
        status: 'delivered',
        isDemo: true,
        workflowId: 'wf-004',
        receiptData: newPayment,
      };

      setWhatsappMessages((prev) => [...prev, msg]);

      recordWorkflowExecution(
        'WF04',
        student.name,
        student.parentPhone,
        `Payment of ₹${paymentData.amount} received (Receipt #${receiptNo})`,
        `Digital receipt generated and sent to ${student.parentName} via WhatsApp.`
      );
    }

    addToast(
      'success',
      'WF04: Payment & Receipt Confirmed',
      `Receipt ${receiptNo} generated. WhatsApp confirmation sent to parent.`
    );

    setActiveReceipt(newPayment);
    return newPayment;
  };

  // ACTION 4: Enter Exam Marks (Interconnected to WF06)
  const enterExamMarks = (data: {
    examId: string;
    studentId: string;
    marks: Record<string, number>;
    teacherRemarks: string;
  }) => {
    const student = students.find((s) => s.id === data.studentId);
    const exam = exams.find((e) => e.id === data.examId);
    if (!student || !exam) return;

    let totalMarks = 0;
    const numSubj = Object.keys(data.marks).length;
    const maxMarks = numSubj * exam.totalMarksPerSubject;

    Object.values(data.marks).forEach((m) => {
      totalMarks += Number(m) || 0;
    });

    const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
    let grade = 'B';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else grade = 'D';

    const newResult: ExamResult = {
      id: `res-${data.examId}-${data.studentId}`,
      examId: data.examId,
      examName: exam.name,
      studentId: data.studentId,
      marks: data.marks,
      totalMarks,
      maxMarks,
      percentage,
      grade,
      teacherRemarks: data.teacherRemarks,
      updatedAt: new Date().toISOString(),
    };

    setExamResults((prev) => {
      const filtered = prev.filter((r) => !(r.examId === data.examId && r.studentId === data.studentId));
      return [newResult, ...filtered];
    });

    // Send WhatsApp notification
    const marksSummary = Object.entries(data.marks)
      .map(([s, score]) => `• ${s}: ${score}/${exam.totalMarksPerSubject}`)
      .join('\n');

    const msg: WhatsAppMessage = {
      id: `wm-exam-${Date.now()}`,
      conversationId: student.id,
      sender: 'institute',
      text: `[DEMO MESSAGE] 📊 *Examination Scorecard Published*\n\nDear Parent, latest results for *${student.name}* in *${exam.name}* are now available:\n\n${marksSummary}\n\n🏆 Overall Score: *${totalMarks}/${maxMarks}* (*${percentage.toFixed(2)}%*)\n⭐ Grade: *${grade}*\n\nTeacher Remark: "${data.teacherRemarks}"\n\nYou can ask the WhatsApp assistant "Show latest marks" anytime.`,
      timestamp: 'Just now',
      status: 'delivered',
      isDemo: true,
      workflowId: 'wf-006',
    };

    setWhatsappMessages((prev) => [...prev, msg]);

    recordWorkflowExecution(
      'WF06',
      student.name,
      student.parentPhone,
      `Exam results published for ${exam.name}`,
      `Score: ${percentage.toFixed(2)}% (Grade ${grade}). WhatsApp scorecard dispatched.`
    );

    addToast(
      'success',
      'WF06: Scorecard Alert Sent',
      `Results for ${student.name} saved. Parent notified via WhatsApp.`
    );
  };

  // ACTION 5: Announcements (Interconnected to WF08)
  const createAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const todayStr = '2026-11-09';
    const newAnc: Announcement = {
      ...data,
      id: `anc-${Date.now()}`,
      date: todayStr,
    };

    setAnnouncements((prev) => [newAnc, ...prev]);

    // Send WhatsApp to target students
    const targetStudents =
      data.targetBatchId === 'all'
        ? students
        : students.filter((s) => s.batchId === data.targetBatchId);

    targetStudents.forEach((st) => {
      const msg: WhatsAppMessage = {
        id: `wm-anc-${st.id}-${Date.now()}`,
        conversationId: st.id,
        sender: 'institute',
        text: `[DEMO MESSAGE] 📢 *Academy Circular: ${data.title}*\n\n${data.content}\n\n_Issued by ${data.sentBy} on ${todayStr}_`,
        timestamp: 'Just now',
        status: 'delivered',
        isDemo: true,
        workflowId: 'wf-008',
      };
      setWhatsappMessages((prev) => [...prev, msg]);
    });

    recordWorkflowExecution(
      'WF08',
      `${data.targetBatchName} (${targetStudents.length} Parents)`,
      'Broadcast',
      `Circular: ${data.title}`,
      `Broadcast dispatched to ${targetStudents.length} registered parent WhatsApp chats.`
    );

    addToast(
      'info',
      'WF08: Announcement Broadcasted',
      `Announcement delivered to ${targetStudents.length} parent WhatsApp chats.`
    );
  };

  // ACTION 6: Parent Sends WhatsApp Message (Bot Dynamic Engine)
  const sendParentWhatsAppMessage = (studentId: string, text: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // 1. Add parent message
    const parentMsg: WhatsAppMessage = {
      id: `wm-p-${Date.now()}`,
      conversationId: studentId,
      sender: 'parent',
      text,
      timestamp: 'Just now',
      status: 'read',
      isDemo: true,
    };

    setWhatsappMessages((prev) => [...prev, parentMsg]);
    setIsBotTyping(true);

    // 2. Simulate typing delay and generate dynamic reply
    setTimeout(() => {
      const response = generateBotResponse(text, {
        student,
        attendance,
        fees,
        examResults,
        homework,
        batches,
        announcements,
      });

      const botMsg: WhatsAppMessage = {
        id: `wm-b-${Date.now()}`,
        conversationId: studentId,
        sender: 'bot',
        text: response.replyText,
        timestamp: 'Just now',
        status: 'read',
        isDemo: true,
        receiptData: response.metadata?.receipt,
      };

      setWhatsappMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 700);
  };

  // ACTION 7: Manual Run for Automations
  const runAutomationWorkflow = (workflowCode: string) => {
    const wf = automations.find((w) => w.code === workflowCode);
    if (!wf) return;

    if (workflowCode === 'WF02') {
      // Daily Attendance Summary
      recordWorkflowExecution(
        'WF02',
        'All Active Batches (30 Students)',
        'Academy Summary',
        'Daily roll call summary compiled',
        '30 students processed: 28 Present, 2 Absent, 0 Late across 4 batches.'
      );
      addToast('success', 'WF02 Executed', 'Daily attendance summary generated and logged.');
    } else if (workflowCode === 'WF03') {
      // Fee Reminder
      const pendingStudents = students.filter((s) => s.feeBalance > 0);
      pendingStudents.forEach((st) => {
        const msg: WhatsAppMessage = {
          id: `wm-fee-rem-${st.id}-${Date.now()}`,
          conversationId: st.id,
          sender: 'institute',
          text: `[DEMO MESSAGE] 🔔 *Monthly Fee Reminder*\n\nDear Parent of *${st.name}*,\nThis is a gentle reminder that an outstanding fee balance of *₹${st.feeBalance.toLocaleString('en-IN')}* is pending for November 2026. Please complete the payment via cash, cheque or UPI at reception. Thank you!`,
          timestamp: 'Just now',
          status: 'delivered',
          isDemo: true,
          workflowId: 'wf-003',
        };
        setWhatsappMessages((prev) => [...prev, msg]);
      });
      recordWorkflowExecution(
        'WF03',
        `${pendingStudents.length} Students with Dues`,
        'Fee Reminders',
        `Dispatched fee due alerts to ${pendingStudents.length} parents`,
        `Students with pending balances received WhatsApp payment reminders.`
      );
      addToast('success', 'WF03 Executed', `Fee reminders sent to ${pendingStudents.length} parents.`);
    } else if (workflowCode === 'WF07') {
      // Low Attendance Early Warning
      const lowAttStudents = students.filter((st) => {
        const att = attendance.filter((a) => a.studentId === st.id);
        const present = att.filter((a) => a.status === 'present').length;
        return att.length > 0 && (present / att.length) < 0.75;
      });
      recordWorkflowExecution(
        'WF07',
        `${lowAttStudents.length} Flagged Students`,
        'Academic Audit',
        `Audit complete: ${lowAttStudents.length} students under 75% attendance threshold`,
        'Early risk alerts queued for faculty intervention and parent counselling.'
      );
      addToast('info', 'WF07 Executed', `Low attendance audit complete. ${lowAttStudents.length} students flagged.`);
    } else if (workflowCode === 'WF10') {
      // Daily Owner Summary
      recordWorkflowExecution(
        'WF10',
        'Bright Future Academy (Executive Report)',
        'Owner Dashboard',
        'Daily Operations Digest',
        `30 Enrolled Students | 4 Batches | Fee Collected Today: ₹3,000 | Pending Dues: ₹28,800 | 14 Automations Triggered.`
      );
      addToast('success', 'WF10 Executed', 'Executive operations summary compiled for Director portal.');
    } else {
      recordWorkflowExecution(
        workflowCode,
        'System Trigger',
        'Simulator',
        `Workflow ${workflowCode} manual test execution`,
        `Rule verified successfully with zero failures.`
      );
      addToast('success', `${workflowCode} Executed`, 'Workflow executed successfully.');
    }
  };

  const toggleWorkflow = (id: string) => {
    setAutomations((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  // CRUD Operations
  const addStudent = (studentData: Omit<Student, 'id' | 'totalPaid' | 'feeBalance'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      feeBalance: studentData.monthlyFee,
      totalPaid: 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
    addToast('success', 'Student Enrolled', `${newStudent.name} successfully registered.`);
  };

  const updateStudent = (student: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
    addToast('success', 'Student Updated', `Profile updated for ${student.name}.`);
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    addToast('info', 'Student Removed', 'Student record deleted.');
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    addToast('success', 'Teacher Added', `${newTeacher.name} appointed to faculty.`);
  };

  const updateTeacher = (teacher: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === teacher.id ? teacher : t)));
    addToast('success', 'Teacher Updated', `Profile updated for ${teacher.name}.`);
  };

  const addBatch = (batchData: Omit<Batch, 'id'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: `b-${Date.now()}`,
    };
    setBatches((prev) => [newBatch, ...prev]);
    addToast('success', 'Batch Created', `${newBatch.name} configured.`);
  };

  const updateBatch = (batch: Batch) => {
    setBatches((prev) => prev.map((b) => (b.id === batch.id ? batch : b)));
    addToast('success', 'Batch Updated', `${batch.name} timings updated.`);
  };

  const addLead = (leadData: Omit<EnquiryLead, 'id' | 'createdAt'>) => {
    const newLead: EnquiryLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast('success', 'Enquiry Recorded', `Lead registered for ${newLead.studentName}.`);
  };

  const updateLeadStage = (id: string, stage: EnquiryLead['leadStage']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, leadStage: stage } : l)));
    addToast('info', 'Pipeline Updated', `Lead moved to ${stage.toUpperCase()}.`);
  };

  const submitLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newLeave: LeaveRequest = {
      ...data,
      id: `lv-${Date.now()}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);
    addToast('info', 'Leave Submitted', 'Leave application submitted for teacher review.');
  };

  const reviewLeaveRequest = (id: string, status: 'approved' | 'rejected', remarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              reviewedBy: 'Dr. Rajesh Mehta',
              reviewRemarks: remarks || `Leave ${status} by faculty.`,
            }
          : l
      )
    );

    const leave = leaveRequests.find((l) => l.id === id);
    if (leave) {
      const msg: WhatsAppMessage = {
        id: `wm-leave-${Date.now()}`,
        conversationId: leave.studentId,
        sender: 'institute',
        text: `[DEMO MESSAGE] 📋 *Leave Application Status: ${status.toUpperCase()}*\n\nStudent: *${leave.studentName}*\nDates: ${leave.startDate} to ${leave.endDate}\nStatus: *${status.toUpperCase()}*\nRemarks: "${remarks || 'Reviewed by class coordinator'}"`,
        timestamp: 'Just now',
        status: 'delivered',
        isDemo: true,
        workflowId: 'wf-09',
      };
      setWhatsappMessages((prev) => [...prev, msg]);
      recordWorkflowExecution(
        'WF09',
        leave.studentName,
        'Parent WhatsApp',
        `Leave request ${status}`,
        `Leave from ${leave.startDate} to ${leave.endDate} was marked ${status}.`
      );
    }

    addToast('success', `Leave ${status}`, 'Parent notified via WhatsApp.');
  };

  // Reset to crisp initial demo state
  const resetToInitialData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_teachers`);
    localStorage.removeItem(`${STORAGE_KEY}_batches`);
    localStorage.removeItem(`${STORAGE_KEY}_attendance`);
    localStorage.removeItem(`${STORAGE_KEY}_fees`);
    localStorage.removeItem(`${STORAGE_KEY}_exams`);
    localStorage.removeItem(`${STORAGE_KEY}_exam_results`);
    localStorage.removeItem(`${STORAGE_KEY}_homework`);
    localStorage.removeItem(`${STORAGE_KEY}_announcements`);
    localStorage.removeItem(`${STORAGE_KEY}_whatsapp_messages`);
    localStorage.removeItem(`${STORAGE_KEY}_automations`);
    localStorage.removeItem(`${STORAGE_KEY}_automation_logs`);
    localStorage.removeItem(`${STORAGE_KEY}_leads`);
    localStorage.removeItem(`${STORAGE_KEY}_leave_requests`);

    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setBatches(INITIAL_BATCHES);
    setAttendance(generateInitialAttendance());
    setFees(INITIAL_FEES);
    setExams(INITIAL_EXAMS);
    setExamResults(INITIAL_EXAM_RESULTS);
    setHomework(INITIAL_HOMEWORK);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setWhatsappMessages(INITIAL_WHATSAPP_MESSAGES);
    setAutomations(INITIAL_AUTOMATIONS);
    setAutomationLogs(INITIAL_AUTOMATION_LOGS);
    setLeads(INITIAL_LEADS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setSelectedStudentId('std-001');
    setGuidedDemoStep(null);

    addToast('info', 'Demo Data Reset', 'Initial institute database restored successfully.');
  };

  // Guided Live Demo Presentation Management
  const startGuidedDemo = () => {
    setShowCampus3D(false);
    setGuidedDemoStep(1);
    setCurrentRole('owner');
    setActiveNavTab('dashboard');
  };

  const nextDemoStep = () => {
    if (guidedDemoStep === null) return;
    if (guidedDemoStep < 15) {
      setGuidedDemoStep(guidedDemoStep + 1);
    } else {
      setGuidedDemoStep(null);
    }
  };

  const prevDemoStep = () => {
    if (guidedDemoStep && guidedDemoStep > 1) {
      setGuidedDemoStep(guidedDemoStep - 1);
    }
  };

  const exitGuidedDemo = () => {
    setGuidedDemoStep(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedStudentId,
        setSelectedStudentId,
        activeNavTab,
        setActiveNavTab,
        showCampus3D,
        setShowCampus3D,
        students,
        teachers,
        batches,
        attendance,
        fees,
        exams,
        examResults,
        homework,
        announcements,
        whatsappMessages,
        automations,
        automationLogs,
        leads,
        leaveRequests,
        isBotTyping,
        toasts,
        addToast,
        removeToast,
        activeReceipt,
        setActiveReceipt,
        guidedDemoStep,
        startGuidedDemo,
        nextDemoStep,
        prevDemoStep,
        exitGuidedDemo,
        markAttendance,
        bulkMarkAttendance,
        addHomework,
        recordFeePayment,
        enterExamMarks,
        createAnnouncement,
        sendParentWhatsAppMessage,
        runAutomationWorkflow,
        toggleWorkflow,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        addBatch,
        updateBatch,
        addLead,
        updateLeadStage,
        submitLeaveRequest,
        reviewLeaveRequest,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
