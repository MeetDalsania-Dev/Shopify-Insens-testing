function Marquee() {
  const words = [
    { t: "smoke", em: true },
    { t: "·", dot: true },
    { t: "salt" },
    { t: "·", dot: true },
    { t: "iris", em: true },
    { t: "·", dot: true },
    { t: "ember" },
    { t: "·", dot: true },
    { t: "paper", em: true },
    { t: "·", dot: true },
    { t: "vellum" },
    { t: "·", dot: true },
    { t: "rain", em: true },
    { t: "·", dot: true },
  ];
  const render = (k) => words.map((w, i) => (
    <span key={`${k}-${i}`} className={w.em ? "" : ""}>
      {w.dot ? <span className="dot">·</span> : (w.em ? <em>{w.t}</em> : w.t)}
    </span>
  ));
  return (
    <section className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {render("a")}
        {render("b")}
      </div>
    </section>
  );
}
window.Marquee = Marquee;
