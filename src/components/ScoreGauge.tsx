import React from 'react';

export default function ScoreGauge({ score }: { score: number }) {
  const strokeDasharray = 251.2; // Circumference for r=40
  const offset = strokeDasharray - (score / 100) * strokeDasharray;

  let color = "stroke-red-500";
  if (score > 50) color = "stroke-yellow-500";
  if (score > 80) color = "stroke-emerald-500";

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64" cy="64" r="40"
          className="stroke-slate-800 fill-none"
          strokeWidth="8"
        />
        <circle
          cx="64" cy="64" r="40"
          className={`${color} fill-none transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Score</span>
      </div>
    </div>
  );
}
