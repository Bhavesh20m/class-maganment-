import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  ArrowRight,
  ArrowLeft,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Zap,
  MessageSquare,
  Users,
  Award,
  CreditCard,
  BookOpen,
} from 'lucide-react';

export const GuidedDemoModal: React.FC = () => {
  const {
    guidedDemoStep,
    nextDemoStep,
    prevDemoStep,
    exitGuidedDemo,
    setCurrentRole,
    setActiveNavTab,
    markAttendance,
    sendParentWhatsAppMessage,
    addHomework,
    recordFeePayment,
    enterExamMarks,
    resetToInitialData,
    setSelectedStudentId,
  } = useApp();

  if (guidedDemoStep === null) return null;

  // Step Definitions
  const demoSteps = [
    {
      step: 1,
      title: 'Step 1: Institute Executive Dashboard',
      description: 'Explore the high-level operational overview: student counts, attendance percentages, monthly collections, and active automation workflows.',
      actionText: 'Proceed to Teacher Portal',
      onExecute: () => {
        setCurrentRole('teacher');
        setActiveNavTab('attendance');
        nextDemoStep();
      },
    },
    {
      step: 2,
      title: 'Step 2: Faculty Attendance Register',
      description: 'You are now Dr. Rajesh Mehta in the Class 10-A Science Foundation batch. Inspect the live student list.',
      actionText: 'Mark Rahul Sharma Absent',
      onExecute: () => {
        markAttendance('std-001', '2026-11-09', 'absent', 'Roll call: Student not in room');
        nextDemoStep();
      },
    },
    {
      step: 3,
      title: 'Step 3: Rahul Sharma Marked Absent',
      description: 'Rahul is marked ABSENT. The system registers the attendance record in the shared database.',
      actionText: 'Trigger WF01 WhatsApp Alert',
      onExecute: () => {
        // Notification is automatically fired; now switch to parent WhatsApp simulator
        setSelectedStudentId('std-001');
        setCurrentRole('parent');
        setActiveNavTab('whatsapp');
        nextDemoStep();
      },
    },
    {
      step: 4,
      title: 'Step 4: WF01 Autonomous Dispatch',
      description: 'The autonomous rule engine intercepts the absence event and routes an instant WhatsApp notification to parent Alok Sharma.',
      actionText: 'Open Parent WhatsApp Simulator',
      onExecute: () => {
        setSelectedStudentId('std-001');
        setActiveNavTab('whatsapp');
        nextDemoStep();
      },
    },
    {
      step: 5,
      title: 'Step 5: Parent WhatsApp Chat Window',
      description: 'Notice the incoming [DEMO MESSAGE] notification alert received on the parent device in real time!',
      actionText: 'Simulate Parent Asking: "What is monthly attendance?"',
      onExecute: () => {
        sendParentWhatsAppMessage('std-001', 'What is Rahul\'s attendance this month?');
        nextDemoStep();
      },
    },
    {
      step: 6,
      title: 'Step 6: Chatbot Dynamically Calculates Records',
      description: 'The AUTOMEXA assistant analyzes Rahul\'s exact attendance logs (23 Present, 2 Absent, 92%) and replies in conversational text.',
      actionText: 'Switch to Teacher to Post Homework',
      onExecute: () => {
        setCurrentRole('teacher');
        setActiveNavTab('homework');
        nextDemoStep();
      },
    },
    {
      step: 7,
      title: 'Step 7: Teacher Posts New Homework',
      description: 'Faculty assigns a new Mathematics homework assignment to Class 10-A.',
      actionText: 'Assign Quadratic Equations Homework (WF05)',
      onExecute: () => {
        addHomework({
          title: 'Quadratic Equations Exercise 4.3 Word Problems',
          batchId: 'b-10a',
          batchName: 'Class 10-A (Science Foundation)',
          subject: 'Mathematics',
          description: 'Solve Q1 to Q10 in homework notebook showing all discriminant steps.',
          assignedDate: '2026-11-09',
          dueDate: '2026-11-13',
          assignedByTeacherId: 't-002',
          teacherName: 'Sneha Kulkarni',
        });
        nextDemoStep();
      },
    },
    {
      step: 8,
      title: 'Step 8: WF05 Homework Notification Dispatched',
      description: 'Notice the prompt broadcast dispatched to all Class 10-A parent WhatsApp channels.',
      actionText: 'Verify in Parent WhatsApp Chat',
      onExecute: () => {
        setSelectedStudentId('std-001');
        setCurrentRole('parent');
        setActiveNavTab('whatsapp');
        nextDemoStep();
      },
    },
    {
      step: 9,
      title: 'Step 9: Parent Receives Homework Alert',
      description: 'The parent sees the new homework title, due date, and teacher instructions in their WhatsApp simulator.',
      actionText: 'Switch to Owner to Record Fee Payment',
      onExecute: () => {
        setCurrentRole('owner');
        setActiveNavTab('fees');
        nextDemoStep();
      },
    },
    {
      step: 10,
      title: 'Step 10: Owner Records Fee Payment (WF04)',
      description: 'Owner receives a ₹3,000 tuition fee installment for Rahul Sharma via UPI.',
      actionText: 'Record ₹3,000 Payment & Generate Receipt',
      onExecute: () => {
        recordFeePayment({
          studentId: 'std-001',
          amount: 3000,
          paymentMode: 'UPI',
          notes: 'November 2026 tuition fee installment',
        });
        nextDemoStep();
      },
    },
    {
      step: 11,
      title: 'Step 11: Official Receipt Generated & Sent',
      description: 'An official digital receipt is generated and an instant WhatsApp confirmation with remaining balance is sent.',
      actionText: 'Inspect Parent WhatsApp Fee Confirmation',
      onExecute: () => {
        setSelectedStudentId('std-001');
        setCurrentRole('parent');
        setActiveNavTab('whatsapp');
        nextDemoStep();
      },
    },
    {
      step: 12,
      title: 'Step 12: Teacher Enters Exam Marks (WF06)',
      description: 'Mid-term assessment marks are compiled by faculty for Mathematics, Science, and English.',
      actionText: 'Publish Exam Marks (88% A Grade)',
      onExecute: () => {
        enterExamMarks({
          examId: 'ex-001',
          studentId: 'std-001',
          marks: {
            Mathematics: 88,
            Science: 94,
            English: 82,
          },
          teacherRemarks: 'Excellent analytical skills in Science. Keep practicing English essay structure.',
        });
        nextDemoStep();
      },
    },
    {
      step: 13,
      title: 'Step 13: Parent Inquires About Marks',
      description: 'Parent asks the chatbot: "Show latest marks and feedback".',
      actionText: 'Simulate Question: "Show latest marks"',
      onExecute: () => {
        sendParentWhatsAppMessage('std-001', 'Show latest exam marks');
        nextDemoStep();
      },
    },
    {
      step: 14,
      title: 'Step 14: Dynamic Scorecard Delivery',
      description: 'The bot retrieves the updated test scores (264/300, 88.0%, Grade A) and teacher feedback directly from database.',
      actionText: 'View Owner Automation Audit Trail',
      onExecute: () => {
        setCurrentRole('owner');
        setActiveNavTab('automations');
        nextDemoStep();
      },
    },
    {
      step: 15,
      title: 'Step 15: Full Automation Audit Completed',
      description: 'Review the complete chronological activity log of all 15 workflow dispatches in the Owner Automation Centre. The presentation is complete!',
      actionText: 'Finish Presentation',
      onExecute: () => {
        exitGuidedDemo();
      },
    },
  ];

  const currentStepInfo = demoSteps.find((s) => s.step === guidedDemoStep) || demoSteps[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4">
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-lg space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            <span className="text-xs font-semibold text-slate-900">
              Walkthrough ({guidedDemoStep} of 15)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={resetToInitialData}
              title="Reset Demo Data"
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors duration-150 ease-out"
            >
              <RotateCcw strokeWidth={1.75} className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={exitGuidedDemo}
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors duration-150 ease-out"
            >
              <X strokeWidth={1.75} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content - Label & value 2-4px apart */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-slate-900">
            {currentStepInfo.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStepInfo.description}
          </p>
        </div>

        {/* Action Button - Single dark accent, no gradients, nested corners (outer 12px, p 20px -> inner 8px) */}
        <div className="flex items-center gap-2 pt-1">
          {guidedDemoStep > 1 && (
            <button
              onClick={prevDemoStep}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-150 ease-out"
              title="Previous Step"
            >
              <ArrowLeft strokeWidth={1.75} className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={currentStepInfo.onExecute}
            className="flex-1 py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center justify-center gap-1.5"
          >
            <span>{currentStepInfo.actionText}</span>
            <ArrowRight strokeWidth={1.75} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
