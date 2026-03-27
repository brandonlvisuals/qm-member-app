'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { classes, ClassSession } from '@/lib/data';
import Link from 'next/link';

const levelColors: Record<string, string> = {
  'Nybörjare': 'bg-green-500/10 text-green-400',
  'Fortsättning': 'bg-yellow-500/10 text-yellow-400',
  'Avancerad': 'bg-red-500/10 text-red-400',
  'Alla nivåer': 'bg-blue-500/10 text-blue-400',
};

const bookableClasses = classes.filter((c) => c.bookable);

export default function BokaPage() {
  const { user, bookClass, cancelClass } = useAuth();
  const router = useRouter();
  const [booked, setBooked] = useState<string | null>(null);

  const handleBook = (cls: ClassSession) => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.membership) {
      router.push('/medlemskap');
      return;
    }
    bookClass(cls.id);
    setBooked(cls.id);
    setTimeout(() => setBooked(null), 2500);
  };

  const isBooked = (classId: string) => user?.bookedClasses.includes(classId) ?? false;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Boka pass</h1>
        <p className="text-[#737373]">
          Dessa pass ingår i Silver-, Guld- och Platinum-medlemskapet och bokas inför varje tillfälle.
        </p>
      </div>

      {/* No membership banner */}
      {user && !user.membership && (
        <div className="bg-[#B68D96]/10 border border-[#B68D96]/20 rounded-xl px-5 py-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[#B68D96] text-sm font-medium">Du behöver ett aktivt Silver-medlemskap eller högre för att boka pass.</p>
          <Link
            href="/medlemskap"
            className="bg-[#B68D96] hover:bg-[#9e7880] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Välj medlemskap
          </Link>
        </div>
      )}

      {!user && (
        <div className="bg-[#B68D96]/10 border border-[#B68D96]/20 rounded-xl px-5 py-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-[#B68D96] text-sm font-medium">Logga in för att boka pass.</p>
          <Link
            href="/login"
            className="bg-[#B68D96] hover:bg-[#9e7880] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Logga in
          </Link>
        </div>
      )}

      {/* Class list */}
      <div className="flex flex-col gap-4">
        {bookableClasses.map((cls) => {
          const alreadyBooked = isBooked(cls.id);
          const justBooked = booked === cls.id;
          const full = cls.spotsLeft === 0;

          return (
            <div
              key={cls.id}
              className={`bg-[#111111] border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${
                alreadyBooked ? 'border-[#B68D96]/40' : 'border-[#2a2a2a] hover:border-[#404040]'
              }`}
            >
              {/* Info */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{cls.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[cls.level]}`}>
                    {cls.level}
                  </span>
                </div>
                <div className="text-xs text-[#737373] flex flex-wrap gap-x-4 gap-y-1">
                  <span>📅 {cls.day} · {cls.startTime}–{cls.endTime}</span>
                  <span>👤 {cls.instructor}</span>
                  <span>📍 {cls.location}</span>
                </div>
                <p className="text-xs text-[#525252] leading-relaxed">{cls.description}</p>

                {/* Spots bar */}
                <div className="flex items-center gap-3 text-xs">
                  <span className={full ? 'text-red-400' : 'text-[#737373]'}>
                    {full ? 'Fullbokad' : `${cls.spotsLeft} / ${cls.spots} platser kvar`}
                  </span>
                  <div className="w-24 h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        cls.spotsLeft / cls.spots > 0.5 ? 'bg-green-500' :
                        cls.spotsLeft / cls.spots > 0.2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(cls.spotsLeft / cls.spots) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="sm:shrink-0">
                {alreadyBooked ? (
                  <button
                    onClick={() => cancelClass(cls.id)}
                    className="w-full sm:w-auto text-sm text-[#737373] hover:text-red-400 border border-[#2a2a2a] hover:border-red-400/30 px-6 py-2 rounded-lg transition-colors"
                  >
                    {justBooked ? '✓ Bokad!' : 'Avboka'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBook(cls)}
                    disabled={full}
                    className={`w-full sm:w-auto text-sm font-semibold px-6 py-2 rounded-lg transition-colors ${
                      full
                        ? 'bg-[#1a1a1a] text-[#525252] cursor-not-allowed'
                        : 'bg-[#B68D96] hover:bg-[#9e7880] text-white'
                    }`}
                  >
                    {full ? 'Fullbokad' : 'Boka'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Term classes section */}
      <div className="mt-12 pt-10 border-t border-[#2a2a2a]">
        <h2 className="text-xl font-bold mb-1">Terminkurser</h2>
        <p className="text-[#737373] text-sm mb-5">
          Vill du anmäla dig eller ditt barn till en av våra strukturerade terminkurser?
          Vi erbjuder kurser i vårt parkourgym i Järfälla samt 12+ lokala kurser runtom i Stockholm.
        </p>
        <a
          href="https://qualitymovement.se/kursanmalan-2/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#B68D96]/50 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors group"
        >
          Se alla terminkurser & anmäl dig
          <span className="text-[#737373] group-hover:text-[#B68D96] transition-colors">→</span>
        </a>
      </div>
    </div>
  );
}
