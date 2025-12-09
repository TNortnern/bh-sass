/**
 * Curated Tailwind CSS Block Library
 *
 * A comprehensive collection of Tailwind-styled blocks for the website builder.
 * Inspired by popular free sources: Tailblocks, Flowbite, Meraki UI, HyperUI, Preline.
 *
 * All blocks use inline styles for GrapeJS compatibility.
 */

export interface TailwindBlock {
  id: string
  label: string
  category: string
  media: string
  content: string
}

// SVG Icons for block previews
const ICONS = {
  hero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="14" x2="14" y2="14"/></svg>',
  heroImage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M22 20 L16 14 L12 18 L8 14 L2 20"/></svg>',
  features: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  pricing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  testimonial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 17h8l4 4V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>',
  faq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2"/></svg>',
  gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 4 l10 9 l10-9"/></svg>',
  cta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="14" width="4" height="6"/><rect x="10" y="10" width="4" height="10"/><rect x="16" y="6" width="4" height="14"/></svg>',
  newsletter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
  logos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="12" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="18" cy="12" r="3"/></svg>',
  nav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="4" rx="1"/><line x1="6" y1="12" x2="18" y2="12"/></svg>',
  footer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="16" width="20" height="4" rx="1"/><line x1="6" y1="8" x2="18" y2="8"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="3" width="18" height="10"/></svg>',
  blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
  content: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="18"/><line x1="14" y1="6" x2="21" y2="6"/><line x1="14" y1="12" x2="21" y2="12"/><line x1="14" y1="18" x2="18" y2="18"/></svg>'
}

// ============================================================================
// HERO SECTIONS - Extended Collection
// ============================================================================

const heroBlocks: TailwindBlock[] = [
  {
    id: 'hero-centered-gradient',
    label: 'Hero - Centered Gradient',
    category: 'Heroes',
    media: ICONS.hero,
    content: `
      <section style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 120px 24px; text-align: center; min-height: 600px; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 900px; margin: 0 auto;">
          <span style="display: inline-block; padding: 8px 20px; background: rgba(255,255,255,0.2); border-radius: 9999px; font-size: 14px; font-weight: 600; color: white; margin-bottom: 24px; font-family: system-ui, sans-serif;">New Release</span>
          <h1 style="font-size: 64px; font-weight: 800; color: white; margin: 0 0 24px 0; line-height: 1.1; font-family: system-ui, sans-serif;">Build beautiful websites in minutes</h1>
          <p style="font-size: 22px; color: rgba(255,255,255,0.9); margin: 0 0 40px 0; font-family: system-ui, sans-serif; max-width: 700px; margin-left: auto; margin-right: auto;">Create stunning landing pages, portfolios, and business sites with our drag-and-drop builder.</p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="display: inline-block; padding: 18px 36px; background: white; color: #667eea; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">Get Started Free</a>
            <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 18px 36px; background: transparent; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif; border: 2px solid rgba(255,255,255,0.3);">Watch Demo</a>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'hero-split-image-left',
    label: 'Hero - Image Left',
    category: 'Heroes',
    media: ICONS.heroImage,
    content: `
      <section style="width: 100%; padding: 80px 24px; background: #f8fafc;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 24px; aspect-ratio: 4/3; min-height: 400px;"></div>
          <div>
            <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: #dbeafe; border-radius: 9999px; font-size: 13px; font-weight: 600; color: #1d4ed8; margin-bottom: 20px; font-family: system-ui, sans-serif;">
              <span style="width: 8px; height: 8px; background: #1d4ed8; border-radius: 50%;"></span>
              Now Available
            </span>
            <h1 style="font-size: 52px; font-weight: 800; color: #0f172a; margin: 0 0 24px 0; line-height: 1.1; font-family: system-ui, sans-serif;">Transform Your Business Today</h1>
            <p style="font-size: 18px; color: #64748b; line-height: 1.75; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Join thousands of companies using our platform to streamline operations and boost growth.</p>
            <div style="display: flex; gap: 12px; margin-bottom: 32px;">
              <a href="#" style="padding: 16px 28px; background: #3b82f6; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Start Free Trial</a>
              <a href="#" style="padding: 16px 28px; background: white; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif; border: 1px solid #e5e7eb;">Learn More</a>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; margin-left: -8px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%; border: 3px solid white; margin-left: -8px;"></div>
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; border: 3px solid white; margin-left: -8px;"></div>
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); border-radius: 50%; border: 3px solid white; margin-left: -8px;"></div>
              </div>
              <p style="font-size: 14px; color: #64748b; margin: 0; font-family: system-ui, sans-serif;"><strong style="color: #0f172a;">2,000+</strong> happy customers</p>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'hero-minimal-dark',
    label: 'Hero - Minimal Dark',
    category: 'Heroes',
    media: ICONS.hero,
    content: `
      <section style="width: 100%; background: #000; padding: 160px 24px; min-height: 100vh; display: flex; align-items: center;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h1 style="font-size: 80px; font-weight: 800; color: white; margin: 0 0 32px 0; line-height: 1; font-family: system-ui, sans-serif;">We build <span style="background: linear-gradient(90deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">digital</span> products.</h1>
          <p style="font-size: 24px; color: #9ca3af; margin: 0 0 48px 0; font-family: system-ui, sans-serif; max-width: 600px;">Award-winning design studio crafting exceptional digital experiences for ambitious brands.</p>
          <a href="#" style="display: inline-flex; align-items: center; gap: 12px; padding: 20px 40px; background: white; color: #000; font-weight: 700; border-radius: 9999px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">View Our Work <span style="font-size: 24px;">→</span></a>
        </div>
      </section>
    `
  },
  {
    id: 'hero-with-browser',
    label: 'Hero - Browser Mockup',
    category: 'Heroes',
    media: ICONS.heroImage,
    content: `
      <section style="width: 100%; background: linear-gradient(180deg, #f1f5f9 0%, #fff 100%); padding: 100px 24px 60px;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <span style="display: inline-block; padding: 8px 16px; background: #ecfdf5; border-radius: 9999px; font-size: 13px; font-weight: 600; color: #059669; margin-bottom: 24px; font-family: system-ui, sans-serif;">✨ Version 2.0 is here</span>
          <h1 style="font-size: 56px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; line-height: 1.15; font-family: system-ui, sans-serif;">The modern way to<br>build websites</h1>
          <p style="font-size: 20px; color: #64748b; margin: 0 0 40px 0; font-family: system-ui, sans-serif; max-width: 600px; margin-left: auto; margin-right: auto;">Drag, drop, and publish. No code required. Create stunning sites in minutes.</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 64px;">
            <a href="#" style="padding: 16px 32px; background: #0f172a; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Start Building</a>
            <a href="#" style="padding: 16px 32px; background: white; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif; border: 1px solid #e5e7eb;">View Templates</a>
          </div>
          <div style="background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); overflow: hidden; max-width: 900px; margin: 0 auto;">
            <div style="background: #f1f5f9; padding: 12px 16px; display: flex; align-items: center; gap: 8px;">
              <div style="display: flex; gap: 6px;">
                <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                <div style="width: 12px; height: 12px; background: #22c55e; border-radius: 50%;"></div>
              </div>
              <div style="flex: 1; background: white; border-radius: 4px; padding: 6px 12px; font-size: 12px; color: #64748b; font-family: system-ui, sans-serif;">yoursite.com</div>
            </div>
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); min-height: 400px;"></div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'hero-saas-product',
    label: 'Hero - SaaS Product',
    category: 'Heroes',
    media: ICONS.heroImage,
    content: `
      <section style="width: 100%; background: #0f172a; padding: 100px 24px; overflow: hidden;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <span style="padding: 6px 12px; background: rgba(59, 130, 246, 0.2); border-radius: 6px; font-size: 12px; font-weight: 700; color: #60a5fa; font-family: system-ui, sans-serif;">NEW</span>
              <span style="font-size: 14px; color: #94a3b8; font-family: system-ui, sans-serif;">AI-powered analytics</span>
            </div>
            <h1 style="font-size: 56px; font-weight: 800; color: white; margin: 0 0 24px 0; line-height: 1.1; font-family: system-ui, sans-serif;">Analytics that help you grow</h1>
            <p style="font-size: 18px; color: #94a3b8; line-height: 1.75; margin: 0 0 36px 0; font-family: system-ui, sans-serif;">Get powerful insights into your business with our intelligent dashboard. Track, analyze, and optimize in real-time.</p>
            <div style="display: flex; gap: 12px; margin-bottom: 40px;">
              <a href="#" style="padding: 16px 28px; background: #3b82f6; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Start Free Trial</a>
              <a href="#" style="display: inline-flex; align-items: center; gap: 8px; padding: 16px 28px; color: white; font-weight: 500; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Live Demo →</a>
            </div>
            <div style="display: flex; gap: 32px;">
              <div>
                <span style="font-size: 32px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">99.9%</span>
                <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Uptime</span>
              </div>
              <div>
                <span style="font-size: 32px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">10k+</span>
                <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Customers</span>
              </div>
              <div>
                <span style="font-size: 32px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">24/7</span>
                <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Support</span>
              </div>
            </div>
          </div>
          <div style="position: relative;">
            <div style="background: linear-gradient(135deg, #1e293b, #334155); border-radius: 16px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
              <div style="background: #0f172a; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="font-size: 14px; color: #94a3b8; font-family: system-ui, sans-serif;">Revenue</span>
                  <span style="font-size: 12px; color: #22c55e; font-family: system-ui, sans-serif;">+23%</span>
                </div>
                <span style="font-size: 28px; font-weight: 700; color: white; font-family: system-ui, sans-serif;">$48,294</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #0f172a; border-radius: 12px; padding: 16px;">
                  <span style="font-size: 12px; color: #64748b; font-family: system-ui, sans-serif; display: block;">Users</span>
                  <span style="font-size: 20px; font-weight: 700; color: white; font-family: system-ui, sans-serif;">2,491</span>
                </div>
                <div style="background: #0f172a; border-radius: 12px; padding: 16px;">
                  <span style="font-size: 12px; color: #64748b; font-family: system-ui, sans-serif; display: block;">Sessions</span>
                  <span style="font-size: 20px; font-weight: 700; color: white; font-family: system-ui, sans-serif;">12.4k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// FEATURE SECTIONS
// ============================================================================

const featureBlocks: TailwindBlock[] = [
  {
    id: 'features-icon-grid',
    label: 'Features - Icon Grid',
    category: 'Features',
    media: ICONS.features,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 12px; font-family: system-ui, sans-serif;">Features</span>
            <h2 style="font-size: 44px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Everything you need</h2>
            <p style="font-size: 18px; color: #64748b; max-width: 600px; margin: 0 auto; font-family: system-ui, sans-serif;">Powerful features to help you manage, track, and grow your business.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;">
            <div style="text-align: center;">
              <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #ede9fe, #c4b5fd); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 32px;">⚡</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Lightning Fast</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Optimized for speed with sub-second load times across all devices.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #dcfce7, #86efac); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🔒</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Secure by Default</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Enterprise-grade security with end-to-end encryption for all data.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 32px;">📊</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Advanced Analytics</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Get actionable insights with real-time dashboards and reports.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #fce7f3, #f9a8d4); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🎯</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Easy Integration</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Connect with 100+ tools you already use in just a few clicks.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #dbeafe, #93c5fd); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🚀</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Scale Infinitely</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Built to handle millions of users without breaking a sweat.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #d1fae5, #6ee7b7); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 32px;">💬</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">24/7 Support</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Our expert team is always ready to help you succeed.</p>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'features-alternating',
    label: 'Features - Alternating',
    category: 'Features',
    media: ICONS.content,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: #f8fafc;">
        <div style="max-width: 1100px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-bottom: 100px;">
            <div style="background: linear-gradient(135deg, #ede9fe, #c4b5fd); border-radius: 20px; aspect-ratio: 4/3; min-height: 320px;"></div>
            <div>
              <span style="display: inline-block; padding: 6px 14px; background: #ede9fe; color: #7c3aed; font-size: 13px; font-weight: 600; border-radius: 6px; margin-bottom: 16px; font-family: system-ui, sans-serif;">Automation</span>
              <h3 style="font-size: 36px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; line-height: 1.2; font-family: system-ui, sans-serif;">Automate your workflow</h3>
              <p style="font-size: 17px; color: #64748b; line-height: 1.75; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">Save hours every week by automating repetitive tasks. Set up custom workflows that run in the background while you focus on what matters.</p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #7c3aed; font-weight: bold;">✓</span> Drag-and-drop workflow builder</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #7c3aed; font-weight: bold;">✓</span> 50+ pre-built templates</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #7c3aed; font-weight: bold;">✓</span> Real-time execution logs</li>
              </ul>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;">
            <div>
              <span style="display: inline-block; padding: 6px 14px; background: #dcfce7; color: #16a34a; font-size: 13px; font-weight: 600; border-radius: 6px; margin-bottom: 16px; font-family: system-ui, sans-serif;">Collaboration</span>
              <h3 style="font-size: 36px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; line-height: 1.2; font-family: system-ui, sans-serif;">Work together seamlessly</h3>
              <p style="font-size: 17px; color: #64748b; line-height: 1.75; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">Collaborate with your team in real-time. Share projects, leave comments, and track changes all in one place.</p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #16a34a; font-weight: bold;">✓</span> Real-time co-editing</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #16a34a; font-weight: bold;">✓</span> Comments and mentions</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 8px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #16a34a; font-weight: bold;">✓</span> Version history</li>
              </ul>
            </div>
            <div style="background: linear-gradient(135deg, #dcfce7, #86efac); border-radius: 20px; aspect-ratio: 4/3; min-height: 320px;"></div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'features-cards-dark',
    label: 'Features - Dark Cards',
    category: 'Features',
    media: ICONS.features,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: #0f172a;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <h2 style="font-size: 44px; font-weight: 800; color: white; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Powerful features for modern teams</h2>
            <p style="font-size: 18px; color: #94a3b8; max-width: 600px; margin: 0 auto; font-family: system-ui, sans-serif;">Everything you need to build, launch, and scale your product.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="background: linear-gradient(135deg, #1e293b, #334155); border-radius: 16px; padding: 32px; border: 1px solid #334155;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📈</div>
              <h3 style="font-size: 20px; font-weight: 700; color: white; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Growth Analytics</h3>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Track key metrics and understand your growth trajectory with detailed analytics.</p>
            </div>
            <div style="background: linear-gradient(135deg, #1e293b, #334155); border-radius: 16px; padding: 32px; border: 1px solid #334155;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ec4899, #f43f5e); border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎨</div>
              <h3 style="font-size: 20px; font-weight: 700; color: white; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Custom Branding</h3>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Make it yours with custom colors, logos, and domains.</p>
            </div>
            <div style="background: linear-gradient(135deg, #1e293b, #334155); border-radius: 16px; padding: 32px; border: 1px solid #334155;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #14b8a6); border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🔗</div>
              <h3 style="font-size: 20px; font-weight: 700; color: white; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">API Access</h3>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Full REST API with webhooks and real-time event streaming.</p>
            </div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// TESTIMONIAL SECTIONS
// ============================================================================

const testimonialBlocks: TailwindBlock[] = [
  {
    id: 'testimonials-cards',
    label: 'Testimonials - Cards',
    category: 'Testimonials',
    media: ICONS.testimonial,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: #f8fafc;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 12px; font-family: system-ui, sans-serif;">Testimonials</span>
            <h2 style="font-size: 44px; font-weight: 800; color: #0f172a; margin: 0; font-family: system-ui, sans-serif;">What our customers say</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span style="color: #fbbf24; font-size: 18px;">★★★★★</span>
              </div>
              <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">"This product has completely transformed how we work. The automation features alone have saved us 20+ hours per week."</p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%;"></div>
                <div>
                  <strong style="font-size: 15px; font-weight: 600; color: #0f172a; font-family: system-ui, sans-serif; display: block;">Sarah Johnson</strong>
                  <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">CEO at TechCorp</span>
                </div>
              </div>
            </div>
            <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span style="color: #fbbf24; font-size: 18px;">★★★★★</span>
              </div>
              <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">"The best decision we made this year. Customer support is incredible and the product keeps getting better."</p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%;"></div>
                <div>
                  <strong style="font-size: 15px; font-weight: 600; color: #0f172a; font-family: system-ui, sans-serif; display: block;">Michael Chen</strong>
                  <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Founder at StartupXYZ</span>
                </div>
              </div>
            </div>
            <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="display: flex; gap: 4px; margin-bottom: 16px;">
                <span style="color: #fbbf24; font-size: 18px;">★★★★★</span>
              </div>
              <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 24px 0; font-family: system-ui, sans-serif;">"We've tried many tools but this is the only one that actually delivers on its promises. Highly recommended!"</p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); border-radius: 50%;"></div>
                <div>
                  <strong style="font-size: 15px; font-weight: 600; color: #0f172a; font-family: system-ui, sans-serif; display: block;">Emily Davis</strong>
                  <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Marketing Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'testimonial-featured',
    label: 'Testimonial - Featured',
    category: 'Testimonials',
    media: ICONS.testimonial,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: #0f172a;">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%; margin: 0 auto 32px;"></div>
          <blockquote style="font-size: 32px; font-weight: 500; color: white; line-height: 1.5; margin: 0 0 32px 0; font-family: Georgia, serif; font-style: italic;">"This is hands down the best product we've ever used. It has transformed our entire business operation and helped us grow 3x in just 6 months."</blockquote>
          <div>
            <strong style="font-size: 18px; font-weight: 600; color: white; font-family: system-ui, sans-serif; display: block; margin-bottom: 4px;">Alexandra Thompson</strong>
            <span style="font-size: 16px; color: #94a3b8; font-family: system-ui, sans-serif;">VP of Operations at Fortune 500 Company</span>
          </div>
          <div style="display: flex; justify-content: center; gap: 24px; margin-top: 48px; padding-top: 48px; border-top: 1px solid #334155;">
            <div style="text-align: center;">
              <span style="font-size: 40px; font-weight: 800; color: #f59e0b; font-family: system-ui, sans-serif; display: block;">4.9/5</span>
              <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Average Rating</span>
            </div>
            <div style="width: 1px; background: #334155;"></div>
            <div style="text-align: center;">
              <span style="font-size: 40px; font-weight: 800; color: #f59e0b; font-family: system-ui, sans-serif; display: block;">10k+</span>
              <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">Happy Customers</span>
            </div>
            <div style="width: 1px; background: #334155;"></div>
            <div style="text-align: center;">
              <span style="font-size: 40px; font-weight: 800; color: #f59e0b; font-family: system-ui, sans-serif; display: block;">500+</span>
              <span style="font-size: 14px; color: #64748b; font-family: system-ui, sans-serif;">5-Star Reviews</span>
            </div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// PRICING SECTIONS
// ============================================================================

const pricingBlocks: TailwindBlock[] = [
  {
    id: 'pricing-three-tier',
    label: 'Pricing - Three Tier',
    category: 'Pricing',
    media: ICONS.pricing,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 12px; font-family: system-ui, sans-serif;">Pricing</span>
            <h2 style="font-size: 44px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Simple, transparent pricing</h2>
            <p style="font-size: 18px; color: #64748b; font-family: system-ui, sans-serif;">No hidden fees. Cancel anytime.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start;">
            <div style="background: #f8fafc; border-radius: 16px; padding: 40px; border: 2px solid #e2e8f0;">
              <span style="font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Starter</span>
              <div style="margin: 20px 0 24px;">
                <span style="font-size: 56px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif;">$19</span>
                <span style="font-size: 18px; color: #64748b; font-family: system-ui, sans-serif;">/month</span>
              </div>
              <p style="font-size: 15px; color: #64748b; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Perfect for individuals and small projects.</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> 5 projects</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> 10GB storage</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Basic analytics</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Email support</li>
              </ul>
              <a href="#" style="display: block; text-align: center; padding: 16px 24px; background: white; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-family: system-ui, sans-serif; border: 1px solid #e2e8f0;">Get Started</a>
            </div>
            <div style="background: #0f172a; border-radius: 16px; padding: 40px; position: relative; transform: scale(1.05); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
              <span style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 8px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 12px; font-weight: 700; border-radius: 9999px; font-family: system-ui, sans-serif;">MOST POPULAR</span>
              <span style="font-size: 14px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Professional</span>
              <div style="margin: 20px 0 24px;">
                <span style="font-size: 56px; font-weight: 800; color: white; font-family: system-ui, sans-serif;">$49</span>
                <span style="font-size: 18px; color: #94a3b8; font-family: system-ui, sans-serif;">/month</span>
              </div>
              <p style="font-size: 15px; color: #94a3b8; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Best for growing teams and businesses.</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #6366f1;">✓</span> Unlimited projects</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #6366f1;">✓</span> 100GB storage</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #6366f1;">✓</span> Advanced analytics</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #6366f1;">✓</span> Priority support</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: rgba(255,255,255,0.9); font-family: system-ui, sans-serif;"><span style="color: #6366f1;">✓</span> Custom integrations</li>
              </ul>
              <a href="#" style="display: block; text-align: center; padding: 16px 24px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-family: system-ui, sans-serif;">Get Started</a>
            </div>
            <div style="background: #f8fafc; border-radius: 16px; padding: 40px; border: 2px solid #e2e8f0;">
              <span style="font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-family: system-ui, sans-serif;">Enterprise</span>
              <div style="margin: 20px 0 24px;">
                <span style="font-size: 56px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif;">$199</span>
                <span style="font-size: 18px; color: #64748b; font-family: system-ui, sans-serif;">/month</span>
              </div>
              <p style="font-size: 15px; color: #64748b; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">For large organizations with custom needs.</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 32px 0;">
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Everything in Pro</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Unlimited storage</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Dedicated support</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> SLA guarantee</li>
                <li style="display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 15px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #10b981;">✓</span> Custom training</li>
              </ul>
              <a href="#" style="display: block; text-align: center; padding: 16px 24px; background: white; color: #374151; font-weight: 600; border-radius: 8px; text-decoration: none; font-family: system-ui, sans-serif; border: 1px solid #e2e8f0;">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'pricing-simple',
    label: 'Pricing - Simple',
    category: 'Pricing',
    media: ICONS.pricing,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="max-width: 500px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 44px; font-weight: 800; color: white; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">One plan, everything included</h2>
          <p style="font-size: 18px; color: rgba(255,255,255,0.9); margin: 0 0 48px 0; font-family: system-ui, sans-serif;">No complicated tiers. No hidden fees. Just simple pricing.</p>
          <div style="background: white; border-radius: 20px; padding: 48px 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 72px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif;">$29</span>
              <span style="font-size: 20px; color: #64748b; font-family: system-ui, sans-serif;">/month</span>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0 0 32px 0; text-align: left;">
              <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 16px; color: #374151; font-family: system-ui, sans-serif; border-bottom: 1px solid #f1f5f9;"><span style="color: #6366f1; font-size: 18px;">✓</span> Unlimited projects</li>
              <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 16px; color: #374151; font-family: system-ui, sans-serif; border-bottom: 1px solid #f1f5f9;"><span style="color: #6366f1; font-size: 18px;">✓</span> Unlimited team members</li>
              <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 16px; color: #374151; font-family: system-ui, sans-serif; border-bottom: 1px solid #f1f5f9;"><span style="color: #6366f1; font-size: 18px;">✓</span> 100GB storage</li>
              <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 16px; color: #374151; font-family: system-ui, sans-serif; border-bottom: 1px solid #f1f5f9;"><span style="color: #6366f1; font-size: 18px;">✓</span> Priority support</li>
              <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0; font-size: 16px; color: #374151; font-family: system-ui, sans-serif;"><span style="color: #6366f1; font-size: 18px;">✓</span> All integrations</li>
            </ul>
            <a href="#" style="display: block; text-align: center; padding: 18px 32px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-weight: 700; border-radius: 10px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">Start 14-Day Free Trial</a>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// CTA SECTIONS
// ============================================================================

const ctaBlocks: TailwindBlock[] = [
  {
    id: 'cta-centered',
    label: 'CTA - Centered',
    category: 'CTA',
    media: ICONS.cta,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: #0f172a;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 48px; font-weight: 800; color: white; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Ready to get started?</h2>
          <p style="font-size: 20px; color: #94a3b8; margin: 0 0 40px 0; font-family: system-ui, sans-serif;">Join thousands of satisfied customers using our platform every day.</p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="padding: 18px 36px; background: white; color: #0f172a; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif;">Start Free Trial</a>
            <a href="#" style="padding: 18px 36px; background: transparent; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 18px; font-family: system-ui, sans-serif; border: 2px solid #334155;">Schedule Demo</a>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'cta-gradient-split',
    label: 'CTA - Gradient Split',
    category: 'CTA',
    media: ICONS.cta,
    content: `
      <section style="width: 100%; padding: 80px 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 32px;">
          <div>
            <h2 style="font-size: 36px; font-weight: 800; color: white; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Start building today</h2>
            <p style="font-size: 18px; color: rgba(255,255,255,0.9); margin: 0; font-family: system-ui, sans-serif;">Get started in minutes with our easy setup process.</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <a href="#" style="padding: 16px 32px; background: white; color: #6366f1; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Get Started</a>
            <a href="#" style="padding: 16px 32px; background: rgba(255,255,255,0.1); color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 16px; font-family: system-ui, sans-serif;">Learn More</a>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'cta-newsletter',
    label: 'CTA - Newsletter',
    category: 'CTA',
    media: ICONS.newsletter,
    content: `
      <section style="width: 100%; padding: 80px 24px; background: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 36px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Stay in the loop</h2>
          <p style="font-size: 18px; color: #64748b; margin: 0 0 32px 0; font-family: system-ui, sans-serif;">Get the latest updates, tips, and exclusive offers delivered to your inbox.</p>
          <div style="display: flex; gap: 12px; max-width: 480px; margin: 0 auto;">
            <input type="email" placeholder="Enter your email" style="flex: 1; padding: 16px 20px; font-size: 16px; border: 2px solid #e2e8f0; border-radius: 8px; outline: none; font-family: system-ui, sans-serif;" />
            <button style="padding: 16px 28px; background: #0f172a; color: white; font-weight: 600; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-family: system-ui, sans-serif;">Subscribe</button>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin: 16px 0 0 0; font-family: system-ui, sans-serif;">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    `
  }
]

// ============================================================================
// TEAM SECTIONS
// ============================================================================

const teamBlocks: TailwindBlock[] = [
  {
    id: 'team-grid',
    label: 'Team - Grid',
    category: 'Team',
    media: ICONS.team,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 12px; font-family: system-ui, sans-serif;">Our Team</span>
            <h2 style="font-size: 44px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Meet the people behind our success</h2>
            <p style="font-size: 18px; color: #64748b; max-width: 600px; margin: 0 auto; font-family: system-ui, sans-serif;">A diverse team of passionate individuals working together to build something amazing.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
            <div style="text-align: center;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #fef3c7, #fcd34d); border-radius: 16px; margin: 0 auto 20px;"></div>
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-family: system-ui, sans-serif;">John Smith</h3>
              <span style="font-size: 14px; color: #6366f1; font-weight: 500; font-family: system-ui, sans-serif; display: block; margin-bottom: 12px;">CEO & Founder</span>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Former engineer turned entrepreneur with a passion for building great products.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #dbeafe, #93c5fd); border-radius: 16px; margin: 0 auto 20px;"></div>
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-family: system-ui, sans-serif;">Sarah Johnson</h3>
              <span style="font-size: 14px; color: #6366f1; font-weight: 500; font-family: system-ui, sans-serif; display: block; margin-bottom: 12px;">CTO</span>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">20+ years of experience in software architecture and team leadership.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #d1fae5, #6ee7b7); border-radius: 16px; margin: 0 auto 20px;"></div>
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-family: system-ui, sans-serif;">Michael Chen</h3>
              <span style="font-size: 14px; color: #6366f1; font-weight: 500; font-family: system-ui, sans-serif; display: block; margin-bottom: 12px;">Head of Design</span>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Award-winning designer focused on creating intuitive user experiences.</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #fce7f3, #f9a8d4); border-radius: 16px; margin: 0 auto 20px;"></div>
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-family: system-ui, sans-serif;">Emily Davis</h3>
              <span style="font-size: 14px; color: #6366f1; font-weight: 500; font-family: system-ui, sans-serif; display: block; margin-bottom: 12px;">Head of Marketing</span>
              <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; font-family: system-ui, sans-serif;">Growth expert who has helped scale multiple successful startups.</p>
            </div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// LOGO CLOUD / CLIENTS
// ============================================================================

const logoBlocks: TailwindBlock[] = [
  {
    id: 'logo-cloud-simple',
    label: 'Logo Cloud - Simple',
    category: 'Logos',
    media: ICONS.logos,
    content: `
      <section style="width: 100%; padding: 60px 24px; background: #f8fafc;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <p style="font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 32px; font-family: system-ui, sans-serif;">Trusted by leading companies</p>
          <div style="display: flex; justify-content: center; align-items: center; gap: 64px; flex-wrap: wrap;">
            <div style="width: 120px; height: 40px; background: #cbd5e1; border-radius: 8px; opacity: 0.7;"></div>
            <div style="width: 120px; height: 40px; background: #cbd5e1; border-radius: 8px; opacity: 0.7;"></div>
            <div style="width: 120px; height: 40px; background: #cbd5e1; border-radius: 8px; opacity: 0.7;"></div>
            <div style="width: 120px; height: 40px; background: #cbd5e1; border-radius: 8px; opacity: 0.7;"></div>
            <div style="width: 120px; height: 40px; background: #cbd5e1; border-radius: 8px; opacity: 0.7;"></div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'logo-cloud-dark',
    label: 'Logo Cloud - Dark',
    category: 'Logos',
    media: ICONS.logos,
    content: `
      <section style="width: 100%; padding: 60px 24px; background: #0f172a;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <p style="font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 32px; font-family: system-ui, sans-serif;">Powering the world's best teams</p>
          <div style="display: flex; justify-content: center; align-items: center; gap: 64px; flex-wrap: wrap;">
            <div style="width: 120px; height: 40px; background: #334155; border-radius: 8px;"></div>
            <div style="width: 120px; height: 40px; background: #334155; border-radius: 8px;"></div>
            <div style="width: 120px; height: 40px; background: #334155; border-radius: 8px;"></div>
            <div style="width: 120px; height: 40px; background: #334155; border-radius: 8px;"></div>
            <div style="width: 120px; height: 40px; background: #334155; border-radius: 8px;"></div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// FAQ SECTIONS
// ============================================================================

const faqBlocks: TailwindBlock[] = [
  {
    id: 'faq-accordion',
    label: 'FAQ - Accordion',
    category: 'FAQ',
    media: ICONS.faq,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: white;">
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 64px;">
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 12px; font-family: system-ui, sans-serif;">FAQ</span>
            <h2 style="font-size: 44px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; font-family: system-ui, sans-serif;">Frequently asked questions</h2>
            <p style="font-size: 18px; color: #64748b; font-family: system-ui, sans-serif;">Everything you need to know about our product.</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">How do I get started?</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Getting started is easy! Simply create an account, choose your plan, and you'll be up and running in minutes. We also offer a 14-day free trial so you can test everything before committing.</p>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Can I cancel anytime?</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Yes! There are no long-term contracts. You can cancel your subscription at any time, and you'll continue to have access until the end of your billing period.</p>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">What payment methods do you accept?</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. For enterprise plans, we also offer invoicing options.</p>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; font-family: system-ui, sans-serif;">Do you offer refunds?</h3>
              <p style="font-size: 16px; color: #64748b; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our product for any reason, contact our support team and we'll process a full refund.</p>
            </div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// CONTACT SECTIONS
// ============================================================================

const contactBlocks: TailwindBlock[] = [
  {
    id: 'contact-split-form',
    label: 'Contact - Split Form',
    category: 'Contact',
    media: ICONS.contact,
    content: `
      <section style="width: 100%; padding: 100px 24px; background: #0f172a;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px;">
          <div>
            <span style="display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 12px; font-family: system-ui, sans-serif;">Contact Us</span>
            <h2 style="font-size: 44px; font-weight: 800; color: white; margin: 0 0 20px 0; line-height: 1.2; font-family: system-ui, sans-serif;">Get in touch</h2>
            <p style="font-size: 18px; color: #94a3b8; margin: 0 0 40px 0; line-height: 1.7; font-family: system-ui, sans-serif;">Have a question or want to work together? We'd love to hear from you.</p>
            <div style="display: flex; flex-direction: column; gap: 24px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: #1e293b; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #6366f1; font-size: 20px;">📧</div>
                <div>
                  <span style="display: block; font-size: 13px; color: #64748b; font-family: system-ui, sans-serif;">Email</span>
                  <span style="font-size: 16px; color: white; font-family: system-ui, sans-serif;">hello@example.com</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: #1e293b; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #6366f1; font-size: 20px;">📞</div>
                <div>
                  <span style="display: block; font-size: 13px; color: #64748b; font-family: system-ui, sans-serif;">Phone</span>
                  <span style="font-size: 16px; color: white; font-family: system-ui, sans-serif;">+1 (555) 123-4567</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: #1e293b; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #6366f1; font-size: 20px;">📍</div>
                <div>
                  <span style="display: block; font-size: 13px; color: #64748b; font-family: system-ui, sans-serif;">Address</span>
                  <span style="font-size: 16px; color: white; font-family: system-ui, sans-serif;">123 Main St, San Francisco, CA 94102</span>
                </div>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 16px; padding: 40px;">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Name</label>
              <input type="text" placeholder="John Doe" style="width: 100%; padding: 14px 16px; font-size: 16px; border: 2px solid #e2e8f0; border-radius: 8px; background: #f8fafc; box-sizing: border-box; font-family: system-ui, sans-serif;" />
            </div>
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Email</label>
              <input type="email" placeholder="john@example.com" style="width: 100%; padding: 14px 16px; font-size: 16px; border: 2px solid #e2e8f0; border-radius: 8px; background: #f8fafc; box-sizing: border-box; font-family: system-ui, sans-serif;" />
            </div>
            <div style="margin-bottom: 24px;">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; font-family: system-ui, sans-serif;">Message</label>
              <textarea placeholder="Your message..." style="width: 100%; padding: 14px 16px; font-size: 16px; border: 2px solid #e2e8f0; border-radius: 8px; background: #f8fafc; min-height: 140px; resize: vertical; box-sizing: border-box; font-family: system-ui, sans-serif;"></textarea>
            </div>
            <button type="button" style="width: 100%; padding: 16px 32px; background: #0f172a; color: white; font-size: 16px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; font-family: system-ui, sans-serif;">Send Message</button>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// FOOTER SECTIONS
// ============================================================================

const footerBlocks: TailwindBlock[] = [
  {
    id: 'footer-multi-column',
    label: 'Footer - Multi Column',
    category: 'Footer',
    media: ICONS.footer,
    content: `
      <footer style="width: 100%;padding: 80px 24px 40px; background: #0f172a;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 64px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px;"></div>
                <span style="font-size: 20px; font-weight: 800; color: white; font-family: system-ui, sans-serif;">Company</span>
              </div>
              <p style="font-size: 15px; color: #94a3b8; line-height: 1.7; margin: 0; font-family: system-ui, sans-serif;">Making the world a better place through beautiful software.</p>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Product</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Features</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Pricing</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Company</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">About</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Careers</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Resources</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Documentation</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Help Center</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 style="font-size: 14px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 20px 0; font-family: system-ui, sans-serif;">Legal</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Privacy</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Terms</a></li>
                <li style="margin-bottom: 12px;"><a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-family: system-ui, sans-serif;">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div style="border-top: 1px solid #1e293b; padding-top: 32px; display: flex; justify-content: space-between; align-items: center;">
            <p style="font-size: 14px; color: #64748b; margin: 0; font-family: system-ui, sans-serif;">© 2025 Company, Inc. All rights reserved.</p>
            <div style="display: flex; gap: 24px;">
              <a href="#" style="color: #64748b; text-decoration: none;">Twitter</a>
              <a href="#" style="color: #64748b; text-decoration: none;">LinkedIn</a>
              <a href="#" style="color: #64748b; text-decoration: none;">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    `
  },
  {
    id: 'footer-simple',
    label: 'Footer - Simple',
    category: 'Footer',
    media: ICONS.footer,
    content: `
      <footer style="width: 100%;padding: 48px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: #0f172a; border-radius: 8px;"></div>
            <span style="font-size: 16px; font-weight: 700; color: #0f172a; font-family: system-ui, sans-serif;">Company</span>
          </div>
          <div style="display: flex; gap: 32px;">
            <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-family: system-ui, sans-serif;">About</a>
            <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-family: system-ui, sans-serif;">Features</a>
            <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-family: system-ui, sans-serif;">Pricing</a>
            <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-family: system-ui, sans-serif;">Contact</a>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin: 0; font-family: system-ui, sans-serif;">© 2025 Company, Inc.</p>
        </div>
      </footer>
    `
  }
]

// ============================================================================
// NAVIGATION SECTIONS
// ============================================================================

const navBlocks: TailwindBlock[] = [
  {
    id: 'nav-simple',
    label: 'Nav - Simple',
    category: 'Navigation',
    media: ICONS.nav,
    content: `
      <nav style="width: 100%;display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: white; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px;"></div>
          <span style="font-size: 18px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif;">Company</span>
        </div>
        <div style="display: flex; align-items: center; gap: 32px;">
          <a href="#" style="font-size: 15px; color: #0f172a; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Home</a>
          <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Features</a>
          <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Pricing</a>
          <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">About</a>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="#" style="font-size: 15px; color: #64748b; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Log In</a>
          <a href="#" style="padding: 10px 20px; background: #0f172a; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 14px; font-family: system-ui, sans-serif;">Get Started</a>
        </div>
      </nav>
    `
  },
  {
    id: 'nav-dark',
    label: 'Nav - Dark',
    category: 'Navigation',
    media: ICONS.nav,
    content: `
      <nav style="width: 100%;display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: #0f172a;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px;"></div>
          <span style="font-size: 18px; font-weight: 800; color: white; font-family: system-ui, sans-serif;">Company</span>
        </div>
        <div style="display: flex; align-items: center; gap: 32px;">
          <a href="#" style="font-size: 15px; color: white; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Home</a>
          <a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Features</a>
          <a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Pricing</a>
          <a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">About</a>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="#" style="font-size: 15px; color: #94a3b8; text-decoration: none; font-weight: 500; font-family: system-ui, sans-serif;">Log In</a>
          <a href="#" style="padding: 10px 20px; background: #6366f1; color: white; font-weight: 600; border-radius: 8px; text-decoration: none; font-size: 14px; font-family: system-ui, sans-serif;">Get Started</a>
        </div>
      </nav>
    `
  }
]

// ============================================================================
// STATS SECTIONS
// ============================================================================

const statsBlocks: TailwindBlock[] = [
  {
    id: 'stats-simple',
    label: 'Stats - Simple',
    category: 'Stats',
    media: ICONS.stats,
    content: `
      <section style="width: 100%; padding: 80px 24px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 48px; text-align: center;">
            <div>
              <span style="font-size: 56px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif; display: block;">8M+</span>
              <span style="font-size: 16px; color: #64748b; font-family: system-ui, sans-serif;">Users worldwide</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif; display: block;">99.9%</span>
              <span style="font-size: 16px; color: #64748b; font-family: system-ui, sans-serif;">Uptime guarantee</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif; display: block;">50+</span>
              <span style="font-size: 16px; color: #64748b; font-family: system-ui, sans-serif;">Countries served</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: #0f172a; font-family: system-ui, sans-serif; display: block;">4.9</span>
              <span style="font-size: 16px; color: #64748b; font-family: system-ui, sans-serif;">Average rating</span>
            </div>
          </div>
        </div>
      </section>
    `
  },
  {
    id: 'stats-gradient',
    label: 'Stats - Gradient',
    category: 'Stats',
    media: ICONS.stats,
    content: `
      <section style="width: 100%; padding: 80px 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 48px; text-align: center;">
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">250K+</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.8); font-family: system-ui, sans-serif;">Active users</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">$50M</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.8); font-family: system-ui, sans-serif;">Revenue generated</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">99.99%</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.8); font-family: system-ui, sans-serif;">Uptime SLA</span>
            </div>
            <div>
              <span style="font-size: 56px; font-weight: 800; color: white; font-family: system-ui, sans-serif; display: block;">24/7</span>
              <span style="font-size: 16px; color: rgba(255,255,255,0.8); font-family: system-ui, sans-serif;">Expert support</span>
            </div>
          </div>
        </div>
      </section>
    `
  }
]

// ============================================================================
// EXPORT ALL BLOCKS
// ============================================================================

export const tailwindBlocks: TailwindBlock[] = [
  ...heroBlocks,
  ...featureBlocks,
  ...testimonialBlocks,
  ...pricingBlocks,
  ...ctaBlocks,
  ...teamBlocks,
  ...logoBlocks,
  ...faqBlocks,
  ...contactBlocks,
  ...footerBlocks,
  ...navBlocks,
  ...statsBlocks
]

// Group blocks by category for easier access
export const blocksByCategory = tailwindBlocks.reduce((acc, block) => {
  if (!acc[block.category]) {
    acc[block.category] = []
  }
  acc[block.category]!.push(block)
  return acc
}, {} as Record<string, TailwindBlock[]>)

// Get all unique categories
export const blockCategories = Object.keys(blocksByCategory)

export default tailwindBlocks
