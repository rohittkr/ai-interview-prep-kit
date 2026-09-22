'use client';

import { useEffect, useState } from 'react';
import { api, token } from '../lib/api';
import Link from 'next/link';

export default function Home() {
  const [kits, setKits] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const savedToken = token();

    if (!savedToken) {
      setLoggedIn(false);
      return;
    }

    setLoggedIn(true);

    api('/kits')
      .then(setKits)
      .catch(() => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setErr('Please log in to view your kits.');
      });
  }, []);

  function logout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setKits([]);
    setErr('');
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Interview Prep Kit</h1>
          <p className="text-gray-600 mt-1">
            Turn a JD into a research-backed preparation plan.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            className="px-4 py-2 rounded-lg bg-black text-white"
            href="/kits/new"
          >
            New kit
          </Link>

          {loggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg border"
            >
              Logout
            </button>
          ) : (
            <Link
              className="px-4 py-2 rounded-lg border"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {err && <div className="card p-4 mb-5">{err}</div>}

      <section className="grid md:grid-cols-2 gap-5">
        {kits.map((k) => (
          <Link
            key={k._id}
            href={`/kits/${k._id}`}
            className="card p-5 hover:shadow-lg"
          >
            <h2 className="font-semibold text-lg">{k.name}</h2>
            <p className="text-sm text-gray-500 mt-2">
              {k.kit?.source?.company} · {k.kit?.schedule?.days_available} days
            </p>
          </Link>
        ))}

        {!kits.length && !err && loggedIn && (
          <div className="card p-8 text-gray-500">
            No kits yet. Create your first one.
          </div>
        )}

        {!loggedIn && (
          <div className="card p-8 text-gray-500">
            Log in to view your interview kits.
          </div>
        )}
      </section>
    </main>
  );
}