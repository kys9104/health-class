import { PAPSAssessment, Student, StudentReportOption, WorkoutLog } from '../types';

export interface GeneratedReport {
  studentId: string;
  studentName: string;
  grade: number;
  classNum: number;
  number: number;
  content: string;
  characterCount: number;
  byteCount: number;
  papsSummaryText: string;
  workoutSummaryText: string;
  keyStrengths: string[];
}

// 나이스 바이트 계산 (한글 3바이트 또는 2바이트 기준 표시, 일반적으로 한글 1자=3byte 또는 2024+ 기준 글자수 500자 기준)
export function calculateKoreanByteLength(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode <= 0x007f) {
      bytes += 1;
    } else if (charCode <= 0x07ff) {
      bytes += 2;
    } else if (charCode >= 0xd800 && charCode <= 0xdbff) {
      // surrogate pair
      bytes += 4;
      i++;
    } else {
      bytes += 3;
    }
  }
  return bytes;
}

// 1. 기초 체력 및 PAPS 평가 관련 문구 풀
const PAPS_SENTENCES_TOP = [
  (s: Student, p: PAPSAssessment) =>
    `PAPS 건강체력평가에서 종합 ${p.totalGrade}등급(${p.totalScore}점)을 획득하며 전반적인 신체 기능과 기초 체력이 매우 뛰어난 학생임.`,
  (s: Student, p: PAPSAssessment) =>
    `기초 체력 진단(PAPS) 결과 종합 ${p.totalGrade}등급을 기록하여 심폐지구력과 근지구력 전반에서 균형 잡힌 뛰어난 운동 능력을 과시함.`,
  (s: Student, p: PAPSAssessment) =>
    `체육 수업 및 PAPS 측정에서 종합 ${p.totalGrade}등급의 우수한 성적을 거두었으며, 평소 체력 관리에 솔선수범하는 적극적인 태도를 지님.`,
];

const PAPS_SENTENCES_MID = [
  (s: Student, p: PAPSAssessment) =>
    `PAPS 건강체력평가에서 종합 ${p.totalGrade}등급을 기록하여 표준적인 신체 발달과 안정적인 운동 수행력을 나타냄.`,
  (s: Student, p: PAPSAssessment) =>
    `체력 진단 결과 종합 ${p.totalGrade}등급으로 기본 운동 기능이 충실하며, 건강체력교실 프로그램에 성실하게 참여하여 기량을 꾸준히 연마함.`,
  (s: Student, p: PAPSAssessment) =>
    `기초 건강체력평가에서 종합 ${p.totalGrade}등급을 획득하였으며, 취약 요소를 자발적으로 파악하고 개선하려는 의지가 돋보임.`,
];

const PAPS_SENTENCES_DEVELOPING = [
  (s: Student, p: PAPSAssessment) =>
    `PAPS 측정 결과 종합 ${p.totalGrade}등급을 받았으나, 건강체력교실의 맞춤형 운동 가이드를 성실히 수행하며 점진적인 체력 향상을 도모함.`,
  (s: Student, p: PAPSAssessment) =>
    `기초 체력 다지기 프로그램에 꾸준히 참여하여 부족한 신체 능력을 보완하고자 끊임없이 노력하는 성실한 자세를 보임.`,
  (s: Student, p: PAPSAssessment) =>
    `자신의 체력 수준을 객관적으로 인지하고, 체육 수업 및 방과 후 자율 운동에 적극적으로 임하며 체력 증진에 높은 열의를 나타냄.`,
];

// 2. 세부 종목별 우수성 문구 풀
function getDomainStrengthSentence(p: PAPSAssessment): string {
  const domains = [
    { name: '심폐지구력', grade: p.cardioGrade, text: `특히 왕복오래달리기(셔틀런 ${p.cardioValue}회)에서 탁월한 폐활량과 페이스 조절 능력을 발휘함.` },
    { name: '근력/근지구력', grade: p.strengthGrade, text: `특히 윗몸말아올리기(${p.strengthValue}회) 종목에서 단단한 코어 근력과 높은 집중력을 입증함.` },
    { name: '유연성', grade: p.flexibilityGrade, text: `특히 앉아윗몸앞으로굽히기(${p.flexibilityValue}cm)에서 뛰어난 관절 가동 범위와 유연성을 나타냄.` },
    { name: '순발력', grade: p.powerGrade, text: `특히 제자리멀리뛰기(${p.powerValue}cm)에서 강한 지면 반발력과 순발력 있는 도약력을 선보임.` },
  ];

  const best = domains.sort((a, b) => a.grade - b.grade)[0];
  if (best.grade <= 2) {
    return best.text;
  }
  return `특히 ${best.name} 영역에서 자신만의 장점을 발휘하며 모든 체력 측정 종목에 끝까지 최선을 다해 임함.`;
}

// 3. 누적 운동 참여도 및 성실성 문구 풀
const WORKOUT_PARTICIPATION_SENTENCES = [
  (count: number, minutes: number) =>
    `학기 중 건강체력교실 웹앱을 통해 총 ${count}회의 자율 운동을 성실히 기록하며 자기주도적 건강관리 습관을 확립함.`,
  (count: number, minutes: number) =>
    `수업 및 자율활동 시간 동안 누적 ${count}회의 운동 과제를 완수하며 매주 설정한 목표를 꾸준히 달성하는 끈기를 발휘함.`,
  (count: number, minutes: number) =>
    `주간 운동 계획을 능동적으로 실천하여 총 ${count}회에 걸쳐 신체 단련을 진행하였으며, 운동 카운터와 타이머를 적극 활용하여 체계적인 트레이닝을 전개함.`,
  (count: number, minutes: number) =>
    `지속적인 자기 피드백을 통해 총 ${count}회의 루틴을 소화하며 규칙적인 신체활동이 일상화된 모범적인 모습을 보여줌.`,
];

// 4. 향상도 및 발전 가능성 문구 풀
const IMPROVEMENT_SENTENCES = [
  `반복적인 체력 훈련을 거치며 초기 측정 대비 운동 지속 시간 및 반복 횟수가 눈에 띄게 증가하는 유의미한 신체적 성장을 거둠.`,
  `운동 가이드에 제시된 정확한 동작과 안전 수칙을 철저히 준수하며 부상 없이 기량을 증진시키는 모범적인 운동 태도를 정립함.`,
  `신체적 한계에 부딪혔을 때도 포기하지 않고 긍정적인 마인드로 극복하려는 도전 정신과 자기 효능감이 돋보임.`,
  `자신에게 적합한 운동 강도를 스스로 설정하고 조절하는 능력이 탁월하며 평생 체육의 기초를 탄탄히 다짐.`,
];

// 5. 수업 태도 및 인성 종합 마무리 문구 풀
const ATTITUDE_SENTENCES = [
  `체육 활동 전반에서 준비운동 및 정리운동에 적극적이며 동료 학생들에게 긍정적인 운동 에너지를 전달함.`,
  `모든 체육 수업에 열정적인 태도로 참여하며 정정당당한 스포츠맨십과 배려심 있는 자세로 수업 분위기를 주도함.`,
  `자신의 신체 변화 과정을 세심하게 모니터링하며 지속적인 체력 향상을 향한 높은 열정을 품고 있음.`,
  `규칙적인 운동의 가치를 깊이 인식하고 급우들과 함께 긍정적인 신체 활동 문화를 선도하는 학생임.`,
];

// 랜덤 또는 시드 기반 문구 선택
function pickRandom<T>(arr: T[], seedOffset: number = 0): T {
  const index = (Math.floor(Math.random() * 100) + seedOffset) % arr.length;
  return arr[index];
}

export function generateStudentReport(
  student: Student,
  logs: WorkoutLog[],
  options: StudentReportOption,
  seed: number = 0
): GeneratedReport {
  const studentLogs = logs.filter(l => l.studentId === student.id);
  const workoutCount = studentLogs.length;
  const totalMinutes = Math.round(
    studentLogs.reduce((acc, l) => acc + (l.durationSeconds || (l.unit === '초' ? l.value : 45)), 0) / 60
  );

  const sentences: string[] = [];
  const keyStrengths: string[] = [];

  // 1. PAPS 평가 문구
  let papsSummaryText = 'PAPS 측정 미등록';
  if (student.paps && options.includePaps) {
    const p = student.paps;
    papsSummaryText = `PAPS ${p.totalGrade}등급 (${p.totalScore}점)`;
    
    if (p.totalGrade <= 2) {
      sentences.push(pickRandom(PAPS_SENTENCES_TOP, seed)(student, p));
      keyStrengths.push(`종합 ${p.totalGrade}등급 최우수/우수`);
    } else if (p.totalGrade === 3) {
      sentences.push(pickRandom(PAPS_SENTENCES_MID, seed + 1)(student, p));
      keyStrengths.push(`종합 ${p.totalGrade}등급 안정적 체력`);
    } else {
      sentences.push(pickRandom(PAPS_SENTENCES_DEVELOPING, seed + 2)(student, p));
      keyStrengths.push('지속 발전형 체력 노력');
    }

    // 세부 우수 영역 문구
    const domainText = getDomainStrengthSentence(p);
    sentences.push(domainText);
  }

  // 2. 운동 참여도 문구
  let workoutSummaryText = `총 ${workoutCount}회 (${totalMinutes}분)`;
  if (options.includeConsistency) {
    if (workoutCount >= 15) {
      sentences.push(pickRandom(WORKOUT_PARTICIPATION_SENTENCES, seed + 3)(workoutCount, totalMinutes));
      keyStrengths.push(`최상위 운동 성실도(${workoutCount}회)`);
    } else if (workoutCount > 0) {
      sentences.push(pickRandom(WORKOUT_PARTICIPATION_SENTENCES, seed + 4)(workoutCount, totalMinutes));
      keyStrengths.push(`성실한 자율 루틴 수행(${workoutCount}회)`);
    } else {
      sentences.push(`체육 수업 내 건강체력교실 활동에 성실히 참여하며 체력 증진을 위한 기본 루틴을 단계별로 익혀나감.`);
    }
  }

  // 3. 향상도 및 극복 문구
  if (options.includeImprovement) {
    sentences.push(pickRandom(IMPROVEMENT_SENTENCES, seed + 5));
  }

  // 4. 태도 및 인성 마무리 문구
  if (options.includeAttitude) {
    sentences.push(pickRandom(ATTITUDE_SENTENCES, seed + 6));
  }

  // 문장 결합
  let content = sentences.join(' ');

  // 키워드 강조 처리 (있는 경우)
  if (options.focusKeywords && options.focusKeywords.length > 0) {
    const keywordSentence = `특히 ${options.focusKeywords.join(', ')} 측면에서 뛰어난 역량과 발전 가능성을 나타냄.`;
    content += ` ${keywordSentence}`;
  }

  const characterCount = content.length;
  const byteCount = calculateKoreanByteLength(content);

  return {
    studentId: student.id,
    studentName: student.name,
    grade: student.grade,
    classNum: student.classNum,
    number: student.number,
    content,
    characterCount,
    byteCount,
    papsSummaryText,
    workoutSummaryText,
    keyStrengths,
  };
}
