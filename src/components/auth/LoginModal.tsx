import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  LogIn,
  X,
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle,
  Sparkles,
  Lock,
  Mail,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setCurrentRole, setActiveNavTab, addToast } = useApp();

  const [email, setEmail] = useState('owner@automexa.demo');
  const [password, setPassword] = useState('demo123');

  if (!isOpen) return null;

  const handleRoleSelect = (role: Role) => {
    setCurrentRole(role);
    if (role === 'owner') {
      setEmail('owner@automexa.demo');
      setActiveNavTab('dashboard');
    } else if (role === 'teacher') {
      setEmail('teacher@automexa.demo');
      setActiveNavTab('attendance');
    } else if (role === 'parent') {
      setEmail('parent@automexa.demo');
      setActiveNavTab('overview');
    }
    setPassword('demo123');
    addToast('success', 'Role Activated', `Switched workspace to ${role.toUpperCase()}.`);
    onClose();
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('teacher')) {
      handleRoleSelect('teacher');
    } else if (email.includes('parent')) {
      handleRoleSelect('parent');
    } else {
      handleRoleSelect('owner');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <LogIn strokeWidth={1.75} className="w-4 h-4 text-slate-700" />
              <span>Select Account</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch role personas for client demonstrations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors duration-150 ease-out"
          >
            <X strokeWidth={1.75} className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Role Switcher Items - Single surface, outer rounded-xl p-6 -> inner rounded-lg */}
        <div className="space-y-2">
          {/* Owner Button */}
          <button
            onClick={() => handleRoleSelect('owner')}
            className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ease-out flex items-center justify-between ${
              currentRole === 'owner'
                ? 'bg-slate-50 border-slate-900'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-medium">
                <ShieldCheck strokeWidth={1.75} className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <span>Institute Owner / Admin</span>
                  {currentRole === 'owner' && (
                    <span className="text-[10px] text-slate-700 font-medium">
                      (Active)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  owner@automexa.demo
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700">Select &rarr;</span>
          </button>

          {/* Teacher Button */}
          <button
            onClick={() => handleRoleSelect('teacher')}
            className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ease-out flex items-center justify-between ${
              currentRole === 'teacher'
                ? 'bg-slate-50 border-slate-900'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-medium">
                <GraduationCap strokeWidth={1.75} className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <span>Dr. Rajesh Mehta (Teacher)</span>
                  {currentRole === 'teacher' && (
                    <span className="text-[10px] text-slate-700 font-medium">
                      (Active)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  teacher@automexa.demo
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700">Select &rarr;</span>
          </button>

          {/* Parent Button */}
          <button
            onClick={() => handleRoleSelect('parent')}
            className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ease-out flex items-center justify-between ${
              currentRole === 'parent'
                ? 'bg-slate-50 border-slate-900'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-medium">
                <Users strokeWidth={1.75} className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                  <span>Alok Sharma (Parent of Rahul)</span>
                  {currentRole === 'parent' && (
                    <span className="text-[10px] text-slate-700 font-medium">
                      (Active)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  parent@automexa.demo
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700">Select &rarr;</span>
          </button>
        </div>

        {/* Demo Credentials Notice */}
        <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-100">
          Default password for all accounts: <strong className="text-slate-700 font-mono">demo123</strong>
        </div>
      </div>
    </div>
  );
};
