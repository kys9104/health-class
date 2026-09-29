import React, { useState } from 'react';
import { 
  Users, 
  Database, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  CheckCircle2, 
  Copy, 
  Key, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  RefreshCw,
  Eye,
  AlertTriangle,
  Code,
  Smartphone,
  Activity,
  Award,
  Zap,
  Layers,
  ChevronRight,
  Calendar,
  Scale
} from 'lucide-react';
import { AppConfig, Gender, InBodyRecord, SchoolType, Student, StudentWorkoutPlan, WorkoutLog } from '../types';
import { 
  getAppConfig, 
  saveAppConfig, 
  saveStudents, 
  resetStudentPinToInitial, 
  resetAllStudentsPinToInitial,
  setStudentCustomPin,
  clearStudentWorkoutLogs,
  clearStudentPaps,
  clearAllWorkoutLogs,
  updateWorkoutLog, 
  deleteWorkoutLog, 
  GOOGLE_APPS_SCRIPT_SAMPLE_CODE,
  sortStudentsNumerically
} from '../services/dataService';
import { StudentLogin } from './StudentLogin';
import { StudentDashboard } from './StudentDashboard';
import { ExerciseGuideView } from './ExerciseGuideView';
import { PapsAssessmentView } from './PapsAssessmentView';
import { WorkoutTracker } from './WorkoutTracker';
import { LeaderboardView } from './LeaderboardView';
import { TeacherStudentStatusOverview } from './TeacherStudentStatusOverview';
import { WorkoutPlanDashboard } from './WorkoutPlanDashboard';
import { InbodyDashboard } from './InbodyDashboard';

interface TeacherDashboardProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  logs: WorkoutLog[];
  setLogs: React.Dispatch<React.SetStateAction<WorkoutLog[]>>;
  inbodyRecords?: InBodyRecord[];
  setInbodyRecords?: React.Dispatch<React.SetStateAction<InBodyRecord[]>>;
  workoutPlans?: StudentWorkoutPlan[];
  setWorkoutPlans?: React.Dispatch<React.SetStateAction<StudentWorkoutPlan[]>>;
  onExit: () => void;
  onRefreshFirebase?: () => Promise<void>;
  isSyncing?: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  setStudents,
  logs,
  setLogs,
  inbodyRecords,
  setInbodyRecords,
  workoutPlans,
  setWorkoutPlans,
  onExit,
  onRefreshFirebase,
  isSyncing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'logs' | 'settings' | 'student-preview'>('overview');
  const [config, setConfig] = useState<AppConfig>(getAppConfig());

  // Student Screen Preview / Simulator State
  const [previewStudentId, setPreviewStudentId] = useState<string>(students[0]?.id || '');
  const [previewSubTab, setPreviewSubTab] = useState<'dashboard' | 'guide' | 'paps' | 'tracker' | 'leaderboard' | 'plan' | 'inbody'>('dashboard');
  const [previewExerciseId, setPreviewExerciseId] = useState<string | undefined>(undefined);

  // Roster Tab Filters & Form
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [rosterSearch, setRosterSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [bulkTextInput, setBulkTextInput] = useState<string>('');

  // Individual Add Student Form
  const [newSchoolType, setNewSchoolType] = useState<SchoolType>('high');
  const [newGrade, setNewGrade] = useState<number>(1);
  const [newClass, setNewClass] = useState<number>(1);
  const [newNumber, setNewNumber] = useState<number>(1);
  const [newName, setNewName] = useState<string>('');
  const [newGender, setNewGender] = useState<Gender>('M');

  // Logs Tab Filters & Search
  const [logSearch, setLogSearch] = useState<string>('');
  const [selectedLogStudentId, setSelectedLogStudentId] = useState<string>('all');
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null);

  // Settings State
  const [gasUrlInput, setGasUrlInput] = useState<string>(config.gasWebhookUrl || '');
  const [schoolNameInput, setSchoolNameInput] = useState<string>(config.schoolName || '신안해양과학고등학교');
  const [newTeacherPassword, setNewTeacherPassword] = useState<string>('');
  const [configSaveNotice, setConfigSaveNotice] = useState<boolean>(false);
  const [codeCopiedNotice, setCodeCopiedNotice] = useState<boolean>(false);

  // In-App Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // In-App Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '확인',
    confirmVariant: 'danger',
    onConfirm: () => {},
  });

  // PIN Management Modal State
  const [pinManageStudent, setPinManageStudent] = useState<Student | null>(null);
  const [customPinInput, setCustomPinInput] = useState<string>('');

  // Record Reset Modal State
  const [recordResetStudent, setRecordResetStudent] = useState<Student | null>(null);

  // Filtered Students (strictly sorted in numeric order: Grade -> Class -> Number)
  const filteredStudents = sortStudentsNumerically(
    students.filter(s => {
      if (selectedGrade !== 'all' && s.grade !== Number(selectedGrade)) return false;
      if (selectedClass !== 'all' && s.classNum !== Number(selectedClass)) return false;
      if (rosterSearch && !s.name.includes(rosterSearch)) return false;
      return true;
    })
  );

  // Filtered Logs
  const filteredLogs = logs.filter(l => {
    if (selectedLogStudentId !== 'all' && l.studentId !== selectedLogStudentId) return false;
    if (logSearch && !l.studentName.includes(logSearch) && !l.exerciseName.includes(logSearch)) return false;
    return true;
  });

  // Handle Single Student PIN Quick Reset to 0000
  const handleResetPin = (studentId: string, studentName: string) => {
    setConfirmModal({
      isOpen: true,
      title: '학생 비밀번호(PIN) 초기화',
      message: `${studentName} 학생의 비밀번호를 기본 초기값('0000')으로 초기화하시겠습니까?\n\n학생은 다음 로그인 시 4자리 개인 비밀번호를 새롭게 설정하게 됩니다.`,
      confirmLabel: '0000으로 초기화',
      confirmVariant: 'warning',
      onConfirm: () => {
        resetStudentPinToInitial(studentId);
        setStudents(prev =>
          prev.map(s => (s.id === studentId ? { ...s, pin: '0000', isInitialPin: true } : s))
        );
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast(`${studentName} 학생의 PIN이 '0000'으로 성공적으로 초기화되었습니다.`);
      },
    });
  };

  // Handle Bulk Reset All Students' PINs to 0000
  const handleBulkResetAllPins = () => {
    setConfirmModal({
      isOpen: true,
      title: '전체 학생 PIN 0000 일괄 초기화',
      message: `현재 등록된 모든 학생(총 ${students.length}명)의 비밀번호를 초기값('0000')으로 일괄 초기화하시겠습니까?\n\n모든 학생의 개인 PIN이 초기화되며 다음 로그인 시 새로 설정해야 합니다.`,
      confirmLabel: '전체 0000으로 일괄 초기화',
      confirmVariant: 'warning',
      onConfirm: () => {
        const updated = resetAllStudentsPinToInitial();
        setStudents(updated);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast(`전체 학생(${updated.length}명)의 비밀번호가 0000으로 일괄 초기화되었습니다.`);
      },
    });
  };

  // Handle Delete Student
  const handleDeleteStudent = (student: Student) => {
    setConfirmModal({
      isOpen: true,
      title: '학생 명단 삭제',
      message: `${student.grade}학년 ${student.classNum}반 ${student.number}번 ${student.name} 학생을 명단에서 삭제하시겠습니까?\n(기존 누적 운동 기록은 데이터 무결성을 위해 보존됩니다)`,
      confirmLabel: '학생 삭제',
      confirmVariant: 'danger',
      onConfirm: () => {
        const updated = students.filter(s => s.id !== student.id);
        setStudents(updated);
        saveStudents(updated);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast(`${student.name} 학생이 명단에서 삭제되었습니다.`);
      },
    });
  };

  // Handle Clear All Workout Logs
  const handleClearAllLogs = () => {
    setConfirmModal({
      isOpen: true,
      title: '전체 운동 기록 일괄 초기화',
      message: `현재 저장된 모든 학생의 운동 기록(총 ${logs.length}건)을 완전히 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없으며, 모든 학생의 누적 운동 기록이 0건으로 비워집니다.`,
      confirmLabel: '모든 기록 영구 삭제 (0건으로 초기화)',
      confirmVariant: 'danger',
      onConfirm: () => {
        clearAllWorkoutLogs();
        setLogs([]);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('전체 운동 기록이 성공적으로 모두 초기화되었습니다.');
      },
    });
  };

  // Handle Add Single Student
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const id = `${newSchoolType === 'middle' ? 'M' : 'H'}-${newGrade}-${newClass}-${String(newNumber).padStart(2, '0')}-${newName.trim()}`;
    const newStudent: Student = {
      id,
      schoolType: newSchoolType,
      grade: newGrade,
      classNum: newClass,
      number: newNumber,
      name: newName.trim(),
      gender: newGender,
      pin: '0000',
      isInitialPin: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    saveStudents(updated);
    setShowAddModal(false);
    setNewName('');
    showToast(`${newStudent.name} 학생이 등록되었습니다. 초기 PIN은 0000입니다.`);
  };

  // Handle Bulk Registration
  const handleBulkRegister = () => {
    if (!bulkTextInput.trim()) return;

    const lines = bulkTextInput.trim().split('\n');
    const addedList: Student[] = [];

    lines.forEach(line => {
      // Split by comma, tab, or space
      const parts = line.split(/[,\t\s]+/).filter(Boolean);
      if (parts.length >= 5) {
        const grade = parseInt(parts[0]) || 1;
        const classNum = parseInt(parts[1]) || 1;
        const number = parseInt(parts[2]) || 1;
        const name = parts[3];
        const gender: Gender = parts[4].includes('여') || parts[4].toUpperCase() === 'F' ? 'F' : 'M';
        const schoolType: SchoolType = 'middle';

        const id = `M-${grade}-${classNum}-${String(number).padStart(2, '0')}-${name}`;
        addedList.push({
          id,
          schoolType,
          grade,
          classNum,
          number,
          name,
          gender,
          pin: '0000',
          isInitialPin: true,
          createdAt: new Date().toISOString(),
        });
      }
    });

    if (addedList.length > 0) {
      const existingIds = new Set(students.map(s => s.id));
      const nonDuplicates = addedList.filter(s => !existingIds.has(s.id));
      const updated = [...students, ...nonDuplicates];
      setStudents(updated);
      saveStudents(updated);
      setShowBulkModal(false);
      setBulkTextInput('');
      showToast(`총 ${nonDuplicates.length}명의 학생이 일괄 등록되었습니다.`);
    } else {
      showToast('올바른 형식의 데이터가 없습니다. (예: 1 1 5 홍길동 남)', 'error');
    }
  };

  // Handle Log Update
  const handleSaveLogEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    updateWorkoutLog(editingLog.id, { value: editingLog.value, notes: editingLog.notes });
    setLogs(prev => prev.map(l => (l.id === editingLog.id ? editingLog : l)));
    setEditingLog(null);
    showToast('운동 기록이 성공적으로 수정되었습니다.');
  };

  // Handle Log Delete
  const handleDeleteLog = (log: WorkoutLog) => {
    setConfirmModal({
      isOpen: true,
      title: '운동 기록 삭제',
      message: `${log.studentName} 학생의 [${log.exerciseName} ${log.value}${log.unit}] (${log.dateFormatted}) 운동 기록을 삭제하시겠습니까?`,
      confirmLabel: '기록 삭제',
      confirmVariant: 'danger',
      onConfirm: () => {
        deleteWorkoutLog(log.id);
        setLogs(prev => prev.filter(l => l.id !== log.id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('운동 기록이 정상 삭제되었습니다.');
      },
    });
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedConfig: AppConfig = {
        ...config,
        schoolName: schoolNameInput,
        gasWebhookUrl: gasUrlInput.trim(),
        teacherPasswordHash: newTeacherPassword.trim() || config.teacherPasswordHash,
      };

      saveAppConfig(updatedConfig);
      setConfig(updatedConfig);
      setConfigSaveNotice(true);
      setTimeout(() => setConfigSaveNotice(false), 3000);
      showToast('시스템 및 구글 시트 연동 설정이 성공적으로 저장되었습니다.');
    } catch (err) {
      showToast('설정 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleCopyGASCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE_CODE);
    setCodeCopiedNotice(true);
    setTimeout(() => setCodeCopiedNotice(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-[#14213D] border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>체육교사 종합 관리 시스템</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {config.schoolName} 건강체력교실 교사 대시보드
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            학생 명단 및 PIN 초기화, 학생별 누적 운동 기록 및 PAPS 초기화, 실시간 운동 기록 관리(CRUD), Firebase & GAS 이중 연동
          </p>
        </div>

        <button
          id="teacher-exit-btn"
          onClick={onExit}
          className="px-4 py-2 rounded-xl bg-[#0B132B] border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition"
        >
          대시보드 닫기
        </button>
      </div>

      {/* In-App Toast Notification */}
      {toast && (
        <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 ${
          toast.type === 'error'
            ? 'bg-red-500/15 border-red-500/30 text-red-300'
            : toast.type === 'warning'
            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-[#FF4B4B] shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-md hover:bg-black/20"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Teacher Tabs & Top-Right Compact Settings Tab */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: '운동계획 & 인바디 종합 현황', icon: Activity },
            { id: 'roster', label: '학생 명단 & PIN 관리', icon: Users },
            { id: 'student-preview', label: '학생 화면 시뮬레이터', icon: Smartphone },
            { id: 'logs', label: '운동 기록 관리', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`teacher-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-[#14213D] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Small Top-Right Tab for System & GAS Google Sheets */}
        <button
          id="teacher-tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 border ${
            activeTab === 'settings'
              ? 'bg-[#00B4D8] text-[#0B132B] border-[#00B4D8] shadow-md shadow-[#00B4D8]/20'
              : 'bg-[#0B132B] text-slate-300 border-slate-700 hover:border-[#00B4D8] hover:text-white'
          }`}
          title="시스템 & GAS 구글 스프레드시트 연동 설정"
        >
          <Settings className="w-3.5 h-3.5 text-[#00B4D8]" />
          <span>시스템 & GAS 연동</span>
        </button>
      </div>

      {/* ================= Tab 0: Overview of Plans, Logs & InBody ================= */}
      {activeTab === 'overview' && (
        <TeacherStudentStatusOverview
          students={students}
          logs={logs}
          inbodyRecords={inbodyRecords}
          setInbodyRecords={setInbodyRecords}
          workoutPlans={workoutPlans}
          setWorkoutPlans={setWorkoutPlans}
          onRefreshFirebase={onRefreshFirebase}
          isSyncing={isSyncing}
        />
      )}

      {/* ================= Tab 1: Roster & Student Management ================= */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-[#14213D] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                id="roster-grade-filter"
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
                className="bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold outline-none"
              >
                <option value="all">전체 학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
              </select>

              <select
                id="roster-class-filter"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold outline-none"
              >
                <option value="all">전체 반</option>
                <option value="1">1반</option>
                <option value="2">2반</option>
              </select>

              <div className="relative flex-1 md:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="roster-search-input"
                  type="text"
                  placeholder="이름 검색"
                  value={rosterSearch}
                  onChange={e => setRosterSearch(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                id="bulk-reset-all-pins-btn"
                onClick={handleBulkResetAllPins}
                className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                title="등록된 모든 학생의 비밀번호를 0000으로 일괄 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>전체 PIN 0000 초기화</span>
              </button>
              <button
                id="open-bulk-register-modal-btn"
                onClick={() => setShowBulkModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span>명단 일괄 등록</span>
              </button>
              <button
                id="open-add-student-modal-btn"
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] text-xs font-extrabold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>학생 개별 등록</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-[#14213D] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B132B] text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">학년/반/번호</th>
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">성별</th>
                    <th className="px-4 py-3">PAPS 등급</th>
                    <th className="px-4 py-3">PIN 상태</th>
                    <th className="px-4 py-3 text-right">관리 작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 font-semibold text-white">
                        {student.grade}학년 {student.classNum}반 {student.number}번
                      </td>
                      <td className="px-4 py-3 font-bold text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {student.gender === 'M' ? '남' : '여'}
                      </td>
                      <td className="px-4 py-3">
                        {student.paps ? (
                          <span className="px-2 py-0.5 rounded bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/30 font-bold text-[11px]">
                            {student.paps.totalGrade}등급 ({student.paps.totalScore}점)
                          </span>
                        ) : (
                          <span className="text-slate-500">미측정</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {student.isInitialPin ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            초기 PIN (0000)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            개인 PIN 설정됨
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          id={`preview-student-${student.id}-btn`}
                          onClick={() => {
                            setPreviewStudentId(student.id);
                            setPreviewSubTab('dashboard');
                            setActiveTab('student-preview');
                          }}
                          className="px-2 py-1 rounded-lg bg-[#00B4D8]/15 hover:bg-[#00B4D8]/25 border border-[#00B4D8]/30 text-[#00B4D8] text-[11px] font-bold transition inline-flex items-center gap-1"
                          title="이 학생 시점의 화면 바로보기"
                        >
                          <Eye className="w-3 h-3" />
                          <span>학생 시점</span>
                        </button>
                        <button
                          id={`manage-pin-${student.id}-btn`}
                          onClick={() => {
                            setPinManageStudent(student);
                            setCustomPinInput('');
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition inline-flex items-center gap-1"
                          title="비밀번호(PIN) 초기화 또는 직접 변경"
                        >
                          <Key className="w-3 h-3" />
                          <span>PIN 관리</span>
                        </button>
                        <button
                          id={`reset-records-${student.id}-btn`}
                          onClick={() => setRecordResetStudent(student)}
                          className="px-2 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-[11px] font-bold transition inline-flex items-center gap-1"
                          title="이 학생의 운동 기록 또는 PAPS 등급 초기화"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>기록 초기화</span>
                        </button>
                        <button
                          id={`delete-student-${student.id}-btn`}
                          onClick={() => handleDeleteStudent(student)}
                          className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-[#FF4B4B] text-[11px] font-bold transition inline-flex items-center"
                          title="학생 삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        해당 조건의 학생이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= Tab: Student Screen Full Preview / Simulator ================= */}
      {activeTab === 'student-preview' && (
        <div className="space-y-4">
          {/* Top Control Bar for Preview */}
          <div className="bg-[#14213D] border border-[#00B4D8]/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>학생용 화면 모니터링 & 시뮬레이터</span>
                </div>
              </div>

              {/* Quick Student Selector */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-300 font-bold whitespace-nowrap">시점 학생:</span>
                <select
                  id="preview-student-select"
                  value={previewStudentId}
                  onChange={e => setPreviewStudentId(e.target.value)}
                  className="bg-[#0B132B] border border-[#00B4D8]/50 focus:border-[#00B4D8] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none w-full md:w-64"
                >
                  {sortStudentsNumerically(students).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.grade}학년 {s.classNum}반 {s.number}번 {s.name} ({s.gender === 'M' ? '남' : '여'}, {s.paps ? `${s.paps.totalGrade}등급` : 'PAPS 미측정'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-Navigation for Student Screens */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800 pt-3">
              {[
                { id: 'dashboard', label: '📊 1. 개인 대시보드 & PAPS 차트', icon: Activity },
                { id: 'plan', label: '📅 2. 개인 맞춤 운동 계획', icon: Calendar },
                { id: 'inbody', label: '⚖️ 3. 인바디 검사 & 체성분 변화', icon: Scale },
                { id: 'guide', label: '🌀 4. 맞춤운동 가이드 (루프밴드/러닝/맨몸/스트레칭/순발력)', icon: Layers },
                { id: 'paps', label: '📋 5. PAPS 5종 측정 & 등급 계산기', icon: Award },
                { id: 'tracker', label: '⏱️ 6. 실시간 운동 측정기 & 타이머', icon: Zap },
                { id: 'leaderboard', label: '🏆 7. 체력 랭킹 & 리더보드', icon: Sparkles },
              ].map(sub => {
                const Icon = sub.icon;
                const isCurrent = previewSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    id={`preview-subtab-${sub.id}`}
                    onClick={() => setPreviewSubTab(sub.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                      isCurrent
                        ? 'bg-[#00B4D8] text-[#0B132B] border-[#00B4D8] shadow-md shadow-[#00B4D8]/20'
                        : 'bg-[#0B132B] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preview View Container */}
          <div className="bg-[#0B132B] border border-slate-800 rounded-3xl p-3 sm:p-6 shadow-2xl relative overflow-hidden">
            {/* Live Mode Tag */}
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400 bg-[#14213D]/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">
                  {(students.find(s => s.id === previewStudentId) || students[0])?.name} 학생 시점 실시간 뷰어
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                신안해양과학고등학교 건강체력교실 Web App
              </span>
            </div>

            {/* Screen 1: Student Personal Dashboard */}
            {previewSubTab === 'dashboard' && (
              <StudentDashboard
                student={students.find(s => s.id === previewStudentId) || students[0]}
                logs={logs}
                onNavigateTab={(tab, param) => {
                  if (param) setPreviewExerciseId(param);
                  setPreviewSubTab(tab as any);
                }}
              />
            )}

            {/* Screen 2: Workout Plan Dashboard */}
            {previewSubTab === 'plan' && (
              <WorkoutPlanDashboard
                student={students.find(s => s.id === previewStudentId) || students[0]}
                onWorkoutCompleted={() => {}}
                onNavigateToGuide={() => setPreviewSubTab('guide')}
              />
            )}

            {/* Screen 3: InBody Dashboard */}
            {previewSubTab === 'inbody' && (
              <InbodyDashboard
                student={students.find(s => s.id === previewStudentId) || students[0]}
                onRecordUpdated={() => {
                  if (onRefreshFirebase) onRefreshFirebase();
                }}
              />
            )}

            {/* Screen 4: Exercise Guide View */}
            {previewSubTab === 'guide' && (
              <ExerciseGuideView
                student={students.find(s => s.id === previewStudentId) || students[0]}
                logs={logs}
                onSelectExerciseToTrack={(exId) => {
                  setPreviewExerciseId(exId);
                  setPreviewSubTab('tracker');
                }}
              />
            )}

            {/* Screen 4: PAPS Assessment View */}
            {previewSubTab === 'paps' && (
              <PapsAssessmentView
                student={students.find(s => s.id === previewStudentId) || students[0]}
                onPapsSaved={(updatedStudent) => {
                  setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
                  saveStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
                  alert(`${updatedStudent.name} 학생의 PAPS 등급 및 점수가 업데이트되었습니다.`);
                }}
              />
            )}

            {/* Screen 5: Real-time Workout Tracker */}
            {previewSubTab === 'tracker' && (
              <WorkoutTracker
                student={students.find(s => s.id === previewStudentId) || students[0]}
                defaultExerciseId={previewExerciseId}
                onWorkoutCompleted={(newLog) => {
                  setLogs(prev => [newLog, ...prev]);
                  alert(`[교사 시뮬레이터] ${newLog.exerciseName} ${newLog.value}${newLog.unit} 운동 기록이 정상 등록되었습니다!`);
                }}
                onNavigateBack={() => setPreviewSubTab('dashboard')}
              />
            )}

            {/* Screen 6: Leaderboard & Rankings */}
            {previewSubTab === 'leaderboard' && (
              <LeaderboardView
                students={students}
                logs={logs}
                currentStudent={students.find(s => s.id === previewStudentId) || students[0]}
              />
            )}
          </div>
        </div>
      )}

      {/* ================= Tab 2: Workout Logs CRUD ================= */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-[#14213D] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="log-search-input"
                  type="text"
                  placeholder="학생 이름 또는 운동 종목 검색"
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white text-xs outline-none"
                />
              </div>

              <select
                id="log-student-filter"
                value={selectedLogStudentId}
                onChange={e => setSelectedLogStudentId(e.target.value)}
                className="bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold outline-none"
              >
                <option value="all">전체 학생 기록 보기 ({logs.length}건)</option>
                {students.map(s => {
                  const sCount = logs.filter(l => l.studentId === s.id).length;
                  return (
                    <option key={s.id} value={s.id}>
                      {s.grade}-{s.classNum}-{s.number} {s.name} ({sCount}건)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="text-xs text-slate-400">
                조회된 기록: <span className="text-[#00B4D8] font-bold">{filteredLogs.length}건</span>
              </div>
              <button
                id="clear-all-workout-logs-btn"
                onClick={handleClearAllLogs}
                disabled={logs.length === 0}
                className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 disabled:opacity-40 disabled:hover:bg-red-500/15 text-[#FF4B4B] text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                title="모든 학생의 누적 운동 기록을 0건으로 일괄 초기화"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>전체 운동 기록 초기화</span>
              </button>
            </div>
          </div>

          <div className="bg-[#14213D] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B132B] text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">날짜/시간</th>
                    <th className="px-4 py-3">학생 정보</th>
                    <th className="px-4 py-3">운동 종목</th>
                    <th className="px-4 py-3">기록</th>
                    <th className="px-4 py-3">메모</th>
                    <th className="px-4 py-3">연동 상태</th>
                    <th className="px-4 py-3 text-right">수정/삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3 text-slate-400 font-mono">
                        {log.dateFormatted} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        {log.studentName} ({log.grade}-{log.classNum})
                      </td>
                      <td className="px-4 py-3 text-slate-200">
                        {log.exerciseName}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#00B4D8]">
                        {log.value}{log.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                        {log.notes || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>DB저장</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          id={`edit-log-${log.id}-btn`}
                          onClick={() => setEditingLog(log)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="기록 수정"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-log-${log.id}-btn`}
                          onClick={() => handleDeleteLog(log)}
                          className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-[#FF4B4B]"
                          title="기록 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        운동 기록이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= Tab 4: System & GAS Webhook Settings ================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="bg-[#14213D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#00B4D8]" />
              <span>시스템 및 이중 연동 설정</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  학교명 / 기관명
                </label>
                <input
                  id="setting-school-name-input"
                  type="text"
                  value={schoolNameInput}
                  onChange={e => setSchoolNameInput(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Apps Script (GAS) Webhook URL
                </label>
                <input
                  id="setting-gas-url-input"
                  type="url"
                  value={gasUrlInput}
                  onChange={e => setGasUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3.5 py-2.5 text-white text-xs outline-none font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  학생이 운동 기록 제출 시 교사의 구글 스프레드시트로 실시간 자동 누적 전송됩니다.
                </p>
              </div>

              {/* Firebase Cloud Connection Status Card */}
              <div className="bg-[#0B132B] border border-emerald-500/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Firebase Firestore 클라우드 자동 연동 상태</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    연동 완료 (정상 동작 중)
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono pt-1">
                  <div>• 클라우드 프로젝트: <strong className="text-white">gen-lang-client-0647827868</strong></div>
                  <div>• Firestore DB: <strong className="text-white">ai-studio-45cd276d-e509-40a3-9278-c8615b62b902</strong></div>
                  <div>• 실시간 동기화: <strong className="text-emerald-400">모든 사용자(학생/교사 기기) 자동 실시간 공유 활성화됨</strong></div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed border-t border-slate-800">
                  💡 <strong>안내:</strong> AI Studio 환경에 Firebase 클라우드 데이터베이스가 이미 안전하게 자동 구성되어 있습니다. 프로젝트 ID나 API 키를 수동으로 입력하지 않으셔도 모든 학생과 교사 간에 운동 기록 및 인바디 데이터가 실시간으로 자동 공유됩니다.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  교사 관리자 비밀번호 변경
                </label>
                <input
                  id="setting-teacher-pw-input"
                  type="password"
                  value={newTeacherPassword}
                  onChange={e => setNewTeacherPassword(e.target.value)}
                  placeholder="새 관리자 비밀번호 (미입력 시 기존 유지)"
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none"
                />
              </div>

              <button
                id="save-teacher-settings-btn"
                type="submit"
                className="w-full bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-xs transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>연동 설정 저장하기</span>
              </button>
            </form>
          </div>

          {/* GAS Code Snippet & Instructions */}
          <div className="bg-[#14213D] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">구글 시트 연동 스크립트 (Code.gs)</h3>
                </div>
                <button
                  id="copy-gas-code-btn"
                  onClick={handleCopyGASCode}
                  className="px-3 py-1.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-[#00B4D8] flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{codeCopiedNotice ? '복사 완료!' : 'Code.gs 복사'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                구글 스프레드시트의 <span className="text-amber-400 font-semibold">[확장 프로그램] → [Apps Script]</span>에 아래 코드를 붙여넣고 <strong className="text-white">[웹 앱으로 배포]</strong>한 뒤 생성된 URL을 왼쪽에 입력하세요.
              </p>

              <pre className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto max-h-64 scrollbar-thin">
                {GOOGLE_APPS_SCRIPT_SAMPLE_CODE}
              </pre>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300">
              ✅ 학생 제출 시 브라우저 CORS 제약을 우회하도록 <code className="bg-slate-900 px-1 py-0.5 rounded text-white">mode: 'no-cors'</code> 옵션이 자동 적용되어 안정적으로 누적 기록됩니다.
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Single Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#14213D] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">학생 개별 등록</h3>
            <form onSubmit={handleAddSingleStudent} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">학년</label>
                  <select
                    value={newGrade}
                    onChange={e => setNewGrade(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-2 text-white text-xs outline-none"
                  >
                    <option value={1}>1학년</option>
                    <option value={2}>2학년</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">반</label>
                  <select
                    value={newClass}
                    onChange={e => setNewClass(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-2 text-white text-xs outline-none"
                  >
                    <option value={1}>1반</option>
                    <option value={2}>2반</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">번호 (1~21)</label>
                  <input
                    type="number"
                    min={1}
                    max={21}
                    value={newNumber}
                    onChange={e => setNewNumber(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-2 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">이름</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">성별 (PAPS 등급 산출용)</label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setNewGender('M')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      newGender === 'M' ? 'bg-[#00B4D8] text-[#0B132B]' : 'bg-[#0B132B] text-slate-400'
                    }`}
                  >
                    남학생
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewGender('F')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      newGender === 'F' ? 'bg-[#FF4B4B] text-white' : 'bg-[#0B132B] text-slate-400'
                    }`}
                  >
                    여학생
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#0B132B] text-slate-300 text-xs font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00B4D8] text-[#0B132B] text-xs font-extrabold rounded-xl"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Register Students */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#14213D] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">학생 명단 일괄 등록 (CSV/엑셀 붙여넣기)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              엑셀이나 한글 문서의 학생 명단을 복사하여 아래에 붙여넣으세요. 한 줄에 한 명씩 <span className="text-[#00B4D8] font-bold">학년 반 번호 이름 성별</span> 형식으로 입력됩니다.
            </p>
            <div className="bg-[#0B132B] p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
              예시 입력 형식:<br />
              1 1 1 김체육 남<br />
              1 1 2 이민수 남<br />
              1 1 3 박지은 여
            </div>
            <textarea
              rows={8}
              value={bulkTextInput}
              onChange={e => setBulkTextInput(e.target.value)}
              placeholder="학년 반 번호 이름 성별"
              className="w-full bg-[#0B132B] border border-slate-700 rounded-2xl p-3 text-white text-xs font-mono outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="flex-1 py-2.5 bg-[#0B132B] text-slate-300 text-xs font-bold rounded-xl"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleBulkRegister}
                className="flex-1 py-2.5 bg-[#00B4D8] text-[#0B132B] text-xs font-extrabold rounded-xl"
              >
                일괄 등록 실행 (초기 PIN 0000 자동 부여)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Log Value */}
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#14213D] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">운동 기록 수정</h3>
            <div className="text-xs text-slate-400">
              {editingLog.studentName} 학생 ({editingLog.exerciseName})
            </div>
            <form onSubmit={handleSaveLogEdit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold">측정 기록 ({editingLog.unit})</label>
                <input
                  type="number"
                  value={editingLog.value}
                  onChange={e => setEditingLog({ ...editingLog, value: Number(e.target.value) })}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-2.5 text-white text-sm font-bold font-mono outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-semibold">메모</label>
                <input
                  type="text"
                  value={editingLog.notes || ''}
                  onChange={e => setEditingLog({ ...editingLog, notes: e.target.value })}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="flex-1 py-2.5 bg-[#0B132B] text-slate-300 text-xs font-bold rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00B4D8] text-[#0B132B] text-xs font-extrabold rounded-xl"
                >
                  수정 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal In-App Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#14213D] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl shrink-0 ${
                confirmModal.confirmVariant === 'danger'
                  ? 'bg-red-500/20 text-[#FF4B4B] border border-red-500/30'
                  : confirmModal.confirmVariant === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/30'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{confirmModal.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">체육교사 관리자 권한 작업</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#0B132B] p-4 rounded-2xl border border-slate-800 whitespace-pre-line">
              {confirmModal.message}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 bg-[#0B132B] hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition ${
                  confirmModal.confirmVariant === 'danger'
                    ? 'bg-[#FF4B4B] hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : confirmModal.confirmVariant === 'warning'
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B]'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Student PIN Management */}
      {pinManageStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#14213D] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/30">
                  교사 권한: 학생 비밀번호(PIN) 관리
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">
                  {pinManageStudent.grade}학년 {pinManageStudent.classNum}반 {pinManageStudent.number}번 {pinManageStudent.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  현재 상태: {pinManageStudent.isInitialPin ? '초기 PIN(0000)' : '개인 설정 PIN 사용 중'}
                </div>
              </div>
              <button
                onClick={() => {
                  setPinManageStudent(null);
                  setCustomPinInput('');
                }}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#0B132B] text-xs font-bold"
              >
                닫기 ✕
              </button>
            </div>

            {/* Option 1: Quick Reset to 0000 */}
            <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>초기 비밀번호 (0000)로 리셋</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  학생이 비밀번호를 분실했을 때 기본값(0000)으로 되돌립니다. 다음 로그인 시 새 PIN을 설정할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetStudentPinToInitial(pinManageStudent.id);
                  setStudents(prev =>
                    prev.map(s => (s.id === pinManageStudent.id ? { ...s, pin: '0000', isInitialPin: true } : s))
                  );
                  showToast(`${pinManageStudent.name} 학생의 비밀번호가 0000으로 초기화되었습니다.`);
                  setPinManageStudent(null);
                  setCustomPinInput('');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md shadow-amber-400/20 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>0000으로 즉시 초기화 실행</span>
              </button>
            </div>

            {/* Option 2: Set Custom 4-digit PIN directly */}
            <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span>교사가 직접 4자리 PIN 지정</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                학생이 희망하는 새로운 4자리 숫자를 직접 입력하여 즉시 설정합니다.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="새 4자리 숫자"
                  value={customPinInput}
                  onChange={e => setCustomPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 bg-[#14213D] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center text-sm font-bold tracking-widest outline-none focus:border-[#00B4D8]"
                />
                <button
                  type="button"
                  disabled={customPinInput.length !== 4}
                  onClick={() => {
                    if (customPinInput.length !== 4) return;
                    setStudentCustomPin(pinManageStudent.id, customPinInput);
                    setStudents(prev =>
                      prev.map(s => (s.id === pinManageStudent.id ? { ...s, pin: customPinInput, isInitialPin: customPinInput === '0000' } : s))
                    );
                    showToast(`${pinManageStudent.name} 학생의 PIN이 [${customPinInput}]로 설정되었습니다.`);
                    setPinManageStudent(null);
                    setCustomPinInput('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00B4D8] hover:bg-[#00B4D8]/90 disabled:opacity-40 disabled:hover:bg-[#00B4D8] text-[#0B132B] text-xs font-black transition shrink-0"
                >
                  지정 적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Student Record Reset */}
      {recordResetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#14213D] border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-red-300 bg-red-500/15 px-2.5 py-1 rounded-md border border-red-500/30">
                  교사 권한: 학생 기록 초기화
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">
                  {recordResetStudent.grade}학년 {recordResetStudent.classNum}반 {recordResetStudent.number}번 {recordResetStudent.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  운동 기록: <strong className="text-[#00B4D8]">{logs.filter(l => l.studentId === recordResetStudent.id).length}건</strong> • 
                  PAPS 상태: <strong className="text-amber-300">{recordResetStudent.paps ? `${recordResetStudent.paps.totalGrade}등급 (${recordResetStudent.paps.totalScore}점)` : '미측정'}</strong>
                </div>
              </div>
              <button
                onClick={() => setRecordResetStudent(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#0B132B] text-xs font-bold"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Clear workout logs only */}
              <button
                type="button"
                onClick={() => {
                  const deletedCount = clearStudentWorkoutLogs(recordResetStudent.id);
                  setLogs(prev => prev.filter(l => l.studentId !== recordResetStudent.id));
                  showToast(`${recordResetStudent.name} 학생의 운동 기록 ${deletedCount}건이 삭제되었습니다.`);
                  setRecordResetStudent(null);
                }}
                className="w-full p-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#00B4D8] transition">
                    운동 기록만 전체 삭제
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    누적된 운동 세션 기록({logs.filter(l => l.studentId === recordResetStudent.id).length}건)만 삭제하며 PAPS 등급은 유지합니다.
                  </div>
                </div>
                <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-[#FF4B4B] shrink-0 ml-2" />
              </button>

              {/* Option 2: Clear PAPS only */}
              <button
                type="button"
                onClick={() => {
                  clearStudentPaps(recordResetStudent.id);
                  setStudents(prev => prev.map(s => (s.id === recordResetStudent.id ? { ...s, paps: undefined } : s)));
                  showToast(`${recordResetStudent.name} 학생의 PAPS 측정 기록이 초기화(미측정)되었습니다.`);
                  setRecordResetStudent(null);
                }}
                className="w-full p-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    PAPS 건강체력평가 기록 초기화
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    PAPS 측정 등급과 점수를 '미측정' 상태로 초기화합니다.
                  </div>
                </div>
                <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-2" />
              </button>

              {/* Option 3: Clear all records */}
              <button
                type="button"
                onClick={() => {
                  const deletedCount = clearStudentWorkoutLogs(recordResetStudent.id);
                  clearStudentPaps(recordResetStudent.id);
                  setLogs(prev => prev.filter(l => l.studentId !== recordResetStudent.id));
                  setStudents(prev => prev.map(s => (s.id === recordResetStudent.id ? { ...s, paps: undefined } : s)));
                  showToast(`${recordResetStudent.name} 학생의 운동(${deletedCount}건) 및 PAPS 기록이 모두 초기화되었습니다.`);
                  setRecordResetStudent(null);
                }}
                className="w-full p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-red-300">
                    운동 기록 및 PAPS 기록 모두 완전 초기화
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    이 학생의 모든 누적 기록을 새 학기 상태로 깨끗이 초기화합니다.
                  </div>
                </div>
                <Trash2 className="w-4 h-4 text-[#FF4B4B] shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
