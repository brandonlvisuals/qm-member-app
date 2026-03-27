'use client';

import { useState } from 'react';
import { classes, openingHours, DAYS_ORDER } from '@/lib/data';

const levelColors: Record<string, string> = {
  'Nybörjare': 'bg-green-500/10 text-green-400',
  'Fortsättning': 'bg-yellow-500/10 text-yellow-400',
  'Avancerad': 'bg-red-500/10 text-red-400',
  'Alla nivåer': 'bg-blue-500/10 text-blue-400',
};

// Map Swedish day names to JS getDay() index (0=Sun)
const dayToJsDay: Record<string, number> = {
  'Måndag': 1, 'Tisdag': 2, 'Onsdag': 3, 'Torsdag': 4,
  'Fredag': 5, 'Lördag': 6, 'Söndag': 0,
};

function getDateForDay(dayName: string): Date {
  const today = new Date();
  const todayJs = today.getDay(); // 0=Sun, 1=Mon…
  // Find Monday of this week
  const daysSinceMonday = todayJs === 0 ? 6 : todayJs - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);
  // Offset from Monday (Mon=0 … Sun=6)
  const targetJs = dayToJsDay[dayName];
  const daysFromMonday = targetJs === 0 ? 6 : targetJs - 1;
  const result = new Date(monday);
  result.setDate(monday.getDate() + daysFromMonday);
  return result;
}

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}`;
}

export default function SchemaPage() {
  const today = new Date();
  const todaySwedish = today.toLocaleDateString('sv-SE', { weekday: 'long' });
  const todayCapitalized = todaySwedish.charAt(0).toUpperCase() + todaySwedish.slice(1);

  const [selectedDay, setSelectedDay] = useState(todayCapitalized);

  const dayTabs = DAYS_ORDER.map((day) => ({
    day,
    dateStr: formatDate(getDateForDay(day)),
  }));

  const selectedClasses = classes
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Schema</h1>
        <p className="text-[#737373]">Öppettider och klasser för veckan.</p>
      </div>

      {/* Day tab navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
        {dayTabs.map(({ day, dateStr }) => {
          const isActive = day === selectedDay;
          const isToday = day === todayCapitalized;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 flex flex-col items-center px-4 py-3 rounded-xl transition-colors border min-w-[88px] ${
                isActive
                  ? 'bg-[#B68D96] text-white border-[#B68D96]'
                  : 'bg-[#111111] text-[#a3a3a3] border-[#2a2a2a] hover:border-[#B68D96]/40 hover:text-white'
              }`}
            >
              <span className={`text-xs font-medium tabular-nums ${
                isActive ? 'text-white/70' : isToday ? 'text-[#B68D96]' : 'text-[#525252]'
              }`}>
                {dateStr}
              </span>
              <span className="text-sm font-semibold mt-0.5">{day}</span>
              {/* Today indicator dot when not active */}
              {isToday && !isActive && (
                <span className="w-1 h-1 rounded-full bg-[#B68D96] mt-1.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class list */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-bold">{selectedDay}</h2>
            {selectedDay === todayCapitalized && (
              <span className="bg-[#B68D96]/10 text-[#B68D96] text-xs font-semibold px-2 py-0.5 rounded-full">
                Idag
              </span>
            )}
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {selectedClasses.length === 0 ? (
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-10 text-center">
              <p className="text-[#525252] text-sm italic">Inga klasser {selectedDay.toLowerCase()}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-start gap-4 bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#404040] transition-colors"
                >
                  {/* Time */}
                  <div className="shrink-0 text-center w-16">
                    <div className="text-sm font-bold text-white">{cls.startTime}</div>
                    <div className="text-xs text-[#525252]">{cls.endTime}</div>
                  </div>
                  <div className="w-px bg-[#2a2a2a] self-stretch" />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className="font-semibold">{cls.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[cls.level]}`}>
                        {cls.level}
                      </span>
                    </div>
                    <div className="text-xs text-[#737373] mt-1">
                      {cls.instructor} · {cls.location}
                    </div>
                    <div className="text-xs text-[#525252] mt-1">
                      {cls.spotsLeft} av {cls.spots} platser kvar
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Opening hours */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 lg:sticky lg:top-24">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-[#737373] mb-5">Öppettider</h2>
            <div className="space-y-3">
              {openingHours.map((oh) => {
                const isToday = oh.day === todayCapitalized;
                return (
                  <div
                    key={oh.day}
                    className={`flex justify-between items-center text-sm ${
                      isToday ? 'text-white' : 'text-[#a3a3a3]'
                    }`}
                  >
                    <span className={isToday ? 'font-semibold text-[#B68D96]' : ''}>{oh.day}</span>
                    <span className={oh.closed ? 'text-[#525252]' : ''}>
                      {oh.closed ? 'Stängt' : oh.hours}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-5 border-t border-[#2a2a2a]">
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Anläggningen är öppen idag
              </div>
            </div>
          </div>

          {/* Level legend */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-[#737373] mb-4">Nivåer</h2>
            <div className="space-y-2.5">
              {Object.entries(levelColors).map(([level, color]) => (
                <div key={level} className="flex items-center gap-2 text-sm">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
