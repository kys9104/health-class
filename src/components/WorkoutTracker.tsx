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
  ChevronDown,
  Navigation,
  MapPin,
  Gauge,
  Flag,
  Activity,
  Timer,
  Compass,
  Footprints,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseGuide, Student, WorkoutLog } from '../types';
import { EXERCISE_DATABASE } from '../data/exercises';
import { addWorkoutLog, getAppConfig } from '../services/dataService';
import { playTapSound, playCountdownBeep, playSuccessFanfare } from '../utils/audioFeedback';

interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed?: number | null; // m/s
  accuracy?: number;
}

interface LapRecord {
  lapNumber: number;
  splitTimeSeconds: number;
  distanceMeters: number;
  paceStr: string;
}

interface WorkoutTrackerProps {
  student: Student;
  preSelectedExerciseId?: string;
  onWorkoutCompleted?: (log: WorkoutLog) => void;
  onNavigateBack?: () => void;
}

// Haversine formula to compute distance between 2 GPS coordinates in meters
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  student,
  preSelectedExerciseId,
  onWorkoutCompleted,
  onNavigateBack,
}) => {
  // Tracker Mode: 'standard' (General Exercise Counter/Timer) vs 'running-gps' (Running Timer & GPS Tracker)
  const isInitialRunning = preSelectedExerciseId === 'running-gps-tracker' || preSelectedExerciseId?.startsWith('running-');
  const [trackerMode, setTrackerMode] = useState<'standard' | 'running-gps'>(isInitialRunning ? 'running-gps' : 'standard');

  const [selectedExercise, setSelectedExercise] = useState<ExerciseGuide>(() => {
    if (preSelectedExerciseId) {
      const found = EXERCISE_DATABASE.find(e => e.id === preSelectedExerciseId);
      if (found) return found;
    }
    return EXERCISE_DATABASE[0];
  });

  // Standard Mode States
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

  // ================= GPS Running Tracker States =================
  const [gpsRunningTime, setGpsRunningTime] = useState<number>(0); // in seconds
  const [isGpsRunning, setIsGpsRunning] = useState<boolean>(false);
  const [gpsDistanceMeters, setGpsDistanceMeters] = useState<number>(0);
  const [gpsPoints, setGpsPoints] = useState<GpsPoint[]>([]);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(0);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'active' | 'denied' | 'simulated'>('idle');
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null);
  const [isSimulatedTrack, setIsSimulatedTrack] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const watchIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<GpsPoint | null>(null);
  const simAngleRef = useRef<number>(0);

  // Standard Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && trackerMode === 'standard') {
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
  }, [isRunning, soundEnabled, trackerMode]);

  // GPS Running Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isGpsRunning && trackerMode === 'running-gps') {
      interval = setInterval(() => {
        setGpsRunningTime(prev => prev + 1);

        // Track Simulation Mode: simulate running on a standard 400m athletic oval track
        if (isSimulatedTrack) {
          simAngleRef.current = (simAngleRef.current + 0.05) % (Math.PI * 2);
          const centerLat = 34.829;
          const centerLng = 126.115;
          const radiusLat = 0.0006 * Math.sin(simAngleRef.current);
          const radiusLng = 0.0012 * Math.cos(simAngleRef.current);
          const newLat = centerLat + radiusLat;
          const newLng = centerLng + radiusLng;

          const newPoint: GpsPoint = {
            lat: newLat,
            lng: newLng,
            timestamp: Date.now(),
            speed: 2.9, // ~10.4 km/h
            accuracy: 3
          };

          setGpsPoints(prev => [...prev.slice(-300), newPoint]);
          setGpsDistanceMeters(prev => prev + 2.9);
          setCurrentSpeedKmh(10.4);
          setGpsStatus('simulated');
          setGpsAccuracyMeters(3);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGpsRunning, trackerMode, isSimulatedTrack]);

  // GPS WatchPosition Handler
  useEffect(() => {
    if (isGpsRunning && trackerMode === 'running-gps' && !isSimulatedTrack) {
      if (!('geolocation' in navigator)) {
        setGpsStatus('denied');
        return;
      }

      setGpsStatus('searching');

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;
          setGpsAccuracyMeters(accuracy);
          setGpsStatus('active');

          const newPoint: GpsPoint = {
            lat: latitude,
            lng: longitude,
            timestamp: position.timestamp,
            speed: speed,
            accuracy: accuracy,
          };

          // Filter out low accuracy jumps (>50m) and compute distance
          if (lastPointRef.current) {
            const dist = calculateHaversineDistance(
              lastPointRef.current.lat,
              lastPointRef.current.lng,
              latitude,
              longitude
            );

            // Filter stationary GPS jitter (<1.5 meters)
            if (dist >= 1.5 && accuracy <= 40) {
              setGpsDistanceMeters(prev => prev + dist);
              lastPointRef.current = newPoint;
              setGpsPoints(prev => [...prev.slice(-400), newPoint]);

              // Calculate current speed in km/h
              if (speed !== null && speed !== undefined && speed >= 0) {
                setCurrentSpeedKmh(Number((speed * 3.6).toFixed(1)));
              } else {
                const timeDiff = (newPoint.timestamp - (lastPointRef.current?.timestamp || newPoint.timestamp)) / 1000;
                if (timeDiff > 0) {
                  setCurrentSpeedKmh(Number(((dist / timeDiff) * 3.6).toFixed(1)));
                }
              }
            }
          } else {
            lastPointRef.current = newPoint;
            setGpsPoints([newPoint]);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setGpsStatus('denied');
          } else {
            setGpsStatus('searching');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isGpsRunning, trackerMode, isSimulatedTrack]);

  // Render Live Route on Canvas
  useEffect(() => {
    if (trackerMode !== 'running-gps') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with dark athletic track theme
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle athletic track grid & concentric circles
    ctx.strokeStyle = '#1E3A5F';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    if (gpsPoints.length === 0) {
      // Empty state preview: Athletic 400m Track graphic
      ctx.strokeStyle = '#00B4D8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width * 0.35, height * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 12px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        isGpsRunning ? 'GPS 위치 수신 중... 트랙을 달리기 시작하세요' : '[러닝 시작]을 누르면 실시간 경로가 그려집니다',
        width / 2,
        height / 2 + 5
      );
      return;
    }

    // Determine bounding box
    const lats = gpsPoints.map(p => p.lat);
    const lngs = gpsPoints.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = Math.max(0.0003, maxLat - minLat);
    const lngSpan = Math.max(0.0003, maxLng - minLng);

    const padding = 35;
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;

    const toCanvasX = (lng: number) => padding + ((lng - minLng) / lngSpan) * drawWidth;
    const toCanvasY = (lat: number) => height - padding - ((lat - minLat) / latSpan) * drawHeight;

    // Draw route path line
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#00B4D8');
    gradient.addColorStop(1, '#10B981');
    ctx.strokeStyle = gradient;

    gpsPoints.forEach((p, idx) => {
      const x = toCanvasX(p.lng);
      const y = toCanvasY(p.lat);
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw Start Marker
    const startX = toCanvasX(gpsPoints[0].lng);
    const startY = toCanvasY(gpsPoints[0].lat);
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(startX, startY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('출발', startX, startY - 10);

    // Draw Current Position Pulsing Marker
    const currentPoint = gpsPoints[gpsPoints.length - 1];
    const currX = toCanvasX(currentPoint.lng);
    const currY = toCanvasY(currentPoint.lat);

    ctx.fillStyle = 'rgba(0, 180, 216, 0.35)';
    ctx.beginPath();
    ctx.arc(currX, currY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00B4D8';
    ctx.beginPath();
    ctx.arc(currX, currY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [gpsPoints, trackerMode, isGpsRunning]);

  // Lap / Split Recording
  const handleRecordLap = () => {
    if (!isGpsRunning) return;
    const lapNum = laps.length + 1;
    const prevDist = laps.reduce((acc, l) => acc + l.distanceMeters, 0);
    const lapDist = Math.max(0, gpsDistanceMeters - prevDist);
    const prevTime = laps.reduce((acc, l) => acc + l.splitTimeSeconds, 0);
    const lapTime = Math.max(1, gpsRunningTime - prevTime);

    const lapPaceSecPerKm = lapDist > 0 ? (lapTime / (lapDist / 1000)) : 0;
    const paceStr = formatPace(lapPaceSecPerKm);

    const newLap: LapRecord = {
      lapNumber: lapNum,
      splitTimeSeconds: lapTime,
      distanceMeters: Math.round(lapDist),
      paceStr: paceStr
    };

    setLaps(prev => [...prev, newLap]);
    if (soundEnabled) playTapSound();
  };

  // Helper formatting functions
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatPace = (secondsPerKm: number) => {
    if (!secondsPerKm || !isFinite(secondsPerKm) || secondsPerKm <= 0 || secondsPerKm > 3600) {
      return "--'--\"";
    }
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.floor(secondsPerKm % 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  // Estimated calories: weight(kg) * distance(km) * 1.036
  const studentWeight = student.paps?.weight || 62;
  const distanceKm = Number((gpsDistanceMeters / 1000).toFixed(2));
  const estimatedCalories = Math.round(studentWeight * distanceKm * 1.036);
  const averagePaceSecPerKm = distanceKm > 0 ? gpsRunningTime / distanceKm : 0;
  const averagePaceStr = formatPace(averagePaceSecPerKm);

  // Standard Touch Tap Handlers
  const handleTouchZoneClick = (e: React.MouseEvent | React.TouchEvent) => {
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
      if (!isRunning) {
        setIsRunning(true);
        if (soundEnabled) playCountdownBeep(false);
      } else {
        setIsRunning(false);
      }
    }
  };

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

  const resetGpsRunning = () => {
    setIsGpsRunning(false);
    setGpsRunningTime(0);
    setGpsDistanceMeters(0);
    setGpsPoints([]);
    setCurrentSpeedKmh(0);
    setLaps([]);
    lastPointRef.current = null;
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

  // Complete and Save Running GPS Record
  const handleSaveGpsRunning = async () => {
    if (gpsRunningTime <= 0 && gpsDistanceMeters <= 0) {
      alert('러닝 측정 기록이 없습니다. 달리기를 시작한 후 기록을 저장하세요!');
      return;
    }

    setIsGpsRunning(false);
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
        exerciseId: 'running-gps-tracker',
        exerciseName: '야외/트랙 러닝 (GPS 트래커 연동)',
        category: 'running',
        recordType: 'timer',
        value: gpsRunningTime,
        unit: '초',
        durationSeconds: gpsRunningTime,
        notes: `총 이동거리: ${distanceKm}km | 평균 페이스: ${averagePaceStr}/km | 소모 칼로리: ${estimatedCalories}kcal${laps.length > 0 ? ` | 랩수: ${laps.length}` : ''}${notes ? ` | 메모: ${notes.trim()}` : ''}`,
      });

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00B4D8', '#10B981', '#FFD166'],
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
      alert('러닝 기록 저장 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // Complete and Submit Standard Exercise
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
    <div className={`max-w-4xl mx-auto px-4 py-6 ${fullscreenMode ? 'fixed inset-0 z-50 bg-[#0B132B] overflow-y-auto' : ''}`}>
      {/* Top Mode Selector Tabs */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1.5 p-1 bg-[#14213D] border border-slate-700/80 rounded-2xl">
          <button
            type="button"
            id="tab-mode-standard-btn"
            onClick={() => setTrackerMode('standard')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              trackerMode === 'standard'
                ? 'bg-[#00B4D8] text-[#0B132B] shadow-sm font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>종목 카운터 / 타이머</span>
          </button>
          <button
            type="button"
            id="tab-mode-running-gps-btn"
            onClick={() => setTrackerMode('running-gps')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              trackerMode === 'running-gps'
                ? 'bg-[#00B4D8] text-[#0B132B] shadow-sm font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>실시간 러닝 & GPS 트래커 🏃</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
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

          {/* Fullscreen Toggle */}
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

      {/* ========================================================================= */}
      {/* MODE 1: GPS RUNNING & LIVE TRACKER                                      */}
      {/* ========================================================================= */}
      {trackerMode === 'running-gps' ? (
        <div className="space-y-4">
          {/* GPS Running Banner & Controls */}
          <div className="bg-[#14213D] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#00B4D8] p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-[#0B132B] rounded-[14px] flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>실시간 야외/트랙 러닝 GPS 트래커</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      LIVE GPS
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    스마트 기기의 GPS로 이동 거리, 1km 페이스, 소모 칼로리를 정밀 측정합니다.
                  </p>
                </div>
              </div>

              {/* GPS Signal Status Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B132B] border border-slate-700 text-xs">
                  <Radio className={`w-3.5 h-3.5 ${
                    gpsStatus === 'active' ? 'text-emerald-400 animate-pulse' :
                    gpsStatus === 'simulated' ? 'text-[#00B4D8]' :
                    gpsStatus === 'searching' ? 'text-amber-400 animate-spin' :
                    gpsStatus === 'denied' ? 'text-[#FF4B4B]' : 'text-slate-500'
                  }`} />
                  <span className="font-bold text-slate-200">
                    {gpsStatus === 'active' ? `GPS 정상 (±${Math.round(gpsAccuracyMeters || 3)}m)` :
                     gpsStatus === 'simulated' ? '400m 트랙 시뮬레이션' :
                     gpsStatus === 'searching' ? 'GPS 위성 탐색 중...' :
                     gpsStatus === 'denied' ? 'GPS 권한 필요' : 'GPS 대기 중'}
                  </span>
                </div>

                {/* Simulation Mode Toggle (Useful for indoor gyms or desktop testing) */}
                <button
                  type="button"
                  id="gps-simulation-toggle-btn"
                  onClick={() => {
                    setIsSimulatedTrack(!isSimulatedTrack);
                    if (!isSimulatedTrack) {
                      setGpsStatus('simulated');
                    } else {
                      setGpsStatus('idle');
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                    isSimulatedTrack
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#0B132B] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  title="실내 운동장 트랙 시뮬레이션 토글"
                >
                  {isSimulatedTrack ? '⚡ 트랙 시뮬레이션 켜짐' : '실내 트랙 시뮬레이션'}
                </button>
              </div>
            </div>

            {/* Giant Running Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              {/* Metric 1: Elapsed Running Time */}
              <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 text-center">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Timer className="w-3.5 h-3.5 text-[#00B4D8]" />
                  <span>달린 시간</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {formatTime(gpsRunningTime)}
                </div>
              </div>

              {/* Metric 2: Distance (km) */}
              <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 text-center">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                  <span>이동 거리</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  {distanceKm}
                  <span className="text-sm font-bold text-slate-400 ml-1">km</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">({Math.round(gpsDistanceMeters)} m)</div>
              </div>

              {/* Metric 3: Average / Current Pace */}
              <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 text-center">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>평균 페이스</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                  {averagePaceStr}
                  <span className="text-xs font-semibold text-slate-400 ml-0.5">/km</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">현재: {currentSpeedKmh} km/h</div>
              </div>

              {/* Metric 4: Estimated Calories */}
              <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800 text-center">
                <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-3.5 h-3.5 text-[#FF4B4B]" />
                  <span>소모 칼로리</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#FF4B4B] font-mono tracking-tight">
                  {estimatedCalories}
                  <span className="text-sm font-bold text-slate-400 ml-1">kcal</span>
                </div>
              </div>
            </div>

            {/* Live GPS Track Canvas Visualizer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#00B4D8]" />
                  <span>실시간 GPS 러닝 경로 맵</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  위치 좌표 {gpsPoints.length}개 기록됨
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={260}
                  className="w-full h-52 sm:h-64 block bg-[#0B132B]"
                />
              </div>
            </div>

            {/* Running Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                id="gps-run-start-pause-btn"
                onClick={() => {
                  const nextState = !isGpsRunning;
                  setIsGpsRunning(nextState);
                  if (nextState) {
                    if (soundEnabled) playCountdownBeep(false);
                  }
                }}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition touch-press-scale ${
                  isGpsRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-[#00B4D8] hover:from-emerald-600 hover:to-[#00B4D8]/90 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isGpsRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-slate-950" />
                    <span>러닝 일시정지</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>{gpsRunningTime > 0 ? '러닝 이어서 달리기' : '러닝 시작하기 (START)'}</span>
                  </>
                )}
              </button>

              {/* Lap Split Button */}
              {isGpsRunning && (
                <button
                  type="button"
                  id="gps-run-lap-btn"
                  onClick={handleRecordLap}
                  className="py-4 px-5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center gap-1.5 transition active:scale-95"
                >
                  <Flag className="w-4 h-4 text-[#00B4D8]" />
                  <span>구간 랩(Lap) 기록</span>
                </button>
              )}

              {/* Reset GPS Button */}
              <button
                type="button"
                id="gps-run-reset-btn"
                onClick={resetGpsRunning}
                className="py-4 px-4 rounded-2xl bg-[#0B132B] hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
                title="러닝 기록 초기화"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Lap Records Table (if any) */}
            {laps.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300">구간별 랩(Lap) 스플릿 기록:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {laps.map((lap) => (
                    <div key={lap.lapNumber} className="bg-[#0B132B] p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="font-bold text-[#00B4D8] flex items-center justify-between">
                        <span>LAP {lap.lapNumber}</span>
                        <span className="text-white font-mono">{formatTime(lap.splitTimeSeconds)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{lap.distanceMeters}m</span>
                        <span className="text-amber-300 font-semibold">{lap.paceStr}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Running Notes & Final Save to Firebase Card */}
          <div className="bg-[#14213D] border border-slate-700/80 rounded-3xl p-5 shadow-xl space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                러닝 메모 / 날씨 / 심박 상태 (선택)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="예: 운동장 5바퀴 질주, 심폐 컨디션 아주 좋음"
                className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-slate-500 outline-none"
              />
            </div>

            <button
              type="button"
              id="save-gps-run-btn"
              onClick={handleSaveGpsRunning}
              disabled={isSaving || (gpsRunningTime <= 0 && gpsDistanceMeters <= 0)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00B4D8] via-[#0096c7] to-emerald-500 hover:from-[#00B4D8]/90 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#00B4D8]/20 transition touch-press-scale disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span>러닝 기록 동기화 저장 중...</span>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                  <span>러닝 기록 저장 완료! 🎉</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>러닝 종료 및 기록 저장하기</span>
                </>
              )}
            </button>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Firebase DB 러닝 기록 저장 완료</span>
                </div>
                {gasSyncStatus === 'synced' && (
                  <div className="flex items-center gap-1.5 text-xs text-[#00B4D8]">
                    <CloudCheck className="w-4 h-4" />
                    <span>구글 시트 연동 전송됨</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: STANDARD EXERCISE COUNTER / TIMER                                */
        /* ========================================================================= */
        <div>
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
                <div 
                  className="absolute inset-0 bg-[#FF4B4B]/30 transition-all pointer-events-none"
                  style={{ width: `${resetHoldProgress}%` }}
                />
                <RotateCcw className="w-4 h-4 text-[#FF4B4B]" />
                <span className="relative z-10">
                  {resetHoldProgress > 0 ? `초기화 중... (${resetHoldProgress}%)` : '길게 눌러 초기화 (오작동 방지)'}
                </span>
              </button>

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
      )}
    </div>
  );
};
