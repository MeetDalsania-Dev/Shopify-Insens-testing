function Hero() {
  const bottleRef = React.useRef(null);

  React.useEffect(() => {
    const onMove = (e) => {
      if (!bottleRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      bottleRef.current.style.transform = `translate3d(${-x}px, ${-y}px, 0) rotate(${x * 0.3}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="hero">
      <div className="hero-meta">
        <div className="cell">
          <div className="mono">N° 001 — SS·26</div>
          <div className="v">An olfactive sentence</div>
        </div>
        <div className="cell">
          <div className="mono">Composed in</div>
          <div className="v">Grasse &amp; Kyoto</div>
        </div>
        <div className="cell">
          <div className="mono">Edition</div>
          <div className="v">Six fragrances, one idea</div>
        </div>
        <div className="cell">
          <div className="mono">Available</div>
          <div className="v">Discovery set — 14 apr 26</div>
        </div>
      </div>

      <div className="hero-stage">
        <div className="hero-type">
          <span className="line"><span className="reveal-mask"><span>Perfume</span></span></span>
          <span className="line display-it"><span className="reveal-mask"><span>as <span className="amber">punctu-</span></span></span></span>
          <span className="line display-it"><span className="reveal-mask"><span>ation.</span></span></span>
          <span className="sub reveal">Six fragrances that end the sentence you’re wearing. No notes. No pyramids to memorize. Just a finishing mark.</span>
        </div>
        <div className="hero-bottle" ref={bottleRef}>
          <window.Bottle shape="prism" hue="amber" label="N°01" name="Vesper" size={480} />
        </div>
      </div>

      <div className="hero-foot">
        <a className="btn primary" data-hover href="#collection">
          <span className="dot"></span>
          Shop the collection
        </a>
        <a className="btn" data-hover href="#finale">
          Order a discovery set — $18
        </a>
        <div className="scrollhint mono">
          <span>Scroll</span>
          <span className="dash"></span>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
