import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  deleteField,
  onSnapshot,
  Firestore,
  getDocFromServer,
  query,
  where,
  disableNetwork,
  enableNetwork,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { InBodyRecord, Student, StudentWorkoutPlan, WorkoutLog } from '../types';

// Silence internal Firestore SDK debug/backoff logs
try {
  setLogLevel('silent');
} catch {}

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ================= Quota Exhaustion & Circuit Breaker =================
const QUOTA_STORAGE_KEY = 'health_fitness_firestore_quota_exceeded';

function checkStoredQuotaExceeded(): boolean {
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) return false;
    const timestamp = parseInt(raw, 10);
    // If recorded less than 3 hours ago, treat quota as still active to prevent retry loops
    if (Date.now() - timestamp < 3 * 60 * 60 * 1000) {
      return true;
    }
    localStorage.removeItem(QUOTA_STORAGE_KEY);
    return false;
  } catch {
    return false;
  }
}

let isQuotaExceededFlag = checkStoredQuotaExceeded();

// If quota was already exceeded in this session/browser, shut down the network immediately
if (isQuotaExceededFlag) {
  try {
    disableNetwork(db).catch(() => {});
  } catch {}
}

export function isFirestoreQuotaExceeded(): boolean {
  return isQuotaExceededFlag;
}

export function resetQuotaExceededFlag(): void {
  isQuotaExceededFlag = false;
  try {
    localStorage.removeItem(QUOTA_STORAGE_KEY);
    enableNetwork(db).catch(() => {});
  } catch {}
}

export function handleFirestoreError(err: any, context: string): void {
  const code = err?.code;
  const msg = err?.message || String(err);
  if (code === 'resource-exhausted' || msg.includes('Quota limit exceeded') || msg.includes('Free daily write units')) {
    isQuotaExceededFlag = true;
    try {
      localStorage.setItem(QUOTA_STORAGE_KEY, String(Date.now()));
      disableNetwork(db).catch(() => {});
    } catch {}
    return;
  }
  if (msg.includes('client is offline') || code === 'unavailable') {
    return;
  }
}

// Validate Connection to Firestore on Boot
export async function testFirestoreConnection(): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (err: any) {
    handleFirestoreError(err, 'Connection test');
    return !isQuotaExceededFlag;
  }
}

// ================= Workout Logs Firebase Operations =================
export async function fetchWorkoutLogsFromFirebase(): Promise<WorkoutLog[]> {
  if (isQuotaExceededFlag) return [];
  try {
    const colRef = collection(db, 'workoutLogs');
    const snap = await getDocs(colRef);
    const logs: WorkoutLog[] = [];
    snap.forEach((d) => {
      const data = d.data();
      logs.push({ id: d.id, ...data } as WorkoutLog);
    });
    logs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
    return logs;
  } catch (err) {
    handleFirestoreError(err, 'fetchWorkoutLogs');
    return [];
  }
}

export async function saveWorkoutLogToFirebase(log: WorkoutLog): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'workoutLogs', log.id);
    await setDoc(docRef, { ...log, syncedToFirebase: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, 'saveWorkoutLog');
    return false;
  }
}

export async function deleteWorkoutLogFromFirebase(logId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'workoutLogs', logId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'deleteWorkoutLog');
    return false;
  }
}

export async function clearAllWorkoutLogsFromFirebase(): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const colRef = collection(db, 'workoutLogs');
    const snap = await getDocs(colRef);
    const deletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
    await Promise.all(deletes);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearAllWorkoutLogs');
    return false;
  }
}

export async function clearStudentWorkoutLogsFromFirebase(studentId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const q = query(collection(db, 'workoutLogs'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    const deletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
    await Promise.all(deletes);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearStudentWorkoutLogs');
    return false;
  }
}

// ================= InBody Records Firebase Operations =================
export async function fetchInBodyRecordsFromFirebase(): Promise<InBodyRecord[]> {
  if (isQuotaExceededFlag) return [];
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
    handleFirestoreError(err, 'fetchInBodyRecords');
    return [];
  }
}

export async function saveInBodyRecordToFirebase(record: InBodyRecord): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'inbodyRecords', record.id);
    await setDoc(docRef, record);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'saveInBodyRecord');
    return false;
  }
}

export async function deleteInBodyRecordFromFirebase(recordId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'inbodyRecords', recordId);
    await deleteDoc(docRef);

    try {
      const q = query(collection(db, 'inbodyRecords'), where('id', '==', recordId));
      const snap = await getDocs(q);
      const batchDeletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
      await Promise.all(batchDeletes);
    } catch {}

    return true;
  } catch (err) {
    handleFirestoreError(err, 'deleteInBodyRecord');
    return false;
  }
}

export async function clearAllInBodyRecordsFromFirebase(): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const colRef = collection(db, 'inbodyRecords');
    const snap = await getDocs(colRef);
    const deletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
    await Promise.all(deletes);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearAllInBodyRecords');
    return false;
  }
}

export async function clearStudentInBodyRecordsFromFirebase(studentId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const q = query(collection(db, 'inbodyRecords'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    const deletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
    await Promise.all(deletes);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearStudentInBodyRecords');
    return false;
  }
}

// ================= Workout Plans Firebase Operations =================
export async function fetchWorkoutPlansFromFirebase(): Promise<StudentWorkoutPlan[]> {
  if (isQuotaExceededFlag) return [];
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
    handleFirestoreError(err, 'fetchWorkoutPlans');
    return [];
  }
}

export async function saveWorkoutPlanToFirebase(plan: StudentWorkoutPlan): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'workoutPlans', plan.studentId);
    await setDoc(docRef, plan);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'saveWorkoutPlan');
    return false;
  }
}

export async function deleteWorkoutPlanFromFirebase(studentId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'workoutPlans', studentId);
    await deleteDoc(docRef);

    try {
      const q = query(collection(db, 'workoutPlans'), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const batchDeletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
      await Promise.all(batchDeletes);
    } catch {}

    return true;
  } catch (err) {
    handleFirestoreError(err, 'deleteWorkoutPlan');
    return false;
  }
}

export async function clearAllWorkoutPlansFromFirebase(): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const colRef = collection(db, 'workoutPlans');
    const snap = await getDocs(colRef);
    const deletes = snap.docs.map(d => deleteDoc(d.ref).catch(() => {}));
    await Promise.all(deletes);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearAllWorkoutPlans');
    return false;
  }
}

// ================= Students Firebase Operations =================
export async function fetchStudentsFromFirebase(): Promise<Student[]> {
  if (isQuotaExceededFlag) return [];
  try {
    const colRef = collection(db, 'students');
    const snap = await getDocs(colRef);
    const students: Student[] = [];
    snap.forEach((d) => {
      const data = d.data();
      students.push({ id: d.id, ...data } as Student);
    });
    students.sort((a, b) => a.grade - b.grade || a.classNum - b.classNum || a.number - b.number);
    return students;
  } catch (err) {
    handleFirestoreError(err, 'fetchStudents');
    return [];
  }
}

export async function saveStudentToFirebase(student: Student): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'students', student.id);
    const cleaned = JSON.parse(JSON.stringify(student));
    await setDoc(docRef, cleaned);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'saveStudent');
    return false;
  }
}

export async function deleteStudentFromFirebase(studentId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'students', studentId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'deleteStudent');
    return false;
  }
}

export async function clearStudentPapsInFirebase(studentId: string): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, {
      paps: deleteField(),
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearStudentPaps');
    return false;
  }
}

export async function clearAllStudentsPapsInFirebase(): Promise<boolean> {
  if (isQuotaExceededFlag) return false;
  try {
    const colRef = collection(db, 'students');
    const snap = await getDocs(colRef);
    const updates = snap.docs.map(d => updateDoc(d.ref, { paps: deleteField() }).catch(() => {}));
    await Promise.all(updates);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'clearAllStudentsPaps');
    return false;
  }
}

// ================= Realtime Firestore Listeners =================
export function subscribeToFirebaseCollections(callbacks: {
  onLogsChange?: (logs: WorkoutLog[]) => void;
  onInBodyChange?: (records: InBodyRecord[]) => void;
  onPlansChange?: (plans: StudentWorkoutPlan[]) => void;
  onStudentsChange?: (students: Student[]) => void;
  onQuotaExceeded?: () => void;
}): () => void {
  const unsubscribes: (() => void)[] = [];

  // If already flagged as quota exceeded, do NOT start any listener streams
  if (isQuotaExceededFlag) {
    if (callbacks.onQuotaExceeded) callbacks.onQuotaExceeded();
    return () => {};
  }

  const handleSnapshotError = (err: any) => {
    handleFirestoreError(err, 'Realtime Listener');
    if (isQuotaExceededFlag) {
      if (callbacks.onQuotaExceeded) callbacks.onQuotaExceeded();
      // Unsubscribe all active listeners immediately to stop backoff delays
      unsubscribes.forEach(u => {
        try { u(); } catch {}
      });
      try {
        disableNetwork(db).catch(() => {});
      } catch {}
    }
  };

  try {
    if (callbacks.onLogsChange) {
      const unsubLogs = onSnapshot(collection(db, 'workoutLogs'), (snap) => {
        const logs: WorkoutLog[] = [];
        snap.forEach((d) => logs.push({ id: d.id, ...d.data() } as WorkoutLog));
        logs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
        callbacks.onLogsChange!(logs);
      }, handleSnapshotError);
      unsubscribes.push(unsubLogs);
    }

    if (callbacks.onInBodyChange) {
      const unsubInbody = onSnapshot(collection(db, 'inbodyRecords'), (snap) => {
        const records: InBodyRecord[] = [];
        snap.forEach((d) => records.push({ id: d.id, ...d.data() } as InBodyRecord));
        records.sort((a, b) => new Date(b.measuredAt || 0).getTime() - new Date(a.measuredAt || 0).getTime());
        callbacks.onInBodyChange!(records);
      }, handleSnapshotError);
      unsubscribes.push(unsubInbody);
    }

    if (callbacks.onPlansChange) {
      const unsubPlans = onSnapshot(collection(db, 'workoutPlans'), (snap) => {
        const plans: StudentWorkoutPlan[] = [];
        snap.forEach((d) => plans.push({ studentId: d.id, ...d.data() } as StudentWorkoutPlan));
        callbacks.onPlansChange!(plans);
      }, handleSnapshotError);
      unsubscribes.push(unsubPlans);
    }

    if (callbacks.onStudentsChange) {
      const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
        const students: Student[] = [];
        snap.forEach((d) => students.push({ id: d.id, ...d.data() } as Student));
        students.sort((a, b) => a.grade - b.grade || a.classNum - b.classNum || a.number - b.number);
        callbacks.onStudentsChange!(students);
      }, handleSnapshotError);
      unsubscribes.push(unsubStudents);
    }
  } catch (e) {
    handleFirestoreError(e, 'subscribeToFirebaseCollections');
  }

  return () => {
    unsubscribes.forEach((unsub) => {
      try {
        unsub();
      } catch {}
    });
  };
}
