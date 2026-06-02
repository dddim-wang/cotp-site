import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Mail, Music2, ShoppingBag } from 'lucide-react';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const fallback = {
  merch: [
    {
      id: 1,
      name: 'LIQUID CYBER',
      price: '￥999',
      images: ['/product1.1.webp', '/product1.2.webp']
    },
    {
      id: 2,
      name: 'KATANA',
      price: '￥999',
      images: ['/product2.1.webp', '/product2.2.webp']
    },
    {
      id: 3,
      name: 'goat',
      price: '￥999',
      video: '/goat.webm'
    }
  ],
  music: [
    { id: 1, title: 'Signal / Noise', type: 'Single', year: '2026', link: '#' },
    { id: 2, title: 'Cold Frame', type: 'Demo', year: '2026', link: '#' },
    { id: 3, title: 'Live Session 01', type: 'Video', year: '2026', link: '#' }
  ]
};

function useApi(path, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetch(`${API_BASE}${path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API error'))))
      .then((json) => {
        if (alive) setData(json);
      })
      .catch(() => {
        if (alive) setData(fallbackData);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [path, fallbackData]);

  return { data, loading };
}

function App() {
  const [active, setActive] = useState('merch');

  const merch = useApi('/merch', fallback.merch);
  const music = useApi('/music', fallback.music);

  const tabs = useMemo(
    () => [
      { id: 'merch', label: 'MERCH', icon: ShoppingBag },
      { id: 'music', label: 'MUSIC', icon: Music2 },
      { id: 'contact', label: 'CONTACT', icon: Mail }
    ],
    []
  );

  return (
    <main className="site">
      <div className="grain" />
      <div className="blade blade-one" />
      <div className="blade blade-two" />

      <header className="topbar">
        <div className="mark">Cries of the Past</div>

        <div className="topbar-right">
          <video
            className="topbar-webm"
            src="/goat.webm"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="tag">
              最佳状态<br />
              最佳状态<br />
              最佳状态<br />
              最佳状态
          </div>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">OFFICIAL BAND SITE</p>

        <div className="hero-logo-wrap">
          <img className="hero-logo" src="/cotp.webp" alt="COTP logo" />
        </div>

        <p className="intro">
          A sharp digital space for merch drops, music releases, and direct contact.
        </p>
      </section>

      <nav className="nav" aria-label="Main navigation">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={active === id ? 'active' : ''}
            aria-pressed={active === id}
            onClick={() => setActive(id)}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <section className="panel">
        {active === 'merch' && <Merch items={merch.data} loading={merch.loading} />}
        {active === 'music' && <Music items={music.data} loading={music.loading} />}
        {active === 'contact' && <Contact />}
      </section>
    </main>
  );
}

function Merch({ items, loading }) {
  return (
    <div className="section-grid">
      <div className="section-copy">
        <p className="eyebrow">DROP SYSTEM</p>
        <h2>Merch with hard edges.</h2>
        <p>Replace these sample items with your real products, images, and checkout links later.</p>
      </div>

      <div className="cards">
        {items.map((item) => (
          <article className="card merch-card" key={item.id}>
            <div
              className={`product-media ${item.video ? 'is-static' : ''}`}
            >
              {item.video ? (
                <video src={item.video} autoPlay muted loop playsInline />
              ) : !item.images?.length ? (
                <span>{item.name.slice(0, 4).toUpperCase()}</span>
              ) : (
                item.images.map((src, index) => (
                  <img
                    key={src}
                    className={index === 1 ? 'alternate' : ''}
                    src={src}
                    alt={`${item.name} view ${index + 1}`}
                  />
                ))
              )}
            </div>

            <div>
              <h3>{item.name}</h3>
            </div>

            <strong>{item.price}</strong>
          </article>
        ))}

        {loading && <p className="tiny">Loading API data...</p>}
      </div>
    </div>
  );
}

function Music({ items, loading }) {
  return (
    <div className="section-grid">
      <div className="section-copy">
        <p className="eyebrow">AUDIO INDEX</p>
        <h2>Music first, no clutter.</h2>
        <p>Use the links for Spotify, Apple Music, YouTube, Bandcamp, or Bilibili embeds.</p>
      </div>

      <div className="track-list">
        {items.map((track) => (
          <a className="track" href={track.link} key={track.id}>
            <span>{String(track.id).padStart(2, '0')}</span>

            <div>
              <h3>{track.title}</h3>
              <p>{track.type} / {track.year}</p>
            </div>

            <ArrowUpRight size={18} />
          </a>
        ))}

        {loading && <p className="tiny">Loading API data...</p>}
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  async function submitForm(e) {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Submit failed');

      setStatus('Message received.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('Backend offline. Form UI is ready.');
    }
  }

  return (
    <div className="section-grid">
      <div className="section-copy">
        <p className="eyebrow">DIRECT LINE</p>
        <h2>Booking, collabs, press.</h2>
        <p>Connect the backend to email service later, such as SendGrid, Resend, or SMTP.</p>
      </div>

      <form className="contact-form" onSubmit={submitForm}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />

        <button type="submit">
          <span>SEND MESSAGE</span>
        </button>

        {status && <p className="tiny">{status}</p>}
      </form>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
