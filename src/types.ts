/**
 * Health & Fitness Classroom (건강체력교실) Type Definitions
 */

export type Gender = 'M' | 'F';
export type SchoolType = 'middle' | 'high'; // 중학교 / 고등학교

export interface PAPSAssessment {
  updatedAt: string;
  // 1. 심폐지구력 (왕복오래달리기 - 셔틀런 회수 또는 오래달리기 초)
  cardioType: 'shuttleRun' | 'enduranceRun';
  cardioValue: number; // 회 또는 초
  cardioGrade: number; // 1~5등급
  cardioScore: number; // 20점 만점

  // 2. 근력/근지구력 (윗몸말아올리기, 팔굽혀펴기, 악력)
  strengthType: 'curlUp' | 'pushUp' | 'grip';
  strengthValue: number; // 회 또는 kg
  strengthGrade: number; // 1~5등급
  strengthScore: number; // 20점 만점

  // 3. 유연성 (앉아윗몸앞으로굽히기)
  flexibilityValue: number; // cm
  flexibilityGrade: number; // 1~5등급
  flexibilityScore: number; // 20점 만점

  // 4. 순발력 (50m 달리기 또는 제자리멀리뛰기)
  powerType: 'standingJump' | 'sprint50m';
  powerValue: number; // cm 또는 초
  powerGrade: number; // 1~5등급
  powerScore: number; // 20점 만점

  // 5. 체지방/체질량 (BMI)
  height: number; // cm
  weight: number; // kg
  bmi: number;
  bmiGrade: number; // 1~5등급
  bmiScore: number; // 20점 만점

  // 종합 평가
  totalScore: number; // 100점 만점
  totalGrade: number; // 1~5등급
}

export interface Student {
  id: string; // e.g. "M-1-2-15-홍길동" or UUID
  schoolType: SchoolType;
  grade: number; // 1, 2, 3
  classNum: number;
  number: number;
  name: string;
  gender: Gender;
  pin: string; // 4 digits, initial is '0000'
  isInitialPin: boolean;
  paps?: PAPSAssessment;
  createdAt: string;
  lastLoginAt?: string;
  customGoals?: {
    weeklyWorkoutsTarget: number;
    focusAreas: string[];
  };
}

export type ExerciseCategory = 
  | 'cardio' 
  | 'strength' 
  | 'flexibility' 
  | 'power' 
  | 'core' 
  | 'loopband' 
  | 'paps' 
  | 'running' 
  | 'stretching' 
  | 'plyometrics'
  | 'battlerope';

export interface FormCheckpoint {
  title: string;
  desc: string;
  isWarning?: boolean;
}

export interface ExerciseGuide {
  id: string;
  name: string;
  category: ExerciseCategory;
  subType?: 'paps_official' | 'loop_band' | 'running_drill' | 'bodyweight_core' | 'flexibility_stretch' | 'plyometrics' | 'battle_rope';
  targetPaps: string; // e.g., "심폐지구력 (왕복오래달리기)"
  difficulty: '초급' | '중급' | '고급';
  targetMuscles: string[];
  description: string;
  safetyNotes: string[];
  steps: string[];
  recommendedRepsOrTime: string;
  mode: 'counter' | 'timer';
  defaultGoal: number; // 기본 목표 횟수(회) 또는 시간(초)
  unit: '회' | '초';
  iconName: string;
  guideAnimationType: string;
  calorieBurnPerMin: number;
  imageUrl?: string;
  keyPoints?: string[];
  checkpoints?: FormCheckpoint[];
}

export interface WorkoutLog {
  id: string;
  studentId: string;
  studentName: string;
  schoolType: SchoolType;
  grade: number;
  classNum: number;
  number: number;
  gender: Gender;
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  recordType: 'count' | 'timer';
  value: number; // 횟수 또는 측정 초
  unit: '회' | '초';
  durationSeconds?: number;
  timestamp: string; // ISO String
  dateFormatted?: string; // YYYY-MM-DD
  notes?: string;
  syncedToGAS?: boolean;
  syncedToFirebase?: boolean;
}

export interface WeeklyProgress {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  targetCount: number;
  completedCount: number;
  categoryBreakdown: Record<ExerciseCategory, number>;
  totalMinutes: number;
}

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

export interface AppConfig {
  schoolName: string;
  teacherPasswordHash: string; // simple hash or stored secret
  gasWebhookUrl: string;
  firebaseConfig: FirebaseClientConfig | null;
  enableSoundFeedback: boolean;
}

export interface LeaderboardEntry {
  studentId: string;
  name: string;
  grade: number;
  classNum: number;
  number: number;
  gender: Gender;
  totalWorkouts: number;
  totalScore: number;
  cardioScore: number;
  strengthScore: number;
  flexibilityScore: number;
  powerScore: number;
  recentActivity: string;
}

export interface StudentReportOption {
  includePaps: boolean;
  includeConsistency: boolean;
  includeImprovement: boolean;
  includeAttitude: boolean;
  tone: 'formal' | 'descriptive' | 'enthusiastic';
  focusKeywords: string[];
}

// ================= 인바디 검사 기록지 (InBody Record) =================
export interface InBodyRecord {
  id: string;
  studentId: string;
  studentName: string;
  schoolType?: SchoolType;
  grade: number;
  classNum: number;
  number: number;
  gender: Gender;
  measuredAt: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  height: number; // cm
  weight: number; // kg
  skeletalMuscleMass: number; // 골격근량 (kg)
  bodyFatMass: number; // 체지방량 (kg)
  bodyFatPercentage: number; // 체지방률 (%)
  bmi: number; // 체질량지수 (kg/m²)
  inBodyScore?: number; // 인바디 점수 (100점 만점)
  bmr?: number; // 기초대사량 (kcal)
  visceralFatLevel?: number; // 내장지방레벨 (1~20)
  bodyType?: string; // 체형 판정 (표준체형, 근육형 과체중, 마른비만, 비만, 강인형 등)
  notes?: string; // 비고 및 식습관/운동 목표 메모
}

// ================= 맞춤 체력 운동 계획 (Workout Plan) =================
export interface PlannedExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  targetSets: number; // 예: 3세트
  targetRepsOrTime: number; // 세트당 목표치 (예: 15회 또는 30초)
  unit: '회' | '초';
  restSeconds: number; // 세트 간 휴식 시간 (초, 기본 45~60초)
  dayOfWeek?: '월' | '화' | '수' | '목' | '금' | '토' | '일' | '매일';
  completedSets?: number;
  isCompleted?: boolean;
  lastCompletedAt?: string;
  notes?: string;
}

export interface StudentWorkoutPlan {
  id: string;
  studentId: string;
  studentName?: string;
  schoolType?: SchoolType;
  grade?: number;
  classNum?: number;
  number?: number;
  gender?: Gender;
  planTitle?: string; // 예: "1학기 PAPS 1등급 체력 증진 플랜"
  weeklyGoalSessions: number; // 주당 목표 운동 횟수 (예: 4회)
  exercises: PlannedExercise[];
  createdAt?: string;
  updatedAt: string;
  notes?: string;
}
