import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Send,
  GitBranch,
  Calendar,
  Image as ImageIcon,
  Clock,
  Users,
  Heart,
  TreePine,
  Network,
  BookOpen,
} from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';
import landingContent from '../data/landingContent.json';

// ─── Content data ──────────────────────────────────────────────────────────

const FALLBACK_HERO_SLIDE = {
  image:
    'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=1920&q=80&fit=crop&crop=center',
  headline: 'Every Family Has a Story Worth Telling',
  sub: 'Preserve your heritage, map your roots, and share the moments that make you who you are.',
};

const HERO_SLIDES = Array.isArray(landingContent.heroSlides) && landingContent.heroSlides.length > 0
  ? landingContent.heroSlides
  : [FALLBACK_HERO_SLIDE];

// Portrait-oriented warm family images for the hero story collage
const COLLAGE_IMAGES = [
  'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=560&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&h=560&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=560&fit=crop&q=80',
];

const BENEFITS = [
  {
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
    title: 'Preserve Your Memory',
    desc: 'Create a living archive of stories, photos, and documents that future generations will treasure.',
  },
  {
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    title: 'Strengthen Family Bonds',
    desc: 'Reconnect with relatives, share milestones, and keep every branch of the family in the loop.',
  },
  {
    icon: BookOpen,
    gradient: 'from-amber-500 to-orange-500',
    title: 'Uncover Your History',
    desc: 'Trace your lineage through generations and discover the stories that shaped who you are today.',
  },
];

const STEPS = [
  {
    number: '01',
    icon: Users,
    title: 'Add Family Members',
    desc: 'Create profiles for each member with photos, key dates, and their personal story.',
  },
  {
    number: '02',
    icon: Network,
    title: 'Map Connections',
    desc: 'Draw the relationships that bind your family — parents, children, spouses, and siblings.',
  },
  {
    number: '03',
    icon: Heart,
    title: 'Explore Together',
    desc: 'Share memories, celebrate birthdays, and discover your shared history as a family.',
  },
];

const FEATURES = [
  {
    id: 'tree',
    gradient: 'from-blue-500 to-cyan-400',
    icon: GitBranch,
    title: 'Interactive Family Tree',
    desc: 'Visualize your entire lineage in a beautiful, navigable tree. Zoom out for the big picture or zoom in to explore individual branches.',
    bullets: [
      'Visualize up to 10+ generations',
      'Smart relationship mapping',
      'Multiple viewing modes',
      'Searchable by name or date',
    ],
  },
  {
    id: 'birthdays',
    gradient: 'from-amber-500 to-orange-400',
    icon: Calendar,
    title: 'Birthdays & Milestones',
    desc: 'Never let an important date slip by. Track birthdays, anniversaries, and milestones for every member of your family.',
    bullets: [
      'Monthly birthday calendar',
      'Automatic reminders',
      'Anniversary tracking',
      "Today's celebrations widget",
    ],
  },
  {
    id: 'media',
    gradient: 'from-emerald-500 to-teal-400',
    icon: ImageIcon,
    title: 'Photos & Documents',
    desc: 'Upload, organize, and preserve the photos and documents that tell your family\'s visual history for generations to come.',
    bullets: [
      'Unlimited photo uploads',
      'Document preservation',
      'Organised by family member',
      'Shared family gallery',
    ],
  },
  {
    id: 'timeline',
    gradient: 'from-purple-500 to-violet-400',
    icon: Clock,
    title: 'Timeline & Community',
    desc: 'Build a shared family timeline of events, news, and milestones that everyone can contribute to and enjoy.',
    bullets: [
      'Family news board',
      'Events calendar',
      'Shared timeline history',
      'Community announcements',
    ],
  },
];

const QUOTES = [
  {
    text: 'In family life, love is the oil that eases friction, the cement that binds closer together, and the music that brings harmony.',
    author: 'Friedrich Nietzsche',
  },
  {
    text: "The love of a family is life's greatest blessing — a legacy that grows more precious with every generation.",
    author: '',
  },
];

// Portrait-oriented warm image for the quote section (same style contract as collage)
const QUOTE_IMAGE =
  'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=600&h=800&fit=crop&q=80';

const FONT_SERIF = { fontFamily: "'Playfair Display', serif" };

// ─── Helper ────────────────────────────────────────────────────────────────

function scrollTo(href) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Auto-advance hero slider every 5 s
  useEffect(() => {
    if (HERO_SLIDES.length <= 1) {
      return undefined;
    }

    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="bg-white">
      <PublicNavbar />

      {/* ══════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image slider — cross-fade between slides */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.image}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover family-photo"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Gradient overlay: strong on the left (text), light on the right (collage) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — hero text; key causes remount to replay entrance animation */}
            <div key={currentSlide} className="hero-text-enter">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/20">
                <TreePine className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">Family Heritage Platform</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                style={FONT_SERIF}
              >
                {slide.headline}
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                {slide.sub}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Tree
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#how-it-works');
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl border border-white/30 transition-all"
                >
                  See How It Works
                </a>
              </div>

              {/* Slide progress indicators */}
              <div className="flex gap-2 mt-10">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all rounded-full ${
                      i === currentSlide
                        ? 'w-8 h-2 bg-amber-400'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right — story collage (desktop only) */}
            <div
              className="relative mx-auto hidden lg:block"
              style={{ width: 380, height: 440 }}
            >
              {/* Card 1 — back-left */}
              <div
                className="absolute w-52 h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/60"
                style={{ top: 80, left: 0, transform: 'rotate(-8deg)', zIndex: 10 }}
              >
                <img
                  src={COLLAGE_IMAGES[0]}
                  alt="Family"
                  className="w-full h-full object-cover family-photo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-medium">Generations</p>
              </div>

              {/* Card 2 — centre-main */}
              <div
                className="absolute w-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
                style={{ top: 0, left: 80, height: 308, transform: 'rotate(3deg)', zIndex: 20 }}
              >
                <img
                  src={COLLAGE_IMAGES[1]}
                  alt="Family"
                  className="w-full h-full object-cover family-photo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-medium">Our Story</p>
              </div>

              {/* Card 3 — front-right */}
              <div
                className="absolute w-48 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80"
                style={{ top: 145, left: 190, transform: 'rotate(-4deg)', zIndex: 15 }}
              >
                <img
                  src={COLLAGE_IMAGES[2]}
                  alt="Family"
                  className="w-full h-full object-cover family-photo"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-3 left-3 text-white text-xs font-medium">Memories</p>
              </div>

              {/* Decorative dot grid */}
              <div className="absolute -bottom-6 -right-6 opacity-20">
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — BENEFITS (overlap cards)
      ══════════════════════════════════════════════ */}
      <section
        id="benefits"
        className="relative z-10 -mt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={FONT_SERIF}>
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS (3 steps)
      ══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 bg-stone-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
              Simple to Start
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2" style={FONT_SERIF}>
              Up and Running in Minutes
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
              No technical knowledge required. If you know your family, you have everything you need.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Connecting line — visible on desktop only */}
            <div
              className="hidden md:block absolute h-px bg-amber-200"
              style={{ top: 40, left: '22%', right: '22%' }}
            />

            {STEPS.map(({ number, title, desc }) => (
              <div key={number} className="flex flex-col items-center text-center relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg border-2 border-amber-200 mb-5 relative z-10">
                  <span
                    className="text-xl font-bold text-amber-600"
                    style={FONT_SERIF}
                  >
                    {number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 — FEATURES
      ══════════════════════════════════════════════ */}
      <section id="features" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
              Built for Families
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2" style={FONT_SERIF}>
              Everything Your Family Needs
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
              Thoughtfully designed tools that bring your family closer — wherever you are.
            </p>
          </div>

          <div className="space-y-20">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;

              return (
                <div
                  key={feature.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Illustration panel */}
                  <div className={isEven ? '' : 'lg:order-2'}>
                    <div
                      className={`h-72 sm:h-80 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl`}
                    >
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-white/80 text-sm font-medium">{feature.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Text panel */}
                  <div className={isEven ? '' : 'lg:order-1'}>
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
                      style={FONT_SERIF}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-base leading-relaxed mb-6">{feature.desc}</p>
                    <ul className="space-y-3">
                      {feature.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-gray-700 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 — FAMILY QUOTE
      ══════════════════════════════════════════════ */}
      <section id="quote" className="py-20 bg-stone-800 overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Portrait image — same warm-toned treatment as hero/collage */}
            <div className="relative h-80 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={QUOTE_IMAGE}
                alt="Family"
                className="w-full h-full object-cover family-photo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent" />
            </div>

            {/* Quotes */}
            <div className="space-y-10">
              {/* Primary quote — always shown */}
              <div>
                <div
                  className="text-amber-400 leading-none font-serif mb-2 select-none"
                  style={{ fontSize: '5rem' }}
                >
                  &ldquo;
                </div>
                <p
                  className="text-white/90 text-lg sm:text-xl leading-relaxed"
                  style={FONT_SERIF}
                >
                  {QUOTES[0].text}
                </p>
                <p className="text-amber-400/80 text-sm mt-4 font-medium">
                  — {QUOTES[0].author}
                </p>
              </div>

              {/* Secondary quote — desktop only */}
              {QUOTES[1] && (
                <div className="hidden sm:block border-t border-stone-700 pt-8">
                  <div
                    className="text-amber-400 leading-none font-serif mb-2 select-none"
                    style={{ fontSize: '3rem' }}
                  >
                    &ldquo;
                  </div>
                  <p className="text-white/70 text-base leading-relaxed italic" style={FONT_SERIF}>
                    {QUOTES[1].text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 6 — REPEATED CTA BAND
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={FONT_SERIF}>
            Your family story deserves to be told.
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
            Join families who are preserving their heritage and strengthening their bonds with
            Ahman Patigi Family Tree.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Start Today — It&apos;s Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 7 — CONTACT
      ══════════════════════════════════════════════ */}
      <section id="contact" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
              Get in Touch
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2" style={FONT_SERIF}>
              We&apos;d Love to Hear from You
            </h2>
            <p className="text-gray-500 mt-3">
              Questions, feedback, or just want to share your story? We&apos;re here.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-white rounded-2xl p-10 shadow-md text-center border border-green-100">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={FONT_SERIF}>
                Message Received
              </h3>
              <p className="text-gray-500">
                Thank you for reaching out. We&apos;ll be in touch within 2 business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-400 text-center">
                We typically respond within 2 business days.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 8 — FOOTER
      ══════════════════════════════════════════════ */}
      <footer id="footer" className="bg-gray-900 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-10 border-b border-gray-800">
            {/* Left — brand + write-up */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TreePine className="w-6 h-6 text-amber-400" />
                <span className="text-white text-xl font-bold" style={FONT_SERIF}>
                  Ahman Patigi Family Tree
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                A private, beautifully crafted space for families to preserve their history,
                celebrate their present, and share their story with generations to come.
              </p>
            </div>

            {/* Right — quick links */}
            <div className="flex flex-col sm:flex-row gap-8 md:justify-end">
              <div>
                <h4 className="text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4">
                  Navigate
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Home', href: '#hero' },
                    { label: 'Features', href: '#features' },
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Contact', href: '#contact' },
                  ].map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(link.href);
                        }}
                        className="text-gray-400 text-sm hover:text-amber-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4">
                  Account
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-400 text-sm hover:text-amber-400 transition-colors"
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="text-gray-400 text-sm hover:text-amber-400 transition-colors"
                    >
                      Create Account
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="pt-6 text-center">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} Ahman Patigi Family Tree. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
