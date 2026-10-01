import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Dumbbell, 
  Timer, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Award, 
  ChevronRight, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Check, 
  ArrowRight,
  Zap,
  Heart,
  TrendingUp,
  X
} from 'lucide-react';
import { ExerciseCategory, ExerciseGuide, PlannedExercise, Student, StudentWorkoutPlan, WorkoutLog } from '../types';
import { EXERCISE_DATABASE } from '../data/exercises';
import { 
  completePlannedExercise, 
  getStudentWorkoutPlan, 
  saveStudentWorkoutPlan,
  getAppConfig 
} from '../services/dataService';
import { playCountdownBeep, playSuccessFanfare, playTapSound } from '../utils/audioFeedback';

interface WorkoutPlanDashboardProps {
  student: Student;
  onWorkoutCompleted?: (newLog: WorkoutLog) => void;
  onNavigateToGuide?: () => void;
}

export const WorkoutPlanDashboard: React.FC<WorkoutPlanDashboardProps> = ({
  student,
  onWorkoutCompleted,
  onNavigateToGuide,
}) => {
  const [plan, setPlan] = useState<StudentWorkoutPlan>(() => {
    const existing = getStudentWorkoutPlan(student.id);
    if (existing) return existing;

    // Default starter plan tailored to student's focus or balanced fitness
    return {
      id: `plan-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      planTitle: '1학기 맞춤 체력 증진 & PAPS 1등급 플랜',
      weeklyGoalSessions: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: [
        {
          id: `item-1`,
          exerciseId: 'curl-up',
          exerciseName: '윗몸말아올리기 (Curl-Up)',
          category: 'strength',
          targetSets: 3,
          targetRepsOrTime: 20,
          unit: '회',
          restSeconds: 45,
          dayOfWeek: '월',
          completedSets: 0,
          isCompleted: false,
        },
        {
          id: `item-2`,
          exerciseId: 'paps-shuttle-run',
          exerciseName: '왕복오래달리기 (20m 셔틀런)',
          category: 'cardio',
          targetSets: 2,
          targetRepsOrTime: 30,
          unit: '회',
          restSeconds: 60,
          dayOfWeek: '수',
          completedSets: 0,
          isCompleted: false,
        },
        {
          id: `item-3`,
          exerciseId: 'kettlebell-two-hand-swing',
          exerciseName: '캐틀벨 투핸드 스윙 (Kettlebell Swing)',
          category: 'kettlebell',
          targetSets: 3,
          targetRepsOrTime: 20,
          unit: '회',
          restSeconds: 45,
          dayOfWeek: '금',
          completedSets: 0,
          isCompleted: false,
        },
      ],
    };
  });

  // Modal to add exercises
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');

  // Active Workout Execution Runner State (운동 측정 및 카운터)
  const [activeRunningExercise, setActiveRunningExercise] = useState<PlannedExercise | null>(null);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(45);
  const [workoutFinishedCelebration, setWorkoutFinishedCelebration] = useState<boolean>(false);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundEnabled = getAppConfig().enableSoundFeedback;

  // Save changes to plan
  const handleSavePlan = (updatedPlan: StudentWorkoutPlan) => {
    setPlan(updatedPlan);
    saveStudentWorkoutPlan(updatedPlan);
  };

  // Add exercise to plan
  const handleAddExerciseToPlan = (guide: ExerciseGuide) => {
    const newItem: PlannedExercise = {
      id: `plan-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      exerciseId: guide.id,
      exerciseName: guide.name,
      category: guide.category,
      targetSets: 3,
      targetRepsOrTime: guide.defaultGoal || 15,
      unit: guide.unit,
      restSeconds: 45,
      dayOfWeek: '매일',
      completedSets: 0,
      isCompleted: false,
    };

    const updated = {
      ...plan,
      exercises: [...plan.exercises, newItem],
    };
    handleSavePlan(updated);
    setShowAddModal(false);
  };

  // Remove exercise from plan
  const handleRemoveExercise = (itemId: string) => {
    const updated = {
      ...plan,
      exercises: plan.exercises.filter(e => e.id !== itemId),
    };
    handleSavePlan(updated);
  };

  // ================= Workout Execution & Counter Logic =================
  const startWorkoutRunner = (item: PlannedExercise) => {
    setActiveRunningExercise(item);
    setCurrentSet((item.completedSets || 0) + 1 > item.targetSets ? 1 : (item.completedSets || 0) + 1);
    setCurrentReps(0);
    setIsResting(false);
    setWorkoutFinishedCelebration(false);

    if (item.unit === '초') {
      setTimerSecondsRemaining(item.targetRepsOrTime);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  // Clean timer on unmount or close
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Timer runner (Exercise countdown or Rest countdown)
  useEffect(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (isResting) {
      timerIntervalRef.current = setInterval(() => {
        setRestSecondsRemaining(prev => {
          if (prev <= 1) {
            if (soundEnabled) playCountdownBeep(true);
            setIsResting(false);
            // Move to next set
            setCurrentSet(s => s + 1);
            if (activeRunningExercise && activeRunningExercise.unit === '초') {
              setTimerSecondsRemaining(activeRunningExercise.targetRepsOrTime);
              setIsTimerRunning(true);
            }
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            playCountdownBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isTimerRunning && activeRunningExercise?.unit === '초') {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsRemaining(prev => {
          if (prev <= 1) {
            if (soundEnabled) playCountdownBeep(true);
            handleSetCompleted();
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            playCountdownBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isResting, isTimerRunning, activeRunningExercise]);

  // Handle Rep Counter Tap
  const handleRepTap = () => {
    if (!activeRunningExercise || isResting) return;
    if (soundEnabled) playTapSound();
    const next = currentReps + 1;
    setCurrentReps(next);

    // If target reps reached, encourage
    if (next >= activeRunningExercise.targetRepsOrTime) {
      if (soundEnabled) playCountdownBeep(true);
    }
  };

  // Complete Current Set
  const handleSetCompleted = async () => {
    if (!activeRunningExercise) return;
    if (soundEnabled) playCountdownBeep(true);

    const actualVal = activeRunningExercise.unit === '초'
      ? activeRunningExercise.targetRepsOrTime
      : (currentReps > 0 ? currentReps : activeRunningExercise.targetRepsOrTime);

    // Save progress to plan & add log
    const result = await completePlannedExercise(
      student,
      activeRunningExercise.id,
      actualVal,
      `[계획 운동] ${currentSet}/${activeRunningExercise.targetSets}세트 완료`
    );

    if (result) {
      setPlan(result.updatedPlan);
      if (onWorkoutCompleted) onWorkoutCompleted(result.log);
    }

    // Check if this was the last set
    if (currentSet >= activeRunningExercise.targetSets) {
      // Finished all sets!
      if (soundEnabled) playSuccessFanfare();
      setWorkoutFinishedCelebration(true);
      setIsTimerRunning(false);
      setIsResting(false);
    } else {
      // Start rest timer
      setIsResting(true);
      setRestSecondsRemaining(activeRunningExercise.restSeconds || 45);
      setCurrentReps(0);
      setIsTimerRunning(false);
    }
  };

  // Skip rest timer
  const handleSkipRest = () => {
    setIsResting(false);
    setCurrentSet(s => s + 1);
    if (activeRunningExercise?.unit === '초') {
      setTimerSecondsRemaining(activeRunningExercise.targetRepsOrTime);
      setIsTimerRunning(true);
    }
  };

  // Close workout runner
  const handleCloseRunner = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setActiveRunningExercise(null);
    setIsResting(false);
    setIsTimerRunning(false);
    setWorkoutFinishedCelebration(false);
  };

  // Progress metrics
  const totalPlannedItems = plan.exercises.length;
  const completedItems = plan.exercises.filter(e => e.isCompleted).length;
  const progressPercent = totalPlannedItems > 0 ? Math.round((completedItems / totalPlannedItems) * 100) : 0;

  // Filtered exercises for add modal
  const filteredDatabase = EXERCISE_DATABASE.filter(ex => {
    if (selectedCategoryFilter !== 'all' && ex.category !== selectedCategoryFilter) return false;
    if (exerciseSearch) {
      const q = exerciseSearch.toLowerCase();
      return ex.name.toLowerCase().includes(q) || ex.targetPaps.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14213D] via-[#1E3A5F] to-[#0B132B] p-6 sm:p-8 border border-[#1E3A5F] shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>맞춤 운동 가이드 연계 체력 플랜</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{student.name} 학생의 체력 운동 계획 대시보드</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="open-add-exercise-to-plan-btn"
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#00B4D8] to-[#0096c7] hover:from-[#00B4D8]/90 text-[#0B132B] font-black px-5 py-3 rounded-2xl shadow-xl shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-sm transition touch-press-scale"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>가이드 종목 추가하기</span>
            </button>
          </div>
        </div>

        {/* Progress Bar in Banner */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/20 text-[#00B4D8] flex items-center justify-center font-black font-mono text-sm border border-[#00B4D8]/30">
              {progressPercent}%
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>오늘의 계획 완료율:</span>
                <span className="text-[#00B4D8]">{completedItems} / {totalPlannedItems}개 완료</span>
              </div>
              <div className="w-48 sm:w-64 h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00B4D8] to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="bg-[#0B132B] px-3 py-1.5 rounded-xl border border-slate-800">
              주간 목표: <strong className="text-white">{plan.weeklyGoalSessions}회</strong>
            </span>
            {progressPercent === 100 && totalPlannedItems > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> 오늘 목표 100% 달성!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Planned Exercises List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-[#00B4D8]" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              계획된 체력 운동 목록 & 측정 카운터 실행
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            각 종목의 [운동 측정 및 카운터] 버튼을 눌러 바로 측정하세요
          </span>
        </div>

        {plan.exercises.length === 0 ? (
          <div className="bg-[#14213D]/70 border border-dashed border-slate-700 rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">등록된 운동 계획이 없습니다</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                맞춤 운동 가이드의 다양한 체력 종목(맨몸 5대 부위, 치닝디핑, 캐틀벨, 러닝, 인터벌 등)을 내 계획에 추가하여 규칙적인 운동을 시작해 보세요.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B4D8] text-[#0B132B] font-bold text-xs hover:bg-[#00B4D8]/90 transition shadow-lg shadow-[#00B4D8]/20"
            >
              <Plus className="w-4 h-4" />
              <span>가이드 종목 추가하기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.exercises.map((item, index) => {
              const guideInfo = EXERCISE_DATABASE.find(e => e.id === item.exerciseId);
              const isDone = item.isCompleted;

              return (
                <div
                  key={item.id}
                  className={`bg-[#14213D] rounded-3xl p-5 border transition flex flex-col justify-between shadow-xl ${
                    isDone
                      ? 'border-emerald-500/40 bg-gradient-to-b from-[#14213D] to-emerald-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#0B132B] text-[#00B4D8] border border-slate-800">
                        {item.category === 'chinningdipping' ? '치닝디핑' :
                         item.category === 'kettlebell' ? '캐틀벨' :
                         item.category === 'interval' ? '인터벌 훈련' :
                         item.category === 'cardio' ? '심폐지구력' :
                         item.category === 'strength' ? '근력/맨몸' :
                         item.category === 'flexibility' ? '유연성' :
                         item.category === 'power' ? '순발력' : '체력 운동'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> 완료됨
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                            {item.completedSets || 0} / {item.targetSets} 세트
                          </span>
                        )}
                        <button
                          onClick={() => handleRemoveExercise(item.id)}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 transition"
                          title="플랜에서 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#00B4D8] transition line-clamp-1">
                        {item.exerciseName}
                      </h3>
                      {guideInfo && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {guideInfo.description}
                        </p>
                      )}
                    </div>

                    {/* Target specs */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#0B132B] border border-slate-800 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">목표 세트</span>
                        <span className="font-mono font-bold text-white">{item.targetSets}세트</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">세트당 목표</span>
                        <span className="font-mono font-bold text-[#00B4D8]">
                          {item.targetRepsOrTime}{item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">세트간 휴식</span>
                        <span className="font-mono font-bold text-amber-300">{item.restSeconds}초</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: 측정 및 카운터 실행 */}
                  <div className="pt-4 mt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => startWorkoutRunner(item)}
                      className={`w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-lg touch-press-scale ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                          : 'bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] shadow-[#00B4D8]/20'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isDone ? '다시 측정하기' : '운동 측정 및 카운터 시작'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= Workout Execution & Counter Modal ================= */}
      {activeRunningExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14213D] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00B4D8]/20 text-[#00B4D8] flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 text-[#00B4D8]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#00B4D8] uppercase tracking-wider block">
                    계획 기반 스마트 운동 측정기
                  </span>
                  <h3 className="text-lg font-black text-white line-clamp-1">
                    {activeRunningExercise.exerciseName}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCloseRunner}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Finished Celebration */}
            {workoutFinishedCelebration ? (
              <div className="py-8 text-center space-y-5 animate-fadeIn">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-bounce">
                  <div className="w-full h-full bg-[#0B132B] rounded-[22px] flex items-center justify-center">
                    <Award className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">모든 계획 세트 완료! 🎉</h4>
                  <p className="text-xs text-slate-300">
                    총 {activeRunningExercise.targetSets}세트 ({activeRunningExercise.targetRepsOrTime * activeRunningExercise.targetSets}{activeRunningExercise.unit})를 완벽하게 달성했습니다.
                  </p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">
                    운동 기록지에 자동 저장 및 계획 완료 상태로 반영되었습니다.
                  </p>
                </div>
                <button
                  onClick={handleCloseRunner}
                  className="px-8 py-3 rounded-2xl bg-[#00B4D8] text-[#0B132B] font-black text-sm shadow-xl shadow-[#00B4D8]/20 hover:bg-[#00B4D8]/90 transition"
                >
                  확인 및 완료
                </button>
              </div>
            ) : isResting ? (
              /* ================= Rest Interval Screen ================= */
              <div className="py-6 text-center space-y-6 animate-fadeIn">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>세트 간 휴식 시간 (Rest Time)</span>
                </div>

                {/* Big Rest Countdown Circle */}
                <div className="w-40 h-40 mx-auto rounded-full bg-[#0B132B] border-4 border-amber-400/80 flex flex-col items-center justify-center shadow-xl shadow-amber-500/10">
                  <span className="text-5xl font-black font-mono text-amber-300">
                    {restSecondsRemaining}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase mt-1">초 남음</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-300">
                    호흡을 가다듬고 물을 한 모금 마시세요.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    다음: <strong className="text-white">세트 {currentSet + 1} / {activeRunningExercise.targetSets}</strong>
                  </p>
                </div>

                <button
                  onClick={handleSkipRest}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700"
                >
                  휴식 건너뛰고 다음 세트 시작 ⏭️
                </button>
              </div>
            ) : (
              /* ================= Active Workout Screen (Counter or Timer) ================= */
              <div className="space-y-6">
                {/* Set Indicator */}
                <div className="flex items-center justify-between bg-[#0B132B] px-4 py-2.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">현재 세트:</span>
                    <span className="text-sm font-black text-white font-mono">
                      세트 {currentSet} / {activeRunningExercise.targetSets}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#00B4D8]">
                    목표: {activeRunningExercise.targetRepsOrTime} {activeRunningExercise.unit}
                  </div>
                </div>

                {/* Main Counter Display */}
                {activeRunningExercise.unit === '초' ? (
                  /* Timer Mode */
                  <div className="text-center py-4 space-y-4">
                    <div className="w-44 h-44 mx-auto rounded-full bg-[#0B132B] border-4 border-[#00B4D8] flex flex-col items-center justify-center shadow-2xl shadow-[#00B4D8]/20">
                      <span className="text-5xl font-black font-mono text-white">
                        {timerSecondsRemaining}
                      </span>
                      <span className="text-xs text-[#00B4D8] font-bold uppercase mt-1">초 카운트다운</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
                          isTimerRunning
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500 text-slate-950'
                        }`}
                      >
                        {isTimerRunning ? '일시 정지' : '타이머 재개'}
                      </button>
                      <button
                        onClick={handleSetCompleted}
                        className="px-5 py-2.5 rounded-xl bg-[#00B4D8] text-[#0B132B] font-bold text-xs hover:bg-[#00B4D8]/90 transition"
                      >
                        세트 즉시 완료
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Rep Counter Mode */
                  <div className="text-center py-2 space-y-4">
                    {/* Big Touch Counter Button */}
                    <button
                      onClick={handleRepTap}
                      className="w-48 h-48 mx-auto rounded-full bg-gradient-to-b from-[#14213D] to-[#0B132B] border-4 border-[#00B4D8] hover:border-emerald-400 active:scale-95 transition-all shadow-2xl shadow-[#00B4D8]/30 flex flex-col items-center justify-center group cursor-pointer"
                    >
                      <span className="text-6xl font-black font-mono text-white group-hover:text-[#00B4D8] transition">
                        {currentReps}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase mt-1">
                        / {activeRunningExercise.targetRepsOrTime} 회 (터치 시 +1)
                      </span>
                    </button>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition"
                      >
                        -1회 차감
                      </button>
                      <button
                        onClick={() => setCurrentReps(0)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition"
                      >
                        초기화
                      </button>
                      <button
                        onClick={handleSetCompleted}
                        className="px-6 py-2 rounded-xl bg-[#00B4D8] text-[#0B132B] font-black text-xs hover:bg-[#00B4D8]/90 transition shadow-lg shadow-[#00B4D8]/20"
                      >
                        현재 세트 완료 ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= Add Exercise from Guide Modal ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14213D] border border-slate-700 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">맞춤 운동 가이드 종목 추가</h3>
                <p className="text-xs text-slate-400">
                  원하는 체력 운동을 선택하여 내 운동 계획 루틴에 추가하세요
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter & Search */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="운동 종목 이름, 심폐/근력/캐틀벨/인터벌 검색..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00B4D8]"
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'strength', label: '맨몸 5대 부위' },
                  { id: 'chinningdipping', label: '치닝디핑' },
                  { id: 'kettlebell', label: '캐틀벨' },
                  { id: 'interval', label: '인터벌 훈련' },
                  { id: 'cardio', label: '심폐지구력' },
                  { id: 'flexibility', label: '유연성' },
                  { id: 'power', label: '순발력' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-[#00B4D8] text-[#0B132B]'
                        : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Database List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredDatabase.map(ex => {
                const isAlreadyInPlan = plan.exercises.some(e => e.exerciseId === ex.id);

                return (
                  <div
                    key={ex.id}
                    className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-[#00B4D8]">
                          {ex.targetPaps}
                        </span>
                        <h4 className="text-xs font-bold text-white">{ex.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{ex.description}</p>
                      <div className="text-[10px] text-slate-500">
                        기본 권장: {ex.defaultGoal}{ex.unit} • {ex.difficulty}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddExerciseToPlan(ex)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                        isAlreadyInPlan
                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          : 'bg-[#00B4D8] text-[#0B132B] hover:bg-[#00B4D8]/90 shadow-md shadow-[#00B4D8]/20'
                      }`}
                    >
                      {isAlreadyInPlan ? '추가 완료됨' : '플랜에 추가'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
