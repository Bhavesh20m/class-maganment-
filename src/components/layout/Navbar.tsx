import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Zap,
  Building2,
  Users,
  GraduationCap,
  MessageSquare,
  RotateCcw,
  Radio,
  ChevronDown,
  ShieldCheck,
  Play,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const {
    currentRole,
    setCurrentRole,
    startGuidedDemo,
    resetToInitialData,
    showCampus3D,
    setShowCampus3D,
    activeNavTab,
    setActiveNavTab,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleRoleSwitch = (role: Role) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    if (role === 'owner') {
      setActiveNavTab('dashboard');
    } else if (role === 'teacher') {
      setActiveNavTab('attendance');
    } else if (role === 'parent') {
      setActiveNavTab('overview');
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setShowCampus3D(false);
            if (currentRole === 'owner') setActiveNavTab('dashboard');
            else if (currentRole === 'teacher') setActiveNavTab('attendance');
            else setActiveNavTab('overview');
          }}
          className="flex items-center gap-2.5 text-left transition-opacity duration-200 ease-out hover:opacity-85"
        >
          {/* Brand Mark with single dark accent */}
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Zap strokeWidth={1.75} className="w-4 h-4 text-white" />
          </div>

          <div>
            <div className="font-semibold text-sm tracking-tight text-slate-900">
              AUTOMEXA
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Institute Management &amp; WhatsApp Automation
            </p>
          </div>
        </button>
      </div>

      {/* Action Zone: Single Dark Accent + Clean Controls */}
      <div className="flex items-center gap-2">
        {/* START LIVE DEMO - Single dark accent button with no looping animation */}
        <button
          onClick={startGuidedDemo}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5"
        >
          <Play strokeWidth={1.75} className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Start Live Demo</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* WhatsApp Simulator Direct Tab */}
        <button
          onClick={() => {
            setShowCampus3D(false);
            setActiveNavTab('whatsapp');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            activeNavTab === 'whatsapp' && !showCampus3D
              ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
          title="Open WhatsApp Parent Simulator"
        >
          <MessageSquare strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden md:inline">WhatsApp Bot</span>
        </button>

        {/* 3D Campus Hub Toggle */}
        <button
          onClick={() => setShowCampus3D(!showCampus3D)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 ${
            showCampus3D
              ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
          }`}
          title="Toggle 3D Institute Campus"
        >
          <Radio strokeWidth={1.75} className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden lg:inline">3D Campus</span>
        </button>

        {/* Role Switcher: outer rounded-lg, padding 4px -> inner rounded-md 4px */}
        <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs">
          <button
            onClick={() => handleRoleSwitch('owner')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 ease-out ${
              currentRole === 'owner'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleSwitch('teacher')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 ease-out ${
              currentRole === 'teacher'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => handleRoleSwitch('parent')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 ease-out ${
              currentRole === 'parent'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parent
          </button>
        </div>

        {/* Mobile Role Dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-1 transition-colors duration-200 ease-out"
          >
            <span className="capitalize">{currentRole}</span>
            <ChevronDown strokeWidth={1.75} className="w-3 h-3 text-slate-500" />
          </button>
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-sm py-1 z-50">
              <button
                onClick={() => handleRoleSwitch('owner')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors duration-150 ease-out"
              >
                Owner / Admin
              </button>
              <button
                onClick={() => handleRoleSwitch('teacher')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors duration-150 ease-out"
              >
                Teacher Portal
              </button>
              <button
                onClick={() => handleRoleSwitch('parent')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors duration-150 ease-out"
              >
                Parent Portal
              </button>
            </div>
          )}
        </div>

        {/* Login Modal Launcher */}
        <button
          onClick={onOpenLogin}
          className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-200 ease-out"
          title="Demo Accounts &amp; Switch Role"
        >
          <LogIn strokeWidth={1.75} className="w-4 h-4" />
        </button>

        {/* Reset Demo Database */}
        <button
          onClick={resetToInitialData}
          className="p-1.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors duration-200 ease-out"
          title="Reset to Initial Demo State"
        >
          <RotateCcw strokeWidth={1.75} className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
