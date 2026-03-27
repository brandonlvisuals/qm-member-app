'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken.');
      return;
    }
    if (password !== confirm) {
      setError('Lösenorden matchar inte.');
      return;
    }

    setLoading(true);
    const ok = await register(name, email, password);
    setLoading(false);

    if (ok) {
      router.push('/medlemskap');
    } else {
      setError('Det finns redan ett konto med den e-postadressen.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-[#B68D96] mb-2">QM</div>
          <h1 className="text-2xl font-bold">Skapa konto</h1>
          <p className="text-[#737373] text-sm mt-1">Bli en del av Quality Movement</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#a3a3a3] mb-2">Namn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Förnamn Efternamn"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#B68D96] focus:outline-none rounded-lg px-4 py-3 text-sm transition-colors placeholder:text-[#404040]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a3a3a3] mb-2">E-postadress</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="din@email.se"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#B68D96] focus:outline-none rounded-lg px-4 py-3 text-sm transition-colors placeholder:text-[#404040]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a3a3a3] mb-2">Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minst 6 tecken"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#B68D96] focus:outline-none rounded-lg px-4 py-3 text-sm transition-colors placeholder:text-[#404040]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a3a3a3] mb-2">Bekräfta lösenord</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Upprepa lösenordet"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#B68D96] focus:outline-none rounded-lg px-4 py-3 text-sm transition-colors placeholder:text-[#404040]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B68D96] hover:bg-[#9e7880] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </button>

          <p className="text-xs text-center text-[#525252]">
            Genom att registrera dig godkänner du våra{' '}
            <span className="text-[#737373]">användarvillkor</span>.
          </p>
        </form>

        <p className="text-center text-sm text-[#737373] mt-6">
          Har du redan ett konto?{' '}
          <Link href="/login" className="text-[#B68D96] hover:text-[#9e7880] font-medium transition-colors">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  );
}
