import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Flame, 
  Zap, 
  Sparkles, 
  CloudCheck,
  Send,
  Plus,
  Minus,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseGuide, Student, WorkoutLog } from '../types';
import { EXERCISE_DATABASE } from '../data/exercises';
import { addWorkoutLog, getAppConfig } from '../services/dataService';
import { playTapSound, playCountdownBeep, playSuccessFanfare } from '../utils/audioFeedback';

interface WorkoutTrackerProps {
  student: Student;
  preSelectedExerciseId?: string;
  onWorkoutCompleted?: (log: WorkoutLog) => void;
}

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  student,
  preSelectedExerciseId,
  onWorkoutCompleted,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseGuide>(() => {
    if (preSelectedExerciseId) {
      const found = EXERCISE_DATABASE.find(e => e.id === preSelectedExerciseId);
      if (found) return found;
    }
    return EXERCISE_DATABASE[0];
  });

  // Mode: counter or timer
  const [count, setCount] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [gasSyncStatus, setGasSyncStatus] = useState<'pending' | 'synced' | 'none'>('none');
  const [notes, setNotes] = useState<string>('');
  const [fullscreenMode, setFullscreenMode] = useState<boolean>(false);

  // Long press reset state
  const [resetHoldProgress, setResetHoldProgress] = useState<number>(0);
  const resetHoldIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const next = prev + 1;
          if (soundEnabled && next % 10 === 0) {
            playCountdownBeep(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, soundEnabled]);

  // Handle touch anywhere to count
  const handleTouchZoneClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Only increment in counter mode
    if (selectedExercise.mode === 'counter') {
      setCount(prev => {
        const next = prev + 1;
        if (soundEnabled) playTapSound();
        if ('vibrate' in navigator) {
          try { navigator.vibrate(20); } catch { /* ignore */ }
        }
        return next;
      });
    } else {
      // In timer mode, tap toggles play/pause
      if (!isRunning) {
        setIsRunning(true);
        if (soundEnabled) playCountdownBeep(false);
      } else {
        setIsRunning(false);
      }
    }
  };

  // Long Press Reset Logic (Hold for 1.5s to reset)
  const startResetHold = () => {
    if (resetHoldIntervalRef.current) clearInterval(resetHoldIntervalRef.current);
    let progress = 0;
    resetHoldIntervalRef.current = setInterval(() => {
      progress += 10;
      setResetHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(resetHoldIntervalRef.current!);
        resetWorkout();
        if (soundEnabled) playCountdownBeep(true);
      }
    }, 120);
  };

  const cancelResetHold = () => {
    if (resetHoldIntervalRef.current) {
      clearInterval(resetHoldIntervalRef.current);
      resetHoldIntervalRef.current = null;
    }
    setResetHoldProgress(0);
  };

  const resetWorkout = () => {
    setCount(0);
    setTimerSeconds(0);
    setIsRunning(false);
    setResetHoldProgress(0);
    setSaveSuccess(false);
    setGasSyncStatus('none');
  };

  const handleManualIncrement = (amount: number) => {
    if (selectedExercise.mode === 'counter') {
      setCount(prev => Math.max(0, prev + amount));
      if (soundEnabled && amount > 0) playTapSound();
    } else {
      setTimerSeconds(prev => Math.max(0, prev + amount));
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Complete and Submit
  const handleCompleteAndSave = async () => {
    const value = selectedExercise.mode === 'counter' ? count : timerSeconds;
    if (value <= 0) {
      alert('측정된 운동 기록이 0입니다. 운동을 수행한 후 기록을 저장하세요!');
      return;
    }

    setIsRunning(false);
    setIsSaving(true);

    try {
      const config = getAppConfig();
      const hasGas = !!config.gasWebhookUrl;
      setGasSyncStatus(hasGas ? 'pending' : 'none');

      const savedLog = await addWorkoutLog({
        studentId: student.id,
        studentName: student.name,
        schoolType: student.schoolType,
        grade: student.grade,
        classNum: student.classNum,
        number: student.number,
        gender: student.gender,
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        category: selectedExercise.category,
        recordType: selectedExercise.mode,
        value: value,
        unit: selectedExercise.unit,
        durationSeconds: selectedExercise.mode === 'timer' ? timerSeconds : Math.round(count * 2.5),
        notes: notes.trim(),
      });

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00B4D8', '#FF4B4B', '#F1F5F9', '#FFD166'],
        });
      } catch {
        /* ignore */
      }

      if (soundEnabled) playSuccessFanfare();

      setSaveSuccess(true);
      setGasSyncStatus(hasGas ? 'synced' : 'none');

      if (onWorkoutCompleted) {
        onWorkoutCompleted(savedLog);
      }
    } catch (err) {
      console.error(err);
      alert('기록 저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const isCounter = selectedExercise.mode === 'counter';
  const currentValue = isCounter ? count : timerSeconds;
  const targetGoal = selectedExercise.defaultGoal;
  const progressPercent = Math.min(100, Math.round((currentValue / targetGoal) * 100));

  return (
    <div className={`max-w-3xl mx-auto px-4 py-6 ${fullscreenMode ? 'fixed inset-0 z-50 bg-[#0B132B] overflow-y-auto' : ''}`}>
      {/* Exercise Selector Header */}
      <div className="bg-[#14213D] border border-[#1E3A5F] rounded-2xl p-4 mb-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/30 flex items-center justify-center text-[#00B4D8] shrink-0">
            <Flame className="w-5 h-5 text-[#00B4D8]" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <span>{selectedExercise.targetPaps}</span>
              <span className="text-[#00B4D8] font-bold">• {selectedExercise.difficulty}</span>
            </div>
            <div className="relative inline-block w-full sm:w-auto mt-0.5">
              <select
                id="exercise-select-dropdown"
                value={selectedExercise.id}
                onChange={(e) => {
                  const item = EXERCISE_DATABASE.find(x => x.id === e.target.value);
                  if (item) {
                    setSelectedExercise(item);
                    resetWorkout();
                  }
                }}
                className="w-full bg-[#0B132B] text-white text-base font-bold py-1.5 px-3 pr-8 rounded-xl border border-slate-700 outline-none appearance-none cursor-pointer hover:border-[#00B4D8]"
              >
                {EXERCISE_DATABASE.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.mode === 'counter' ? '횟수 카운터' : '초 타이머'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Controls (Sound, Fullscreen, Reset) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition ${
              soundEnabled
                ? 'bg-[#00B4D8]/15 border-[#00B4D8]/40 text-[#00B4D8]'
                : 'bg-[#0B132B] border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="fullscreen-toggle-btn"
            onClick={() => setFullscreenMode(!fullscreenMode)}
            className="p-2.5 rounded-xl bg-[#0B132B] border border-slate-800 text-slate-300 hover:text-white"
            title="전체화면 모드"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Touch-Anywhere Interactive Stage */}
      <div className="relative">
        <div
          id="workout-touch-stage"
          onClick={handleTouchZoneClick}
          className={`w-full min-h-[340px] sm:min-h-[420px] rounded-3xl p-6 flex flex-col items-center justify-between border-2 transition-all cursor-pointer relative overflow-hidden select-none active:scale-[0.99] ${
            isCounter
              ? 'bg-gradient-to-b from-[#14213D] via-[#0B132B] to-[#14213D] border-[#00B4D8]/50 shadow-2xl shadow-[#00B4D8]/10'
              : isRunning
              ? 'bg-gradient-to-b from-[#0B132B] via-[#14213D] to-[#0B132B] border-emerald-500/60 shadow-2xl shadow-emerald-500/15'
              : 'bg-gradient-to-b from-[#14213D] to-[#0B132B] border-amber-500/40 shadow-xl'
          }`}
        >
          {/* Subtle Background Rings */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="w-72 h-72 rounded-full border-4 border-dashed border-[#00B4D8] animate-spin" style={{ animationDuration: '40s' }} />
          </div>

          {/* Goal Progress Pill */}
          <div className="z-10 flex items-center justify-between w-full max-w-sm px-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B132B]/80 border border-slate-700 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#00B4D8]" />
              <span>권장 목표: {selectedExercise.defaultGoal}{selectedExercise.unit}</span>
            </div>
            <div className="text-xs font-bold text-[#00B4D8] bg-[#00B4D8]/10 px-2.5 py-0.5 rounded-full border border-[#00B4D8]/30">
              달성률 {progressPercent}%
            </div>
          </div>

          {/* Giant Number / Time Display */}
          <div className="z-10 text-center my-auto py-4">
            <div 
              id="tracker-display-value"
              className="font-black text-7xl sm:text-9xl text-white tracking-tighter drop-shadow-lg font-mono"
            >
              {isCounter ? count : formatTime(timerSeconds)}
            </div>

            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00B4D8] mt-2 flex items-center justify-center gap-2">
              <span>{isCounter ? '화면을 터치할 때마다 +1회' : isRunning ? '측정 중 (화면 터치 시 일시정지)' : '화면 터치하여 타이머 시작'}</span>
            </div>
          </div>

          {/* Target Progress Bar */}
          <div className="w-full max-w-md z-10 space-y-1.5">
            <div className="w-full bg-[#0B132B] h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 100 
                    ? 'bg-gradient-to-r from-[#00B4D8] via-emerald-400 to-[#FF4B4B]' 
                    : 'bg-gradient-to-r from-[#00B4D8] to-[#0096c7]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stepper Buttons (+1, -1) */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            id="tracker-minus-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleManualIncrement(isCounter ? -1 : -10);
            }}
            className="w-12 h-12 rounded-2xl bg-[#14213D] border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition active:scale-95"
            title={isCounter ? "-1회" : "-10초"}
          >
            <Minus className="w-5 h-5" />
          </button>

          {!isCounter && (
            <button
              id="tracker-play-pause-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsRunning(!isRunning);
              }}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition active:scale-95 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isRunning ? '일시정지' : '타이머 시작'}</span>
            </button>
          )}

          <button
            id="tracker-plus-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleManualIncrement(isCounter ? 1 : 10);
            }}
            className="w-12 h-12 rounded-2xl bg-[#14213D] border border-slate-700 text-[#00B4D8] hover:text-white flex items-center justify-center shadow-lg transition active:scale-95"
            title={isCounter ? "+1회" : "+10초"}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reset with Accident-Prevention Long Press UI & Complete Save Button */}
      <div className="mt-6 bg-[#14213D] border border-[#1E3A5F] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Memo Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            운동 메모 / 컨디션 (선택)
          </label>
          <input
            id="workout-notes-input"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="예: 3세트 완료, 복근 자극 최고"
            className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3.5 py-2 text-white text-xs placeholder:text-slate-500 outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Accident Prevention Long Press Reset Button */}
          <button
            id="long-press-reset-btn"
            type="button"
            onMouseDown={startResetHold}
            onMouseUp={cancelResetHold}
            onMouseLeave={cancelResetHold}
            onTouchStart={startResetHold}
            onTouchEnd={cancelResetHold}
            className="w-full sm:w-auto relative px-4 py-3 rounded-xl bg-[#0B132B] border border-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 overflow-hidden transition"
          >
            {/* Circular/Linear Fill for Long Press */}
            <div 
              className="absolute inset-0 bg-[#FF4B4B]/30 transition-all pointer-events-none"
              style={{ width: `${resetHoldProgress}%` }}
            />
            <RotateCcw className="w-4 h-4 text-[#FF4B4B]" />
            <span className="relative z-10">
              {resetHoldProgress > 0 ? `초기화 중... (${resetHoldProgress}%)` : '길게 눌러 초기화 (오작동 방지)'}
            </span>
          </button>

          {/* Submit and Save to DB & Google Sheets */}
          <button
            id="save-workout-result-btn"
            type="button"
            onClick={handleCompleteAndSave}
            disabled={isSaving || currentValue <= 0}
            className="w-full flex-1 bg-gradient-to-r from-[#00B4D8] via-[#0096c7] to-[#0077b6] hover:from-[#00B4D8]/90 hover:to-[#0077b6]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0B132B] font-extrabold py-3 px-6 rounded-xl shadow-lg shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-sm transition touch-press-scale"
          >
            {isSaving ? (
              <span>클라우드 동기화 저장 중...</span>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>기록 저장 완료!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>측정 완료 및 이중 자동 저장</span>
              </>
            )}
          </button>
        </div>

        {/* Dual Save Indicators */}
        {saveSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Firebase DB 실시간 저장 완료</span>
            </div>
            {gasSyncStatus === 'synced' && (
              <div className="flex items-center gap-1.5 text-xs text-[#00B4D8]">
                <CloudCheck className="w-4 h-4" />
                <span>교사 구글 시트 연동 전송됨</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exercise Tip / Safety Card */}
      <div className="mt-4 p-4 rounded-2xl bg-[#0B132B]/70 border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <span className="text-[#00B4D8] font-bold">💡 바른 자세 팁:</span> {selectedExercise.safetyNotes[0]}
      </div>
    </div>
  );
};
