/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { StudentManagement } from './components/owner/StudentManagement';
import { TeacherManagement } from './components/owner/TeacherManagement';
import { BatchManagement } from './components/owner/BatchManagement';
import { FeeManagement } from './components/owner/FeeManagement';
import { AutomationCenter } from './components/owner/AutomationCenter';
import { LeadManagement } from './components/owner/LeadManagement';
import { Announcements } from './components/owner/Announcements';
import { ParentCommunication } from './components/owner/ParentCommunication';
import { Reports } from './components/owner/Reports';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentPortal } from './components/parent/ParentPortal';
import { WhatsAppSimulator } from './components/whatsapp/WhatsAppSimulator';
import { Campus3DView } from './components/campus3d/Campus3DView';
import { ReceiptModal } from './components/common/ReceiptModal';
import { GuidedDemoModal } from './components/common/GuidedDemoModal';
import { LoginModal } from './components/auth/LoginModal';
import { ToastContainer } from './components/common/ToastContainer';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Zap,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRole, activeNavTab, setActiveNavTab, showCampus3D, setShowCampus3D } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Router logic for Main Content
  const renderContent = () => {
    if (showCampus3D) {
      return <Campus3DView />;
    }

    if (activeNavTab === 'whatsapp') {
      return <WhatsAppSimulator />;
    }

    if (currentRole === 'owner') {
      switch (activeNavTab) {
        case 'dashboard':
          return <OwnerDashboard />;
        case 'students':
          return <StudentManagement />;
        case 'teachers':
          return <TeacherManagement />;
        case 'batches':
          return <BatchManagement />;
        case 'fees':
          return <FeeManagement />;
        case 'automations':
          return <AutomationCenter />;
        case 'leads':
          return <LeadManagement />;
        case 'announcements':
          return <Announcements />;
        case 'communication':
          return <ParentCommunication />;
        case 'reports':
          return <Reports />;
        default:
          return <OwnerDashboard />;
      }
    }

    if (currentRole === 'teacher') {
      return <TeacherDashboard />;
    }

    if (currentRole === 'parent') {
      return <ParentPortal />;
    }

    return <OwnerDashboard />;
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onOpenLogin={() => setShowLoginModal(true)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        {!showCampus3D && activeNavTab !== 'whatsapp' && <Sidebar />}

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#f4f5f8] pb-16 md:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {!showCampus3D && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around z-30 px-2 shadow-xs">
          <button
            onClick={() => {
              setShowCampus3D(false);
              if (currentRole === 'owner') setActiveNavTab('dashboard');
              else if (currentRole === 'teacher') setActiveNavTab('attendance');
              else setActiveNavTab('overview');
            }}
            className={`p-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ease-out ${
              activeNavTab !== 'whatsapp' && !showCampus3D ? 'text-slate-900 font-semibold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard strokeWidth={1.75} className="w-4 h-4" />
            <span>Portal</span>
          </button>

          {currentRole === 'owner' && (
            <>
              <button
                onClick={() => {
                  setShowCampus3D(false);
                  setActiveNavTab('students');
                }}
                className={`p-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ease-out ${
                  activeNavTab === 'students' ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}
              >
                <Users strokeWidth={1.75} className="w-4 h-4" />
                <span>Students</span>
              </button>
              <button
                onClick={() => {
                  setShowCampus3D(false);
                  setActiveNavTab('fees');
                }}
                className={`p-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ease-out ${
                  activeNavTab === 'fees' ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}
              >
                <CreditCard strokeWidth={1.75} className="w-4 h-4" />
                <span>Fees</span>
              </button>
              <button
                onClick={() => {
                  setShowCampus3D(false);
                  setActiveNavTab('automations');
                }}
                className={`p-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ease-out ${
                  activeNavTab === 'automations' ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}
              >
                <Zap strokeWidth={1.75} className="w-4 h-4" />
                <span>Auto</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              setShowCampus3D(false);
              setActiveNavTab('whatsapp');
            }}
            className={`p-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ease-out ${
              activeNavTab === 'whatsapp' ? 'text-slate-900 font-semibold' : 'text-slate-500'
            }`}
          >
            <MessageSquare strokeWidth={1.75} className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      )}

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <ReceiptModal />
      <GuidedDemoModal />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
