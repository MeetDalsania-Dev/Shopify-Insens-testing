"use client";
import { useState, useEffect } from "react";

const products = [
  {
    name: "Oud Noir",
    house: "Maison Al Arabiya",
    price: "$320",
    notes: "Oud · Sandalwood · Amber",
    bg: "from-oud-900 to-oud-700",
    emoji: "🖤",
  },
  {
    name: "Rose Safran",
    house: "Atelier Lumière",
    price: "$185",
    notes: "Rose · Saffron · Musk",
    bg: "from-rose-900 to-rose-700",
    emoji: "🌹",
  },
  {
    name: "Bois Doré",
    house: "Forêt Secrète",
    price: "$240",
    notes: "Cedarwood · Vanilla · Bergamot",
    bg: "from-amber-900 to-amber-700",
    emoji: "✨",
  },
  {
    name: "Nuit Blanche",
    house: "Parfums de Minuit",
    price: "$195",
    notes: "Jasmine · Iris · White Musk",
    bg: "from-slate-800 to-slate-600",
    emoji: "🌙",
  },
];

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "Browse thousands of artisan fragrances from independent houses worldwide.",
  },
  {
    n: "02",
    title: "Sample",
    desc: "Order discovery sets before committing to a full bottle.",
  },
  {
    n: "03",
    title: "Own",
    desc: "Secure checkout, authentic guarantee, and doorstep delivery.",
  },
];

const sellerSteps = [
  {
    n: "01",
    title: "List",
    desc: "Upload your fragrances with rich notes, accords, and story in minutes.",
  },
  {
    n: "02",
    title: "Reach",
    desc: "Access thousands of passionate fragrance buyers from day one.",
  },
  {
    n: "03",
    title: "Grow",
    desc: "Real-time analytics, payouts, and seller support to scale your house.",
  },
];

const testimonials = [
  {
    quote:
      "Insens introduced me to niche houses I'd never find elsewhere. It's become my go-to for every new season.",
    name: "Amelia R.",
    role: "Fragrance Collector, London",
  },
  {
    quote:
      "As an indie perfumer, Insens gave me global reach within weeks. My sales tripled in the first month.",
    name: "Karim S.",
    role: "Founder, Oud & Co.",
  },
  {
    quote:
      "The discovery sets are genius. I tried six new fragrances before choosing my signature scent.",
    name: "Sofia M.",
    role: "Lifestyle Blogger, Milan",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"buyers" | "sellers">("buyers");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-oud-950 font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-scrolled" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-display font-light tracking-widest text-oud-800 uppercase">
              Insens
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1" />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {["Discover", "How It Works", "For Sellers", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-oud-700 hover:text-oud-950 tracking-wide transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-sm text-oud-700 hover:text-oud-950 px-4 py-2 tracking-wide transition-colors">
              Sign In
            </a>
            <a href="#" className="btn-primary text-xs py-2.5 px-6">
              Get Started
            </a>
          </div>

          <button
            className="md:hidden p-2 text-oud-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-px bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-4 h-px bg-current transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-px bg-current transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-cream-50 border-t border-cream-200 px-6 py-6 space-y-4">
            {["Discover", "How It Works", "For Sellers", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block text-sm text-oud-700 tracking-wide py-1"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <a href="#" className="btn-primary text-xs py-3 w-full justify-center mt-4">
              Get Started
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-50 to-oud-50/30" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full border border-gold-200 opacity-40" />
        <div className="absolute top-32 right-20 w-48 h-48 rounded-full border border-gold-300 opacity-30" />
        <div className="absolute bottom-32 left-10 w-96 h-96 rounded-full border border-cream-300 opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          <p className="section-label mb-6 animate-fade-up">
            The Luxury Fragrance Marketplace
          </p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-none text-oud-950 mb-8 animate-fade-up"
            style={{ fontFamily: "Cormorant Garamond, Georgia, serif", animationDelay: "0.1s" }}>
            Scent is{" "}
            <span className="italic text-oud-700">Memory.</span>
            <br />
            Memory is{" "}
            <span className="italic text-gold-600">Art.</span>
          </h1>

          <p className="text-lg md:text-xl text-oud-600 max-w-2xl mx-auto leading-relaxed mb-12 font-light animate-fade-up"
            style={{ animationDelay: "0.2s" }}>
            Discover rare artisan fragrances from independent houses worldwide —
            or list your own creations on the world&apos;s most thoughtful perfume marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "0.3s" }}>
            <a href="#discover" className="btn-primary">
              Explore Fragrances
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#for-sellers" className="btn-outline">
              Start Selling
            </a>
          </div>

          <div className="mt-20 flex items-center justify-center gap-12 text-center animate-fade-up"
            style={{ animationDelay: "0.4s" }}>
            {[["2,400+", "Fragrances"], ["380+", "Artisan Houses"], ["48K+", "Collectors"]].map(
              ([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-display font-light text-oud-800">{num}</p>
                  <p className="text-xs tracking-widest text-oud-500 uppercase mt-1">{label}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-oud-400">
          <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-oud-400 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <div className="bg-oud-900 py-5 overflow-hidden">
        <div className="flex gap-16 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {Array(3).fill(["Oud", "Rose", "Saffron", "Amber", "Vetiver", "Jasmine", "Sandalwood", "Musk"]).flat().map(
            (note, i) => (
              <span key={i} className="text-cream-200 text-sm tracking-[0.3em] uppercase font-light">
                {note}
                <span className="text-gold-500 mx-8">✦</span>
              </span>
            )
          )}
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </div>

      {/* ── ABOUT / STORY ── */}
      <section id="about" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-4">Our Story</p>
            <h2 className="section-heading mb-6">
              Where Every Bottle <br />
              <span className="italic">Tells a Story</span>
            </h2>
            <div className="gold-line mb-8" style={{ marginLeft: 0 }} />
            <p className="text-oud-600 leading-relaxed mb-6 font-light text-lg">
              Insens was born from a simple belief: the world&apos;s most captivating fragrances
              shouldn&apos;t be locked behind department store counters. Independent perfumers
              craft extraordinary scents in small batches — they deserve a global stage.
            </p>
            <p className="text-oud-600 leading-relaxed font-light text-lg">
              We built a marketplace where collectors discover hidden gems, indie houses
              reach their true audience, and every transaction carries the care and
              integrity that fine fragrance deserves.
            </p>
            <div className="mt-10">
              <a href="#discover" className="btn-primary">
                Browse the Collection
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-oud-800 to-oud-950 rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-cream-50 text-center p-12">
                <div className="text-8xl mb-6">🫙</div>
                <p className="font-display text-3xl font-light italic text-cream-100 mb-2">
                  &ldquo;Wear your soul&rdquo;
                </p>
                <div className="w-8 h-px bg-gold-400 mx-auto my-4" />
                <p className="text-xs tracking-[0.3em] text-cream-300 uppercase">
                  The Insens Philosophy
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold-100 border border-gold-200 rounded-sm -z-10" />
            <div className="absolute -top-6 -right-6 w-24 h-24 dot-pattern opacity-30 -z-10" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 bg-oud-950 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-5" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-gold-400 font-medium mb-4">
              Simple by Design
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-cream-50 font-display">
              How Insens Works
            </h2>
            <div className="gold-line mt-6" />
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-1 mb-16 p-1 bg-oud-900 rounded-sm w-fit mx-auto">
            <button
              onClick={() => setActiveTab("buyers")}
              className={`px-8 py-2.5 text-sm tracking-widest uppercase transition-all duration-200 ${
                activeTab === "buyers"
                  ? "bg-gold-500 text-oud-950 font-medium"
                  : "text-cream-300 hover:text-cream-100"
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab("sellers")}
              className={`px-8 py-2.5 text-sm tracking-widest uppercase transition-all duration-200 ${
                activeTab === "sellers"
                  ? "bg-gold-500 text-oud-950 font-medium"
                  : "text-cream-300 hover:text-cream-100"
              }`}
            >
              For Sellers
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(activeTab === "buyers" ? steps : sellerSteps).map((step, i) => (
              <div key={step.n} className="relative group">
                <div className="border border-oud-700 p-8 hover:border-gold-500 transition-all duration-300 rounded-sm">
                  <span className="text-5xl font-display font-light text-gold-500/30 group-hover:text-gold-500/60 transition-colors block mb-4">
                    {step.n}
                  </span>
                  <h3 className="text-xl font-display text-cream-100 mb-3">{step.title}</h3>
                  <p className="text-cream-400 font-light leading-relaxed text-sm">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gold-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED FRAGRANCES ── */}
      <section id="discover" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Curated Selection</p>
          <h2 className="section-heading mb-4">
            Featured <span className="italic">Fragrances</span>
          </h2>
          <div className="gold-line mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.name} className="card-scent group cursor-pointer">
              <div className={`h-56 bg-gradient-to-br ${p.bg} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 dot-pattern opacity-10" />
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {p.emoji}
                </span>
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-xs text-gold-600 tracking-wider uppercase mb-1">{p.house}</p>
                <h3 className="font-display text-xl text-oud-900 mb-1">{p.name}</h3>
                <p className="text-xs text-oud-400 mb-3">{p.notes}</p>
                <div className="flex items-center justify-between">
                  <span className="text-oud-800 font-medium">{p.price}</span>
                  <button className="text-xs tracking-widest uppercase text-gold-600 hover:text-gold-700 transition-colors">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="btn-outline">
            View All Fragrances
          </a>
        </div>
      </section>

      {/* ── FOR SELLERS ── */}
      <section id="for-sellers" className="py-28 bg-cream-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full dot-pattern opacity-20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">For Perfumers & Houses</p>
              <h2 className="section-heading mb-6">
                Your Fragrance, <br />
                <span className="italic">The World&apos;s Stage</span>
              </h2>
              <div className="gold-line mb-8" style={{ marginLeft: 0 }} />
              <p className="text-oud-600 font-light leading-relaxed text-lg mb-8">
                Join 380+ independent perfumers already selling on Insens. List your
                fragrances in minutes, reach passionate collectors globally, and grow
                your house with real-time insights and dedicated support.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Zero upfront fees — only pay when you sell",
                  "Built-in storytelling tools for your brand",
                  "Direct access to 48,000+ serious collectors",
                  "Same-day payouts and full inventory control",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-oud-700">
                    <span className="text-gold-500 mt-0.5 text-lg leading-none">✦</span>
                    <span className="font-light">{point}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-gold">
                Apply as a Seller
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📦", label: "Easy Listing", desc: "Upload fragrances with notes, accords & story" },
                { icon: "📊", label: "Analytics", desc: "Track views, saves, and sales in real time" },
                { icon: "💳", label: "Fast Payouts", desc: "Receive earnings directly to your account" },
                { icon: "🌍", label: "Global Reach", desc: "Sell to collectors in 60+ countries" },
              ].map((item) => (
                <div key={item.label} className="bg-white border border-cream-200 p-6 rounded-sm hover:shadow-md transition-shadow">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <h4 className="font-display text-oud-800 text-lg mb-1">{item.label}</h4>
                  <p className="text-xs text-oud-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Voices from the Community</p>
          <h2 className="section-heading">
            What People <span className="italic">Are Saying</span>
          </h2>
          <div className="gold-line mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-cream-200 p-8 rounded-sm hover:shadow-lg transition-shadow">
              <div className="text-gold-400 text-3xl mb-6 font-display">&ldquo;</div>
              <p className="text-oud-700 font-light leading-relaxed italic mb-6">{t.quote}</p>
              <div className="border-t border-cream-200 pt-6">
                <p className="font-medium text-oud-800 text-sm">{t.name}</p>
                <p className="text-xs text-oud-400 mt-0.5 tracking-wide">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── APP DOWNLOAD ── */}
      <section className="py-20 bg-oud-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-5" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-400 font-medium mb-4">
            Available on iOS & Android
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-light text-cream-50 mb-6">
            The Insens App
          </h2>
          <p className="text-cream-300 font-light mb-10 max-w-lg mx-auto">
            Discover fragrances, track your collection, and shop on the go.
            Over 40,000 downloads and counting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-cream-50 px-6 py-3 rounded-sm transition-all">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <p className="text-xs text-cream-300">Download on the</p>
                <p className="font-medium tracking-wide">App Store</p>
              </div>
            </a>
            <a href="#" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-cream-50 px-6 py-3 rounded-sm transition-all">
              <span className="text-2xl">▶️</span>
              <div className="text-left">
                <p className="text-xs text-cream-300">Get it on</p>
                <p className="font-medium tracking-wide">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-4">Stay in the Loop</p>
          <h2 className="section-heading mb-4">
            New Arrivals. <span className="italic">First.</span>
          </h2>
          <div className="gold-line mt-4 mb-8" />
          <p className="text-oud-600 font-light mb-10">
            Subscribe for curated drops, limited releases, and exclusive access to new houses joining Insens.
          </p>

          {subscribed ? (
            <div className="bg-oud-50 border border-gold-200 rounded-sm px-8 py-6 text-oud-700">
              <span className="text-gold-500 text-2xl block mb-2">✦</span>
              <p className="font-display text-xl italic">Thank you for subscribing.</p>
              <p className="text-sm text-oud-500 mt-1">Your first curated drop is on its way.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 border border-cream-300 bg-white px-5 py-3.5 text-sm text-oud-800 placeholder:text-oud-400 focus:outline-none focus:border-oud-700 transition-colors rounded-sm"
              />
              <button type="submit" className="btn-primary whitespace-nowrap text-xs py-3.5">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-oud-950 text-cream-300">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-display font-light tracking-widest text-cream-100 uppercase">
                  Insens
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              </div>
              <p className="text-sm text-cream-400 font-light leading-relaxed">
                The world&apos;s most thoughtful marketplace for artisan fragrances.
              </p>
            </div>

            {[
              {
                heading: "Marketplace",
                links: ["Browse All", "New Arrivals", "Best Sellers", "Discovery Sets"],
              },
              {
                heading: "For Sellers",
                links: ["Apply Now", "Seller Dashboard", "Pricing", "Success Stories"],
              },
              {
                heading: "Company",
                links: ["About Us", "Blog", "Careers", "Contact"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-xs tracking-[0.2em] uppercase text-cream-200 mb-5 font-medium">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-cream-400 hover:text-cream-100 transition-colors font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-oud-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-cream-500">
              &copy; {new Date().getFullYear()} Insens Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-xs text-cream-500 hover:text-cream-300 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
