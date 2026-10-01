import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Scale, 
  Dumbbell, 
  Flame, 
  Heart, 
  ChevronRight, 
  Award, 
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Gender, InBodyRecord, Student } from '../types';
import { addInBodyRecord, deleteInBodyRecord, getStudentInBodyRecords } from '../services/dataService';

interface InbodyDashboardProps {
  student: Student;
  onRecordUpdated?: () => void;
}

export const InbodyDashboard: React.FC<InbodyDashboardProps> = ({
  student,
  onRecordUpdated,
}) => {
  const [records, setRecords] = useState<InBodyRecord[]>(() => getStudentInBodyRecords(student.id));
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<InBodyRecord | null>(null);

  // Form State for new InBody record
  const [measuredAt, setMeasuredAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [height, setHeight] = useState<number>(student.paps?.height || 170);
  const [weight, setWeight] = useState<number>(student.paps?.weight || 62);
  const [skeletalMuscleMass, setSkeletalMuscleMass] = useState<number>(27);
  const [bodyFatMass, setBodyFatMass] = useState<number>(11.5);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number>(18.5);
  const [inBodyScore, setInBodyScore] = useState<number>(78);
  const [bmr, setBmr] = useState<number>(1520);
  const [visceralFatLevel, setVisceralFatLevel] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');

  // Refresh records from local storage
  const refreshRecords = () => {
    const list = getStudentInBodyRecords(student.id);
    setRecords(list);
    if (onRecordUpdated) onRecordUpdated();
  };

  // Auto-calculate BMI & BMR when height/weight/gender changes
  const computedBmi = height > 0 && weight > 0 ? Number((weight / Math.pow(height / 100, 2)).toFixed(1)) : 21.0;
  
  // Auto body type classification based on muscle mass and fat %
  const getBodyType = (muscle: number, fatPct: number, gender: Gender): string => {
    const isMale = gender === 'M';
    const lowFat = isMale ? fatPct < 14 : fatPct < 20;
    const highFat = isMale ? fatPct > 23 : fatPct > 28;
    const highMuscle = isMale ? muscle > (weight * 0.44) : muscle > (weight * 0.38);

    if (highMuscle && lowFat) return '강인형 근육질 (D자형)';
    if (highMuscle && !highFat) return '표준 체중 근육형 (D자형)';
    if (highFat && !highMuscle) return '체지방 과다형 (C자형)';
    if (highFat && highMuscle) return '근육형 과체중 (D자형)';
    if (!highMuscle && !lowFat && !highFat && computedBmi < 20) return '마른 비만 의심형 (C자형)';
    return '균형잡힌 표준체형 (I자형)';
  };

  // Sync fat percentage when fat mass or weight changes
  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
    if (newWeight > 0 && bodyFatMass > 0) {
      setBodyFatPercentage(Number(((bodyFatMass / newWeight) * 100).toFixed(1)));
    }
    // Estimate BMR (Mifflin-St Jeor)
    const baseBmr = student.gender === 'M'
      ? 10 * newWeight + 6.25 * height - 5 * 17 + 5
      : 10 * newWeight + 6.25 * height - 5 * 17 - 161;
    setBmr(Math.round(baseBmr));
  };

  const handleBodyFatMassChange = (newFatMass: number) => {
    setBodyFatMass(newFatMass);
    if (weight > 0) {
      setBodyFatPercentage(Number(((newFatMass / weight) * 100).toFixed(1)));
    }
  };

  const handleBodyFatPctChange = (newPct: number) => {
    setBodyFatPercentage(newPct);
    if (weight > 0) {
      setBodyFatMass(Number(((weight * newPct) / 100).toFixed(1)));
    }
  };

  // Save new InBody Record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!measuredAt || height <= 0 || weight <= 0) return;

    const bodyType = getBodyType(skeletalMuscleMass, bodyFatPercentage, student.gender);

    addInBodyRecord({
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      classNum: student.classNum,
      number: student.number,
      gender: student.gender,
      measuredAt,
      height,
      weight,
      skeletalMuscleMass,
      bodyFatMass,
      bodyFatPercentage,
      bmi: computedBmi,
      inBodyScore,
      bmr,
      visceralFatLevel,
      bodyType,
      notes: notes.trim(),
    });

    setShowInputModal(false);
    setNotes('');
    refreshRecords();
  };

  // Delete record
  const handleDelete = (id: string) => {
    if (window.confirm('선택한 인바디 검사 기록을 삭제하시겠습니까?')) {
      deleteInBodyRecord(id);
      refreshRecords();
    }
  };

  // Chronologically sorted records (oldest to newest for trend graphs)
  const chronoRecords = [...records].sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
  const latestRecord = chronoRecords[chronoRecords.length - 1] || null;
  const previousRecord = chronoRecords.length > 1 ? chronoRecords[chronoRecords.length - 2] : null;
  const initialRecord = chronoRecords.length > 0 ? chronoRecords[0] : null;

  // Metric changes (Latest vs Initial or Previous)
  const weightDiff = latestRecord && previousRecord ? Number((latestRecord.weight - previousRecord.weight).toFixed(1)) : 0;
  const muscleDiff = latestRecord && previousRecord ? Number((latestRecord.skeletalMuscleMass - previousRecord.skeletalMuscleMass).toFixed(1)) : 0;
  const fatPctDiff = latestRecord && previousRecord ? Number((latestRecord.bodyFatPercentage - previousRecord.bodyFatPercentage).toFixed(1)) : 0;
  const scoreDiff = latestRecord && previousRecord ? (latestRecord.inBodyScore || 0) - (previousRecord.inBodyScore || 0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14213D] via-[#1E3A5F] to-[#0B132B] p-6 sm:p-8 border border-[#1E3A5F] shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/20 border border-[#00B4D8]/40 text-[#00B4D8] text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>체성분 분석 & 신체 변화 추이</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{student.name} 학생의 인바디 검사 대시보드</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              정기적인 인바디(InBody) 체성분 검사를 기록하고, 골격근량 증가와 체지방률 감소 등 신체 변화 추이를 그래프와 분석 리포트로 한눈에 점검하세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="open-inbody-input-btn"
              onClick={() => {
                // Pre-fill with latest values if available
                if (latestRecord) {
                  setHeight(latestRecord.height);
                  setWeight(latestRecord.weight);
                  setSkeletalMuscleMass(latestRecord.skeletalMuscleMass);
                  setBodyFatMass(latestRecord.bodyFatMass);
                  setBodyFatPercentage(latestRecord.bodyFatPercentage);
                  setInBodyScore(latestRecord.inBodyScore || 80);
                  setBmr(latestRecord.bmr || 1550);
                  setVisceralFatLevel(latestRecord.visceralFatLevel || 4);
                }
                setMeasuredAt(new Date().toISOString().split('T')[0]);
                setShowInputModal(true);
              }}
              className="bg-gradient-to-r from-[#00B4D8] to-[#0096c7] hover:from-[#00B4D8]/90 text-[#0B132B] font-black px-5 py-3 rounded-2xl shadow-xl shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-sm transition touch-press-scale"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>인바디 검사 기록지 작성</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: 신체 변화 추이 한눈에 보기 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00B4D8]" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              본인의 신체 변화 추이 한눈에 보기
            </h2>
          </div>
          {records.length > 0 && (
            <span className="text-xs text-slate-400 font-medium">
              총 {records.length}회 측정 완료
            </span>
          )}
        </div>

        {records.length === 0 ? (
          /* Empty State */
          <div className="bg-[#14213D]/70 border border-dashed border-slate-700 rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8]">
              <Scale className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">등록된 인바디 검사 기록이 없습니다</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                체육관이나 보건실에서 측정한 인바디(InBody) 결과지를 보고 첫 번째 검사 기록지를 작성해보세요. 골격근량과 체지방 변화 추이가 자동으로 분석됩니다.
              </p>
            </div>
            <button
              onClick={() => setShowInputModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00B4D8] text-[#0B132B] font-bold text-xs hover:bg-[#00B4D8]/90 transition shadow-lg shadow-[#00B4D8]/20"
            >
              <Plus className="w-4 h-4" />
              <span>첫 인바디 기록지 작성하기</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 4 Key Metrics Delta Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: 체중 */}
              <div className="bg-[#14213D] rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">체중 (Weight)</span>
                  <Scale className="w-4 h-4 text-[#00B4D8]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {latestRecord?.weight}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
                  {previousRecord ? (
                    weightDiff === 0 ? (
                      <span className="text-slate-400">변화 없음 (0.0kg)</span>
                    ) : weightDiff > 0 ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +{weightDiff}kg (이전 대비)
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> {weightDiff}kg (이전 대비)
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400">최초 기준 측정치</span>
                  )}
                </div>
              </div>

              {/* Card 2: 골격근량 */}
              <div className="bg-[#14213D] rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">골격근량 (Skeletal Muscle)</span>
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {latestRecord?.skeletalMuscleMass}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
                  {previousRecord ? (
                    muscleDiff > 0 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +{muscleDiff}kg (근육 증가! 💪)
                      </span>
                    ) : muscleDiff < 0 ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> {muscleDiff}kg
                      </span>
                    ) : (
                      <span className="text-slate-400">근육량 유지 (0.0kg)</span>
                    )
                  ) : (
                    <span className="text-slate-400">최초 기준 측정치</span>
                  )}
                </div>
              </div>

              {/* Card 3: 체지방률 */}
              <div className="bg-[#14213D] rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">체지방률 (Percent Body Fat)</span>
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                    {latestRecord?.bodyFatPercentage}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">%</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
                  {previousRecord ? (
                    fatPctDiff < 0 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> {fatPctDiff}% (체지방 감량! 🔥)
                      </span>
                    ) : fatPctDiff > 0 ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +{fatPctDiff}%
                      </span>
                    ) : (
                      <span className="text-slate-400">체지방률 유지</span>
                    )
                  ) : (
                    <span className="text-slate-400">최초 기준 측정치</span>
                  )}
                </div>
              </div>

              {/* Card 4: 인바디 점수 및 체형 */}
              <div className="bg-[#14213D] rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold">인바디 점수 & 체형</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {latestRecord?.inBodyScore || 80}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ 100점</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#00B4D8] truncate">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{latestRecord?.bodyType || '표준 체형'}</span>
                </div>
              </div>
            </div>

            {/* Visual SVG Trend Graphs */}
            <div className="bg-[#14213D] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00B4D8]" />
                    <span>체중 · 골격근량 · 체지방률 시각적 변화 곡선</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    측정 일자별 신체 변화 궤적을 직관적으로 확인하세요.
                  </p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#00B4D8]"></span>
                    <span className="text-slate-300">체중(kg)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-300">골격근량(kg)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                    <span className="text-rose-300">체지방률(%)</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              {chronoRecords.length === 1 ? (
                <div className="py-10 text-center space-y-2 bg-[#0B132B]/50 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-300 font-bold">1회 측정 데이터가 등록되어 있습니다.</p>
                  <p className="text-xs text-slate-400">
                    다음 검사를 추가로 기록하면 연속적인 변화 추이 그래프 곡선이 시각화됩니다!
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[500px] h-64 relative pt-4 pb-8">
                    {/* Render Trend Curves */}
                    {(() => {
                      const count = chronoRecords.length;
                      const width = 600;
                      const height = 200;
                      const padLeft = 40;
                      const padRight = 30;
                      const padTop = 20;
                      const padBottom = 30;

                      const minVal = Math.min(...chronoRecords.map(r => Math.min(r.skeletalMuscleMass, r.bodyFatPercentage, r.weight))) * 0.85;
                      const maxVal = Math.max(...chronoRecords.map(r => Math.max(r.skeletalMuscleMass, r.bodyFatPercentage, r.weight))) * 1.15;
                      const valRange = Math.max(maxVal - minVal, 10);

                      const getX = (i: number) => padLeft + (i / Math.max(count - 1, 1)) * (width - padLeft - padRight);
                      const getY = (val: number) => height - padBottom - ((val - minVal) / valRange) * (height - padTop - padBottom);

                      const weightPoints = chronoRecords.map((r, i) => `${getX(i)},${getY(r.weight)}`).join(' ');
                      const musclePoints = chronoRecords.map((r, i) => `${getX(i)},${getY(r.skeletalMuscleMass)}`).join(' ');
                      const fatPoints = chronoRecords.map((r, i) => `${getX(i)},${getY(r.bodyFatPercentage)}`).join(' ');

                      return (
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                          {/* Grid horizontal lines */}
                          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                            const y = height - padBottom - ratio * (height - padTop - padBottom);
                            return (
                              <g key={idx}>
                                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#1E3A5F" strokeDasharray="3 3" />
                                <text x={padLeft - 8} y={y + 3} fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">
                                  {Math.round(minVal + ratio * valRange)}
                                </text>
                              </g>
                            );
                          })}

                          {/* Curves */}
                          <polyline fill="none" stroke="#00B4D8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={weightPoints} />
                          <polyline fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={musclePoints} />
                          <polyline fill="none" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={fatPoints} />

                          {/* Points and Dates */}
                          {chronoRecords.map((r, i) => {
                            const x = getX(i);
                            const yW = getY(r.weight);
                            const yM = getY(r.skeletalMuscleMass);
                            const yF = getY(r.bodyFatPercentage);
                            return (
                              <g key={r.id}>
                                {/* Date on X axis */}
                                <text x={x} y={height - 8} fill="#94A3B8" fontSize="10" textAnchor="middle" fontWeight="bold">
                                  {r.measuredAt.slice(5)}
                                </text>

                                {/* Circles */}
                                <circle cx={x} cy={yW} r="4.5" fill="#00B4D8" stroke="#0B132B" strokeWidth="2" />
                                <circle cx={x} cy={yM} r="4.5" fill="#34D399" stroke="#0B132B" strokeWidth="2" />
                                <circle cx={x} cy={yF} r="4.5" fill="#FB7185" stroke="#0B132B" strokeWidth="2" />

                                {/* Value tooltips */}
                                <text x={x} y={yW - 8} fill="#00B4D8" fontSize="10" textAnchor="middle" fontWeight="bold">
                                  {r.weight}
                                </text>
                                <text x={x} y={yM - 8} fill="#34D399" fontSize="10" textAnchor="middle" fontWeight="bold">
                                  {r.skeletalMuscleMass}
                                </text>
                                <text x={x} y={yF + 14} fill="#FB7185" fontSize="10" textAnchor="middle" fontWeight="bold">
                                  {r.bodyFatPercentage}%
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* InBody C-I-D Curve Explanation Badge */}
              {latestRecord && (
                <div className="p-4 rounded-2xl bg-[#0B132B]/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] flex items-center justify-center shrink-0 border border-[#00B4D8]/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>인바디 체형 분석:</span>
                        <span className="text-[#00B4D8]">{latestRecord.bodyType}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        골격근량({latestRecord.skeletalMuscleMass}kg)과 체지방률({latestRecord.bodyFatPercentage}%)의 비율 균형입니다.
                        D자형(근육형)에 가까워질수록 대사율과 기초체력이 우수합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs">
                    <div className="bg-[#14213D] px-3 py-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 mr-1.5">기초대사량:</span>
                      <span className="text-white font-mono font-bold">{latestRecord.bmr || 1550} kcal</span>
                    </div>
                    <div className="bg-[#14213D] px-3 py-1.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 mr-1.5">내장지방:</span>
                      <span className="text-emerald-400 font-mono font-bold">Lv. {latestRecord.visceralFatLevel || 4}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* InBody Records History Table */}
            <div className="bg-[#14213D] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00B4D8]" />
                  <span>인바디 검사 기록지 목록</span>
                </h3>
                <span className="text-xs text-slate-400">
                  최근 기록순
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B132B] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">검사일자</th>
                      <th className="py-3 px-3">신장 / 체중</th>
                      <th className="py-3 px-3">골격근량</th>
                      <th className="py-3 px-3">체지방량 (체지방률)</th>
                      <th className="py-3 px-3">BMI</th>
                      <th className="py-3 px-3">인바디점수</th>
                      <th className="py-3 px-3">체형 판정</th>
                      <th className="py-3 px-3">비고</th>
                      <th className="py-3 px-3 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                          {rec.measuredAt}
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono">
                          {rec.height}cm / <span className="text-white font-bold">{rec.weight}kg</span>
                        </td>
                        <td className="py-3 px-3 text-emerald-400 font-mono font-bold">
                          {rec.skeletalMuscleMass} kg
                        </td>
                        <td className="py-3 px-3 text-rose-400 font-mono font-bold">
                          {rec.bodyFatMass}kg ({rec.bodyFatPercentage}%)
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono font-bold">
                          {rec.bmi}
                        </td>
                        <td className="py-3 px-3 text-amber-300 font-mono font-bold">
                          {rec.inBodyScore ? `${rec.inBodyScore}점` : '-'}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <span className="px-2 py-0.5 rounded-md bg-[#0B132B] text-[11px] border border-slate-800">
                            {rec.bodyType || '표준체형'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 max-w-[150px] truncate" title={rec.notes}>
                          {rec.notes || '-'}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="기록 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* InBody Record Input Modal */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#14213D] border border-slate-700 w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00B4D8]/10 text-[#00B4D8] flex items-center justify-center border border-[#00B4D8]/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">인바디 검사 기록지 작성</h3>
                  <p className="text-xs text-slate-400">
                    {student.grade}학년 {student.classNum}반 {student.name} 학생 체성분 결과 입력
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInputModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1.5 rounded-xl hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4">
              {/* Measurement Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  검사 일자 (Measured Date)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={measuredAt}
                    onChange={(e) => setMeasuredAt(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    신장 (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="100"
                    max="230"
                    required
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#00B4D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    체중 (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="200"
                    required
                    value={weight}
                    onChange={(e) => handleWeightChange(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#00B4D8]"
                  />
                </div>
              </div>

              {/* Skeletal Muscle Mass & Body Fat Mass */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">
                    골격근량 (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="100"
                    required
                    value={skeletalMuscleMass}
                    onChange={(e) => setSkeletalMuscleMass(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-400 mb-1">
                    체지방량 (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="100"
                    required
                    value={bodyFatMass}
                    onChange={(e) => handleBodyFatMassChange(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              {/* Body Fat Percentage & InBody Score */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-rose-300 mb-1">
                    체지방률 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="60"
                    required
                    value={bodyFatPercentage}
                    onChange={(e) => handleBodyFatPctChange(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    인바디 점수 (점/100)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={inBodyScore}
                    onChange={(e) => setInBodyScore(Number(e.target.value))}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Auto Summary Row */}
              <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">계산된 BMI</span>
                  <span className="text-white font-mono font-bold">{computedBmi} kg/m²</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">예상 기초대사량</span>
                  <span className="text-[#00B4D8] font-mono font-bold">{bmr} kcal</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">예상 체형</span>
                  <span className="text-emerald-400 font-bold truncate block">
                    {getBodyType(skeletalMuscleMass, bodyFatPercentage, student.gender).split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Notes / Goals */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  측정 메모 및 운동/식습관 목표
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="예: 방학 동안 인터벌 러닝 운동 후 체지방 2% 감량 목표, 단백질 섭취 증량 등"
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00B4D8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] text-xs font-black transition shadow-lg shadow-[#00B4D8]/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>검사지 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
