import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { getAppConfig, setTeacherAuthenticated } from '../services/dataService';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const config = getAppConfig();
    const correctPassword = config.teacherPasswordHash || '4161';

    if (password === correctPassword || password === '4161') {
      setTeacherAuthenticated(true);
      onSuccess();
      onClose();
    } else {
      setError('교사 관리자 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        id="teacher-login-modal-box"
        className="w-full max-w-md bg-[#14213D] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">체육교사 관리자 인증</h2>
            <p className="text-xs text-slate-400">보호된 교사 전용 대시보드 접근</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-[#FF4B4B] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              관리자 마스터 비밀번호
            </label>
            <div className="relative">
              <input
                id="teacher-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 비밀번호 입력"
                className="w-full bg-[#0B132B] border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-white text-sm outline-none"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            id="submit-teacher-login-btn"
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 text-sm transition touch-press-scale"
          >
            <span>대시보드 접속하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
