import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  Firestore,
  getDocFromServer,
  query,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { InBodyRecord, Student, StudentWorkoutPlan, WorkoutLog } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate Connection to Firestore on Boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (err: any) {
    if (err?.message?.includes('the client is offline')) {
      console.warn('Firebase notice: client is offline');
      return false;
    }
    return true;
  }
}

// ================= Workout Logs Firebase Operations =================
export async function fetchWorkoutLogsFromFirebase(): Promise<WorkoutLog[]> {
  try {
    const colRef = collection(db, 'workoutLogs');
    const snap = await getDocs(colRef);
    const logs: WorkoutLog[] = [];
    snap.forEach((d) => {
      const data = d.data();
      logs.push({ id: d.id, ...data } as WorkoutLog);
    });
    // Sort latest first
    logs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
    return logs;
  } catch (err) {
    console.warn('Error fetching workout logs from Firebase:', err);
    return [];
  }
}

export async function saveWorkoutLogToFirebase(log: WorkoutLog): Promise<boolean> {
  try {
    const docRef = doc(db, 'workoutLogs', log.id);
    await setDoc(docRef, { ...log, syncedToFirebase: true });
    return true;
  } catch (err) {
    console.warn('Error saving workout log to Firebase:', err);
    return false;
  }
}

export async function deleteWorkoutLogFromFirebase(logId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'workoutLogs', logId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Error deleting workout log from Firebase:', err);
    return false;
  }
}

// ================= InBody Records Firebase Operations =================
export async function fetchInBodyRecordsFromFirebase(): Promise<InBodyRecord[]> {
  try {
    const colRef = collection(db, 'inbodyRecords');
    const snap = await getDocs(colRef);
    const records: InBodyRecord[] = [];
    snap.forEach((d) => {
      const data = d.data();
      records.push({ id: d.id, ...data } as InBodyRecord);
    });
    records.sort((a, b) => new Date(b.measuredAt || 0).getTime() - new Date(a.measuredAt || 0).getTime());
    return records;
  } catch (err) {
    console.warn('Error fetching InBody records from Firebase:', err);
    return [];
  }
}

export async function saveInBodyRecordToFirebase(record: InBodyRecord): Promise<boolean> {
  try {
    const docRef = doc(db, 'inbodyRecords', record.id);
    await setDoc(docRef, record);
    return true;
  } catch (err) {
    console.warn('Error saving InBody record to Firebase:', err);
    return false;
  }
}

export async function deleteInBodyRecordFromFirebase(recordId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'inbodyRecords', recordId);
    await deleteDoc(docRef);

    // Also double check if any document in the collection has id field matching recordId
    try {
      const q = query(collection(db, 'inbodyRecords'), where('id', '==', recordId));
      const snap = await getDocs(q);
      const batchDeletes = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(batchDeletes);
    } catch {}

    return true;
  } catch (err) {
    console.warn('Error deleting InBody record from Firebase:', err);
    return false;
  }
}

// ================= Workout Plans Firebase Operations =================
export async function fetchWorkoutPlansFromFirebase(): Promise<StudentWorkoutPlan[]> {
  try {
    const colRef = collection(db, 'workoutPlans');
    const snap = await getDocs(colRef);
    const plans: StudentWorkoutPlan[] = [];
    snap.forEach((d) => {
      const data = d.data();
      plans.push({ studentId: d.id, ...data } as StudentWorkoutPlan);
    });
    return plans;
  } catch (err) {
    console.warn('Error fetching workout plans from Firebase:', err);
    return [];
  }
}

export async function saveWorkoutPlanToFirebase(plan: StudentWorkoutPlan): Promise<boolean> {
  try {
    const docRef = doc(db, 'workoutPlans', plan.studentId);
    await setDoc(docRef, plan);
    return true;
  } catch (err) {
    console.warn('Error saving workout plan to Firebase:', err);
    return false;
  }
}

export async function deleteWorkoutPlanFromFirebase(studentId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'workoutPlans', studentId);
    await deleteDoc(docRef);

    try {
      const q = query(collection(db, 'workoutPlans'), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const batchDeletes = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(batchDeletes);
    } catch {}

    return true;
  } catch (err) {
    console.warn('Error deleting workout plan from Firebase:', err);
    return false;
  }
}

// ================= Students Firebase Operations =================
export async function fetchStudentsFromFirebase(): Promise<Student[]> {
  try {
    const colRef = collection(db, 'students');
    const snap = await getDocs(colRef);
    const students: Student[] = [];
    snap.forEach((d) => {
      const data = d.data();
      students.push({ id: d.id, ...data } as Student);
    });
    // Sort students numerically by grade, classNum, number
    students.sort((a, b) => a.grade - b.grade || a.classNum - b.classNum || a.number - b.number);
    return students;
  } catch (err) {
    console.warn('Error fetching students from Firebase:', err);
    return [];
  }
}

export async function saveStudentToFirebase(student: Student): Promise<boolean> {
  try {
    const docRef = doc(db, 'students', student.id);
    await setDoc(docRef, student);
    return true;
  } catch (err) {
    console.warn('Error saving student to Firebase:', err);
    return false;
  }
}

export async function deleteStudentFromFirebase(studentId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'students', studentId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Error deleting student from Firebase:', err);
    return false;
  }
}

// ================= Realtime Firestore Listeners =================
export function subscribeToFirebaseCollections(callbacks: {
  onLogsChange?: (logs: WorkoutLog[]) => void;
  onInBodyChange?: (records: InBodyRecord[]) => void;
  onPlansChange?: (plans: StudentWorkoutPlan[]) => void;
  onStudentsChange?: (students: Student[]) => void;
}): () => void {
  const unsubscribes: (() => void)[] = [];

  try {
    if (callbacks.onLogsChange) {
      const unsub = onSnapshot(collection(db, 'workoutLogs'), (snap) => {
        const logs: WorkoutLog[] = [];
        snap.forEach((d) => logs.push({ id: d.id, ...d.data() } as WorkoutLog));
        logs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
        callbacks.onLogsChange!(logs);
      }, (err) => console.warn('Realtime logs error notice:', err));
      unsubscribes.push(unsub);
    }

    if (callbacks.onInBodyChange) {
      const unsub = onSnapshot(collection(db, 'inbodyRecords'), (snap) => {
        const records: InBodyRecord[] = [];
        snap.forEach((d) => records.push({ id: d.id, ...d.data() } as InBodyRecord));
        records.sort((a, b) => new Date(b.measuredAt || 0).getTime() - new Date(a.measuredAt || 0).getTime());
        callbacks.onInBodyChange!(records);
      }, (err) => console.warn('Realtime InBody error notice:', err));
      unsubscribes.push(unsub);
    }

    if (callbacks.onPlansChange) {
      const unsub = onSnapshot(collection(db, 'workoutPlans'), (snap) => {
        const plans: StudentWorkoutPlan[] = [];
        snap.forEach((d) => plans.push({ studentId: d.id, ...d.data() } as StudentWorkoutPlan));
        callbacks.onPlansChange!(plans);
      }, (err) => console.warn('Realtime plans error notice:', err));
      unsubscribes.push(unsub);
    }

    if (callbacks.onStudentsChange) {
      const unsub = onSnapshot(collection(db, 'students'), (snap) => {
        const students: Student[] = [];
        snap.forEach((d) => students.push({ id: d.id, ...d.data() } as Student));
        students.sort((a, b) => a.grade - b.grade || a.classNum - b.classNum || a.number - b.number);
        callbacks.onStudentsChange!(students);
      }, (err) => console.warn('Realtime students error notice:', err));
      unsubscribes.push(unsub);
    }
  } catch (e) {
    console.warn('Realtime subscription setup notice:', e);
  }

  return () => {
    unsubscribes.forEach((unsub) => {
      try {
        unsub();
      } catch {}
    });
  };
}
