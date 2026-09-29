import React from 'react';
import { 
  Flame, 
  Dumbbell, 
  Timer, 
  Award, 
  Trophy, 
  ShieldCheck, 
  LogOut, 
  User, 
  HeartHandshake,
  Menu,
  X,
  Scale,
  Calendar,
  Cloud
} from 'lucide-react';
import { Student } from '../types';
import { getPapsGradeColor } from '../utils/papsCalculator';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeStudent: Student | null;
  students?: Student[];
  onSelectStudent?: (student: Student) => void;
  onLogout: () => void;
  onOpenTeacherMode: () => void;
  isTeacherMode: boolean;
  isFirebaseConnected?: boolean;
  isSyncing?: boolean;
  onSyncFirebase?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeStudent,
  students = [],
  onSelectStudent,
  onLogout,
  onOpenTeacherMode,
  isTeacherMode,
  isFirebaseConnected = true,
  isSyncing = false,
  onSyncFirebase,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const studentPapsColor = activeStudent?.paps
    ? getPapsGradeColor(activeStudent.paps.totalGrade)
    : null;

  const navItems = [
    { id: 'dashboard', label: '나의 체력', icon: Dumbbell },
    { id: 'plan', label: '체력 운동 계획', icon: Calendar, highlight: true },
    { id: 'inbody', label: '인바디 검사지', icon: Scale },
    { id: 'tracker', label: '운동 측정/카운터', icon: Timer },
    { id: 'guide', label: '맞춤 운동 가이드', icon: HeartHandshake },
    { id: 'paps', label: 'PAPS 진단', icon: Award },
    { id: 'leaderboard', label: '명예의 전당', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B]/95 backdrop-blur-md border-b border-[#1E3A5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              id="app-logo-btn"
              onClick={() => setActiveTab(isTeacherMode ? 'teacher' : 'dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B4D8] to-[#FF4B4B] p-0.5 flex items-center justify-center shadow-lg shadow-[#00B4D8]/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#00B4D8] group-hover:text-[#FF4B4B] transition" />
                </div>
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-wider flex items-center gap-1.5">
                  건강체력교실
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/30">
                    신안해양과학고
                  </span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium -mt-1">
                  E-PAPS 스마트 체육수업
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items (when student is logged in) */}
          {!isTeacherMode && activeStudent && (
            <nav className="hidden md:flex items-center gap-1 bg-[#14213D] p-1 rounded-2xl border border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-[#00B4D8] text-[#0B132B] shadow-sm'
                        : item.highlight
                        ? 'text-[#00B4D8] hover:bg-slate-800'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Profile & Teacher Switch */}
          <div className="flex items-center gap-2.5">
            {/* Firebase Live Cloud Status & Sync Button */}
            {onSyncFirebase && (
              <button
                id="navbar-firebase-sync-btn"
                onClick={onSyncFirebase}
                disabled={isSyncing}
                title="Firebase 클라우드 실시간 동기화"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#14213D] border border-slate-700/80 text-[11px] font-bold text-slate-300 hover:text-white hover:border-[#00B4D8] transition"
              >
                <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-400' : 'bg-amber-400'} ${isSyncing ? 'animate-ping' : ''}`} />
                <Cloud className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span className="hidden sm:inline">{isSyncing ? '동기화 중...' : 'Firebase'}</span>
              </button>
            )}

            {isTeacherMode ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>체육교사 관리자 모드</span>
                </div>
                <button
                  id="exit-teacher-mode-btn"
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-[#14213D] border border-slate-700 text-slate-300 hover:text-[#FF4B4B] hover:border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="관리자 로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">나가기</span>
                </button>
              </div>
            ) : activeStudent ? (
              <div className="flex items-center gap-2">
                {/* Student Selector / Info Badge */}
                {students.length > 0 && onSelectStudent ? (
                  <div className="flex items-center gap-1.5 bg-[#14213D] border border-slate-700/80 px-2 py-1 rounded-xl">
                    <User className="w-3.5 h-3.5 text-[#00B4D8]" />
                    <select
                      id="navbar-student-selector"
                      value={activeStudent.id}
                      onChange={(e) => {
                        const target = students.find(s => s.id === e.target.value);
                        if (target) onSelectStudent(target);
                      }}
                      className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-1"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#0B132B] text-white">
                          {s.grade}학년 {s.classNum}반 {s.name} ({s.number}번)
                        </option>
                      ))}
                    </select>
                    {studentPapsColor && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${studentPapsColor.bg} ${studentPapsColor.text} ${studentPapsColor.border}`}>
                        {studentPapsColor.label.split(' ')[0]}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 bg-[#14213D] border border-slate-700/80 px-3 py-1.5 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{activeStudent.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {activeStudent.grade}-{activeStudent.classNum} ({activeStudent.number}번)
                        </span>
                      </div>
                    </div>
                    {studentPapsColor && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${studentPapsColor.bg} ${studentPapsColor.text} ${studentPapsColor.border}`}>
                        {studentPapsColor.label.split(' ')[0]}
                      </span>
                    )}
                  </div>
                )}

                {/* Teacher Mode Shortcut */}
                <button
                  id="teacher-portal-shortcut-btn"
                  onClick={onOpenTeacherMode}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#00B4D8]/10 hover:bg-[#00B4D8]/20 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">교사모드</span>
                </button>
              </div>
            ) : (
              <button
                id="header-teacher-login-btn"
                onClick={onOpenTeacherMode}
                className="px-3.5 py-1.5 rounded-xl bg-[#14213D] hover:bg-slate-800 border border-[#1E3A5F] text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4 text-[#00B4D8]" />
                <span>체육교사 로그인</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            {!isTeacherMode && activeStudent && (
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-[#14213D] border border-slate-700 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && !isTeacherMode && activeStudent && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1">
            {/* Mobile student info badge */}
            <div className="px-3 py-2 bg-[#14213D] rounded-xl mb-2 flex items-center justify-between border border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs font-bold text-white">
                  {activeStudent.grade}학년 {activeStudent.classNum}반 {activeStudent.number}번 {activeStudent.name}
                </span>
              </div>
              {studentPapsColor && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${studentPapsColor.bg} ${studentPapsColor.text} ${studentPapsColor.border}`}>
                  {studentPapsColor.label}
                </span>
              )}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#00B4D8] text-[#0B132B]'
                      : 'text-slate-300 hover:bg-[#14213D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
