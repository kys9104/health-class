import React, { useState, useEffect } from 'react';
import { UserCheck, KeyRound, ShieldAlert, Sparkles, School, UserCircle, GraduationCap } from 'lucide-react';
import { findStudentForLogin, getStoredStudents } from '../services/dataService';
import { SchoolType, Student } from '../types';

interface StudentLoginProps {
  students?: Student[];
  onLoginSuccess: (student: Student) => void;
  onOpenTeacherMode?: () => void;
  onOpenTeacherLogin?: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ 
  students: propStudents,
  onLoginSuccess, 
  onOpenTeacherMode,
  onOpenTeacherLogin 
}) => {
  const [schoolType, setSchoolType] = useState<SchoolType>('high');
  const [grade, setGrade] = useState<number>(1);
  const [classNum, setClassNum] = useState<number>(1);
  const [number, setNumber] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [availableStudents, setAvailableStudents] = useState<Student[]>(() => propStudents || getStoredStudents());

  useEffect(() => {
    if (propStudents && propStudents.length > 0) {
      setAvailableStudents(propStudents);
    } else {
      const list = getStoredStudents();
      setAvailableStudents(list);
    }
  }, [propStudents]);

  // Filter students in current class to suggest name & number (sorted strictly by student number)
  const classStudents = (propStudents || availableStudents)
    .filter(s => s.grade === grade && s.classNum === classNum)
    .sort((a, b) => a.number - b.number);

  const handleSelectPreRegistered = (s: Student) => {
    setNumber(s.number);
    setName(s.name);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }

    if (pin.length !== 4) {
      setError('4자리 PIN 비밀번호를 입력해 주세요.');
      return;
    }

    const student = findStudentForLogin(grade, classNum, number, name);

    if (!student) {
      setError('등록된 학생 정보를 찾을 수 없습니다. 학년(1~2), 반(1~2), 번호(1~21), 이름을 다시 확인해 주세요. (미등록 시 체육 선생님께 문의하세요)');
      return;
    }

    if (student.pin !== pin) {
      setError('비밀번호(PIN)가 일치하지 않습니다. (초기 비밀번호는 0000입니다. 분실 시 선생님께 초기화를 요청하세요)');
      return;
    }

    onLoginSuccess(student);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Athletic Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-bold mb-3 shadow-sm">
            <GraduationCap className="w-4 h-4 text-[#00B4D8]" />
            <span>신안해양과학고등학교 건강체력교실</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            학생 간편 로그인
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            학년, 반, 번호, 성명과 4자리 PIN 번호로 즉시 로그인하세요.
          </p>
        </div>

        {/* Main Login Box */}
        <div 
          id="student-login-box" 
          className="bg-[#14213D] border border-[#1E3A5F] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4D8] via-[#FF4B4B] to-[#00B4D8]" />

          {/* School Badge Bar */}
          <div className="flex items-center justify-between bg-[#0B132B] p-3 rounded-xl border border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8]">
                <School className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-white block">
                  신안해양과학고등학교
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  1·2학년 (1반, 2반 / 1~21번)
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30">
              PAPS 체육
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-[#FF4B4B] font-medium leading-relaxed flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Grade, Class, Number Grids */}
            <div className="grid grid-cols-3 gap-3">
              {/* Grade Selector (1학년, 2학년) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  학년
                </label>
                <select
                  id="grade-select"
                  value={grade}
                  onChange={(e) => {
                    const newG = Number(e.target.value);
                    setGrade(newG);
                    setName('');
                  }}
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none cursor-pointer"
                >
                  <option value={1}>1학년</option>
                  <option value={2}>2학년</option>
                </select>
              </div>

              {/* Class Selector (1반, 2반) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  반
                </label>
                <select
                  id="class-select"
                  value={classNum}
                  onChange={(e) => {
                    const newC = Number(e.target.value);
                    setClassNum(newC);
                    setName('');
                  }}
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none cursor-pointer"
                >
                  <option value={1}>1반</option>
                  <option value={2}>2반</option>
                </select>
              </div>

              {/* Number Selector (1번 ~ 21번) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  번호 (1~21)
                </label>
                <select
                  id="number-select"
                  value={number}
                  onChange={(e) => {
                    const newN = Number(e.target.value);
                    setNumber(newN);
                    // If a student exists with this number, auto-fill name
                    const matched = classStudents.find(cs => cs.number === newN);
                    if (matched) setName(matched.name);
                  }}
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none cursor-pointer"
                >
                  {Array.from({ length: 21 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}번
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Registered Student Quick Suggestions for mobile ease */}
            {classStudents.length > 0 && (
              <div className="bg-[#0B132B]/70 p-3 rounded-2xl border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00B4D8] inline-block animate-pulse" />
                    <span>{grade}학년 {classNum}반 학생 명단 ({classStudents.length}명):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">이름 터치 시 자동선택</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {classStudents.map((cs) => {
                    const isSelected = name === cs.name && number === cs.number;
                    return (
                      <button
                        key={cs.id}
                        type="button"
                        onClick={() => handleSelectPreRegistered(cs)}
                        className={`text-xs px-2 py-1.5 rounded-lg border transition text-center truncate ${
                          isSelected
                            ? 'bg-[#00B4D8] text-[#0B132B] border-[#00B4D8] font-black shadow-sm'
                            : 'bg-[#14213D] text-slate-200 border-slate-700/80 hover:border-[#00B4D8]/60 hover:text-white'
                        }`}
                        title={`${cs.number}번 ${cs.name}`}
                      >
                        <span className="text-[10px] text-slate-400 mr-1 font-mono">{cs.number}번</span>
                        <span className="font-semibold">{cs.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                학생 성명 (이름)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserCircle className="w-4 h-4" />
                </div>
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 곽승준 (또는 상단 명단 클릭)"
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] rounded-xl pl-10 pr-4 py-3 text-white text-sm font-bold placeholder:text-slate-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  PIN 비밀번호 (4자리)
                </label>
                <span className="text-[11px] text-[#00B4D8] font-medium">초기 비밀번호: 0000</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="student-pin-input"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="4자리 숫자 입력"
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] rounded-xl pl-10 pr-4 py-3 text-white text-base tracking-[0.3em] font-mono outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="student-login-submit-btn"
              type="submit"
              className="w-full mt-3 bg-gradient-to-r from-[#00B4D8] to-[#0096c7] hover:from-[#00B4D8]/90 hover:to-[#0096c7]/90 text-[#0B132B] font-black py-3.5 px-4 rounded-xl shadow-lg shadow-[#00B4D8]/20 flex items-center justify-center gap-2 text-base transition touch-press-scale"
            >
              <UserCheck className="w-5 h-5" />
              <span>체력교실 입장하기</span>
            </button>
          </form>

          {/* Teacher Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              id="switch-to-teacher-login-btn"
              type="button"
              onClick={onOpenTeacherMode || onOpenTeacherLogin}
              className="text-xs text-slate-400 hover:text-[#00B4D8] font-medium transition inline-flex items-center gap-1.5"
            >
              <span>체육교사이신가요?</span>
              <span className="text-[#00B4D8] font-semibold underline underline-offset-4">
                교사용 대시보드 로그인 →
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Helper Info */}
        <div className="mt-5 text-center text-xs text-slate-400">
          💡 첫 방문 학생은 초기 비밀번호 <span className="text-white font-mono font-bold">0000</span>으로 로그인 후 본인 비밀번호를 설정하세요.
        </div>
      </div>
    </div>
  );
};
