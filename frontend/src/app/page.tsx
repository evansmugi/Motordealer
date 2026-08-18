import React from 'react';
import Header from '../components/Header';
import { checkStrapiHealth, fetchStrapiCollection, StrapiItem } from '../lib/strapi';
import { 
  Sparkles, 
  Database, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Code2, 
  Layers, 
  Server,
  Terminal,
  BookOpen
} from 'lucide-react';

export const revalidate = 0; // Dynamic data fetching

export default async function HomePage() {
  const status = await checkStrapiHealth();
  const { data: articles, isFallback } = await fetchStrapiCollection('articles');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header status={status} />

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>Next.js 15 App Router + Strapi v5 Headless Architecture</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            maxWidth: '900px',
            margin: '0 auto 1.25rem'
          }}>
            Powering Digital Experiences with <span className="gradient-text">Strapi & PostgreSQL</span>
          </h1>

          <p style={{ 
            fontSize: '1.15rem', 
            color: 'var(--text-muted)', 
            maxWidth: '680px', 
            margin: '0 auto 2.5rem',
            fontWeight: 400 
          }}>
            Your client frontend is connected to your local Strapi backend server. Manage content seamlessly in the admin panel and deliver high-speed web pages.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="http://localhost:1338/admin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="gradient-button"
              style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
            >
              <span>Launch Strapi Admin</span>
              <ExternalLink size={18} />
            </a>

            <a 
              href="http://localhost:1338/api" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="secondary-button"
              style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
            >
              <Code2 size={18} />
              <span>Inspect REST API</span>
            </a>
          </div>
        </section>

        {/* CONNECTION MONITOR CARD */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Server color="#8b5cf6" size={24} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Backend Infrastructure Status</h2>
              </div>
              <div className="badge-status">
                <span className={status.connected ? 'dot-online' : 'dot-offline'} />
                <span>{status.connected ? `Connected (${status.latencyMs || 5}ms latency)` : 'Disconnected'}</span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '0.4rem', fontWeight: 600 }}>CMS ENGINE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="#6366f1" /> Strapi v5.52.0
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '0.4rem', fontWeight: 600 }}>DATABASE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={18} color="#34d399" /> PostgreSQL 18
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '0.4rem', fontWeight: 600 }}>HOST ENDPOINT</div>
                <div className="code-font" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#a5b4fc' }}>
                  http://localhost:1338/api
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT FEED GRID */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Articles & Content</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {isFallback 
                  ? 'Showing demonstration content. Create and publish entries in Strapi to stream live data here.'
                  : 'Live data dynamically fetched from Strapi backend.'
                }
              </p>
            </div>
            {isFallback && (
              <span style={{ 
                background: 'rgba(236, 72, 153, 0.15)', 
                color: '#f472b6', 
                border: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Demo Feed Mode
              </span>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {articles.map((item: StrapiItem) => (
              <article key={item.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {item.imageUrl && (
                  <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {item.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                    {item.description}
                  </p>

                  <div style={{ 
                    borderTop: '1px solid rgba(255,255,255,0.06)', 
                    paddingTop: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-subtle)'
                  }}>
                    <span>Published: {new Date(item.publishedAt || Date.now()).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#818cf8', fontWeight: 600 }}>
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* QUICKSTART GUIDE */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,27,75,0.5) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <BookOpen color="#a855f7" size={26} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>How to Add & Publish Real Content</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Follow these simple steps in your Strapi Admin panel to push live data directly to this frontend:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>1</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Login to Admin</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Open <a href="http://localhost:1338/admin" target="_blank" style={{ color: '#818cf8', textDecoration: 'underline' }}>http://localhost:1338/admin</a> and create your administrator credentials.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>2</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Content Type</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Go to <strong>Content-Type Builder</strong> & create a collection (e.g. <code className="code-font">Article</code>) with fields: <code className="code-font">title</code>, <code className="code-font">description</code>, <code className="code-font">category</code>.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>3</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Set Permissions</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Navigate to <strong>Settings &gt; Roles &gt; Public</strong> and enable <code className="code-font">find</code> & <code className="code-font">findOne</code> permissions for your new content type.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>4</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Publish & Refresh</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Create & Publish your entries, then refresh this page to see your live data update automatically!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
        <p>Strapi v5 + PostgreSQL + Next.js App Router | Decoupled Architecture</p>
      </footer>
    </div>
  );
}
