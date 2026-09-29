import { Gender, PAPSAssessment, SchoolType } from '../types';

interface GradeThreshold {
  g1: number;
  g2: number;
  g3: number;
  g4: number;
}

// 셔틀런(왕복오래달리기) 기준 (높을수록 좋음)
const SHUTTLE_RUN_CRITERIA: Record<string, GradeThreshold> = {
  'middle-M-1': { g1: 64, g2: 48, g3: 32, g4: 18 },
  'middle-M-2': { g1: 68, g2: 52, g3: 35, g4: 20 },
  'middle-M-3': { g1: 72, g2: 56, g3: 38, g4: 22 },
  'middle-F-1': { g1: 42, g2: 32, g3: 21, g4: 12 },
  'middle-F-2': { g1: 45, g2: 34, g3: 23, g4: 13 },
  'middle-F-3': { g1: 47, g2: 36, g3: 25, g4: 14 },
  'high-M-1': { g1: 75, g2: 58, g3: 41, g4: 25 },
  'high-M-2': { g1: 78, g2: 61, g3: 43, g4: 26 },
  'high-M-3': { g1: 80, g2: 63, g3: 45, g4: 27 },
  'high-F-1': { g1: 48, g2: 36, g3: 25, g4: 14 },
  'high-F-2': { g1: 50, g2: 38, g3: 26, g4: 15 },
  'high-F-3': { g1: 52, g2: 40, g3: 27, g4: 16 },
};

// 윗몸말아올리기(회) 기준 (높을수록 좋음)
const CURL_UP_CRITERIA: Record<string, GradeThreshold> = {
  'middle-M-1': { g1: 55, g2: 42, g3: 27, g4: 14 },
  'middle-M-2': { g1: 60, g2: 46, g3: 30, g4: 16 },
  'middle-M-3': { g1: 65, g2: 50, g3: 33, g4: 18 },
  'middle-F-1': { g1: 40, g2: 29, g3: 17, g4: 8 },
  'middle-F-2': { g1: 45, g2: 33, g3: 20, g4: 10 },
  'middle-F-3': { g1: 47, g2: 35, g3: 22, g4: 11 },
  'high-M-1': { g1: 68, g2: 52, g3: 36, g4: 20 },
  'high-M-2': { g1: 72, g2: 56, g3: 39, g4: 22 },
  'high-M-3': { g1: 75, g2: 60, g3: 42, g4: 24 },
  'high-F-1': { g1: 48, g2: 36, g3: 22, g4: 11 },
  'high-F-2': { g1: 50, g2: 38, g3: 24, g4: 12 },
  'high-F-3': { g1: 52, g2: 40, g3: 25, g4: 13 },
};

// 앉아윗몸앞으로굽히기(cm) 기준 (높을수록 좋음)
const SIT_AND_REACH_CRITERIA: Record<string, GradeThreshold> = {
  'middle-M-1': { g1: 17.0, g2: 11.0, g3: 4.0, g4: -2.0 },
  'middle-M-2': { g1: 18.0, g2: 12.0, g3: 5.0, g4: -1.0 },
  'middle-M-3': { g1: 19.0, g2: 13.0, g3: 6.0, g4: 0.0 },
  'middle-F-1': { g1: 20.0, g2: 14.0, g3: 7.0, g4: 0.5 },
  'middle-F-2': { g1: 21.0, g2: 15.0, g3: 8.0, g4: 1.0 },
  'middle-F-3': { g1: 22.0, g2: 16.0, g3: 9.0, g4: 2.0 },
  'high-M-1': { g1: 20.0, g2: 14.0, g3: 7.0, g4: 0.0 },
  'high-M-2': { g1: 21.0, g2: 15.0, g3: 8.0, g4: 1.0 },
  'high-M-3': { g1: 22.0, g2: 16.0, g3: 9.0, g4: 2.0 },
  'high-F-1': { g1: 23.0, g2: 17.0, g3: 10.0, g4: 3.0 },
  'high-F-2': { g1: 24.0, g2: 18.0, g3: 11.0, g4: 4.0 },
  'high-F-3': { g1: 25.0, g2: 19.0, g3: 12.0, g4: 5.0 },
};

// 제자리멀리뛰기(cm) 기준 (높을수록 좋음)
const STANDING_JUMP_CRITERIA: Record<string, GradeThreshold> = {
  'middle-M-1': { g1: 220, g2: 195, g3: 170, g4: 140 },
  'middle-M-2': { g1: 230, g2: 205, g3: 180, g4: 150 },
  'middle-M-3': { g1: 240, g2: 215, g3: 190, g4: 160 },
  'middle-F-1': { g1: 180, g2: 160, g3: 140, g4: 115 },
  'middle-F-2': { g1: 185, g2: 165, g3: 145, g4: 120 },
  'middle-F-3': { g1: 190, g2: 170, g3: 150, g4: 125 },
  'high-M-1': { g1: 245, g2: 225, g3: 200, g4: 170 },
  'high-M-2': { g1: 250, g2: 230, g3: 205, g4: 175 },
  'high-M-3': { g1: 255, g2: 235, g3: 210, g4: 180 },
  'high-F-1': { g1: 195, g2: 175, g3: 155, g4: 130 },
  'high-F-2': { g1: 200, g2: 180, g3: 160, g4: 135 },
  'high-F-3': { g1: 205, g2: 185, g3: 165, g4: 140 },
};

function getLookupKey(schoolType: SchoolType, gender: Gender, grade: number): string {
  const boundedGrade = Math.min(Math.max(grade || 1, 1), 3);
  return `${schoolType}-${gender}-${boundedGrade}`;
}

export function calculateGradeHigherBetter(value: number, threshold: GradeThreshold): { grade: number; score: number } {
  if (value >= threshold.g1) return { grade: 1, score: 20 };
  if (value >= threshold.g2) return { grade: 2, score: 16 };
  if (value >= threshold.g3) return { grade: 3, score: 12 };
  if (value >= threshold.g4) return { grade: 4, score: 8 };
  return { grade: 5, score: 4 };
}

export function calculateBmi(heightCm: number, weightKg: number): { bmi: number; grade: number; score: number } {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 21.0, grade: 1, score: 20 };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  // 청소년 BMI 표준 구간
  if (bmi >= 18.5 && bmi <= 22.9) {
    return { bmi, grade: 1, score: 20 }; // 표준
  } else if ((bmi >= 23.0 && bmi <= 24.9) || (bmi >= 17.0 && bmi < 18.5)) {
    return { bmi, grade: 2, score: 16 }; // 과체중 전단계 / 저체중 전단계
  } else if ((bmi >= 25.0 && bmi <= 29.9) || (bmi >= 16.0 && bmi < 17.0)) {
    return { bmi, grade: 3, score: 12 }; // 경도 비만 / 저체중
  } else if (bmi >= 30.0 && bmi <= 34.9) {
    return { bmi, grade: 4, score: 8 }; // 중등도 비만
  } else {
    return { bmi, grade: 5, score: 4 }; // 고도 비만 또는 심한 저체중
  }
}

export function calculatePapsAssessment(
  schoolType: SchoolType,
  grade: number,
  gender: Gender,
  raw: {
    cardioValue: number;
    strengthValue: number;
    flexibilityValue: number;
    powerValue: number;
    height: number;
    weight: number;
  }
): PAPSAssessment {
  const key = getLookupKey(schoolType, gender, grade);
  
  // 1. 심폐지구력
  const cardioThresh = SHUTTLE_RUN_CRITERIA[key] || SHUTTLE_RUN_CRITERIA['middle-M-1'];
  const cardio = calculateGradeHigherBetter(raw.cardioValue, cardioThresh);

  // 2. 근력/근지구력
  const strengthThresh = CURL_UP_CRITERIA[key] || CURL_UP_CRITERIA['middle-M-1'];
  const strength = calculateGradeHigherBetter(raw.strengthValue, strengthThresh);

  // 3. 유연성
  const flexThresh = SIT_AND_REACH_CRITERIA[key] || SIT_AND_REACH_CRITERIA['middle-M-1'];
  const flexibility = calculateGradeHigherBetter(raw.flexibilityValue, flexThresh);

  // 4. 순발력
  const powerThresh = STANDING_JUMP_CRITERIA[key] || STANDING_JUMP_CRITERIA['middle-M-1'];
  const power = calculateGradeHigherBetter(raw.powerValue, powerThresh);

  // 5. BMI
  const bmiResult = calculateBmi(raw.height, raw.weight);

  // 종합 점수 (5개 영역 합산, 각 20점 만점 -> 100점 만점)
  const totalScore = cardio.score + strength.score + flexibility.score + power.score + bmiResult.score;
  
  let totalGrade = 5;
  if (totalScore >= 80) totalGrade = 1;
  else if (totalScore >= 60) totalGrade = 2;
  else if (totalScore >= 40) totalGrade = 3;
  else if (totalScore >= 20) totalGrade = 4;
  else totalGrade = 5;

  return {
    updatedAt: new Date().toISOString(),
    cardioType: 'shuttleRun',
    cardioValue: raw.cardioValue,
    cardioGrade: cardio.grade,
    cardioScore: cardio.score,

    strengthType: 'curlUp',
    strengthValue: raw.strengthValue,
    strengthGrade: strength.grade,
    strengthScore: strength.score,

    flexibilityValue: raw.flexibilityValue,
    flexibilityGrade: flexibility.grade,
    flexibilityScore: flexibility.score,

    powerType: 'standingJump',
    powerValue: raw.powerValue,
    powerGrade: power.grade,
    powerScore: power.score,

    height: raw.height,
    weight: raw.weight,
    bmi: bmiResult.bmi,
    bmiGrade: bmiResult.grade,
    bmiScore: bmiResult.score,

    totalScore,
    totalGrade,
  };
}

export function getPapsGradeColor(grade: number): { text: string; bg: string; border: string; label: string } {
  switch (grade) {
    case 1:
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: '1등급 (최우수)' };
    case 2:
      return { text: 'text-[#00B4D8]', bg: 'bg-[#00B4D8]/10', border: 'border-[#00B4D8]/30', label: '2등급 (우수)' };
    case 3:
      return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: '3등급 (보통)' };
    case 4:
      return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: '4등급 (경계)' };
    case 5:
    default:
      return { text: 'text-[#FF4B4B]', bg: 'bg-[#FF4B4B]/10', border: 'border-[#FF4B4B]/30', label: '5등급 (취약/개선필요)' };
  }
}

export function getPapsPrescription(assessment: PAPSAssessment): {
  summary: string;
  strongestArea: string;
  weakestArea: string;
  recommendedExercises: string[];
} {
  const domains = [
    { name: '심폐지구력', grade: assessment.cardioGrade, score: assessment.cardioScore, exercise: '인터벌 버피테스트 & 셔틀런' },
    { name: '근력/근지구력', grade: assessment.strengthGrade, score: assessment.strengthScore, exercise: '푸시업 & 플랭크 챌린지' },
    { name: '유연성', grade: assessment.flexibilityGrade, score: assessment.flexibilityScore, exercise: '햄스트링 & 전신 스트레칭 루틴' },
    { name: '순발력', grade: assessment.powerGrade, score: assessment.powerScore, exercise: '스쿼트 점프 & 하이점프' },
  ];

  // 정렬: 점수 높은 순(강점), 낮은 순(약점)
  const sortedByScore = [...domains].sort((a, b) => b.score - a.score);
  const strongest = sortedByScore[0];
  const weakest = sortedByScore[sortedByScore.length - 1];

  let summary = '';
  if (assessment.totalGrade <= 2) {
    summary = `전반적인 신체 건강체력이 매우 우수한 상태입니다. 특히 [${strongest.name}] 영역에서 탁월한 기량을 보이며, 현재의 규칙적인 운동 습관을 유지하는 것이 좋습니다.`;
  } else if (assessment.totalGrade === 3) {
    summary = `전체적인 체력 수준이 양호하나, [${weakest.name}] 영역의 체계적인 보완 훈련을 통해 1~2등급으로 향상할 잠재력이 큽니다.`;
  } else {
    summary = `건강체력 향상을 위한 맞춤 트레이닝이 필요합니다. [${weakest.name}] 영역을 집중 강화할 수 있는 안전한 초급 단계 운동부터 점진적으로 시작해 보세요.`;
  }

  const recommendedExercises = domains
    .filter(d => d.grade >= 3)
    .map(d => d.exercise);

  if (recommendedExercises.length === 0) {
    recommendedExercises.push('고급 전신 타바타 서킷 트레이닝', '심폐 지구력 심화 러닝');
  }

  return {
    summary,
    strongestArea: strongest.name,
    weakestArea: weakest.name,
    recommendedExercises,
  };
}
