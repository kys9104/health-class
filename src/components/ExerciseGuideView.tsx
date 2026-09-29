import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Dumbbell, 
  Zap, 
  Flame, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  Compass, 
  Activity,
  AlertTriangle,
  Play,
  Search,
  Check,
  Sparkles,
  Info,
  Layers,
  Award,
  Timer
} from 'lucide-react';
import { ExerciseCategory, ExerciseGuide, Student, WorkoutLog } from '../types';
import { EXERCISE_DATABASE } from '../data/exercises';

interface ExerciseGuideViewProps {
  student: Student;
  logs: WorkoutLog[];
  onSelectExerciseToTrack: (exerciseId: string) => void;
}

export const ExerciseGuideView: React.FC<ExerciseGuideViewProps> = ({
  student,
  logs,
  onSelectExerciseToTrack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBodyPart, setSelectedBodyPart] = useState<'all' | 'back' | 'shoulder' | 'chest' | 'abs' | 'legs'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeExerciseModal, setActiveExerciseModal] = useState<ExerciseGuide | null>(null);

  // Weekly workout statistics (this week)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekLogs = logs.filter(
    l => l.studentId === student.id && new Date(l.timestamp) >= oneWeekAgo
  );
  const weeklyTarget = student.customGoals?.weeklyWorkoutsTarget || 5;
  const weeklyCompleted = thisWeekLogs.length;
  const weeklyProgressPercent = Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100));

  const categories: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'all', label: '전체 종목', icon: Activity },
    { id: 'paps', label: 'PAPS 공식 종목', icon: Award },
    { id: 'bodyweight', label: '맨몸 근력 (5개 부위)', icon: Dumbbell },
    { id: 'chinningdipping', label: '치닝디핑 기구', icon: Layers },
    { id: 'kettlebell', label: '캐틀벨 운동', icon: Flame },
    { id: 'interval', label: '인터벌 훈련', icon: Zap },
    { id: 'running', label: '러닝 & 달리기', icon: Timer },
    { id: 'stretching', label: '유연성 스트레칭', icon: Compass },
    { id: 'plyometrics', label: '순발력·플라이오', icon: Zap },
  ];

  const bodyParts: { id: 'all' | 'back' | 'shoulder' | 'chest' | 'abs' | 'legs'; label: string }[] = [
    { id: 'all', label: '5대 부위 전체' },
    { id: 'back', label: '등 (Back)' },
    { id: 'shoulder', label: '어깨 (Shoulder)' },
    { id: 'chest', label: '가슴 (Chest)' },
    { id: 'abs', label: '복근 (Abs)' },
    { id: 'legs', label: '하체 (Legs)' },
  ];

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    // Category match
    let matchCategory = true;
    if (selectedCategory === 'all') {
      matchCategory = true;
    } else if (selectedCategory === 'paps') {
      matchCategory = ex.subType === 'paps_official';
    } else if (selectedCategory === 'bodyweight') {
      matchCategory = ex.category === 'strength' || ex.category === 'core' || (ex.subType && ex.subType.startsWith('bodyweight_'));
    } else if (selectedCategory === 'chinningdipping') {
      matchCategory = ex.category === 'chinningdipping' || ex.subType === 'chinning_dipping';
    } else if (selectedCategory === 'kettlebell') {
      matchCategory = ex.category === 'kettlebell' || ex.subType === 'kettlebell';
    } else if (selectedCategory === 'interval') {
      matchCategory = ex.category === 'interval' || ex.subType === 'interval_drill';
    } else if (selectedCategory === 'running') {
      matchCategory = ex.category === 'running' || ex.subType === 'running_drill';
    } else if (selectedCategory === 'stretching') {
      matchCategory = ex.category === 'stretching' || ex.category === 'flexibility' || ex.subType === 'flexibility_stretch';
    } else if (selectedCategory === 'plyometrics') {
      matchCategory = ex.category === 'plyometrics' || ex.category === 'power' || ex.subType === 'plyometrics';
    } else {
      matchCategory = ex.category === selectedCategory;
    }

    // Body part sub-match (especially when viewing bodyweight or all)
    let matchBodyPart = true;
    if (selectedBodyPart !== 'all') {
      matchBodyPart = ex.bodyPart === selectedBodyPart;
    }

    // Search query match
    const matchSearch = searchQuery.trim() === ''
      ? true
      : ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.targetPaps.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchBodyPart && matchSearch;
  });

  const getBodyPartBadge = (bodyPart?: string) => {
    switch (bodyPart) {
      case 'back':
        return { label: '등 (Back)', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'shoulder':
        return { label: '어깨 (Shoulder)', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'chest':
        return { label: '가슴 (Chest)', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'abs':
        return { label: '복근 (Abs)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'legs':
        return { label: '하체 (Legs)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Weekly Plan & Progress Bar */}
      <div 
        id="weekly-plan-card"
        className="bg-gradient-to-r from-[#14213D] via-[#16294D] to-[#14213D] border border-[#00B4D8]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>신안해양과학고 맞춤형 운동 가이드</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {student.name} 학생을 위한 체력요소별 트레이닝
            </h2>
          </div>

          <div className="w-full md:w-72 bg-[#0B132B]/80 border border-slate-700/80 p-4 rounded-2xl shrink-0">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">주간 권장 달성률</span>
              <span className="text-[#00B4D8]">{weeklyCompleted} / {weeklyTarget}회 ({weeklyProgressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00B4D8] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgressPercent}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>최근 7일 실천 기록</span>
              <span className="text-emerald-400 font-semibold">{weeklyProgressPercent >= 100 ? '목표 달성 완료! 🎉' : `${weeklyTarget - weeklyCompleted}회 남음`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'bodyweight' && cat.id !== 'all') {
                      setSelectedBodyPart('all');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#00B4D8] text-[#0B132B] border-[#00B4D8] shadow-md shadow-[#00B4D8]/20'
                      : 'bg-[#14213D] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="운동명, 부위, PAPS 종목 검색..."
              className="w-full bg-[#14213D] border border-slate-700/80 focus:border-[#00B4D8] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Sub-Filter: Bodyweight 5 Muscle Groups (등, 어깨, 가슴, 복근, 하체) */}
        {(selectedCategory === 'bodyweight' || selectedCategory === 'all') && (
          <div className="p-3 bg-[#14213D]/90 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-300 flex items-center gap-1.5 mr-1">
              <Dumbbell className="w-4 h-4 text-[#00B4D8]" />
              <span>맨몸 5대 부위 균형 선택:</span>
            </span>
            {bodyParts.map((bp) => {
              const isSelected = selectedBodyPart === bp.id;
              return (
                <button
                  key={bp.id}
                  id={`bodypart-filter-${bp.id}`}
                  onClick={() => setSelectedBodyPart(bp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    isSelected
                      ? 'bg-[#00B4D8] text-[#0B132B] border-[#00B4D8] shadow-sm font-black'
                      : 'bg-[#0B132B] text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {bp.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            총 <strong className="text-[#00B4D8] font-mono">{filteredExercises.length}개</strong>의 맞춤 운동 종목
          </span>
          <span className="text-[11px] text-slate-400">
            💡 카드를 누르면 자세한 단계별 동작과 체크포인트를 확인할 수 있습니다.
          </span>
        </div>
      </div>

      {/* Exercise Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.map((ex) => {
          const bpBadge = getBodyPartBadge(ex.bodyPart);

          return (
            <div
              key={ex.id}
              id={`exercise-card-${ex.id}`}
              className="bg-[#14213D] border border-slate-800 hover:border-[#00B4D8]/60 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group"
            >
              <div>
                {/* Exercise Header Banner */}
                <div className="p-5 bg-gradient-to-br from-[#0B132B] via-[#0D1B3A] to-[#14213D] border-b border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30 shadow-sm">
                        {ex.targetPaps.split(' ')[0]}
                      </span>
                      {bpBadge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${bpBadge.bg}`}>
                          {bpBadge.label}
                        </span>
                      )}
                      {ex.category === 'chinningdipping' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          치닝디핑
                        </span>
                      )}
                      {ex.category === 'kettlebell' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          캐틀벨
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        ex.difficulty === '초급'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ex.difficulty === '중급'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {ex.difficulty}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B132B] text-slate-300 border border-slate-700">
                        {ex.mode === 'counter' ? '🔢 카운터' : '⏱️ 타이머'} ({ex.unit})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-[#00B4D8] transition mb-1 line-clamp-1">
                    {ex.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium truncate">
                    {ex.targetPaps}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {ex.description}
                  </p>

                  {/* Key Highlights */}
                  {ex.keyPoints && ex.keyPoints.length > 0 && (
                    <div className="space-y-1 mb-3 bg-[#0B132B]/60 p-2.5 rounded-xl border border-slate-800/80">
                      {ex.keyPoints.slice(0, 2).map((kp, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <Check className="w-3 h-3 text-[#00B4D8] shrink-0" />
                          <span className="truncate">{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Target Muscle Badges */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ex.targetMuscles.map((m, i) => (
                      <span key={i} className="text-[10px] bg-[#0B132B] text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        #{m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center gap-2 mt-auto">
                <button
                  type="button"
                  id={`view-detail-${ex.id}-btn`}
                  onClick={() => setActiveExerciseModal(ex)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-[#00B4D8]" />
                  <span>자세 & 동작 가이드</span>
                </button>
                <button
                  type="button"
                  id={`start-workout-${ex.id}-btn`}
                  onClick={() => onSelectExerciseToTrack(ex.id)}
                  className="py-2.5 px-3.5 rounded-xl bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] text-xs font-black flex items-center gap-1.5 transition touch-press-scale shadow-md shadow-[#00B4D8]/20"
                >
                  <Play className="w-3.5 h-3.5 fill-[#0B132B]" />
                  <span>측정하기</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Exercise Modal with Form Checkpoints */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div 
            id="exercise-detail-modal"
            className="w-full max-w-3xl bg-[#14213D] border border-[#00B4D8]/50 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-[#00B4D8] px-2.5 py-1 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/30">
                    {activeExerciseModal.targetPaps}
                  </span>
                  {activeExerciseModal.bodyPart && (
                    <span className="text-xs font-bold text-blue-300 px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                      부위: {getBodyPartBadge(activeExerciseModal.bodyPart)?.label || activeExerciseModal.bodyPart}
                    </span>
                  )}
                  {activeExerciseModal.category === 'chinningdipping' && (
                    <span className="text-xs font-bold text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30">
                      기구: 치닝디핑
                    </span>
                  )}
                  {activeExerciseModal.category === 'kettlebell' && (
                    <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30">
                      소도구: 캐틀벨
                    </span>
                  )}
                  <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30">
                    난이도: {activeExerciseModal.difficulty}
                  </span>
                  <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                    권장: {activeExerciseModal.recommendedRepsOrTime}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeExerciseModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs font-bold shrink-0"
              >
                닫기 ✕
              </button>
            </div>

            {/* Exercise Info Summary Card */}
            <div className="rounded-2xl border border-slate-700 bg-[#0B132B] p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400">주요 자극 부위:</span>
                  {activeExerciseModal.targetMuscles.map((m, i) => (
                    <span key={i} className="text-xs font-black text-[#00B4D8] bg-[#14213D] px-2.5 py-1 rounded-lg border border-[#00B4D8]/30">
                      #{m}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg font-mono font-bold">
                    🔥 약 {activeExerciseModal.calorieBurnPerMin} kcal / 분
                  </span>
                  <span className="text-xs text-slate-300 bg-[#14213D] border border-slate-700 px-3 py-1 rounded-lg font-bold">
                    {activeExerciseModal.mode === 'counter' ? '🔢 카운터 모드' : '⏱️ 타이머 모드'} ({activeExerciseModal.unit})
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Description */}
            <p className="text-sm text-slate-200 leading-relaxed bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
              {activeExerciseModal.description}
            </p>

            {/* Step-by-Step Instructions */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B4D8]" />
                <span>단계별 정확한 수행 동작</span>
              </h4>
              <ol className="space-y-2.5">
                {activeExerciseModal.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-[#0B132B]/70 p-3 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-[#00B4D8] text-[#0B132B] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-200 leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Posture Checkpoints (Good Form vs Caution) */}
            {activeExerciseModal.checkpoints && activeExerciseModal.checkpoints.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>자세 핵심 체크포인트 & 꿀팁</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeExerciseModal.checkpoints.map((cp, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border ${
                        cp.isWarning
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-emerald-500/10 border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {cp.isWarning ? (
                          <AlertTriangle className="w-4 h-4 text-[#FF4B4B] shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${cp.isWarning ? 'text-red-300' : 'text-emerald-300'}`}>
                          {cp.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {cp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Tips */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF4B4B]" />
                <span>안전 및 부상 예방 수칙</span>
              </h4>
              <div className="bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-2xl p-4 space-y-2">
                {activeExerciseModal.safetyNotes.map((note, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B] shrink-0 mt-1.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveExerciseModal(null)}
                className="flex-1 py-3.5 rounded-xl bg-[#0B132B] border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800"
              >
                닫기
              </button>
              <button
                type="button"
                id="modal-start-exercise-btn"
                onClick={() => {
                  const id = activeExerciseModal.id;
                  setActiveExerciseModal(null);
                  onSelectExerciseToTrack(id);
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00B4D8]/20 touch-press-scale"
              >
                <Play className="w-4 h-4 fill-[#0B132B]" />
                <span>지금 이 운동 바로 측정하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
