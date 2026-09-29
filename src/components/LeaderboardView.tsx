import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Zap, 
  Dumbbell, 
  Compass, 
  Crown, 
  Filter, 
  UserCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { LeaderboardEntry, Student, WorkoutLog } from '../types';
import { computeLeaderboard } from '../services/dataService';

interface LeaderboardViewProps {
  students: Student[];
  logs: WorkoutLog[];
  currentStudent: Student | null;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  students,
  logs,
  currentStudent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'total' | 'workouts' | 'cardio' | 'strength' | 'flexibility'>('total');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const entries: LeaderboardEntry[] = computeLeaderboard(students, logs);

  // Filter
  const filtered = entries.filter((item) => {
    if (gradeFilter !== 'all' && item.grade !== Number(gradeFilter)) return false;
    if (genderFilter !== 'all' && item.gender !== genderFilter) return false;
    return true;
  });

  // Sort according to category
  const sorted = [...filtered].sort((a, b) => {
    if (selectedCategory === 'total') return b.totalScore - a.totalScore;
    if (selectedCategory === 'workouts') return b.totalWorkouts - a.totalWorkouts;
    if (selectedCategory === 'cardio') return b.cardioScore - a.cardioScore;
    if (selectedCategory === 'strength') return b.strengthScore - a.strengthScore;
    if (selectedCategory === 'flexibility') return b.flexibilityScore - a.flexibilityScore;
    return 0;
  });

  const top3 = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'total':
        return { name: '종합 체력왕 누적 랭킹', desc: 'PAPS 등급 점수와 전 종목 누적 운동 가산점을 종합한 누적 랭킹입니다.', icon: Crown };
      case 'workouts':
        return { name: '전체 운동 누적 횟수 랭킹', desc: '건강체력교실 전 종목 누적 실천 횟수 랭킹입니다.', icon: Flame };
      case 'cardio':
        return { name: '심폐지구력 누적 기록 랭킹', desc: '심폐지구력 누적 기록 랭킹입니다.', icon: Zap };
      case 'strength':
        return { name: '근력 및 근지구력 랭킹', desc: '근력 및 근지구력 랭킹입니다.', icon: Dumbbell };
      case 'flexibility':
        return { name: '유연성 누적 기록 랭킹', desc: '유연성 종목 누적 기록 랭킹입니다.', icon: Compass };
    }
  };

  const currentCategoryInfo = getCategoryTitle();

  const getMetricDisplay = (entry: LeaderboardEntry) => {
    switch (selectedCategory) {
      case 'total':
        return `${entry.totalScore}점`;
      case 'workouts':
        return `${entry.totalWorkouts}회 달성`;
      case 'cardio':
        return `${entry.cardioScore}초/회`;
      case 'strength':
        return `${entry.strengthScore}회`;
      case 'flexibility':
        return `${entry.flexibilityScore}초/cm`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'total', label: '👑 종합 체력 누적 랭킹', icon: Crown },
          { id: 'workouts', label: '🔥 전체 누적 횟수 랭킹', icon: Flame },
          { id: 'cardio', label: '⚡ 심폐지구력 누적 랭킹', icon: Zap },
          { id: 'strength', label: '💪 근력 및 근지구력 랭킹', icon: Dumbbell },
          { id: 'flexibility', label: '🧘 유연성 누적 랭킹', icon: Compass },
        ].map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              id={`leaderboard-tab-${tab.id}`}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                isActive
                  ? 'bg-[#00B4D8] text-[#0B132B] border-[#00B4D8] shadow-md shadow-[#00B4D8]/20'
                  : 'bg-[#14213D] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Header Info & Filters */}
      <div className="bg-[#14213D] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00B4D8] mb-1">
            <Trophy className="w-4 h-4 text-[#00B4D8]" />
            <span>건강체력교실 명예의 전당</span>
          </div>
          <h2 className="text-2xl font-black text-white">{currentCategoryInfo.name}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentCategoryInfo.desc}</p>
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-[#0B132B] px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-grade-select"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              <option value="all">전체 학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </div>

          <div className="bg-[#0B132B] px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <select
              id="filter-gender-select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              <option value="all">전체 성별</option>
              <option value="M">남학생</option>
              <option value="F">여학생</option>
            </select>
          </div>
        </div>
      </div>

      {/* Podium (Top 3 Visual Display) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div 
              id="podium-rank-2"
              className="bg-[#14213D] border border-slate-600/50 rounded-2xl p-5 shadow-xl flex flex-col items-center justify-between text-center relative order-2 md:order-1"
            >
              <div className="w-12 h-12 rounded-full bg-slate-300 text-slate-900 font-black text-lg flex items-center justify-center shadow-lg mb-3">
                🥈 2
              </div>
              <div className="text-base font-extrabold text-white">{top3[1].name}</div>
              <div className="text-xs text-slate-400 mb-3">
                {top3[1].grade}학년 {top3[1].classNum}반 ({top3[1].number}번)
              </div>
              <div className="w-full bg-[#0B132B] py-2 rounded-xl text-sm font-black text-slate-300 font-mono">
                {getMetricDisplay(top3[1])}
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Center & Highlighted) */}
          {top3[0] && (
            <div 
              id="podium-rank-1"
              className="bg-gradient-to-b from-[#1E3A5F] via-[#14213D] to-[#14213D] border-2 border-amber-400/70 rounded-3xl p-6 shadow-2xl shadow-amber-400/10 flex flex-col items-center justify-between text-center relative order-1 md:order-2 scale-105"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xl shadow-amber-400/30 mb-3">
                👑 1
              </div>
              <div className="text-lg font-black text-white">{top3[0].name}</div>
              <div className="text-xs text-amber-300 font-semibold mb-3">
                {top3[0].grade}학년 {top3[0].classNum}반 ({top3[0].number}번)
              </div>
              <div className="w-full bg-[#0B132B] py-2.5 rounded-xl text-base font-black text-amber-400 font-mono border border-amber-400/30">
                {getMetricDisplay(top3[0])}
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div 
              id="podium-rank-3"
              className="bg-[#14213D] border border-amber-800/40 rounded-2xl p-5 shadow-xl flex flex-col items-center justify-between text-center relative order-3"
            >
              <div className="w-12 h-12 rounded-full bg-amber-700/60 text-amber-200 font-black text-lg flex items-center justify-center shadow-lg mb-3">
                🥉 3
              </div>
              <div className="text-base font-extrabold text-white">{top3[2].name}</div>
              <div className="text-xs text-slate-400 mb-3">
                {top3[2].grade}학년 {top3[2].classNum}반 ({top3[2].number}번)
              </div>
              <div className="w-full bg-[#0B132B] py-2 rounded-xl text-sm font-black text-amber-300 font-mono">
                {getMetricDisplay(top3[2])}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remaining Rankings Table */}
      <div className="bg-[#14213D] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-400 flex items-center justify-between">
          <span>전체 순위 리스트</span>
          <span>총 {sorted.length}명 참여</span>
        </div>

        <div className="divide-y divide-slate-800/70">
          {sorted.map((item, index) => {
            const isMe = currentStudent && currentStudent.id === item.studentId;
            return (
              <div
                key={item.studentId}
                id={`leaderboard-row-${item.studentId}`}
                className={`p-4 flex items-center justify-between gap-4 transition ${
                  isMe ? 'bg-[#00B4D8]/10 border-l-4 border-l-[#00B4D8]' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 text-center font-mono font-bold text-sm ${
                    index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      {isMe && (
                        <span className="text-[10px] bg-[#00B4D8] text-[#0B132B] font-extrabold px-1.5 py-0.5 rounded">
                          나
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-normal">
                        ({item.grade}학년 {item.classNum}반 {item.number}번)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      최근 활동: {item.recentActivity}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-white font-mono">
                    {getMetricDisplay(item)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    누적 {item.totalWorkouts}회 운동
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
