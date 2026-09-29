import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Dumbbell, 
  CheckCircle2, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Download, 
  Eye, 
  Calendar, 
  Clock, 
  Flame, 
  Sparkles, 
  Award, 
  FileText, 
  Filter, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  Save,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Gender, InBodyRecord, PlannedExercise, Student, StudentWorkoutPlan, WorkoutLog } from '../types';
import { 
  getStoredInBodyRecords, 
  getStoredWorkoutPlans, 
  getStudentInBodyRecords, 
  getStudentWorkoutPlan,
  addInBodyRecord,
  updateInBodyRecord,
  deleteInBodyRecord,
  saveStudentWorkoutPlan,
  clearStudentWorkoutPlan,
  deletePlannedExerciseFromPlan,
  updatePlannedExerciseInPlan,
  sortStudentsNumerically,
  isRecordForStudent
} from '../services/dataService';
import { 
  deleteInBodyRecordFromFirebase, 
  deleteWorkoutPlanFromFirebase 
} from '../services/firebase';
import { EXERCISE_DATABASE } from '../data/exercises';

interface TeacherStudentStatusOverviewProps {
  students: Student[];
  logs: WorkoutLog[];
  inbodyRecords?: InBodyRecord[];
  setInbodyRecords?: React.Dispatch<React.SetStateAction<InBodyRecord[]>>;
  workoutPlans?: StudentWorkoutPlan[];
  setWorkoutPlans?: React.Dispatch<React.SetStateAction<StudentWorkoutPlan[]>>;
  onRefreshFirebase?: () => Promise<void>;
  isSyncing?: boolean;
}

export const TeacherStudentStatusOverview: React.FC<TeacherStudentStatusOverviewProps> = ({
  students,
  logs,
  inbodyRecords: propInbodyRecords,
  setInbodyRecords: propSetInbodyRecords,
  workoutPlans: propWorkoutPlans,
  setWorkoutPlans: propSetWorkoutPlans,
  onRefreshFirebase,
  isSyncing = false,
}) => {
  // Top view tab: student overview vs all inbody records vs all workout plans
  const [currentView, setCurrentView] = useState<'students' | 'allInbody' | 'allPlans'>('students');

  // Filter & Search states
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'hasPlan' | 'hasInbody' | 'completedWorkout'>('all');

  // Selected student for dossier modal
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  // InBody Edit/Add Modal states
  const [editingInbodyRecord, setEditingInbodyRecord] = useState<InBodyRecord | null>(null);
  const [isAddingInbodyForStudent, setIsAddingInbodyForStudent] = useState<Student | null>(null);

  // InBody Form Fields
  const [inbodyFormDate, setInbodyFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inbodyFormHeight, setInbodyFormHeight] = useState<number>(170);
  const [inbodyFormWeight, setInbodyFormWeight] = useState<number>(62);
  const [inbodyFormMuscle, setInbodyFormMuscle] = useState<number>(27);
  const [inbodyFormFatPct, setInbodyFormFatPct] = useState<number>(18.5);
  const [inbodyFormFatMass, setInbodyFormFatMass] = useState<number>(11.5);
  const [inbodyFormScore, setInbodyFormScore] = useState<number>(78);
  const [inbodyFormBmr, setInbodyFormBmr] = useState<number>(1520);
  const [inbodyFormVisceral, setInbodyFormVisceral] = useState<number>(4);
  const [inbodyFormBodyType, setInbodyFormBodyType] = useState<string>('표준체형 (I자형)');
  const [inbodyFormNotes, setInbodyFormNotes] = useState<string>('');

  // Workout Plan Edit Modal states
  const [editingPlanStudent, setEditingPlanStudent] = useState<Student | null>(null);
  const [planGoalSessions, setPlanGoalSessions] = useState<number>(3);
  const [planExercisesList, setPlanExercisesList] = useState<PlannedExercise[]>([]);
  const [showAddExerciseToPlan, setShowAddExerciseToPlan] = useState<boolean>(false);
  const [selectedExerciseIdToAdd, setSelectedExerciseIdToAdd] = useState<string>(EXERCISE_DATABASE[0]?.id || 'running-1');
  const [addSets, setAddSets] = useState<number>(3);
  const [addReps, setAddReps] = useState<number>(15);
  const [addRest, setAddRest] = useState<number>(60);

  // Notification message
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // In-App Confirmation Modal state (immune to iframe window.confirm blocking)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Live collections from props or local storage
  const allInbodyRecords = propInbodyRecords || getStoredInBodyRecords();
  const allPlans = propWorkoutPlans || getStoredWorkoutPlans();

  // Helper to refresh state locally
  const triggerLocalRefresh = () => {
    if (propSetInbodyRecords) {
      propSetInbodyRecords(getStoredInBodyRecords());
    }
    if (propSetWorkoutPlans) {
      propSetWorkoutPlans(getStoredWorkoutPlans());
    }
    if (onRefreshFirebase) {
      onRefreshFirebase();
    }
  };

  // Strictly sort students numerically: Grade -> Class -> Number
  const sortedStudents = sortStudentsNumerically(students);

  // Filter students
  const filteredStudents = sortedStudents.filter(student => {
    if (selectedGrade !== 'all' && student.grade !== Number(selectedGrade)) return false;
    if (selectedClass !== 'all' && student.classNum !== Number(selectedClass)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchNum = `${student.grade}-${student.classNum}-${student.number}`.includes(q);
      if (!matchName && !matchNum) return false;
    }

    const hasPlan = allPlans.some(p => (p.studentId === student.id || isRecordForStudent(p as any, student)) && p.exercises?.length > 0);
    const hasInbody = allInbodyRecords.some(r => isRecordForStudent(r, student));
    const hasLogs = logs.some(l => isRecordForStudent(l, student));

    if (statusFilter === 'hasPlan' && !hasPlan) return false;
    if (statusFilter === 'hasInbody' && !hasInbody) return false;
    if (statusFilter === 'completedWorkout' && !hasLogs) return false;

    return true;
  });

  // KPI Statistics
  const totalStudentsCount = students.length;
  const studentsWithPlanCount = students.filter(s => 
    allPlans.some(p => (p.studentId === s.id || isRecordForStudent(p as any, s)) && p.exercises?.length > 0)
  ).length;
  const studentsWithInbodyCount = students.filter(s => 
    allInbodyRecords.some(r => isRecordForStudent(r, s))
  ).length;
  const totalCompletedLogsCount = logs.length;

  // Open Edit InBody Modal
  const handleOpenEditInbody = (record: InBodyRecord) => {
    setEditingInbodyRecord(record);
    setIsAddingInbodyForStudent(null);
    setInbodyFormDate(record.measuredAt || new Date().toISOString().split('T')[0]);
    setInbodyFormHeight(record.height || 170);
    setInbodyFormWeight(record.weight || 62);
    setInbodyFormMuscle(record.skeletalMuscleMass || 27);
    setInbodyFormFatPct(record.bodyFatPercentage || 18.5);
    setInbodyFormFatMass(record.bodyFatMass || 11.5);
    setInbodyFormScore(record.inBodyScore || 78);
    setInbodyFormBmr(record.bmr || 1520);
    setInbodyFormVisceral(record.visceralFatLevel || 4);
    setInbodyFormBodyType(record.bodyType || '표준체형 (I자형)');
    setInbodyFormNotes(record.notes || '');
  };

  // Open Add InBody Modal
  const handleOpenAddInbody = (student: Student) => {
    setIsAddingInbodyForStudent(student);
    setEditingInbodyRecord(null);
    setInbodyFormDate(new Date().toISOString().split('T')[0]);
    setInbodyFormHeight(student.paps?.height || 170);
    setInbodyFormWeight(student.paps?.weight || 62);
    setInbodyFormMuscle(27);
    setInbodyFormFatPct(18.5);
    setInbodyFormFatMass(11.5);
    setInbodyFormScore(78);
    setInbodyFormBmr(1520);
    setInbodyFormVisceral(4);
    setInbodyFormBodyType('표준체형 (I자형)');
    setInbodyFormNotes('');
  };

  // Save InBody (Create or Update)
  const handleSaveInbodyForm = (e: React.FormEvent) => {
    e.preventDefault();
    const computedBmi = inbodyFormHeight > 0 && inbodyFormWeight > 0 
      ? Number((inbodyFormWeight / Math.pow(inbodyFormHeight / 100, 2)).toFixed(1)) 
      : 21.0;

    if (editingInbodyRecord) {
      // Update existing record
      updateInBodyRecord(editingInbodyRecord.id, {
        measuredAt: inbodyFormDate,
        height: inbodyFormHeight,
        weight: inbodyFormWeight,
        skeletalMuscleMass: inbodyFormMuscle,
        bodyFatPercentage: inbodyFormFatPct,
        bodyFatMass: inbodyFormFatMass,
        bmi: computedBmi,
        inBodyScore: inbodyFormScore,
        bmr: inbodyFormBmr,
        visceralFatLevel: inbodyFormVisceral,
        bodyType: inbodyFormBodyType,
        notes: inbodyFormNotes.trim(),
      });
      showToast('인바디 검사 기록이 성공적으로 수정되었습니다.');
    } else if (isAddingInbodyForStudent) {
      // Add new record for student
      addInBodyRecord({
        studentId: isAddingInbodyForStudent.id,
        studentName: isAddingInbodyForStudent.name,
        schoolType: isAddingInbodyForStudent.schoolType,
        grade: isAddingInbodyForStudent.grade,
        classNum: isAddingInbodyForStudent.classNum,
        number: isAddingInbodyForStudent.number,
        gender: isAddingInbodyForStudent.gender,
        measuredAt: inbodyFormDate,
        height: inbodyFormHeight,
        weight: inbodyFormWeight,
        skeletalMuscleMass: inbodyFormMuscle,
        bodyFatPercentage: inbodyFormFatPct,
        bodyFatMass: inbodyFormFatMass,
        bmi: computedBmi,
        inBodyScore: inbodyFormScore,
        bmr: inbodyFormBmr,
        visceralFatLevel: inbodyFormVisceral,
        bodyType: inbodyFormBodyType,
        notes: inbodyFormNotes.trim(),
      });
      showToast(`${isAddingInbodyForStudent.name} 학생의 새 인바디 기록이 등록되었습니다.`);
    }

    setEditingInbodyRecord(null);
    setIsAddingInbodyForStudent(null);
    triggerLocalRefresh();
  };

  // Delete InBody record (In-App Confirm Modal - Safe in iframes)
  const handleDeleteInbodyRecord = (record: InBodyRecord) => {
    setConfirmModal({
      isOpen: true,
      title: '인바디 검사 기록 삭제',
      message: `${record.studentName || '학생'}의 ${record.measuredAt} 인바디 검사 기록(체중: ${record.weight}kg, 골격근량: ${record.skeletalMuscleMass}kg)을 정말 삭제하시겠습니까?\n\n이 작업은 로컬 저장소 및 Firebase Firestore 클라우드 데이터베이스에서 즉시 영구 삭제됩니다.`,
      confirmLabel: '영구 삭제',
      onConfirm: async () => {
        deleteInBodyRecord(record.id);
        await deleteInBodyRecordFromFirebase(record.id);
        if (propSetInbodyRecords) {
          propSetInbodyRecords(prev => prev.filter(r => r.id !== record.id));
        }
        showToast('인바디 검사 기록이 성공적으로 삭제되었습니다.');
        setConfirmModal(null);
        triggerLocalRefresh();
      },
    });
  };

  // Open Workout Plan Edit Modal
  const handleOpenEditPlan = (student: Student) => {
    setEditingPlanStudent(student);
    const existingPlan = allPlans.find(p => p.studentId === student.id || isRecordForStudent(p as any, student));
    if (existingPlan) {
      setPlanGoalSessions(existingPlan.weeklyGoalSessions || 3);
      setPlanExercisesList(existingPlan.exercises || []);
    } else {
      setPlanGoalSessions(3);
      setPlanExercisesList([]);
    }
    setShowAddExerciseToPlan(false);
  };

  // Add Exercise to Plan in Modal
  const handleAddExerciseToPlan = () => {
    const exData = EXERCISE_DATABASE.find(e => e.id === selectedExerciseIdToAdd) || EXERCISE_DATABASE[0];
    const newEx: PlannedExercise = {
      id: `plan-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      exerciseId: exData.id,
      exerciseName: exData.name,
      category: exData.category,
      targetSets: addSets,
      targetRepsOrTime: addReps,
      unit: exData.unit,
      restSeconds: addRest,
      completedSets: 0,
      isCompleted: false,
    };
    setPlanExercisesList(prev => [...prev, newEx]);
    setShowAddExerciseToPlan(false);
  };

  // Remove Exercise from Plan in Modal
  const handleRemoveExerciseFromPlan = (id: string) => {
    setPlanExercisesList(prev => prev.filter(e => e.id !== id));
  };

  // Save Workout Plan
  const handleSavePlanForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanStudent) return;

    const updatedPlan: StudentWorkoutPlan = {
      id: `plan-${editingPlanStudent.id}`,
      studentId: editingPlanStudent.id,
      studentName: editingPlanStudent.name,
      schoolType: editingPlanStudent.schoolType,
      grade: editingPlanStudent.grade,
      classNum: editingPlanStudent.classNum,
      number: editingPlanStudent.number,
      gender: editingPlanStudent.gender,
      weeklyGoalSessions: planGoalSessions,
      exercises: planExercisesList,
      updatedAt: new Date().toISOString(),
    };

    saveStudentWorkoutPlan(updatedPlan);
    showToast(`${editingPlanStudent.name} 학생의 맞춤 운동 계획이 저장되었습니다.`);
    setEditingPlanStudent(null);
    triggerLocalRefresh();
  };

  // Delete Workout Plan Entirely
  const handleDeletePlanEntirely = (student: Student) => {
    setConfirmModal({
      isOpen: true,
      title: '맞춤 체력 운동 계획 삭제',
      message: `${student.grade}학년 ${student.classNum}반 ${student.number}번 ${student.name} 학생의 맞춤 운동 계획을 완전히 삭제하시겠습니까?\n\n주간 목표 및 등록된 운동 종목이 초기화되며 Firebase 클라우드에서도 삭제됩니다.`,
      confirmLabel: '계획 삭제',
      onConfirm: async () => {
        clearStudentWorkoutPlan(student.id);
        await deleteWorkoutPlanFromFirebase(student.id);
        if (propSetWorkoutPlans) {
          propSetWorkoutPlans(prev => prev.filter(p => p.studentId !== student.id));
        }
        showToast(`${student.name} 학생의 운동 계획이 삭제되었습니다.`);
        setConfirmModal(null);
        triggerLocalRefresh();
      },
    });
  };

  // Export to CSV for Teacher
  const handleExportCSV = () => {
    const headers = [
      '학년', '반', '번호', '이름', '성별', 
      '운동계획수립여부', '계획종목수', '주간목표(회)',
      '총운동완료횟수', '최근운동일자', '최근운동종목',
      '인바디측정횟수', '최근체중(kg)', '골격근량(kg)', '체지방률(%)', 'BMI', '인바디점수', '체형판정'
    ];

    const rows = sortedStudents.map(s => {
      const sPlan = allPlans.find(p => p.studentId === s.id || isRecordForStudent(p as any, s));
      const sLogs = logs.filter(l => isRecordForStudent(l, s));
      const sInbody = allInbodyRecords.filter(r => isRecordForStudent(r, s)).sort((a, b) => new Date(b.measuredAt || 0).getTime() - new Date(a.measuredAt || 0).getTime());
      const latestInbody = sInbody[0];
      const latestLog = sLogs[0];

      return [
        s.grade,
        s.classNum,
        s.number,
        `"${s.name}"`,
        s.gender === 'M' ? '남' : '여',
        sPlan && sPlan.exercises?.length > 0 ? '수립완료' : '미수립',
        sPlan?.exercises?.length || 0,
        sPlan?.weeklyGoalSessions || 0,
        sLogs.length,
        latestLog ? (latestLog.dateFormatted || latestLog.timestamp.split('T')[0]) : '-',
        latestLog ? `"${latestLog.exerciseName}"` : '-',
        sInbody.length,
        latestInbody?.weight || '-',
        latestInbody?.skeletalMuscleMass || '-',
        latestInbody?.bodyFatPercentage || '-',
        latestInbody?.bmi || '-',
        latestInbody?.inBodyScore || '-',
        latestInbody?.bodyType ? `"${latestInbody.bodyType}"` : '-'
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `신안해양과학고_체력_인바디_종합현황_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Detail Modal Student Data
  const detailStudentPlan = selectedStudentForDetail 
    ? allPlans.find(p => p.studentId === selectedStudentForDetail.id || isRecordForStudent(p as any, selectedStudentForDetail))
    : null;
  const detailStudentInbody = selectedStudentForDetail
    ? allInbodyRecords.filter(r => isRecordForStudent(r, selectedStudentForDetail)).sort((a, b) => new Date(b.measuredAt || 0).getTime() - new Date(a.measuredAt || 0).getTime())
    : [];
  const detailStudentLogs = selectedStudentForDetail
    ? logs.filter(l => isRecordForStudent(l, selectedStudentForDetail)).sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    : [];
  const latestInbodyRecord = detailStudentInbody[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header Banner & Live Status */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1A2C54] to-[#14213D] border border-[#00B4D8]/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/15 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>교사 전용 체력 관리 시스템 • 실시간 Firebase 연동</span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <span>학생 운동계획 & 인바디 종합 현황</span>
            </h2>
            <p className="text-xs text-slate-300">
              신안해양과학고 학생 전원의 운동 계획 수립 여부, 완료 횟수 및 인바디(체성분) 검사 기록을 실시간으로 확인하고 직접 수정·삭제할 수 있습니다.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onRefreshFirebase && (
              <button
                type="button"
                onClick={onRefreshFirebase}
                disabled={isSyncing}
                className={`px-3.5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition flex items-center gap-2 ${
                  isSyncing ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                title="Firebase 클라우드 데이터 실시간 동기화"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#00B4D8] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? '동기화 중...' : 'Firebase 동기화'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#00B4D8] hover:bg-[#0096c7] text-[#0B132B] text-xs font-black shadow-lg shadow-[#00B4D8]/20 transition flex items-center gap-2"
              title="학생 전원의 운동 계획 및 인바디 측정 현황을 엑셀 CSV로 다운로드"
            >
              <Download className="w-4 h-4" />
              <span>종합 현황 엑셀(CSV) 저장</span>
            </button>
          </div>
        </div>

        {/* View Switcher Sub-Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-700/60 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCurrentView('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentView === 'students'
                ? 'bg-[#00B4D8] text-[#0B132B] shadow-md'
                : 'bg-[#0B132B]/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>학생별 종합 현황 (기본)</span>
          </button>
          <button
            onClick={() => setCurrentView('allInbody')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentView === 'allInbody'
                ? 'bg-[#00B4D8] text-[#0B132B] shadow-md'
                : 'bg-[#0B132B]/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>전체 인바디 기록 모아보기 ({allInbodyRecords.length}건)</span>
          </button>
          <button
            onClick={() => setCurrentView('allPlans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentView === 'allPlans'
                ? 'bg-[#00B4D8] text-[#0B132B] shadow-md'
                : 'bg-[#0B132B]/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>전체 학생 운동 계획 모아보기 ({allPlans.filter(p => p.exercises?.length > 0).length}명)</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#14213D] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">전체 등록 학생</span>
            <Users className="w-4 h-4 text-[#00B4D8]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">{totalStudentsCount}</span>
            <span className="text-xs text-slate-400 font-bold">명 (숫자순 정렬)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">1학년 ~ 2학년 전교생</span>
        </div>

        <div className="bg-[#14213D] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">운동 계획 수립률</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{studentsWithPlanCount}</span>
            <span className="text-xs text-slate-400 font-bold">
              명 ({totalStudentsCount > 0 ? Math.round((studentsWithPlanCount / totalStudentsCount) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">루틴 및 주간 목표 설정 완료</span>
        </div>

        <div className="bg-[#14213D] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">누적 운동 완료 기록</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">{totalCompletedLogsCount}</span>
            <span className="text-xs text-slate-400 font-bold">건</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">실시간 타이머 및 카운터 기록</span>
        </div>

        <div className="bg-[#14213D] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">인바디 검사지 작성</span>
            <Scale className="w-4 h-4 text-[#00B4D8]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#00B4D8] font-mono">{studentsWithInbodyCount}</span>
            <span className="text-xs text-slate-400 font-bold">
              명 ({totalStudentsCount > 0 ? Math.round((studentsWithInbodyCount / totalStudentsCount) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">총 {allInbodyRecords.length}회 검사 데이터 저장</span>
        </div>
      </div>

      {/* ================= VIEW 1: Main Students Table ================= */}
      {currentView === 'students' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-[#14213D] rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Grade filter */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-[#0B132B] border border-slate-700 text-xs font-bold text-white px-3 py-2 rounded-xl outline-none"
              >
                <option value="all">전체 학년</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </select>

              {/* Class filter */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-[#0B132B] border border-slate-700 text-xs font-bold text-white px-3 py-2 rounded-xl outline-none"
              >
                <option value="all">전체 반</option>
                <option value="1">1반</option>
                <option value="2">2반</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#0B132B] border border-slate-700 text-xs font-bold text-white px-3 py-2 rounded-xl outline-none"
              >
                <option value="all">전체 학생 상태</option>
                <option value="hasPlan">운동 계획 수립 학생만</option>
                <option value="completedWorkout">운동 완료 기록 보유 학생만</option>
                <option value="hasInbody">인바디 검사지 작성 학생만</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="학생 이름 또는 학번 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 text-xs text-white pl-9 pr-3 py-2 rounded-xl outline-none focus:border-[#00B4D8]"
              />
            </div>
          </div>

          {/* Main Students Status Table */}
          <div className="bg-[#14213D] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B132B] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">학생 정보 (학년•반•번호순)</th>
                    <th className="py-3.5 px-3">운동 계획 (종목/목표)</th>
                    <th className="py-3.5 px-3">운동 완료 현황</th>
                    <th className="py-3.5 px-3">인바디 최근 결과</th>
                    <th className="py-3.5 px-3">신체 변화 추이</th>
                    <th className="py-3.5 px-4 text-right">관리 작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        조건에 해당하는 학생이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => {
                      const sPlan = allPlans.find(p => p.studentId === student.id || isRecordForStudent(p as any, student));
                      const sLogs = logs.filter(l => isRecordForStudent(l, student));
                      const sInbody = allInbodyRecords
                        .filter(r => isRecordForStudent(r, student))
                        .sort((a, b) => new Date(b.measuredAt || 0).getTime() - new Date(a.measuredAt || 0).getTime());
                      const latestInbody = sInbody[0];
                      const prevInbody = sInbody[1];

                      const hasPlan = sPlan && sPlan.exercises?.length > 0;
                      const completedWorkoutsCount = sLogs.length;

                      // Weight & muscle delta
                      const weightDiff = latestInbody && prevInbody ? Number((latestInbody.weight - prevInbody.weight).toFixed(1)) : 0;
                      const muscleDiff = latestInbody && prevInbody ? Number((latestInbody.skeletalMuscleMass - prevInbody.skeletalMuscleMass).toFixed(1)) : 0;

                      return (
                        <tr key={student.id} className="hover:bg-slate-800/40 transition">
                          {/* Student Info: Numeric order badge */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#0B132B] border border-slate-700 flex items-center justify-center font-bold text-white text-xs font-mono">
                                {student.grade}-{student.classNum}-{student.number}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span>{student.name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    ({student.gender === 'M' ? '남' : '여'})
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {student.grade}학년 {student.classNum}반 {student.number}번
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Workout Plan */}
                          <td className="py-3.5 px-3">
                            {hasPlan ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                                    <CheckCircle2 className="w-3 h-3" /> {sPlan.exercises.length}개 종목
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    주 {sPlan.weeklyGoalSessions || 3}회
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-300 truncate max-w-[170px]">
                                  {sPlan.exercises.map(e => e.exerciseName).join(', ')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">미수립</span>
                            )}
                          </td>

                          {/* Workout Completion */}
                          <td className="py-3.5 px-3">
                            {completedWorkoutsCount > 0 ? (
                              <div className="space-y-0.5">
                                <span className="text-white font-mono font-bold text-xs">
                                  {completedWorkoutsCount}회 완료
                                </span>
                                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                  최근: {sLogs[0]?.exerciseName || '-'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">완료 기록 없음</span>
                            )}
                          </td>

                          {/* InBody Recent Result */}
                          <td className="py-3.5 px-3">
                            {latestInbody ? (
                              <div className="space-y-0.5">
                                <div className="text-xs font-mono">
                                  <span className="text-white font-bold">{latestInbody.weight}kg</span>
                                  <span className="text-slate-400 ml-1.5">근육: <strong className="text-emerald-400">{latestInbody.skeletalMuscleMass}kg</strong></span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  체지방 {latestInbody.bodyFatPercentage}% • 점수: <strong className="text-amber-300">{latestInbody.inBodyScore || 80}점</strong>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">미작성</span>
                            )}
                          </td>

                          {/* Body Change Trend */}
                          <td className="py-3.5 px-3">
                            {latestInbody && prevInbody ? (
                              <div className="space-y-0.5 text-[11px] font-bold">
                                <div className="flex items-center gap-1">
                                  {muscleDiff > 0 ? (
                                    <span className="text-emerald-400 flex items-center gap-0.5">
                                      <TrendingUp className="w-3 h-3" /> 근육 +{muscleDiff}kg
                                    </span>
                                  ) : muscleDiff < 0 ? (
                                    <span className="text-rose-400 flex items-center gap-0.5">
                                      <TrendingDown className="w-3 h-3" /> 근육 {muscleDiff}kg
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">근육 유지</span>
                                  )}
                                </div>
                                <div className="text-slate-400 text-[10px]">
                                  체중 {weightDiff > 0 ? `+${weightDiff}kg` : `${weightDiff}kg`}
                                </div>
                              </div>
                            ) : latestInbody ? (
                              <span className="text-[11px] text-slate-400">1회 기준치 측정됨</span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Action Buttons: View, Edit Plan, Add/Edit Inbody */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedStudentForDetail(student)}
                                className="px-2.5 py-1.5 rounded-xl bg-[#0B132B] hover:bg-[#00B4D8] hover:text-[#0B132B] text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1"
                                title="학생 종합 기록 조회 & 수정/삭제"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>상세조회</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditPlan(student)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1"
                                title="운동 계획 수정 및 종목 관리"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>계획 수정</span>
                              </button>

                              <button
                                onClick={() => handleOpenAddInbody(student)}
                                className="px-2 py-1.5 rounded-xl bg-[#00B4D8]/10 hover:bg-[#00B4D8]/25 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold transition flex items-center gap-1"
                                title="새 인바디 기록 입력"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>인바디 입력</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: All InBody Records Table ================= */}
      {currentView === 'allInbody' && (
        <div className="space-y-4">
          <div className="bg-[#14213D] rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              전체 사용자가 등록한 인바디 검사 기록 총 <strong className="text-[#00B4D8] font-bold">{allInbodyRecords.length}</strong>건이 Firebase에서 조회되었습니다.
            </div>
            <span className="text-[11px] text-slate-400">교사 권한으로 각 행의 기록을 직접 수정하거나 영구 삭제할 수 있습니다.</span>
          </div>

          <div className="bg-[#14213D] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B132B] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">측정 일자</th>
                    <th className="py-3.5 px-3">학생 정보</th>
                    <th className="py-3.5 px-3">신장 / 체중</th>
                    <th className="py-3.5 px-3">골격근량 / 체지방</th>
                    <th className="py-3.5 px-3">BMI / 인바디점수</th>
                    <th className="py-3.5 px-3">체형 판정</th>
                    <th className="py-3.5 px-3">메모</th>
                    <th className="py-3.5 px-4 text-right">수정 / 삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {allInbodyRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        등록된 인바디 기록이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    allInbodyRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                          {rec.measuredAt}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white">{rec.studentName || '학생'}</div>
                          <span className="text-[10px] text-slate-400">
                            {rec.grade ? `${rec.grade}학년 ${rec.classNum}반 ${rec.number}번` : rec.studentId}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono">
                          <span className="text-white font-bold">{rec.weight} kg</span>
                          <span className="text-slate-400 ml-1">({rec.height} cm)</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono">
                          <div className="text-emerald-400 font-bold">근육: {rec.skeletalMuscleMass} kg</div>
                          <div className="text-rose-400 text-[11px]">체지방: {rec.bodyFatPercentage}% ({rec.bodyFatMass || '-'}kg)</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono">
                          <div>BMI <strong className="text-white">{rec.bmi}</strong></div>
                          <div className="text-amber-300 font-bold">{rec.inBodyScore || 80}점</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-[#0B132B] text-slate-300 border border-slate-700 text-[10px]">
                            {rec.bodyType || '표준'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 truncate max-w-[120px]">
                          {rec.notes || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditInbody(rec)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                              title="인바디 값 수정"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInbodyRecord(rec)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition"
                              title="인바디 기록 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: All Workout Plans Table ================= */}
      {currentView === 'allPlans' && (
        <div className="space-y-4">
          <div className="bg-[#14213D] rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              전체 수립된 학생 맞춤 운동 계획 총 <strong className="text-emerald-400 font-bold">{allPlans.filter(p => p.exercises?.length > 0).length}</strong>건
            </div>
            <span className="text-[11px] text-slate-400">교사 권한으로 학생의 루틴 종목, 세트, 목표를 수정하거나 계획을 초기화할 수 있습니다.</span>
          </div>

          <div className="bg-[#14213D] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B132B] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">학생 정보</th>
                    <th className="py-3.5 px-3">주간 목표</th>
                    <th className="py-3.5 px-3">계획 종목 상세</th>
                    <th className="py-3.5 px-3">최근 수정 일시</th>
                    <th className="py-3.5 px-4 text-right">계획 수정 / 삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {allPlans.filter(p => p.exercises?.length > 0).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        수립된 운동 계획이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    allPlans
                      .filter(p => p.exercises?.length > 0)
                      .map(plan => {
                        const matchingStudent = students.find(s => s.id === plan.studentId || isRecordForStudent(plan as any, s));
                        return (
                          <tr key={plan.studentId} className="hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white text-sm">{plan.studentName || matchingStudent?.name || '학생'}</div>
                              <span className="text-[10px] text-slate-400">
                                {plan.grade ? `${plan.grade}학년 ${plan.classNum}반 ${plan.number}번` : plan.studentId}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="px-2.5 py-1 rounded-md bg-[#00B4D8]/15 text-[#00B4D8] font-bold text-xs font-mono">
                                주 {plan.weeklyGoalSessions || 3}회
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1.5 max-w-md">
                                {plan.exercises.map(item => (
                                  <span key={item.id} className="px-2 py-0.5 rounded bg-[#0B132B] border border-slate-700 text-slate-300 text-[11px]">
                                    {item.exerciseName} ({item.targetSets}세트 × {item.targetRepsOrTime}{item.unit})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 text-[11px] font-mono">
                              {plan.updatedAt ? plan.updatedAt.split('T')[0] : '-'}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    if (matchingStudent) {
                                      handleOpenEditPlan(matchingStudent);
                                    } else {
                                      // Fallback
                                      setEditingPlanStudent({
                                        id: plan.studentId,
                                        name: plan.studentName || '학생',
                                        schoolType: plan.schoolType || 'high',
                                        grade: plan.grade || 1,
                                        classNum: plan.classNum || 1,
                                        number: plan.number || 1,
                                        gender: plan.gender || 'M',
                                        pin: '0000',
                                        isInitialPin: true,
                                      });
                                      setPlanGoalSessions(plan.weeklyGoalSessions || 3);
                                      setPlanExercisesList(plan.exercises || []);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1"
                                  title="계획 수정"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>수정</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmModal({
                                      isOpen: true,
                                      title: '맞춤 체력 운동 계획 삭제',
                                      message: `${plan.studentName || '학생'}의 운동 계획을 삭제하시겠습니까?\n\n주간 목표 및 운동 종목 목록이 초기화되며 Firebase 클라우드에서도 삭제됩니다.`,
                                      confirmLabel: '계획 삭제',
                                      onConfirm: async () => {
                                        clearStudentWorkoutPlan(plan.studentId);
                                        await deleteWorkoutPlanFromFirebase(plan.studentId);
                                        if (propSetWorkoutPlans) {
                                          propSetWorkoutPlans(prev => prev.filter(p => p.studentId !== plan.studentId));
                                        }
                                        showToast('운동 계획이 삭제되었습니다.');
                                        setConfirmModal(null);
                                        triggerLocalRefresh();
                                      },
                                    });
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition flex items-center gap-1"
                                  title="계획 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>삭제</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= Student Dossier Detail Modal ================= */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14213D] border border-slate-700 w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00B4D8]/20 text-[#00B4D8] flex items-center justify-center font-bold text-lg border border-[#00B4D8]/30">
                  {selectedStudentForDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>{selectedStudentForDetail.name} 학생 체력·인바디 종합 기록</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-[#00B4D8]">
                      {selectedStudentForDetail.gender === 'M' ? '남학생' : '여학생'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    신안해양과학고 {selectedStudentForDetail.grade}학년 {selectedStudentForDetail.classNum}반 {selectedStudentForDetail.number}번
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Workout Plan with Edit / Delete Action */}
            <div className="space-y-3 bg-[#0B132B]/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>맞춤 체력 운동 계획</span>
                  {detailStudentPlan && (
                    <span className="text-xs text-[#00B4D8] font-bold font-mono">
                      (주 {detailStudentPlan.weeklyGoalSessions || 3}회)
                    </span>
                  )}
                </h4>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditPlan(selectedStudentForDetail)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>계획 수정</span>
                  </button>
                  {detailStudentPlan && detailStudentPlan.exercises?.length > 0 && (
                    <button
                      onClick={() => handleDeletePlanEntirely(selectedStudentForDetail)}
                      className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition flex items-center gap-1"
                      title="운동 계획 전체 초기화"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>계획 삭제</span>
                    </button>
                  )}
                </div>
              </div>

              {detailStudentPlan && detailStudentPlan.exercises?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {detailStudentPlan.exercises.map(item => (
                    <div key={item.id} className="p-3 rounded-xl bg-[#14213D] border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{item.exerciseName}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.targetSets}세트 × {item.targetRepsOrTime}{item.unit} (휴식 {item.restSeconds}초)
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.isCompleted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            완료됨
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {item.completedSets || 0}/{item.targetSets}세트
                          </span>
                        )}
                        <button
                          onClick={() => {
                            deletePlannedExerciseFromPlan(selectedStudentForDetail.id, item.id);
                            showToast(`'${item.exerciseName}' 종목이 계획에서 삭제되었습니다.`);
                            triggerLocalRefresh();
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="이 종목만 계획에서 제거"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-400 mb-2">등록된 운동 계획이 없습니다.</p>
                  <button
                    onClick={() => handleOpenEditPlan(selectedStudentForDetail)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0B132B] text-xs font-bold transition inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>새 운동 계획 수립하기</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: InBody Records History with Direct Edit & Delete */}
            <div className="space-y-3 bg-[#0B132B]/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#00B4D8]" />
                  <span>인바디 검사 기록지 & 신체 변화 추이</span>
                  <span className="text-xs text-slate-400 font-normal">총 {detailStudentInbody.length}회</span>
                </h4>

                <button
                  onClick={() => handleOpenAddInbody(selectedStudentForDetail)}
                  className="px-2.5 py-1 rounded-lg bg-[#00B4D8]/15 hover:bg-[#00B4D8]/25 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>인바디 직접 입력</span>
                </button>
              </div>

              {detailStudentInbody.length > 0 ? (
                <div className="space-y-3">
                  {/* Latest InBody Summary Cards */}
                  {latestInbodyRecord && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-[#14213D] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">최신 체중</span>
                        <span className="font-black text-white font-mono text-sm">{latestInbodyRecord.weight} kg</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#14213D] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">골격근량</span>
                        <span className="font-black text-emerald-400 font-mono text-sm">{latestInbodyRecord.skeletalMuscleMass} kg</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#14213D] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">체지방률</span>
                        <span className="font-black text-rose-400 font-mono text-sm">{latestInbodyRecord.bodyFatPercentage} %</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#14213D] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">인바디 점수</span>
                        <span className="font-black text-amber-300 font-mono text-sm">{latestInbodyRecord.inBodyScore || 80} 점</span>
                      </div>
                    </div>
                  )}

                  {/* History List with Edit & Delete */}
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {detailStudentInbody.map(rec => (
                      <div key={rec.id} className="p-2.5 rounded-xl bg-[#14213D] border border-slate-800 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-white mr-2">{rec.measuredAt}</span>
                          <span className="text-slate-300">
                            {rec.height}cm / {rec.weight}kg | 근육 {rec.skeletalMuscleMass}kg | 체지방 {rec.bodyFatPercentage}% (BMI {rec.bmi})
                          </span>
                          {rec.notes && <p className="text-[11px] text-slate-400 italic">"{rec.notes}"</p>}
                        </div>
                        <div className="flex items-center gap-1.5 ml-2">
                          <span className="px-2 py-0.5 rounded bg-[#0B132B] text-[10px] text-slate-300 border border-slate-800">
                            {rec.bodyType || '표준'}
                          </span>
                          <button
                            onClick={() => handleOpenEditInbody(rec)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition"
                            title="이 인바디 기록 수정"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteInbodyRecord(rec)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition"
                            title="이 인바디 기록 삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-400 mb-2">작성된 인바디 검사 기록지가 없습니다.</p>
                  <button
                    onClick={() => handleOpenAddInbody(selectedStudentForDetail)}
                    className="px-3 py-1.5 rounded-xl bg-[#00B4D8] hover:bg-[#0096c7] text-[#0B132B] text-xs font-bold transition inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>첫 인바디 기록 등록하기</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section 3: Completed Workouts Logs */}
            <div className="space-y-3 bg-[#0B132B]/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>운동 완료 기록 (최근순)</span>
                <span className="text-xs text-slate-400 font-normal">총 {detailStudentLogs.length}건</span>
              </h4>

              {detailStudentLogs.length > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {detailStudentLogs.map(log => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-[#14213D] border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{log.exerciseName}</span>
                        <span className="text-slate-400 ml-2">({log.dateFormatted || log.timestamp.split('T')[0]})</span>
                        {log.notes && <p className="text-[11px] text-slate-500 mt-0.5">{log.notes}</p>}
                      </div>
                      <span className="font-mono font-bold text-[#00B4D8]">
                        {log.value} {log.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">완료된 운동 기록이 없습니다.</p>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= InBody Edit / Add Modal ================= */}
      {(editingInbodyRecord || isAddingInbodyForStudent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14213D] border border-[#00B4D8]/50 w-full max-w-xl rounded-3xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#00B4D8]" />
                <span>
                  {editingInbodyRecord ? '인바디 검사 기록 수정' : `${isAddingInbodyForStudent?.name} 학생 새 인바디 입력`}
                </span>
              </h3>
              <button
                onClick={() => {
                  setEditingInbodyRecord(null);
                  setIsAddingInbodyForStudent(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInbodyForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">측정 일자</label>
                  <input
                    type="date"
                    required
                    value={inbodyFormDate}
                    onChange={(e) => setInbodyFormDate(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">인바디 점수 (100점 만점)</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={inbodyFormScore}
                    onChange={(e) => setInbodyFormScore(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">신장 (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="100"
                    max="220"
                    required
                    value={inbodyFormHeight}
                    onChange={(e) => setInbodyFormHeight(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">체중 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="180"
                    required
                    value={inbodyFormWeight}
                    onChange={(e) => setInbodyFormWeight(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">골격근량 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="80"
                    required
                    value={inbodyFormMuscle}
                    onChange={(e) => setInbodyFormMuscle(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">체지방률 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="60"
                    required
                    value={inbodyFormFatPct}
                    onChange={(e) => setInbodyFormFatPct(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">체지방량 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="80"
                    value={inbodyFormFatMass}
                    onChange={(e) => setInbodyFormFatMass(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">기초대사량 (kcal)</label>
                  <input
                    type="number"
                    min="800"
                    max="3000"
                    value={inbodyFormBmr}
                    onChange={(e) => setInbodyFormBmr(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">내장지방 레벨 (1~20)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={inbodyFormVisceral}
                    onChange={(e) => setInbodyFormVisceral(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">체형 판정</label>
                  <select
                    value={inbodyFormBodyType}
                    onChange={(e) => setInbodyFormBodyType(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                  >
                    <option value="표준체형 (I자형)">표준체형 (I자형)</option>
                    <option value="강인한 근육형 (D자형)">강인한 근육형 (D자형)</option>
                    <option value="체지방 관리필요형 (C자형)">체지방 관리필요형 (C자형)</option>
                    <option value="마른 비만형">마른 비만형</option>
                    <option value="근육형 과체중">근육형 과체중</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">지도 메모 / 피드백</label>
                <input
                  type="text"
                  placeholder="예: 근력 향상 목표 지속 권장, 수분 섭취 안내 등"
                  value={inbodyFormNotes}
                  onChange={(e) => setInbodyFormNotes(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-[#00B4D8]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingInbodyRecord(null);
                    setIsAddingInbodyForStudent(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B4D8] hover:bg-[#0096c7] text-[#0B132B] font-black flex items-center gap-1.5 shadow-lg shadow-[#00B4D8]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingInbodyRecord ? '인바디 수정 완료' : '인바디 저장'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Workout Plan Edit Modal ================= */}
      {editingPlanStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14213D] border border-emerald-500/50 w-full max-w-2xl rounded-3xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-emerald-400" />
                  <span>{editingPlanStudent.name} 학생 맞춤 운동 계획 수정</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {editingPlanStudent.grade}학년 {editingPlanStudent.classNum}반 {editingPlanStudent.number}번
                </span>
              </div>
              <button
                onClick={() => setEditingPlanStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanForm} className="space-y-5 text-xs">
              {/* Weekly Goal Sessions */}
              <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-white font-bold block">주간 목표 운동 실천 횟수</label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPlanGoalSessions(num)}
                      className={`px-3 py-1.5 rounded-xl font-bold font-mono transition ${
                        planGoalSessions === num
                          ? 'bg-emerald-500 text-[#0B132B]'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      주 {num}회
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises List in Plan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">계획된 운동 종목 목록 ({planExercisesList.length}개)</span>
                  <button
                    type="button"
                    onClick={() => setShowAddExerciseToPlan(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#00B4D8]/15 hover:bg-[#00B4D8]/25 text-[#00B4D8] border border-[#00B4D8]/30 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>운동 종목 추가</span>
                  </button>
                </div>

                {/* Add Exercise Inline Form */}
                {showAddExerciseToPlan && (
                  <div className="bg-[#0B132B] p-4 rounded-2xl border border-[#00B4D8]/40 space-y-3">
                    <span className="font-bold text-[#00B4D8] block">새 운동 종목 선택 및 세부 설정</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-slate-400 block mb-1">운동 종목</label>
                        <select
                          value={selectedExerciseIdToAdd}
                          onChange={(e) => setSelectedExerciseIdToAdd(e.target.value)}
                          className="w-full bg-[#14213D] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none"
                        >
                          {EXERCISE_DATABASE.map(ex => (
                            <option key={ex.id} value={ex.id}>
                              [{ex.category}] {ex.name} ({ex.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">세트수</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={addSets}
                            onChange={(e) => setAddSets(Number(e.target.value))}
                            className="w-full bg-[#14213D] border border-slate-700 text-white rounded-xl px-2 py-2 text-center"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">목표(회/초)</label>
                          <input
                            type="number"
                            min="5"
                            max="200"
                            value={addReps}
                            onChange={(e) => setAddReps(Number(e.target.value))}
                            className="w-full bg-[#14213D] border border-slate-700 text-white rounded-xl px-2 py-2 text-center"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">휴식(초)</label>
                          <input
                            type="number"
                            min="10"
                            max="180"
                            step="5"
                            value={addRest}
                            onChange={(e) => setAddRest(Number(e.target.value))}
                            className="w-full bg-[#14213D] border border-slate-700 text-white rounded-xl px-2 py-2 text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddExerciseToPlan(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleAddExerciseToPlan}
                        className="px-4 py-1.5 rounded-xl bg-[#00B4D8] text-[#0B132B] font-bold"
                      >
                        종목 추가하기
                      </button>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2">
                  {planExercisesList.length === 0 ? (
                    <p className="text-center py-6 text-slate-400 bg-[#0B132B]/60 rounded-xl border border-slate-800">
                      계획된 종목이 없습니다. 위의 '운동 종목 추가' 버튼을 눌러 추가하세요.
                    </p>
                  ) : (
                    planExercisesList.map((item, idx) => (
                      <div key={item.id} className="p-3 bg-[#0B132B] rounded-xl border border-slate-800 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white text-xs">{idx + 1}. {item.exerciseName}</span>
                          <div className="text-[11px] text-slate-400">
                            {item.targetSets}세트 × {item.targetRepsOrTime}{item.unit} (세트 간 휴식 {item.restSeconds}초)
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromPlan(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="계획에서 제거"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlanStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#0B132B] font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>운동 계획 저장 완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= In-App Safe Confirmation Modal ================= */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14213D] border border-rose-500/50 w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">{confirmModal.title}</h3>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => confirmModal.onConfirm()}
                className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow-lg shadow-rose-500/30 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{confirmModal.confirmLabel || '삭제 실행'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
