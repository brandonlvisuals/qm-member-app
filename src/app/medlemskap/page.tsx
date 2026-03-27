'use client';

import { useAuth } from '@/lib/auth';
import { memberships, MembershipTier } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function MedlemskapPage() {
  const { user, updateMembership } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<MembershipTier | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (tier: MembershipTier) => {
    if (!user) {
      router.push('/register');
      return;
    }
    setSelected(tier);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (!selected) return;
    updateMembership(selected);
    setConfirmed(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Välj ditt medlemskap</h1>
        <p className="text-[#737373] text-lg max-w-xl mx-auto">
          Alla medlemskap inkluderar fri tillgång till anläggningen under öppettider. Ingen bindningstid.
        </p>
        {user?.membership && (
          <div className="inline-flex items-center gap-2 mt-4 bg-[#B68D96]/10 text-[#B68D96] text-sm font-medium px-4 py-2 rounded-full">
            Ditt nuvarande: <span className="font-bold">{memberships.find(m => m.id === user.membership)?.name}</span>
          </div>
        )}
      </div>

      {/* Membership cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {memberships.map((m) => {
          const isCurrent = user?.membership === m.id;
          const isSelected = selected === m.id;

          return (
            <div
              key={m.id}
              className={`relative rounded-2xl p-6 border flex flex-col transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#B68D96] bg-[#B68D96]/5 ring-1 ring-[#B68D96]/30'
                  : m.popular
                  ? 'border-[#B68D96]/50 bg-[#111111]'
                  : 'border-[#2a2a2a] bg-[#111111] hover:border-[#404040]'
              }`}
              onClick={() => handleSelect(m.id)}
            >
              {m.popular && !isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B68D96] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Populärast
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Ditt val
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">{m.name}</h3>
                <div className="text-3xl font-bold text-[#B68D96]">
                  {m.price} kr
                  <span className="text-sm font-normal text-[#737373]"> /mån</span>
                </div>
                <p className="text-[#737373] text-xs mt-2">{m.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {m.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#a3a3a3]">
                    <span className="text-[#B68D96] mt-0.5 shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-[#B68D96] text-white'
                    : isCurrent
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : m.popular
                    ? 'bg-[#B68D96] hover:bg-[#9e7880] text-white'
                    : 'border border-[#2a2a2a] hover:border-[#404040] text-white'
                }`}
              >
                {isCurrent ? 'Aktivt' : isSelected ? '✓ Valt' : `Välj ${m.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm section */}
      {selected && !confirmed && (
        <div className="max-w-md mx-auto bg-[#111111] border border-[#B68D96]/30 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Bekräfta ditt val</h3>
          <p className="text-[#737373] text-sm mb-4">
            Du har valt{' '}
            <span className="text-white font-semibold">
              {memberships.find((m) => m.id === selected)?.name}
            </span>{' '}
            för{' '}
            <span className="text-[#B68D96] font-semibold">
              {memberships.find((m) => m.id === selected)?.price} kr/mån
            </span>
            .
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 border border-[#2a2a2a] hover:border-[#404040] text-[#a3a3a3] hover:text-white py-2.5 rounded-xl text-sm transition-colors"
            >
              Avbryt
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[#B68D96] hover:bg-[#9e7880] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Bekräfta
            </button>
          </div>
        </div>
      )}

      {confirmed && (
        <div className="max-w-md mx-auto text-center py-6">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="font-bold text-xl text-[#B68D96] mb-2">Välkommen!</h3>
          <p className="text-[#737373] text-sm">Ditt medlemskap är aktiverat. Skickar dig vidare...</p>
        </div>
      )}

      {/* No account banner */}
      {!user && (
        <div className="text-center mt-8 pt-8 border-t border-[#2a2a2a]">
          <p className="text-[#737373] mb-4">
            Skapa ett konto för att köpa ett medlemskap.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="bg-[#B68D96] hover:bg-[#9e7880] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              Registrera dig
            </Link>
            <Link href="/login" className="border border-[#2a2a2a] hover:border-[#404040] text-white px-6 py-3 rounded-xl text-sm transition-colors">
              Logga in
            </Link>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Vanliga frågor</h2>
        <div className="space-y-4">
          {[
            { q: 'Vad är uppsägningstiden?', a: '3 månaders uppsägningstid gäller för alla medlemskap.' },
            { q: 'Kan jag byta nivå?', a: 'Ja, du kan uppgradera eller nedgradera när du vill. Ändringen träder i kraft nästkommande kalendermånad.' },
            { q: 'Vad händer om jag missar en klass?', a: 'Du kan avboka upp till 2 timmar innan klassen börjar utan avgift.' },
            { q: 'Vad är Chase Tag-lagrabatt?', a: 'Om ni är 4 eller fler personer som alla skaffar ett aktivt medlemskap får ni 100 kr rabatt var.' },
          ].map((item) => (
            <div key={item.q} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2">{item.q}</h3>
              <p className="text-[#737373] text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
