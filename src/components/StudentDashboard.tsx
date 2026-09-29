import React from 'react';
import { 
  Flame, 
  Dumbbell, 
  Award, 
  Timer, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Compass, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Trophy,
  Scale,
  Activity
} from 'lucide-react';
import { Student, WorkoutLog } from '../types';
import { getPapsGradeColor, getPapsPrescription } from '../utils/papsCalculator';

interface StudentDashboardProps {
  student: Student;
  logs: WorkoutLog[];
  onNavigateTab: (tab: string, param?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  logs,
  onNavigateTab,
}) => {
  const studentLogs = logs.filter(l => l.studentId === student.id);
  const totalWorkouts = studentLogs.length;

  // Weekly stats
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekLogs = studentLogs.filter(l => new Date(l.timestamp) >= oneWeekAgo);
  const weeklyTarget = student.customGoals?.weeklyWorkoutsTarget || 5;
  const weeklyCompleted = thisWeekLogs.length;
  const weeklyProgressPercent = Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100));

  const paps = student.paps;
  const gradeColor = paps ? getPapsGradeColor(paps.totalGrade) : null;
  const prescription = paps ? getPapsPrescription(paps) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div 
        id="student-hero-banner"
        className="bg-gradient-to-br from-[#14213D] via-[#16294D] to-[#0B132B] border border-[#1E3A5F] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Athletic Accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00B4D8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/15 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{student.grade}학년 {student.classNum}반 {student.number}번</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              반가워요, <span className="text-[#00B4D8]">{student.name}</span> 학생!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              오늘도 건강체력교실에서 맞춤형 트레이닝을 실천하고 체력 등급을 향상해 보세요.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              id="dashboard-workout-plan-btn"
              onClick={() => onNavigateTab('plan')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-slate-950 font-black px-4 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs transition touch-press-scale"
            >
              <Dumbbell className="w-4 h-4" />
              <span>체력 운동 계획 & 카운터</span>
            </button>
            <button
              id="dashboard-inbody-btn"
              onClick={() => onNavigateTab('inbody')}
              className="bg-gradient-to-r from-[#00B4D8] to-[#0096c7] hover:from-[#00B4D8]/90 text-[#0B132B] font-black px-4 py-3 rounded-2xl shadow-xl shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-xs transition touch-press-scale"
            >
              <Scale className="w-4 h-4" />
              <span>인바디 검사 & 변화 추이</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-[#0B132B]/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold">PAPS 종합 등급</div>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              {paps ? (
                <span className={gradeColor?.text}>{paps.totalGrade}등급 ({paps.totalScore}점)</span>
              ) : (
                <span className="text-slate-500 text-sm">미측정</span>
              )}
            </div>
          </div>

          <div className="bg-[#0B132B]/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold">주간 달성률</div>
            <div className="text-lg sm:text-xl font-black text-[#00B4D8] font-mono mt-0.5">
              {weeklyCompleted} / {weeklyTarget}회 ({weeklyProgressPercent}%)
            </div>
          </div>

          <div className="bg-[#0B132B]/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold">누적 운동 기록</div>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              {totalWorkouts}회 완료
            </div>
          </div>

          <div className="bg-[#0B132B]/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold">체질량지수 (BMI)</div>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              {paps ? `${paps.bmi} (${paps.bmiGrade}등급)` : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: PAPS Domain Summary & Weekly Workout Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 4 Fitness Domains Status */}
        <div className="lg:col-span-2 bg-[#14213D] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#00B4D8]" />
              <h2 className="text-lg font-bold text-white">4대 건강체력 영역 현황</h2>
            </div>
            <button
              id="view-full-paps-btn"
              onClick={() => onNavigateTab('paps')}
              className="text-xs text-[#00B4D8] hover:underline font-bold flex items-center gap-1"
            >
              <span>상세 진단표 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {paps ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { name: '심폐지구력', sub: '셔틀런', value: `${paps.cardioValue}회`, grade: paps.cardioGrade, icon: Zap, exId: 'shuttle-run-drill' },
                { name: '근력/근지구력', sub: '윗몸말아올리기', value: `${paps.strengthValue}회`, grade: paps.strengthGrade, icon: Dumbbell, exId: 'curl-up' },
                { name: '유연성', sub: '체전굴', value: `${paps.flexibilityValue}cm`, grade: paps.flexibilityGrade, icon: Compass, exId: 'sit-and-reach-stretch' },
                { name: '순발력', sub: '제자리멀리뛰기', value: `${paps.powerValue}cm`, grade: paps.powerGrade, icon: Flame, exId: 'standing-broad-jump-drill' },
              ].map((domain, i) => {
                const Icon = domain.icon;
                const dColor = getPapsGradeColor(domain.grade);

                return (
                  <div
                    key={i}
                    className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3 group hover:border-[#00B4D8]/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#14213D] border border-slate-700 flex items-center justify-center text-[#00B4D8]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{domain.name}</div>
                        <div className="text-[11px] text-slate-400">{domain.sub}: <strong className="text-slate-200">{domain.value}</strong></div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${dColor.bg} ${dColor.text} ${dColor.border}`}>
                        {domain.grade}등급
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#0B132B] rounded-2xl border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">아직 등록된 PAPS 측정 데이터가 없습니다.</p>
              <button
                onClick={() => onNavigateTab('paps')}
                className="text-xs text-[#00B4D8] font-bold px-3.5 py-1.5 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/30"
              >
                PAPS 측정값 입력하기
              </button>
            </div>
          )}

          {/* Prescription Box */}
          {prescription && (
            <div className="p-4 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-[#00B4D8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>체력 피드백:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {prescription.summary}
              </p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Activities */}
        <div className="bg-[#14213D] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00B4D8]" />
                <h2 className="text-lg font-bold text-white">최근 나의 운동 기록</h2>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {studentLogs.slice(0, 5).map((log) => (
                <div 
                  key={log.id}
                  className="bg-[#0B132B] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{log.exerciseName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.dateFormatted}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-[#00B4D8] text-sm">
                      {log.value}{log.unit}
                    </span>
                  </div>
                </div>
              ))}

              {studentLogs.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  아직 측정된 운동 기록이 없습니다.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('tracker')}
            className="w-full py-3 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition"
          >
            <Timer className="w-4 h-4 text-[#00B4D8]" />
            <span>새로운 운동 측정하기</span>
          </button>
        </div>

      </div>
    </div>
  );
};
