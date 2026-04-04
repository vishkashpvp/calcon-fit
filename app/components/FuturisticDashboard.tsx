'use client';

import { useMemo } from 'react';
import { Activity, Zap, Flame, TrendingUp, Plus, Target, Award } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  max?: string | number;
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'green' | 'pink';
  size?: 'small' | 'medium' | 'large';
}

function StatCard({ 
  label, 
  value, 
  unit, 
  max, 
  icon, 
  accentColor = 'cyan',
  size = 'medium' 
}: StatCardProps) {
  const accentClass = {
    cyan: 'accent-text',
    green: 'accent-text-secondary',
    pink: 'accent-text-tertiary'
  }[accentColor];

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }[size];

  return (
    <div className={`futuristic-card ${sizeClasses} rounded-sm border border-[var(--card-border)] backdrop-blur-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest mb-3 font-medium">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="stats-counter text-[var(--text-primary)]">
              {value}
            </span>
            {unit && <span className="text-[var(--text-secondary)] text-sm">{unit}</span>}
          </div>
          {max && (
            <p className="text-[var(--text-muted)] text-xs mt-2">
              of {max}
            </p>
          )}
        </div>
        <div className={`${accentClass} p-2`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ percentage, size = 120 }: { percentage: number; size?: number }) {
  const circumference = 2 * Math.PI * (size / 2 - 6);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 6}
        fill="none"
        stroke="var(--card-border)"
        strokeWidth="2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 6}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.23, 1, 0.320, 1)' }}
      />
      <text
        x={size / 2}
        y={size / 2 + 8}
        textAnchor="middle"
        className="stats-counter"
        fill="var(--text-primary)"
        fontSize="24"
      >
        {percentage}%
      </text>
    </svg>
  );
}

export default function FuturisticDashboard() {
  const userStats = useMemo(() => ({
    consumed: 0,
    remaining: 2061,
    total: 2061,
    protein: { current: 0, max: 155 },
    carbs: { current: 0, max: 232 },
    fat: { current: 0, max: 57 },
    meals: 0,
    streak: 0,
    xp: 0,
    level: 1
  }), []);

  const consumedPercentage = Math.round((userStats.consumed / userStats.total) * 100);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest mb-2">
              Welcome Back
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Vishnuprakash
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)]"></div>
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">
                Rookie Level • 0 Day Streak
              </span>
            </div>
          </div>
          
          <button className="self-start md:self-auto px-6 py-3 bg-[var(--accent)] text-[var(--background)] font-bold uppercase tracking-widest text-sm rounded-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            + Log Meal
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mb-12 opacity-30"></div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Daily Calorie Overview */}
          <div className="futuristic-card p-8 rounded-sm border border-[var(--card-border)] col-span-1 md:col-span-2">
            <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest mb-6 font-medium">
              Daily Progress
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Progress Ring */}
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <ProgressRing percentage={consumedPercentage} size={140} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-[var(--text-secondary)]">calories</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="border-b border-[var(--card-border)] pb-4">
                    <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest mb-2">
                      Consumed
                    </p>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                      {userStats.consumed} <span className="text-sm text-[var(--text-secondary)]">kcal</span>
                    </p>
                  </div>
                  <div className="border-b border-[var(--card-border)] pb-4">
                    <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest mb-2">
                      Remaining
                    </p>
                    <p className="text-2xl font-bold accent-text">
                      {userStats.remaining} <span className="text-sm text-[var(--text-secondary)]">kcal</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="mb-12">
          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest mb-4 font-medium">
            Macronutrient Composition
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Protein"
              value={userStats.protein.current}
              unit={`/${userStats.protein.max}g`}
              icon={<Activity size={20} />}
              accentColor="cyan"
            />
            <StatCard
              label="Carbohydrates"
              value={userStats.carbs.current}
              unit={`/${userStats.carbs.max}g`}
              icon={<Flame size={20} />}
              accentColor="green"
            />
            <StatCard
              label="Fat"
              value={userStats.fat.current}
              unit={`/${userStats.fat.max}g`}
              icon={<Zap size={20} />}
              accentColor="pink"
            />
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="mb-12">
          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest mb-4 font-medium">
            Activity Metrics
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Meals Logged"
              value={userStats.meals}
              icon={<Target size={20} />}
              accentColor="cyan"
            />
            <StatCard
              label="Current Streak"
              value={userStats.streak}
              unit="days"
              icon={<TrendingUp size={20} />}
              accentColor="green"
            />
            <StatCard
              label="Experience Points"
              value={userStats.xp}
              icon={<Award size={20} />}
              accentColor="pink"
            />
          </div>
        </div>

        {/* Empty State Message */}
        <div className="futuristic-card p-8 rounded-sm border border-[var(--card-border)] text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--hover)] flex items-center justify-center">
              <Activity className="text-[var(--accent)] opacity-60" size={24} />
            </div>
          </div>
          <p className="text-[var(--text-secondary)] uppercase tracking-widest text-sm font-medium">
            No meals logged yet — Start tracking to unlock your potential
          </p>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="futuristic-card p-6 rounded-sm border border-[var(--card-border)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest font-medium">
                Progression
              </p>
              <span className="text-[var(--accent)] text-xs font-bold">Level 1</span>
            </div>
            <p className="text-3xl font-bold mb-2">Rookie</p>
            <div className="w-full h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"></div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">25% until next level</p>
          </div>

          <div className="futuristic-card p-6 rounded-sm border border-[var(--card-border)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[var(--text-secondary)] text-xs uppercase tracking-widest font-medium">
                Statistics
              </p>
              <span className="text-[var(--accent-secondary)] text-xs font-bold">0 Days</span>
            </div>
            <p className="text-3xl font-bold mb-2 accent-text-secondary">0</p>
            <p className="text-xs text-[var(--text-muted)]">
              Keep logging meals to build your streak and earn achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
