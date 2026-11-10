import {
  Student,
  AttendanceRecord,
  FeePayment,
  ExamResult,
  Homework,
  Batch,
  Announcement,
} from '../types';

interface BotContext {
  student: Student;
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  examResults: ExamResult[];
  homework: Homework[];
  batches: Batch[];
  announcements: Announcement[];
}

export function generateBotResponse(userMessage: string, context: BotContext): { replyText: string; metadata?: any } {
  const { student, attendance, fees, examResults, homework, batches, announcements } = context;
  const raw = userMessage.toLowerCase().trim();

  // Helper: Get student attendance stats
  const studentAtt = attendance.filter((a) => a.studentId === student.id);
  const totalDays = studentAtt.length;
  const presentDays = studentAtt.filter((a) => a.status === 'present').length;
  const absentDays = studentAtt.filter((a) => a.status === 'absent').length;
  const lateDays = studentAtt.filter((a) => a.status === 'late').length;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays * 0.5) / totalDays) * 100 : 100;
  
  // Today's attendance
  const todayStr = '2026-11-09';
  const todayRecord = studentAtt.find((a) => a.date === todayStr);

  // Student fees
  const studentPayments = fees.filter((f) => f.studentId === student.id);
  const lastPayment = studentPayments[0];

  // Latest exam result
  const latestResult = examResults.filter((r) => r.studentId === student.id)[0];

  // Student batch homework
  const studentHw = homework.filter((h) => h.batchId === student.batchId);

  // Batch info
  const studentBatch = batches.find((b) => b.id === student.batchId);

  // GREETINGS & HELP
  if (
    raw === 'hi' ||
    raw === 'hello' ||
    raw === 'hey' ||
    raw === 'namaste' ||
    raw.includes('good morning') ||
    raw.includes('good afternoon') ||
    raw.includes('start') ||
    raw.includes('help') ||
    raw === 'menu'
  ) {
    return {
      replyText: `Hello! 👋 Welcome to Bright Future Coaching Academy.\n\nI'm *AUTOMEXA*, your 24/7 automated parent assistant for *${student.name}* (${student.batchName}).\n\nYou can ask me in your own words about:\n1️⃣ *Attendance* ("Is ${student.name.split(' ')[0]} present today?", "Monthly attendance")\n2️⃣ *Fees* ("What are the pending fees?", "Show my fee receipt")\n3️⃣ *Results* ("Show latest marks", "Which subject needs practice?")\n4️⃣ *Homework* ("What is today's homework?", "Homework deadline")\n5️⃣ *Timetable* ("What is today's timetable?")\n6️⃣ *Announcements* ("Latest academy circulars")\n\nHow can I help you right now?`,
    };
  }

  // 1. ATTENDANCE INTENTS
  if (
    raw.includes('present') ||
    raw.includes('absent') ||
    raw.includes('attendance') ||
    raw.includes('attandance') ||
    raw.includes('late') ||
    raw.includes('holiday')
  ) {
    if (raw.includes('today') || raw.includes('is my child') || raw.includes('marked')) {
      const todayStatusText = todayRecord
        ? todayRecord.status === 'present'
          ? '✅ *Present* in class today.'
          : todayRecord.status === 'absent'
          ? '❌ *Absent* today. The teacher marked this at roll call.'
          : '⏱️ *Late* arrival recorded for today.'
        : 'ℹ️ Attendance for today is currently in progress / not finalized yet.';

      return {
        replyText: `📅 *Today's Attendance for ${student.name}*\n\nStatus: ${todayStatusText}\nDate: Monday, 09 Nov 2026\nBatch: ${student.batchName}\n\n*Overall Month Summary:*\n• Present: ${presentDays} days\n• Absent: ${absentDays} days\n• Attendance Rate: *${attendanceRate.toFixed(1)}%*`,
      };
    }

    // Monthly attendance query
    return {
      replyText: `📊 *${student.name}'s Attendance Report (Current Month)*\n\n• Total Academic Working Days: *${totalDays}*\n• ✅ Present: *${presentDays}*\n• ❌ Absent: *${absentDays}*\n• ⏱️ Late: *${lateDays}*\n\n📈 Attendance Percentage: *${attendanceRate.toFixed(1)}%*\n\n${
        attendanceRate >= 85
          ? '⭐ *Excellent Attendance:* Regularity is directly contributing to academic confidence!'
          : attendanceRate >= 75
          ? '⚠️ *Satisfactory:* Maintain regular attendance to avoid missing critical topics.'
          : '🚨 *Low Attendance Alert:* Attendance is below the institute recommended 75% threshold. Please ensure regular attendance.'
      }`,
    };
  }

  // 2. FEE INTENTS
  if (
    raw.includes('fee') ||
    raw.includes('pending') ||
    raw.includes('balance') ||
    raw.includes('payment') ||
    raw.includes('pay') ||
    raw.includes('receipt') ||
    raw.includes('due') ||
    raw.includes('installment')
  ) {
    if (raw.includes('receipt') || raw.includes('last payment') || raw.includes('proof')) {
      if (lastPayment) {
        return {
          replyText: `🧾 *Latest Fee Receipt Details*\n\nStudent: *${student.name}*\nReceipt No: *${lastPayment.receiptNo}*\nAmount Paid: *₹${lastPayment.amount.toLocaleString('en-IN')}*\nDate: *${lastPayment.paymentDate}*\nPayment Mode: *${lastPayment.paymentMode}*\nCollected By: *${lastPayment.collectedBy}*\nStatus: *Verified & Confirmed ✅*\n\nCurrent Balance: *₹${student.feeBalance.toLocaleString('en-IN')}*`,
          metadata: { receipt: lastPayment },
        };
      }
    }

    return {
      replyText: `💰 *Fee Information & Status*\n\nStudent: *${student.name}* (Roll: ${student.rollNo})\nMonthly Fee: *₹${student.monthlyFee.toLocaleString('en-IN')}*\nTotal Paid till date: *₹${student.totalPaid.toLocaleString('en-IN')}*\nOutstanding Balance: *₹${student.feeBalance.toLocaleString('en-IN')}*\nNext Due Date: *10th of every month*\n\n${
        student.feeBalance > 0
          ? `⚠️ You have an outstanding balance of *₹${student.feeBalance.toLocaleString('en-IN')}*. You can pay at the academy reception or via UPI (GPay/PhonePe/PayTM).`
          : `🎉 All dues are fully cleared! Thank you for prompt payments.`
      }`,
    };
  }

  // 3. ACADEMIC PERFORMANCE & MARKS
  if (
    raw.includes('mark') ||
    raw.includes('result') ||
    raw.includes('score') ||
    raw.includes('exam') ||
    raw.includes('percentage') ||
    raw.includes('grade') ||
    raw.includes('performance') ||
    raw.includes('feedback') ||
    raw.includes('progress') ||
    raw.includes('report')
  ) {
    if (latestResult) {
      const marksBreakdown = Object.entries(latestResult.marks)
        .map(([subj, score]) => `• ${subj}: *${score}/100*`)
        .join('\n');

      return {
        replyText: `📚 *Latest Examination Report*\n\nExam: *${latestResult.examName}*\nStudent: *${student.name}*\n\n*Subject Scores:*\n${marksBreakdown}\n\n📊 Total Score: *${latestResult.totalMarks}/${latestResult.maxMarks}*\n📈 Percentage: *${latestResult.percentage.toFixed(2)}%*\n🏆 Grade: *${latestResult.grade}*\n\n👩‍🏫 *Teacher Remark:* \n"${latestResult.teacherRemarks}"`,
      };
    } else {
      return {
        replyText: `📚 Examination records for ${student.name} are currently being compiled. The upcoming Pre-Board assessment is scheduled for 24 Nov.`,
      };
    }
  }

  // 4. HOMEWORK INTENTS
  if (
    raw.includes('homework') ||
    raw.includes('hw') ||
    raw.includes('assignment') ||
    raw.includes('task') ||
    raw.includes('deadline') ||
    raw.includes('submission')
  ) {
    if (studentHw.length > 0) {
      const hwList = studentHw
        .map(
          (h, i) =>
            `*${i + 1}. ${h.subject}*\n📖 Topic: ${h.title}\n📅 Due Date: *${h.dueDate}*\n👨‍🏫 Teacher: ${h.teacherName}\n📝 Details: ${h.description}\n`
        )
        .join('\n');

      return {
        replyText: `📝 *Current Homework & Assignments for ${student.name}*\n\n${hwList}\nPlease ensure notebooks are submitted to respective subject teachers by the due date.`,
      };
    } else {
      return {
        replyText: `📝 There is no pending homework recorded for *${student.batchName}* at this moment.`,
      };
    }
  }

  // 5. TIMETABLE & BATCH SCHEDULE
  if (
    raw.includes('timetable') ||
    raw.includes('schedule') ||
    raw.includes('timing') ||
    raw.includes('time') ||
    raw.includes('class') ||
    raw.includes('room')
  ) {
    return {
      replyText: `⏰ *Timetable & Class Schedule*\n\nStudent: *${student.name}*\nBatch: *${studentBatch?.name || student.batchName}*\nStream: *${studentBatch?.stream || 'Science'}*\n\n🕒 *Daily Timing:* ${studentBatch?.timing || '04:00 PM - 06:00 PM'}\n📍 *Classroom:* ${studentBatch?.room || 'Hall 101'}\n\n*Assigned Faculty:*\n• Dr. Rajesh Mehta (Physics)\n• Sneha Kulkarni (Mathematics)\n• Amit Saxena (Chemistry)\n• Vikram Nair (English)`,
    };
  }

  // 6. ANNOUNCEMENTS & EVENTS
  if (
    raw.includes('announcement') ||
    raw.includes('notice') ||
    raw.includes('circular') ||
    raw.includes('update') ||
    raw.includes('event') ||
    raw.includes('news')
  ) {
    const relevantAnnouncements = announcements.filter(
      (a) => a.targetBatchId === 'all' || a.targetBatchId === student.batchId
    );
    const notices = relevantAnnouncements
      .map((a, i) => `*${i + 1}. ${a.title}* (${a.date})\n${a.content}\n_Issued by: ${a.sentBy}_\n`)
      .join('\n');

    return {
      replyText: `📢 *Latest Academy Circulars & Announcements*\n\n${notices}`,
    };
  }

  // 7. LEAVE REQUEST OR CONTACT
  if (raw.includes('leave') || raw.includes('sick') || raw.includes('fever') || raw.includes('absent tomorrow')) {
    return {
      replyText: `🏥 *Leave Application Protocol*\n\nTo request formal leave for *${student.name}*:\n1. You can submit the Leave Request form directly inside the *AUTOMEXA Parent Portal* under the "Request Leave" tab.\n2. Or reply here with the start date, end date, and reason. Your request will be forwarded to the class coordinator for immediate approval.`,
    };
  }

  if (raw.includes('contact') || raw.includes('teacher') || raw.includes('call') || raw.includes('phone') || raw.includes('talk')) {
    return {
      replyText: `📞 *Contact Faculty / Reception*\n\nAcademy Front Desk: *+91 98220 99888*\nClass 10-A Coordinator (Dr. Mehta): *Available Mon-Sat 3:00 PM - 4:00 PM*\n\nYou can also click "Request Teacher Callback" in your Parent Portal to schedule a phone discussion with subject teachers.`,
    };
  }

  // FALLBACK INTELLIGENT REPLY
  return {
    replyText: `Thank you for your message! 🤖\n\nI couldn't quite match that specific request for *${student.name}*. You can ask me:\n• "Is Rahul present today?"\n• "What is his monthly attendance?"\n• "What are the pending fees?"\n• "Show latest exam marks"\n• "What is today's homework?"\n• "Show timetable"\n\nOr click one of the quick buttons below! 👇`,
  };
}
