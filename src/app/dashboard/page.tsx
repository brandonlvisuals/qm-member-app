'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { classes, memberships } from '@/lib/data';

export default function DashboardPage() {
  const { user, isLoading, cancelClass } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-[#737373]">Laddar...</div>
      </div>
    );
  }

  const currentMembership = memberships.find((m) => m.id === user.membership);
  const bookedClasses = classes.filter((c) => user.bookedClasses.includes(c.id));
  const joinDate = new Date(user.joinedDate).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Hej, {user.name.split(' ')[0]}!</h1>
        <p className="text-[#737373]">Välkommen till din sida.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#737373]">Profil</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#B68D96]/10 text-[#B68D96] flex items-center justify-center text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-[#737373]">{user.email}</div>
              </div>
            </div>
            <div className="text-xs text-[#525252]">Medlem sedan {joinDate}</div>
          </div>

          {/* Membership card */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#737373]">Medlemskap</h2>
            {currentMembership ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg">{currentMembership.name}</span>
                  <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full font-medium">Aktivt</span>
                </div>
                <div className="text-[#B68D96] font-semibold mb-4">
                  {currentMembership.price} kr <span className="text-[#737373] font-normal text-sm">/ månad</span>
                </div>
                <Link
                  href="/medlemskap"
                  className="block text-center text-sm border border-[#2a2a2a] hover:border-[#404040] py-2 rounded-lg transition-colors text-[#a3a3a3] hover:text-white"
                >
                  Ändra medlemskap
                </Link>
              </>
            ) : (
              <>
                <p className="text-[#737373] text-sm mb-4">Du har inget aktivt medlemskap.</p>
                <Link
                  href="/medlemskap"
                  className="block text-center text-sm bg-[#B68D96] hover:bg-[#9e7880] text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Välj medlemskap
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right column – booked classes */}
        <div className="lg:col-span-2">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-[#737373]">Mina bokade klasser</h2>
              <Link href="/boka" className="text-[#B68D96] hover:text-[#9e7880] text-sm font-medium transition-colors">
                + Boka klass
              </Link>
            </div>

            {bookedClasses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-[#737373] mb-4">Du har inga bokade klasser.</p>
                <Link
                  href="/boka"
                  className="inline-block text-sm bg-[#B68D96] hover:bg-[#9e7880] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Boka din första klass
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookedClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-start justify-between gap-4 p-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-sm">{cls.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          cls.level === 'Nybörjare' ? 'bg-green-500/10 text-green-400' :
                          cls.level === 'Fortsättning' ? 'bg-yellow-500/10 text-yellow-400' :
                          cls.level === 'Avancerad' ? 'bg-red-500/10 text-red-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {cls.level}
                        </span>
                      </div>
                      <div className="text-xs text-[#737373]">
                        {cls.day} {cls.startTime}–{cls.endTime} · {cls.instructor} · {cls.location}
                      </div>
                    </div>
                    <button
                      onClick={() => cancelClass(cls.id)}
                      className="shrink-0 text-xs text-[#737373] hover:text-red-400 transition-colors"
                    >
                      Avboka
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link
              href="/schema"
              className="bg-[#111111] border border-[#2a2a2a] hover:border-[#404040] rounded-xl p-5 transition-colors group"
            >
              <div className="text-2xl mb-2">🗓</div>
              <div className="font-semibold text-sm">Se schema</div>
              <div className="text-xs text-[#737373] mt-1">Öppettider och klasser</div>
            </Link>
            <Link
              href="/boka"
              className="bg-[#111111] border border-[#2a2a2a] hover:border-[#404040] rounded-xl p-5 transition-colors group"
            >
              <div className="text-2xl mb-2">✅</div>
              <div className="font-semibold text-sm">Boka klass</div>
              <div className="text-xs text-[#737373] mt-1">Bläddra bland klasser</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
