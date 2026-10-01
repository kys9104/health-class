import React, { useState, useEffect } from 'react';
import { InBodyRecord, Student, StudentWorkoutPlan, WorkoutLog } from './types';
import { 
  getActiveStudent, 
  setActiveStudent, 
  getStoredStudents, 
  getStoredWorkoutLogs, 
  getStoredInBodyRecords,
  getStoredWorkoutPlans,
  saveWorkoutLogs,
  saveInBodyRecords,
  saveWorkoutPlans,
  saveStudents,
  isTeacherAuthenticated, 
  setTeacherAuthenticated,
  syncAllWithFirebase,
  sortStudentsNumerically
} from './services/dataService';
import { subscribeToFirebaseCollections } from './services/firebase';
import { Navbar } from './components/Navbar';
import { StudentLogin } from './components/StudentLogin';
import { PinChangeModal } from './components/PinChangeModal';
import { StudentDashboard } from './components/StudentDashboard';
import { WorkoutTracker } from './components/WorkoutTracker';
import { ExerciseGuideView } from './components/ExerciseGuideView';
import { PapsAssessmentView } from './components/PapsAssessmentView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { InbodyDashboard } from './components/InbodyDashboard';
import { WorkoutPlanDashboard } from './components/WorkoutPlanDashboard';

export default function App() {
  const [activeStudent, setActiveStudentState] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [logs, setLogs] = useState<WorkoutLog[]>(() => getStoredWorkoutLogs());
  const [inbodyRecords, setInbodyRecords] = useState<InBodyRecord[]>(() => getStoredInBodyRecords());
  const [workoutPlans, setWorkoutPlans] = useState<StudentWorkoutPlan[]>(() => getStoredWorkoutPlans());
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState<boolean>(false);
  const [selectedExerciseForTracker, setSelectedExerciseForTracker] = useState<string | undefined>(undefined);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Manual / Auto Firebase sync
  const handleSyncFirebase = async () => {
    setIsSyncing(true);
    try {
      const synced = await syncAllWithFirebase();
      setStudents(synced.students);
      setLogs(synced.logs);
      setInbodyRecords(synced.inbodyRecords);
      setWorkoutPlans(synced.workoutPlans);
      setIsFirebaseConnected(synced.isConnected);
      const curr = getActiveStudent();
      if (curr) {
        const fresh = synced.students.find(s => s.id === curr.id) || curr;
        setActiveStudentState(fresh);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Initialize data on mount & subscribe to realtime Firestore
  useEffect(() => {
    const studentList = getStoredStudents();
    setStudents(studentList);

    const logList = getStoredWorkoutLogs();
    setLogs(logList);

    setInbodyRecords(getStoredInBodyRecords());
    setWorkoutPlans(getStoredWorkoutPlans());

    const currentStudent = getActiveStudent();
    if (currentStudent) {
      const fresh = studentList.find(s => s.id === currentStudent.id) || currentStudent;
      setActiveStudentState(fresh);
    }

    const isTeacher = isTeacherAuthenticated();
    if (isTeacher) {
      setIsTeacherMode(true);
      setActiveTab('teacher');
    }

    // Auto sync from Firebase on boot
    handleSyncFirebase();

    // Realtime listeners for changes across all users and devices
    const unsubscribe = subscribeToFirebaseCollections({
      onLogsChange: (remoteLogs) => {
        setLogs(remoteLogs);
        saveWorkoutLogs(remoteLogs);
      },
      onInBodyChange: (remoteRecords) => {
        setInbodyRecords(remoteRecords);
        saveInBodyRecords(remoteRecords);
      },
      onPlansChange: (remotePlans) => {
        setWorkoutPlans(remotePlans);
        saveWorkoutPlans(remotePlans);
      },
      onStudentsChange: (remoteStudents) => {
        if (!remoteStudents || remoteStudents.length === 0) return;
        const sorted = sortStudentsNumerically(remoteStudents);
        setStudents(sorted);
        saveStudents(sorted);
      },
      onQuotaExceeded: () => {
        setIsFirebaseConnected(false);
      },
    });

    return () => unsubscribe();
  }, []);

  const currentActiveStudent = activeStudent;

  // Handle Student Login Success
  const handleStudentLoginSuccess = (student: Student) => {
    setActiveStudent(student);
    setActiveStudentState(student);
    setActiveTab('dashboard');
    handleSyncFirebase();
  };

  // Handle Student Switch
  const handleStudentSwitch = (student: Student) => {
    setActiveStudent(student);
    setActiveStudentState(student);
  };

  // Handle Forced PIN Change Completion
  const handlePinChangeSuccess = (updatedStudent: Student) => {
    setActiveStudent(updatedStudent);
    setActiveStudentState(updatedStudent);
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  // Handle Logout
  const handleLogout = () => {
    setActiveStudent(null);
    setActiveStudentState(null);
    setIsTeacherMode(false);
    setTeacherAuthenticated(false);
  };

  // Handle Teacher Portal Open Request
  const handleOpenTeacherPortal = () => {
    if (isTeacherAuthenticated()) {
      setIsTeacherMode(true);
      setActiveTab('teacher');
    } else {
      setShowTeacherLoginModal(true);
    }
  };

  // Handle Teacher Login Success
  const handleTeacherLoginSuccess = () => {
    setIsTeacherMode(true);
    setActiveTab('teacher');
    setShowTeacherLoginModal(false);
    handleSyncFirebase();
  };

  // Callback when a workout is completed in tracker or plan
  const handleWorkoutCompleted = (newLog: WorkoutLog) => {
    setLogs(prev => [newLog, ...prev]);
    setInbodyRecords(getStoredInBodyRecords());
    setWorkoutPlans(getStoredWorkoutPlans());
  };

  // Callback when student saves PAPS assessment
  const handlePapsUpdated = (updatedStudent: Student) => {
    setActiveStudent(updatedStudent);
    setActiveStudentState(updatedStudent);
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  // Callback to jump to tracker from guide or paps
  const handleStartExerciseTracker = (exerciseId: string) => {
    setSelectedExerciseForTracker(exerciseId);
    setActiveTab('tracker');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans selection:bg-[#00B4D8] selection:text-[#0B132B]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeStudent={currentActiveStudent}
        students={students}
        onSwitchStudent={handleStudentSwitch}
        onLogout={handleLogout}
        onOpenTeacherMode={handleOpenTeacherPortal}
        isTeacherMode={isTeacherMode}
        isFirebaseConnected={isFirebaseConnected}
        isSyncing={isSyncing}
        onSyncFirebase={handleSyncFirebase}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        {isTeacherMode ? (
          <TeacherDashboard
            students={students}
            setStudents={setStudents}
            logs={logs}
            setLogs={setLogs}
            inbodyRecords={inbodyRecords}
            setInbodyRecords={setInbodyRecords}
            workoutPlans={workoutPlans}
            setWorkoutPlans={setWorkoutPlans}
            onExit={() => {
              setIsTeacherMode(false);
              setActiveTab('dashboard');
            }}
            onRefreshFirebase={handleSyncFirebase}
            isSyncing={isSyncing}
          />
        ) : currentActiveStudent ? (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                student={currentActiveStudent}
                logs={logs}
                onNavigateTab={(tab, param) => {
                  if (param) setSelectedExerciseForTracker(param);
                  setActiveTab(tab);
                }}
              />
            )}

            {activeTab === 'plan' && (
              <WorkoutPlanDashboard
                student={currentActiveStudent}
                onWorkoutCompleted={handleWorkoutCompleted}
                onNavigateToGuide={() => setActiveTab('guide')}
              />
            )}

            {activeTab === 'inbody' && (
              <InbodyDashboard
                student={currentActiveStudent}
                onRecordUpdated={handleSyncFirebase}
              />
            )}

            {activeTab === 'tracker' && (
              <WorkoutTracker
                student={currentActiveStudent}
                preSelectedExerciseId={selectedExerciseForTracker}
                onWorkoutCompleted={handleWorkoutCompleted}
              />
            )}

            {activeTab === 'guide' && (
              <ExerciseGuideView
                student={currentActiveStudent}
                logs={logs}
                onSelectExerciseToTrack={handleStartExerciseTracker}
              />
            )}

            {activeTab === 'paps' && (
              <PapsAssessmentView
                student={currentActiveStudent}
                onAssessmentUpdated={handlePapsUpdated}
                onNavigateToExercise={handleStartExerciseTracker}
              />
            )}
          </>
        ) : (
          <div className="py-12">
            <StudentLogin
              students={students}
              onLoginSuccess={handleStudentLoginSuccess}
              onOpenTeacherMode={handleOpenTeacherPortal}
            />
          </div>
        )}
      </main>

      {/* Forced PIN Change Modal */}
      {currentActiveStudent && currentActiveStudent.isInitialPin && (
        <PinChangeModal
          student={currentActiveStudent}
          onSuccess={handlePinChangeSuccess}
        />
      )}

      {/* Teacher Authentication Modal */}
      {showTeacherLoginModal && (
        <TeacherLoginModal
          isOpen={showTeacherLoginModal}
          onClose={() => setShowTeacherLoginModal(false)}
          onSuccess={handleTeacherLoginSuccess}
        />
      )}
    </div>
  );
}
