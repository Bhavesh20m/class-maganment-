import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  CreditCard,
  Zap,
  MessageSquare,
  Bell,
  FileText,
  CheckCircle,
  BookOpen,
  Award,
  Calendar,
  UserPlus,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  count?: number;
}

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    activeNavTab,
    setActiveNavTab,
    setShowCampus3D,
    showCampus3D,
    students,
    leaveRequests,
  } = useApp();

  const handleTabClick = (tab: string) => {
    setShowCampus3D(false);
    setActiveNavTab(tab);
  };

  // Nav Items per Role
  const ownerNav: NavItem[] = [
    { id: 'dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, count: students.length },
    { id: 'teachers', label: 'Faculty Staff', icon: GraduationCap },
    { id: 'batches', label: 'Batches & Rooms', icon: Layers },
    { id: 'fees', label: 'Fee Management', icon: CreditCard },
    { id: 'automations', label: 'Automation Centre', icon: Zap, count: 10 },
    { id: 'leads', label: 'Admissions CRM', icon: UserPlus },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'communication', label: 'Parent Chats Log', icon: MessageSquare },
    { id: 'reports', label: 'Institute Reports', icon: FileText },
  ];

  const teacherNav: NavItem[] = [
    { id: 'attendance', label: 'Mark Attendance', icon: CheckCircle },
    { id: 'homework', label: 'Homework & Tasks', icon: BookOpen },
    { id: 'marks', label: 'Enter Exam Marks', icon: Award },
    {
      id: 'leave',
      label: 'Leave Requests',
      icon: Calendar,
      count: leaveRequests.filter((l) => l.status === 'pending').length,
    },
    { id: 'students', label: 'Class Students', icon: Users },
  ];

  const parentNav: NavItem[] = [
    { id: 'overview', label: 'Child Profile', icon: LayoutDashboard },
    { id: 'academics', label: 'Marks & Results', icon: Award },
    { id: 'fees', label: 'Fees & Receipts', icon: CreditCard },
    { id: 'homework', label: 'Active Homework', icon: BookOpen },
    { id: 'leave', label: 'Request Leave / Call', icon: Calendar },
  ];

  const currentNav =
    currentRole === 'owner'
      ? ownerNav
      : currentRole === 'teacher'
      ? teacherNav
      : parentNav;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-3 flex-shrink-0 select-none">
      {/* Upper Navigation List */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {currentRole === 'owner'
            ? 'Director Workspace'
            : currentRole === 'teacher'
            ? 'Faculty Desk'
            : 'Parent Desk'}
        </div>

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavTab === item.id && !showCampus3D;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors duration-200 ease-out ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  strokeWidth={1.75}
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isActive ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-3 border-t border-slate-100 my-2">
          <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Simulator
          </div>
          <button
            onClick={() => handleTabClick('whatsapp')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors duration-200 ease-out ${
              activeNavTab === 'whatsapp' && !showCampus3D
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare
              strokeWidth={1.75}
              className={`w-4 h-4 ${
                activeNavTab === 'whatsapp' && !showCampus3D ? 'text-white' : 'text-slate-400'
              }`}
            />
            <span>WhatsApp Simulator</span>
          </button>
        </div>
      </div>

      {/* Institutional Metadata - Clean text, no cards inside cards */}
      <div className="pt-3 border-t border-slate-100 px-3 py-2 text-xs">
        <div className="font-semibold text-slate-900 text-xs">
          Bright Future Academy
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Academic Year 2026–27
        </p>
      </div>
    </aside>
  );
};
