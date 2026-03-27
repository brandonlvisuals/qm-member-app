import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="font-bold text-lg mb-2">
              <span className="text-[#B68D96]">QM</span> Quality Movement
            </div>
            <p className="text-[#737373] text-sm leading-relaxed">
              Parkourförening i världsklass. Vi tränar rörelse, kreativitet och gemenskap.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#737373] mb-3">Snabblänkar</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schema" className="text-[#a3a3a3] hover:text-white transition-colors">Schema</Link></li>
              <li><Link href="/boka" className="text-[#a3a3a3] hover:text-white transition-colors">Boka klass</Link></li>
              <li><Link href="/medlemskap" className="text-[#a3a3a3] hover:text-white transition-colors">Medlemskap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#737373] mb-3">Kontakt</h3>
            <ul className="space-y-2 text-sm text-[#a3a3a3]">
              <li>info@qualitymovement.se</li>
              <li>070-332 82 50</li>
              <li>Gjutmästare Rosbergs väg 7, 176 69 Järfälla</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2a2a2a] mt-8 pt-6 text-center text-sm text-[#525252]">
          © {new Date().getFullYear()} Quality Movement. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}
