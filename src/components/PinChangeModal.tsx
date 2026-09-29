import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { updateStudentPin } from '../services/dataService';
import { Student } from '../types';

interface PinChangeModalProps {
  student: Student;
  onSuccess: (updatedStudent: Student) => void;
}

export const PinChangeModal: React.FC<PinChangeModalProps> = ({ student, onSuccess }) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError('비밀번호는 반드시 숫자 4자리여야 합니다.');
      return;
    }

    if (newPin === '0000') {
      setError('초기 비밀번호(0000)는 사용할 수 없습니다. 새로운 4자리를 입력해 주세요.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    const success = updateStudentPin(student.id, newPin);
    if (success) {
      const updatedStudent: Student = {
        ...student,
        pin: newPin,
        isInitialPin: false,
      };
      onSuccess(updatedStudent);
    } else {
      setError('비밀번호 변경 처리 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        id="pin-change-modal-card" 
        className="w-full max-w-md bg-[#14213D] border-2 border-[#00B4D8]/40 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4D8] via-[#FF4B4B] to-[#00B4D8]" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/15 border border-[#00B4D8]/30 flex items-center justify-center text-[#00B4D8]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">초기 비밀번호 변경 필수</h2>
            <p className="text-xs text-slate-400">
              {student.grade}학년 {student.classNum}반 {student.number}번 {student.name} 학생
            </p>
          </div>
        </div>

        <div className="bg-[#0B132B] border border-amber-500/30 rounded-xl p-3.5 mb-6 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="text-amber-400 font-semibold">보안 안내:</span> 최초 로그인 시 초기 비밀번호(<span className="font-mono text-white bg-slate-800 px-1 py-0.5 rounded">0000</span>)를 반드시 나만의 4자리 비밀번호로 변경해야 서비스를 이용할 수 있습니다.
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-[#FF4B4B] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B]" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              새로운 4자리 비밀번호 (PIN)
            </label>
            <input
              id="new-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="예: 2580 (숫자 4자리)"
              className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] font-bold text-white placeholder:text-slate-500 placeholder:text-sm placeholder:tracking-normal outline-none transition"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              비밀번호 확인
            </label>
            <input
              id="confirm-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="새 비밀번호를 다시 입력하세요"
              className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] font-bold text-white placeholder:text-slate-500 placeholder:text-sm placeholder:tracking-normal outline-none transition"
              required
            />
          </div>

          <button
            id="submit-pin-change-btn"
            type="submit"
            disabled={isSubmitting || newPin.length !== 4 || confirmPin.length !== 4}
            className="w-full mt-2 bg-[#00B4D8] hover:bg-[#00B4D8]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#0B132B] font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-sm transition touch-press-scale"
          >
            {isSubmitting ? (
              <span>저장 중...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>비밀번호 설정 및 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
