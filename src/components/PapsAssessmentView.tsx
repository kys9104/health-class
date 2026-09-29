import React, { useState } from 'react';
import { 
  Award, 
  Activity, 
  Zap, 
  Dumbbell, 
  Compass, 
  Flame, 
  Scale, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PAPSAssessment, Student } from '../types';
import { 
  calculatePapsAssessment, 
  getPapsGradeColor, 
  getPapsPrescription 
} from '../utils/papsCalculator';
import { saveStudentPapsAssessment } from '../services/dataService';

interface PapsAssessmentViewProps {
  student: Student;
  onAssessmentUpdated: (updatedStudent: Student) => void;
  onNavigateToExercise: (exerciseId: string) => void;
}

export const PapsAssessmentView: React.FC<PapsAssessmentViewProps> = ({
  student,
  onAssessmentUpdated,
  onNavigateToExercise,
}) => {
  const currentPaps = student.paps;

  // Form states for raw values
  const [cardioValue, setCardioValue] = useState<number>(currentPaps?.cardioValue || 45);
  const [strengthValue, setStrengthValue] = useState<number>(currentPaps?.strengthValue || 35);
  const [flexibilityValue, setFlexibilityValue] = useState<number>(currentPaps?.flexibilityValue || 12.5);
  const [powerValue, setPowerValue] = useState<number>(currentPaps?.powerValue || 180);
  const [height, setHeight] = useState<number>(currentPaps?.height || 165);
  const [weight, setWeight] = useState<number>(currentPaps?.weight || 55);

  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Realtime calculated preview
  const previewAssessment: PAPSAssessment = calculatePapsAssessment(
    student.schoolType,
    student.grade,
    student.gender,
    {
      cardioValue,
      strengthValue,
      flexibilityValue,
      powerValue,
      height,
      weight,
    }
  );

  const prescription = getPapsPrescription(previewAssessment);
  const gradeColor = getPapsGradeColor(previewAssessment.totalGrade);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = saveStudentPapsAssessment(student.id, previewAssessment);
    if (success) {
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
      onAssessmentUpdated({
        ...student,
        paps: previewAssessment,
      });
    }
  };

  const domainCards = [
    {
      id: 'cardio',
      name: '심폐지구력',
      metricName: '왕복오래달리기(셔틀런)',
      unit: '회',
      value: cardioValue,
      setValue: setCardioValue,
      grade: previewAssessment.cardioGrade,
      score: previewAssessment.cardioScore,
      icon: Zap,
      step: 1,
      min: 0,
      max: 130,
      recommendedExId: 'paps-shuttle-run',
    },
    {
      id: 'strength',
      name: '근력/근지구력',
      metricName: '윗몸말아올리기',
      unit: '회',
      value: strengthValue,
      setValue: setStrengthValue,
      grade: previewAssessment.strengthGrade,
      score: previewAssessment.strengthScore,
      icon: Dumbbell,
      step: 1,
      min: 0,
      max: 100,
      recommendedExId: 'curl-up',
    },
    {
      id: 'flexibility',
      name: '유연성',
      metricName: '앉아윗몸앞으로굽히기',
      unit: 'cm',
      value: flexibilityValue,
      setValue: setFlexibilityValue,
      grade: previewAssessment.flexibilityGrade,
      score: previewAssessment.flexibilityScore,
      icon: Compass,
      step: 0.5,
      min: -20,
      max: 40,
      recommendedExId: 'paps-sit-and-reach',
    },
    {
      id: 'power',
      name: '순발력',
      metricName: '제자리멀리뛰기',
      unit: 'cm',
      value: powerValue,
      setValue: setPowerValue,
      grade: previewAssessment.powerGrade,
      score: previewAssessment.powerScore,
      icon: Flame,
      step: 1,
      min: 50,
      max: 320,
      recommendedExId: 'plyo-power-tuck-jump',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Total PAPS Grade Result */}
      <div 
        id="paps-summary-banner"
        className="bg-[#14213D] border-2 border-[#00B4D8]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>학생건강체력평가 (PAPS) 종합 진단표</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {student.name} 학생의 체력 등급: <span className={gradeColor.text}>{gradeColor.label}</span>
            </h2>
            <p className="text-xs text-slate-300">
              {student.schoolType === 'middle' ? '중학교' : '고등학교'} {student.grade}학년 {student.gender === 'M' ? '남학생' : '여학생'} 기준 교육부 표준 규정 적용
            </p>
          </div>

          {/* Big Score Box */}
          <div className="flex items-center gap-4 bg-[#0B132B] p-4 rounded-2xl border border-slate-700/80">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">종합 점수</div>
              <div className="text-3xl font-black text-white font-mono">{previewAssessment.totalScore}<span className="text-sm font-normal text-slate-400">/100</span></div>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] uppercase font-bold text-slate-400">PAPS 등급</div>
              <div className={`text-3xl font-black font-mono ${gradeColor.text}`}>
                {previewAssessment.totalGrade}등급
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Prescription Box */}
        <div className="mt-5 p-4 rounded-2xl bg-[#0B132B]/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00B4D8]">
            <Sparkles className="w-4 h-4" />
            <span>맞춤형 체력 분석 및 피드백</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {prescription.summary}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">권장 강화 운동:</span>
            {prescription.recommendedExercises.map((rec, i) => (
              <span key={i} className="text-[11px] bg-[#14213D] text-[#00B4D8] font-semibold px-2.5 py-0.5 rounded-md border border-[#00B4D8]/30">
                {rec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Measurement Input Form & Domain Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainCards.map((domain) => {
            const Icon = domain.icon;
            const domGradeColor = getPapsGradeColor(domain.grade);

            return (
              <div
                key={domain.id}
                id={`paps-domain-card-${domain.id}`}
                className="bg-[#14213D] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/15 border border-[#00B4D8]/30 flex items-center justify-center text-[#00B4D8]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${domGradeColor.bg} ${domGradeColor.text} ${domGradeColor.border}`}>
                      {domain.grade}등급 ({domain.score}점)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{domain.name}</h3>
                  <div className="text-[11px] text-slate-400 mb-3">{domain.metricName}</div>

                  {/* Input value */}
                  <div className="flex items-center gap-2">
                    <input
                      id={`paps-input-${domain.id}`}
                      type="number"
                      step={domain.step}
                      min={domain.min}
                      max={domain.max}
                      value={domain.value}
                      onChange={(e) => domain.setValue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3 py-2 text-white font-bold text-lg font-mono outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">{domain.unit}</span>
                  </div>
                </div>

                <button
                  type="button"
                  id={`navigate-ex-${domain.id}-btn`}
                  onClick={() => onNavigateToExercise(domain.recommendedExId)}
                  className="w-full py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-xs text-[#00B4D8] font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>대비 훈련 시작</span>
                  <TrendingUp className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Body Composition (Height, Weight & BMI) */}
        <div className="bg-[#14213D] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#00B4D8]" />
              <h3 className="text-sm font-bold text-white">체질량지수 (BMI) 측정</h3>
            </div>
            <div className="text-xs font-bold text-slate-300">
              BMI: <span className="font-mono text-[#00B4D8] text-base">{previewAssessment.bmi}</span> ({previewAssessment.bmiGrade}등급)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                신장 (키)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="paps-input-height"
                  type="number"
                  step={0.1}
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3 py-2 text-white font-bold font-mono outline-none"
                />
                <span className="text-xs font-bold text-slate-400">cm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                체중 (몸무게)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="paps-input-weight"
                  type="number"
                  step={0.1}
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3 py-2 text-white font-bold font-mono outline-none"
                />
                <span className="text-xs font-bold text-slate-400">kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {isSavedNotice ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>PAPS 진단 결과가 학생 프로필에 안전하게 저장되었습니다!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>수정한 측정값을 저장하면 나의 체력 등급과 통계가 즉시 업데이트됩니다.</span>
            </div>
          )}

          <button
            id="save-paps-assessment-btn"
            type="submit"
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#0B132B] font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-[#00B4D8]/20 flex items-center gap-2 text-sm transition touch-press-scale shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>PAPS 진단 결과 저장하기</span>
          </button>
        </div>
      </form>
    </div>
  );
};
