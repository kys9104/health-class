import { AppConfig, ExerciseCategory, InBodyRecord, LeaderboardEntry, PAPSAssessment, PlannedExercise, SchoolType, Student, StudentWorkoutPlan, WorkoutLog } from '../types';
import { Firestore, doc, updateDoc } from 'firebase/firestore';
import { 
  db,
  testFirestoreConnection,
  fetchWorkoutLogsFromFirebase,
  saveWorkoutLogToFirebase,
  deleteWorkoutLogFromFirebase,
  fetchInBodyRecordsFromFirebase,
  saveInBodyRecordToFirebase,
  deleteInBodyRecordFromFirebase,
  fetchWorkoutPlansFromFirebase,
  saveWorkoutPlanToFirebase,
  deleteWorkoutPlanFromFirebase,
  fetchStudentsFromFirebase,
  saveStudentToFirebase
} from './firebase';

const STORAGE_KEYS = {
  STUDENTS: 'health_fitness_students_shinan_v2',
  WORKOUT_LOGS: 'health_fitness_logs_shinan_v2',
  INBODY_RECORDS: 'health_fitness_inbody_records_v1',
  WORKOUT_PLANS: 'health_fitness_workout_plans_v1',
  APP_CONFIG: 'health_fitness_config_shinan_v2',
  ACTIVE_STUDENT_ID: 'health_fitness_active_student_id_shinan_v2',
  TEACHER_AUTH: 'health_fitness_teacher_auth_shinan_v2',
};

// 신안해양과학고등학교 전체 학생 명단 (총 69명, 초기 PIN: 0000)
const INITIAL_DEMO_STUDENTS: Student[] = [
  // ================= 1학년 1반 (19명) =================
  {
    id: 'H-1-1-01-곽승준',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 1,
    name: '곽승준',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 72,
      cardioGrade: 1,
      cardioScore: 20,
      strengthType: 'curlUp',
      strengthValue: 60,
      strengthGrade: 1,
      strengthScore: 20,
      flexibilityValue: 19.0,
      flexibilityGrade: 1,
      flexibilityScore: 20,
      powerType: 'standingJump',
      powerValue: 235,
      powerGrade: 1,
      powerScore: 20,
      height: 174,
      weight: 65,
      bmi: 21.5,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 100,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-02-김건우',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 2,
    name: '김건우',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 58,
      cardioGrade: 2,
      cardioScore: 16,
      strengthType: 'curlUp',
      strengthValue: 48,
      strengthGrade: 2,
      strengthScore: 16,
      flexibilityValue: 14.5,
      flexibilityGrade: 2,
      flexibilityScore: 16,
      powerType: 'standingJump',
      powerValue: 215,
      powerGrade: 2,
      powerScore: 16,
      height: 172,
      weight: 64,
      bmi: 21.6,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 84,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-03-김준성',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 3,
    name: '김준성',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-04-김현지',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 4,
    name: '김현지',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 45,
      cardioGrade: 1,
      cardioScore: 20,
      strengthType: 'curlUp',
      strengthValue: 42,
      strengthGrade: 1,
      strengthScore: 20,
      flexibilityValue: 21.5,
      flexibilityGrade: 1,
      flexibilityScore: 20,
      powerType: 'standingJump',
      powerValue: 185,
      powerGrade: 1,
      powerScore: 20,
      height: 163,
      weight: 52,
      bmi: 19.6,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 100,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-05-명지호',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 5,
    name: '명지호',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-07-박주영',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 7,
    name: '박주영',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-08-박호연',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 8,
    name: '박호연',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-09-백호',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 9,
    name: '백호',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-10-선준혁',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 10,
    name: '선준혁',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-11-송현우',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 11,
    name: '송현우',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-12-양준성',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 12,
    name: '양준성',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-13-이관훈',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 13,
    name: '이관훈',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-14-이민수',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 14,
    name: '이민수',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-16-이예준',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 16,
    name: '이예준',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-17-임솔지',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 17,
    name: '임솔지',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-18-장범석',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 18,
    name: '장범석',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-19-정찬주',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 19,
    name: '정찬주',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-20-조희우',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 20,
    name: '조희우',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-1-21-홍서현',
    schoolType: 'high',
    grade: 1,
    classNum: 1,
    number: 21,
    name: '홍서현',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },

  // ================= 1학년 2반 (18명) =================
  {
    id: 'H-1-2-01-강성수',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 1,
    name: '강성수',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 62,
      cardioGrade: 2,
      cardioScore: 16,
      strengthType: 'curlUp',
      strengthValue: 52,
      strengthGrade: 2,
      strengthScore: 16,
      flexibilityValue: 15.0,
      flexibilityGrade: 2,
      flexibilityScore: 16,
      powerType: 'standingJump',
      powerValue: 220,
      powerGrade: 2,
      powerScore: 16,
      height: 171,
      weight: 63,
      bmi: 21.5,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 84,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-03-김보현',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 3,
    name: '김보현',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-04-김예준',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 4,
    name: '김예준',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-05-문경호',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 5,
    name: '문경호',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-06-박이한',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 6,
    name: '박이한',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-07-박해일',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 7,
    name: '박해일',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-08-백승광',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 8,
    name: '백승광',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-09-백현주',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 9,
    name: '백현주',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-10-신예영',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 10,
    name: '신예영',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-11-윤호현',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 11,
    name: '윤호현',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-12-이진우',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 12,
    name: '이진우',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-13-이진주',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 13,
    name: '이진주',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-14-이진혁',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 14,
    name: '이진혁',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-15-이채아',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 15,
    name: '이채아',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-16-정솔비',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 16,
    name: '정솔비',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-17-조하얀',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 17,
    name: '조하얀',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-18-주단비',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 18,
    name: '주단비',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-1-2-19-최우진',
    schoolType: 'high',
    grade: 1,
    classNum: 2,
    number: 19,
    name: '최우진',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },

  // ================= 2학년 1반 (17명) =================
  {
    id: 'H-2-1-01-강성률',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 1,
    name: '강성률',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 75,
      cardioGrade: 1,
      cardioScore: 20,
      strengthType: 'curlUp',
      strengthValue: 62,
      strengthGrade: 1,
      strengthScore: 20,
      flexibilityValue: 18.0,
      flexibilityGrade: 1,
      flexibilityScore: 20,
      powerType: 'standingJump',
      powerValue: 238,
      powerGrade: 1,
      powerScore: 20,
      height: 176,
      weight: 68,
      bmi: 21.9,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 100,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-02-고아영',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 2,
    name: '고아영',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 48,
      cardioGrade: 1,
      cardioScore: 20,
      strengthType: 'curlUp',
      strengthValue: 45,
      strengthGrade: 1,
      strengthScore: 20,
      flexibilityValue: 22.0,
      flexibilityGrade: 1,
      flexibilityScore: 20,
      powerType: 'standingJump',
      powerValue: 188,
      powerGrade: 1,
      powerScore: 20,
      height: 164,
      weight: 51,
      bmi: 18.9,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 100,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-03-김서윤',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 3,
    name: '김서윤',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-04-김서준',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 4,
    name: '김서준',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-05-김승준',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 5,
    name: '김승준',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-06-김예찬',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 6,
    name: '김예찬',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-07-김주엘',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 7,
    name: '김주엘',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-08-김현우',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 8,
    name: '김현우',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-09-신승민',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 9,
    name: '신승민',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-10-안현서',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 10,
    name: '안현서',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-12-이하늘',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 12,
    name: '이하늘',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-13-장준혁',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 13,
    name: '장준혁',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-14-정서연',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 14,
    name: '정서연',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-15-주시은',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 15,
    name: '주시은',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-16-주혜진',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 16,
    name: '주혜진',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-17-한주아',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 17,
    name: '한주아',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-1-18-한준범',
    schoolType: 'high',
    grade: 2,
    classNum: 1,
    number: 18,
    name: '한준범',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },

  // ================= 2학년 2반 (15명) =================
  {
    id: 'H-2-2-02-김대륜',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 2,
    name: '김대륜',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    paps: {
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      cardioType: 'shuttleRun',
      cardioValue: 65,
      cardioGrade: 2,
      cardioScore: 16,
      strengthType: 'curlUp',
      strengthValue: 55,
      strengthGrade: 2,
      strengthScore: 16,
      flexibilityValue: 16.0,
      flexibilityGrade: 2,
      flexibilityScore: 16,
      powerType: 'standingJump',
      powerValue: 228,
      powerGrade: 1,
      powerScore: 20,
      height: 175,
      weight: 66,
      bmi: 21.5,
      bmiGrade: 1,
      bmiScore: 20,
      totalScore: 88,
      totalGrade: 1,
    },
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-03-김승민',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 3,
    name: '김승민',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-05-문경원',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 5,
    name: '문경원',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-06-문대호',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 6,
    name: '문대호',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-07-박대성',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 7,
    name: '박대성',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-08-박찬수',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 8,
    name: '박찬수',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-09-승주빈',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 9,
    name: '승주빈',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-10-유동준',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 10,
    name: '유동준',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-11-이민서',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 11,
    name: '이민서',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-12-이태형',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 12,
    name: '이태형',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-13-장성효',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 13,
    name: '장성효',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-14-진재원',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 14,
    name: '진재원',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-15-최가은',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 15,
    name: '최가은',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-16-최지윤',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 16,
    name: '최지윤',
    gender: 'F',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'H-2-2-17-하태민',
    schoolType: 'high',
    grade: 2,
    classNum: 2,
    number: 17,
    name: '하태민',
    gender: 'M',
    pin: '0000',
    isInitialPin: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

// 기본 데모 운동 기록 (예시 기록 삭제 완료 - 기본 빈 배열)
const INITIAL_DEMO_LOGS: WorkoutLog[] = [];

const DEFAULT_CONFIG: AppConfig = {
  schoolName: '신안해양과학고등학교',
  teacherPasswordHash: '4161',
  gasWebhookUrl: '',
  firebaseConfig: null,
  enableSoundFeedback: true,
};

// Provisioned Firebase Firestore Instance
export function getFirebaseDb(): Firestore | null {
  return db || null;
}

// ================= App Config =================
export function getAppConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    const config = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    if (!config.teacherPasswordHash || config.teacherPasswordHash === 'admin1234') {
      config.teacherPasswordHash = '4161';
    }
    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveAppConfig(config: AppConfig): void {
  localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(config));
}

// ================= Students Sorting & Matching Helpers =================
export function sortStudentsNumerically(students: Student[]): Student[] {
  return [...students].sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade;
    if (a.classNum !== b.classNum) return a.classNum - b.classNum;
    return a.number - b.number;
  });
}

export function isRecordForStudent(
  record: { studentId?: string; grade?: number; classNum?: number; number?: number; studentName?: string },
  student: Student
): boolean {
  if (!record || !student) return false;
  if (record.studentId && (record.studentId === student.id || student.id.includes(record.studentId))) return true;
  if (
    record.grade === student.grade && 
    record.classNum === student.classNum && 
    record.number === student.number
  ) return true;
  if (
    record.studentName && 
    record.studentName.trim() === student.name.trim() && 
    record.grade === student.grade
  ) return true;
  return false;
}

// ================= Students CRUD =================
export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      const sorted = sortStudentsNumerically(INITIAL_DEMO_STUDENTS);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sorted));
      return sorted;
    }
    const parsed: Student[] = JSON.parse(raw);
    return sortStudentsNumerically(parsed);
  } catch {
    return sortStudentsNumerically(INITIAL_DEMO_STUDENTS);
  }
}

export function saveStudents(students: Student[]): void {
  const sorted = sortStudentsNumerically(students);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sorted));
  
  // Sync to Firebase Firestore
  sorted.forEach((student) => {
    saveStudentToFirebase(student).catch(e => console.warn('Firestore student sync notice:', e));
  });
}

export function findStudentForLogin(
  grade: number,
  classNum: number,
  number: number,
  name: string
): Student | undefined {
  const students = getStoredStudents();
  const trimmedName = name.trim().toLowerCase();
  return students.find(
    s => s.grade === grade && s.classNum === classNum && s.number === number && s.name.trim().toLowerCase() === trimmedName
  );
}

export function updateStudentPin(studentId: string, newPin: string): boolean {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return false;

  students[index].pin = newPin;
  students[index].isInitialPin = false;
  saveStudents(students);
  return true;
}

export function resetStudentPinToInitial(studentId: string): boolean {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return false;

  students[index].pin = '0000';
  students[index].isInitialPin = true;
  saveStudents(students);
  return true;
}

export function resetAllStudentsPinToInitial(): Student[] {
  const students = getStoredStudents();
  const updated = students.map(s => ({
    ...s,
    pin: '0000',
    isInitialPin: true,
  }));
  saveStudents(updated);
  return updated;
}

export function setStudentCustomPin(studentId: string, newPin: string): boolean {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return false;

  students[index].pin = newPin;
  students[index].isInitialPin = newPin === '0000';
  saveStudents(students);
  return true;
}

export function clearStudentWorkoutLogs(studentId: string): number {
  const logs = getStoredWorkoutLogs();
  const filtered = logs.filter(l => l.studentId !== studentId);
  const deletedCount = logs.length - filtered.length;
  saveWorkoutLogs(filtered);
  return deletedCount;
}

export function clearStudentPaps(studentId: string): boolean {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return false;

  delete students[index].paps;
  saveStudents(students);
  return true;
}

export function clearAllWorkoutLogs(): void {
  saveWorkoutLogs([]);
}

export function saveStudentPapsAssessment(studentId: string, paps: PAPSAssessment): boolean {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return false;

  students[index].paps = paps;
  saveStudents(students);
  return true;
}

// ================= Active Student Session =================
export function getActiveStudent(): Student | null {
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
  if (!activeId) return null;
  const students = getStoredStudents();
  return students.find(s => s.id === activeId) || null;
}

export function setActiveStudent(student: Student | null): void {
  if (!student) {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, student.id);
  }
}

// ================= Teacher Session =================
export function isTeacherAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.TEACHER_AUTH) === 'true';
}

export function setTeacherAuthenticated(authed: boolean): void {
  if (authed) {
    localStorage.setItem(STORAGE_KEYS.TEACHER_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.TEACHER_AUTH);
  }
}

// ================= Workout Logs & Dual Sync =================
export function getStoredWorkoutLogs(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify([]));
      return [];
    }
    const parsed: WorkoutLog[] = JSON.parse(raw);
    // Filter out mock demo logs like log-1, log-2, etc. (Requirement: Delete all sample records)
    const cleaned = parsed.filter(l => !['log-1', 'log-2', 'log-3', 'log-4', 'log-5'].includes(l.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function saveWorkoutLogs(logs: WorkoutLog[]): void {
  localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));
}

export async function addWorkoutLog(logInput: Omit<WorkoutLog, 'id' | 'timestamp' | 'dateFormatted'>): Promise<WorkoutLog> {
  const now = new Date();
  const log: WorkoutLog = {
    ...logInput,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: now.toISOString(),
    dateFormatted: now.toISOString().split('T')[0],
    syncedToFirebase: false,
    syncedToGAS: false,
  };

  const logs = getStoredWorkoutLogs();
  logs.unshift(log); // 최신순
  saveWorkoutLogs(logs);

  const config = getAppConfig();

  // 1. Firebase Firestore Sync
  saveWorkoutLogToFirebase(log).then((success) => {
    if (success) {
      log.syncedToFirebase = true;
    }
  }).catch((e) => console.warn('Firebase log sync notice:', e));

  // 2. Google Apps Script Webhook Dual Sync (GAS)
  if (config.gasWebhookUrl && config.gasWebhookUrl.startsWith('http')) {
    try {
      // mode: 'no-cors' to avoid CORS error while successfully delivering POST payload to Google Script
      const payload = {
        action: 'ADD_WORKOUT_LOG',
        timestamp: log.timestamp,
        date: log.dateFormatted,
        schoolName: config.schoolName,
        studentId: log.studentId,
        studentName: log.studentName,
        grade: log.grade,
        classNum: log.classNum,
        number: log.number,
        gender: log.gender === 'M' ? '남' : '여',
        exerciseName: log.exerciseName,
        category: log.category,
        recordType: log.recordType === 'count' ? '횟수' : '타이머',
        value: log.value,
        unit: log.unit,
        notes: log.notes || '',
      };

      await fetch(config.gasWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      log.syncedToGAS = true;
    } catch (err) {
      console.warn('Google Sheets GAS sync notice:', err);
    }
  }

  // Save updated sync flags
  saveWorkoutLogs(logs);
  return log;
}

export function updateWorkoutLog(id: string, updatedFields: Partial<WorkoutLog>): boolean {
  const logs = getStoredWorkoutLogs();
  const index = logs.findIndex(l => l.id === id);
  if (index === -1) return false;

  logs[index] = { ...logs[index], ...updatedFields };
  saveWorkoutLogs(logs);

  const db = getFirebaseDb();
  if (db) {
    updateDoc(doc(db, 'workoutLogs', id), updatedFields).catch(e => console.warn(e));
  }
  return true;
}

export function deleteWorkoutLog(id: string): boolean {
  const logs = getStoredWorkoutLogs();
  const filtered = logs.filter(l => l.id !== id);
  if (filtered.length === logs.length) return false;

  saveWorkoutLogs(filtered);
  deleteWorkoutLogFromFirebase(id).catch(e => console.warn(e));
  return true;
}

// ================= InBody Records CRUD =================
export function getStoredInBodyRecords(): InBodyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INBODY_RECORDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveInBodyRecords(records: InBodyRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.INBODY_RECORDS, JSON.stringify(records));
}

export function addInBodyRecord(recordInput: Omit<InBodyRecord, 'id' | 'createdAt'>): InBodyRecord {
  const newRecord: InBodyRecord = {
    ...recordInput,
    id: `inbody-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const records = getStoredInBodyRecords();
  records.unshift(newRecord);
  saveInBodyRecords(records);

  // Sync to Firebase Firestore
  saveInBodyRecordToFirebase(newRecord).catch(e => console.warn('Firebase InBody sync notice:', e));

  return newRecord;
}

export function updateInBodyRecord(id: string, updatedFields: Partial<InBodyRecord>): boolean {
  const records = getStoredInBodyRecords();
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return false;

  records[index] = { ...records[index], ...updatedFields };
  saveInBodyRecords(records);

  saveInBodyRecordToFirebase(records[index]).catch(e => console.warn(e));
  return true;
}

export function deleteInBodyRecord(id: string): boolean {
  const records = getStoredInBodyRecords();
  const filtered = records.filter(r => r.id !== id);
  saveInBodyRecords(filtered);
  deleteInBodyRecordFromFirebase(id).catch(e => console.warn(e));
  return true;
}

export function getStudentInBodyRecords(studentOrId: Student | string): InBodyRecord[] {
  const records = getStoredInBodyRecords();
  if (typeof studentOrId === 'string') {
    return records
      .filter(r => r.studentId === studentOrId || r.studentId?.includes(studentOrId))
      .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime());
  }
  return records
    .filter(r => isRecordForStudent(r, studentOrId))
    .sort((a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime());
}

export function clearStudentInBodyRecords(studentId: string): void {
  const records = getStoredInBodyRecords();
  const toDelete = records.filter(r => r.studentId === studentId || r.studentId?.includes(studentId));
  const remaining = records.filter(r => r.studentId !== studentId && !r.studentId?.includes(studentId));
  saveInBodyRecords(remaining);
  toDelete.forEach(r => deleteInBodyRecordFromFirebase(r.id).catch(() => {}));
}

// ================= Workout Plans CRUD =================
export function getStoredWorkoutPlans(): StudentWorkoutPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_PLANS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWorkoutPlans(plans: StudentWorkoutPlan[]): void {
  localStorage.setItem(STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(plans));
}

export function getStudentWorkoutPlan(studentOrId: Student | string): StudentWorkoutPlan | null {
  const plans = getStoredWorkoutPlans();
  if (typeof studentOrId === 'string') {
    return plans.find(p => p.studentId === studentOrId || p.studentId?.includes(studentOrId)) || null;
  }
  return plans.find(p => isRecordForStudent(p as any, studentOrId) || p.studentId === studentOrId.id) || null;
}

export function saveStudentWorkoutPlan(plan: StudentWorkoutPlan): void {
  const plans = getStoredWorkoutPlans();
  const index = plans.findIndex(p => p.studentId === plan.studentId);
  const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    plans[index] = updatedPlan;
  } else {
    plans.push(updatedPlan);
  }
  saveWorkoutPlans(plans);

  // Sync to Firebase Firestore
  saveWorkoutPlanToFirebase(updatedPlan).catch(e => console.warn('Firebase Plan sync notice:', e));
}

export function clearStudentWorkoutPlan(studentId: string): boolean {
  const plans = getStoredWorkoutPlans();
  const filtered = plans.filter(p => p.studentId !== studentId && !p.studentId?.includes(studentId));
  saveWorkoutPlans(filtered);
  deleteWorkoutPlanFromFirebase(studentId).catch(e => console.warn(e));
  return true;
}

export function deletePlannedExerciseFromPlan(studentId: string, plannedExerciseId: string): boolean {
  const plan = getStudentWorkoutPlan(studentId);
  if (!plan) return false;
  plan.exercises = plan.exercises.filter(e => e.id !== plannedExerciseId);
  saveStudentWorkoutPlan(plan);
  return true;
}

export function updatePlannedExerciseInPlan(studentId: string, updatedExercise: PlannedExercise): boolean {
  const plan = getStudentWorkoutPlan(studentId);
  if (!plan) return false;
  const idx = plan.exercises.findIndex(e => e.id === updatedExercise.id);
  if (idx === -1) return false;
  plan.exercises[idx] = updatedExercise;
  saveStudentWorkoutPlan(plan);
  return true;
}

export async function completePlannedExercise(
  student: Student,
  plannedExerciseId: string,
  actualValue: number,
  notes?: string
): Promise<{ log: WorkoutLog; updatedPlan: StudentWorkoutPlan } | null> {
  const plan = getStudentWorkoutPlan(student.id);
  if (!plan) return null;

  const itemIndex = plan.exercises.findIndex(e => e.id === plannedExerciseId);
  if (itemIndex === -1) return null;

  const plannedItem = plan.exercises[itemIndex];
  const newCompletedSets = (plannedItem.completedSets || 0) + 1;
  const isDone = newCompletedSets >= plannedItem.targetSets;

  const updatedItem: PlannedExercise = {
    ...plannedItem,
    completedSets: newCompletedSets,
    isCompleted: isDone,
    lastCompletedAt: new Date().toISOString(),
  };

  plan.exercises[itemIndex] = updatedItem;
  saveStudentWorkoutPlan(plan);

  const log = await addWorkoutLog({
    studentId: student.id,
    studentName: student.name,
    schoolType: student.schoolType,
    grade: student.grade,
    classNum: student.classNum,
    number: student.number,
    gender: student.gender,
    exerciseId: plannedItem.exerciseId,
    exerciseName: plannedItem.exerciseName,
    category: plannedItem.category,
    recordType: plannedItem.unit === '초' ? 'timer' : 'count',
    value: actualValue,
    unit: plannedItem.unit,
    durationSeconds: plannedItem.unit === '초' ? actualValue : Math.max(actualValue * 2, 30),
    notes: notes || `[계획 운동 완료] ${newCompletedSets}/${plannedItem.targetSets}세트 달성`,
  });

  return { log, updatedPlan: plan };
}

export function clearStudentWorkoutPlans(studentId: string): void {
  const plans = getStoredWorkoutPlans();
  const remaining = plans.filter(p => p.studentId !== studentId);
  saveWorkoutPlans(remaining);
}

// ================= Firebase Full Bidirectional Synchronization =================
export async function syncAllWithFirebase(): Promise<{
  students: Student[];
  logs: WorkoutLog[];
  inbodyRecords: InBodyRecord[];
  workoutPlans: StudentWorkoutPlan[];
  isConnected: boolean;
}> {
  try {
    const isConnected = await testFirestoreConnection();
    if (!isConnected) {
      return {
        students: getStoredStudents(),
        logs: getStoredWorkoutLogs(),
        inbodyRecords: getStoredInBodyRecords(),
        workoutPlans: getStoredWorkoutPlans(),
        isConnected: false,
      };
    }

    // 1. Fetch collections from Firebase
    const [remoteLogs, remoteInbody, remotePlans, remoteStudents] = await Promise.all([
      fetchWorkoutLogsFromFirebase(),
      fetchInBodyRecordsFromFirebase(),
      fetchWorkoutPlansFromFirebase(),
      fetchStudentsFromFirebase(),
    ]);

    // 2. Synchronize Workout Logs
    const localLogs = getStoredWorkoutLogs();
    const logMap = new Map<string, WorkoutLog>();
    remoteLogs.forEach(l => logMap.set(l.id, l));
    localLogs.forEach(l => {
      if (!logMap.has(l.id)) {
        logMap.set(l.id, l);
        // Upload local to Firebase
        saveWorkoutLogToFirebase(l).catch(() => {});
      }
    });
    const mergedLogs = Array.from(logMap.values())
      .filter(l => !['log-1', 'log-2', 'log-3', 'log-4', 'log-5'].includes(l.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    saveWorkoutLogs(mergedLogs);

    // 3. Synchronize InBody Records
    const localInbody = getStoredInBodyRecords();
    const inbodyMap = new Map<string, InBodyRecord>();
    remoteInbody.forEach(r => inbodyMap.set(r.id, r));
    localInbody.forEach(r => {
      if (!inbodyMap.has(r.id)) {
        inbodyMap.set(r.id, r);
        saveInBodyRecordToFirebase(r).catch(() => {});
      }
    });
    const mergedInbody = Array.from(inbodyMap.values()).sort(
      (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
    );
    saveInBodyRecords(mergedInbody);

    // 4. Synchronize Workout Plans
    const localPlans = getStoredWorkoutPlans();
    const planMap = new Map<string, StudentWorkoutPlan>();
    remotePlans.forEach(p => planMap.set(p.studentId, p));
    localPlans.forEach(p => {
      if (!planMap.has(p.studentId)) {
        planMap.set(p.studentId, p);
        saveWorkoutPlanToFirebase(p).catch(() => {});
      }
    });
    const mergedPlans = Array.from(planMap.values());
    saveWorkoutPlans(mergedPlans);

    // 5. Synchronize Students Roster
    const localStudents = getStoredStudents();
    const studentMap = new Map<string, Student>();
    localStudents.forEach(s => studentMap.set(s.id, s));
    remoteStudents.forEach(remoteS => {
      const existing = studentMap.get(remoteS.id);
      studentMap.set(remoteS.id, existing ? { ...existing, ...remoteS } : remoteS);
    });
    const mergedStudents = Array.from(studentMap.values());
    saveStudents(mergedStudents);

    return {
      students: mergedStudents,
      logs: mergedLogs,
      inbodyRecords: mergedInbody,
      workoutPlans: mergedPlans,
      isConnected: true,
    };
  } catch (err) {
    console.warn('Firebase full sync error notice:', err);
    return {
      students: getStoredStudents(),
      logs: getStoredWorkoutLogs(),
      inbodyRecords: getStoredInBodyRecords(),
      workoutPlans: getStoredWorkoutPlans(),
      isConnected: false,
    };
  }
}


// ================= Leaderboard Generator =================
export function computeLeaderboard(students: Student[], logs: WorkoutLog[]): LeaderboardEntry[] {
  return students.map((student) => {
    const studentLogs = logs.filter(l => l.studentId === student.id);
    const totalWorkouts = studentLogs.length;
    
    const cardioScore = studentLogs
      .filter(l => l.category === 'cardio' || l.category === 'battlerope' || l.category === 'running')
      .reduce((acc, l) => acc + l.value, 0);

    const strengthScore = studentLogs
      .filter(l => l.category === 'strength' || l.category === 'core' || l.category === 'loopband')
      .reduce((acc, l) => acc + l.value, 0);

    const flexibilityScore = studentLogs
      .filter(l => l.category === 'flexibility')
      .reduce((acc, l) => acc + l.value, 0);

    const powerScore = studentLogs
      .filter(l => l.category === 'power')
      .reduce((acc, l) => acc + l.value, 0);

    // 종합 체력 점수 (PAPS 총점 + 누적 운동 가산점)
    const papsScore = student.paps?.totalScore || 50;
    const totalScore = papsScore + totalWorkouts * 5;

    const latestLog = studentLogs[0];
    const recentActivity = latestLog ? `${latestLog.exerciseName} (${latestLog.dateFormatted})` : '기록 없음';

    return {
      studentId: student.id,
      name: student.name,
      grade: student.grade,
      classNum: student.classNum,
      number: student.number,
      gender: student.gender,
      totalWorkouts,
      totalScore,
      cardioScore,
      strengthScore,
      flexibilityScore,
      powerScore,
      recentActivity,
    };
  });
}

// Google Apps Script Sample Code for Teachers
export const GOOGLE_APPS_SCRIPT_SAMPLE_CODE = `/**
 * 건강체력교실 웹앱 - 구글 스프레드시트 실시간 이중 저장 Webhook 스크립트
 * 
 * [설치 및 배포 방법]
 * 1. 새 구글 스프레드시트를 생성하고 첫 행(A1~L1)에 아래 헤더를 입력합니다:
 *    [ 타임스탬프 | 날짜 | 학교명 | 학생ID | 이름 | 학년 | 반 | 번호 | 성별 | 운동종목 | 카테고리 | 기록 ]
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
 * 3. 아래 코드를 전부 복사하여 기존 내용을 지우고 붙여넣기(Ctrl+V)
 * 4. 오른쪽 상단 [배포] > [새 배포] 클릭
 * 5. 유형 선택(톱니바퀴) > [웹 앱] 선택
 * 6. 설정:
 *    - 설명: 건강체력교실 웹훅 v1
 *    - 다음 사용자로 실행: '나(My account)'
 *    - 액세스 권한이 있는 사용자: '모든 사용자(Anyone)'  <-- 중요!
 * 7. [배포] 버튼 클릭 후 생성된 [웹 앱 URL]을 복사하여 교사 대시보드 [설정] 탭에 입력하세요.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 만약 시트가 비어있다면 헤더 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "타임스탬프", "날짜", "학교명", "학생ID", "이름", 
        "학년", "반", "번호", "성별", "운동종목", "구분", "기록(단위)", "비고"
      ]);
      sheet.getRange("A1:M1").setBackground("#0B132B").setFontColor("#00B4D8").setFontWeight("bold");
    }

    var contents = e.postData.contents;
    var data = JSON.parse(contents);

    var formattedValue = data.value + (data.unit ? " " + data.unit : "");

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.date || Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd"),
      data.schoolName || "",
      data.studentId || "",
      data.studentName || "",
      data.grade || "",
      data.classNum || "",
      data.number || "",
      data.gender || "",
      data.exerciseName || "",
      data.category || "",
      formattedValue,
      data.notes || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("건강체력교실 GAS Webhook 서비스가 정상 작동 중입니다.");
}
`;
