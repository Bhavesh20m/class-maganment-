export type Role = 'owner' | 'teacher' | 'parent';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  batchId: string;
  batchName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  monthlyFee: number;
  feeBalance: number;
  totalPaid: number;
  discount: number;
  avatarUrl?: string;
  dateOfBirth: string;
  address: string;
  status: 'active' | 'inactive';
  academicTarget?: string;
  emergencyContact: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedBatchIds: string[];
  qualification: string;
  joinDate: string;
  avatarUrl?: string;
  status: 'active' | 'on_leave';
}

export interface Batch {
  id: string;
  name: string;
  grade: string;
  stream: string;
  timing: string;
  room: string;
  teacherIds: string[];
  capacity: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late';
  markedByTeacherId: string;
  markedByName: string;
  timestamp: string;
  remarks?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  discount: number;
  lateFee: number;
  notes?: string;
  collectedBy: string;
  status: 'confirmed' | 'pending';
}

export interface Exam {
  id: string;
  name: string;
  batchId: string;
  batchName: string;
  date: string;
  totalMarksPerSubject: number;
  subjects: string[];
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  marks: Record<string, number>; // subject -> marks
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  teacherRemarks: string;
  updatedAt: string;
}

export interface Homework {
  id: string;
  title: string;
  batchId: string;
  batchName: string;
  subject: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  assignedByTeacherId: string;
  teacherName: string;
  attachments?: string[];
  status: 'assigned' | 'completed' | 'evaluated';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetBatchId: string; // 'all' or batchId
  targetBatchName: string;
  priority: 'normal' | 'urgent' | 'event';
  date: string;
  sentBy: string;
}

export interface WhatsAppMessage {
  id: string;
  conversationId: string; // studentId
  sender: 'parent' | 'bot' | 'institute';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isDemo: true;
  workflowId?: string;
  receiptData?: Partial<FeePayment>;
}

export interface AutomationWorkflow {
  id: string;
  code: string; // e.g. 'WF01'
  name: string;
  description: string;
  triggerEvent: string;
  enabled: boolean;
  executionCount: number;
  successCount: number;
  failedCount: number;
  lastExecutedAt?: string;
  category: 'Attendance' | 'Fees' | 'Academics' | 'General';
}

export interface AutomationLog {
  id: string;
  workflowId: string;
  workflowCode: string;
  workflowName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'queued';
  studentName?: string;
  parentPhone?: string;
  summary: string;
  details?: string;
}

export interface EnquiryLead {
  id: string;
  parentName: string;
  studentName: string;
  phone: string;
  email: string;
  interestedCourse: string;
  grade: string;
  leadStage: 'new' | 'contacted' | 'demo_scheduled' | 'followup' | 'admitted' | 'not_interested';
  followUpDate: string;
  notes: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedBy?: string;
  reviewRemarks?: string;
}
