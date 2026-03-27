import Link from 'next/link';
import { memberships } from '@/lib/data';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B68D96]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#B68D96]/10 text-[#B68D96] text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B68D96]"></span>
              Parkourorganisation sedan 2008
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
              Rör dig fritt.<br />
              <span className="text-[#B68D96]">Var utan gränser.</span>
            </h1>
            <p className="text-[#a3a3a3] text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Quality Movement är parkourföreningen med Stockholms främsta parkourhall. Vi erbjuder klasser för alla nivåer – från nybörjare till avancerade utövare.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="bg-[#B68D96] hover:bg-[#9e7880] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Bli medlem idag
              </Link>
              <Link
                href="/schema"
                className="border border-[#2a2a2a] hover:border-[#404040] text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Se schema
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {[
            { value: '500+', label: 'Aktiva medlemmar' },
            { value: '12+', label: 'Klasser per vecka' },
            { value: '6', label: 'Instruktörer' },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="text-3xl font-bold text-[#B68D96]">{stat.value}</div>
              <div className="text-sm text-[#737373] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold mb-3">Vad vi erbjuder</h2>
        <p className="text-[#737373] mb-10 max-w-lg">Träning, gemenskap och möjligheter att växa – oavsett din erfarenhetsnivå.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: '🤸',
              title: 'Parkourklasser',
              desc: 'Strukturerade klasser för nybörjare, medelnivå och avancerade utövare med erfarna instruktörer.',
            },
            {
              icon: '📅',
              title: 'Flexibelt schema',
              desc: 'Välj bland klasser alla veckodagar – tidig morgon till sen kväll. Boka enkelt i appen.',
            },
            {
              icon: '💪',
              title: 'Open Gym',
              desc: 'Träna fritt på egen hand med handledare på plats. Perfekt för att öva på egna projekt.',
            },
            {
              icon: '👨‍👩‍👧‍👦',
              title: 'Familjeträning',
              desc: 'Träna hela familjen tillsammans varje lördag. Kul aktiviteter för alla åldrar.',
            },
            {
              icon: '🏆',
              title: 'Tävlingsförberedelse',
              desc: 'Specialträning och workshops för dig som vill tävla på hög nivå.',
            },
            {
              icon: '🌍',
              title: 'Gemenskap',
              desc: 'Bli en del av en aktiv och välkomnande gemenskap av rörelsemänniskor.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#404040] transition-colors">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-[#737373] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership preview */}
      <section className="bg-[#0d0d0d] border-y border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Medlemskap</h2>
              <p className="text-[#737373]">Välj det som passar dig bäst.</p>
            </div>
            <Link href="/medlemskap" className="text-[#B68D96] hover:text-[#9e7880] text-sm font-medium transition-colors">
              Se alla detaljer →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberships.map((m) => (
              <div
                key={m.id}
                className={`relative rounded-xl p-5 border ${
                  m.popular
                    ? 'border-[#B68D96] bg-[#B68D96]/5'
                    : 'border-[#2a2a2a] bg-[#111111]'
                }`}
              >
                {m.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B68D96] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Populärast
                  </div>
                )}
                <div className="font-bold text-lg mb-1">{m.name}</div>
                <div className="text-2xl font-bold text-[#B68D96] mb-1">
                  {m.price} kr
                  <span className="text-sm font-normal text-[#737373]"> /mån</span>
                </div>
                <p className="text-[#737373] text-xs mb-4">{m.description}</p>
                <Link
                  href="/medlemskap"
                  className={`block text-center text-sm font-medium py-2 rounded-lg transition-colors ${
                    m.popular
                      ? 'bg-[#B68D96] hover:bg-[#9e7880] text-white'
                      : 'border border-[#2a2a2a] hover:border-[#404040] text-white'
                  }`}
                >
                  Välj {m.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Redo att börja röra dig?</h2>
        <p className="text-[#737373] text-lg mb-8 max-w-md mx-auto">
          Registrera dig idag och få tillgång till alla klasser, schema och bokningar.
        </p>
        <Link
          href="/register"
          className="inline-block bg-[#B68D96] hover:bg-[#9e7880] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
        >
          Kom igång gratis
        </Link>
      </section>
    </div>
  );
}
