function Collection() {
  const fragrances = [
    {
      n: "01", name: "Vesper", kind: "comma,",
      tagline: "a pause, not an ending",
      shape: "prism", hue: "amber",
      accords: [
        ["01", "bergamot rind", "top"],
        ["02", "iris absolute", "heart"],
        ["03", "warm amber", "base"],
        ["04", "pink pepper", "top"],
      ],
      price: "$148",
    },
    {
      n: "02", name: "Ellipsis", kind: "…",
      tagline: "left deliberately unfinished",
      shape: "orb", hue: "iris",
      accords: [
        ["01", "wet iris", "top"],
        ["02", "violet leaf", "heart"],
        ["03", "ambrette seed", "heart"],
        ["04", "cashmeran", "base"],
      ],
      price: "$164",
    },
    {
      n: "03", name: "Em Dash", kind: "—",
      tagline: "interrupts the room",
      shape: "column", hue: "smoke",
      accords: [
        ["01", "birch tar", "top"],
        ["02", "leather", "heart"],
        ["03", "smoked vetiver", "base"],
        ["04", "black tea", "heart"],
      ],
      price: "$172",
    },
    {
      n: "04", name: "Asterisk", kind: "*",
      tagline: "a footnote you will keep thinking about",
      shape: "flask", hue: "rust",
      accords: [
        ["01", "saffron", "top"],
        ["02", "rose de mai", "heart"],
        ["03", "oud", "base"],
        ["04", "benzoin", "base"],
      ],
      price: "$186",
    },
    {
      n: "05", name: "Period", kind: ".",
      tagline: "closes what you were saying",
      shape: "prism", hue: "moss",
      accords: [
        ["01", "fig leaf", "top"],
        ["02", "oakmoss", "heart"],
        ["03", "patchouli", "base"],
        ["04", "labdanum", "base"],
      ],
      price: "$148",
    },
    {
      n: "06", name: "Question", kind: "?",
      tagline: "leaves you wanting an answer",
      shape: "orb", hue: "salt",
      accords: [
        ["01", "sea spray", "top"],
        ["02", "neroli", "heart"],
        ["03", "white musk", "base"],
        ["04", "ambergris", "base"],
      ],
      price: "$156",
    },
  ];

  return (
    <section id="collection">
      <div style={{ padding: "100px var(--gutter) 40px", borderTop: "1px solid var(--rule)" }}>
        <div className="eyebrow">The Collection — six punctuation marks</div>
        <h2 style={{
          fontFamily: "var(--serif)", fontWeight: 300,
          fontSize: "clamp(56px, 9vw, 160px)", lineHeight: 0.9, letterSpacing: "-0.04em",
          marginTop: 24, maxWidth: "14ch"
        }}>
          Read the <em style={{ fontStyle: "italic", color: "var(--accent)" }}>sentence,</em> not the label.
        </h2>
      </div>
      {fragrances.map((f, i) => (
        <div className="chapter" key={f.n}>
          <div className="side">
            <div>
              <div className="eyebrow">Chapter {f.n} — {f.kind}</div>
              <div className="numeral reveal-mask"><span>N°{f.n}</span></div>
              <div className="name">
                {f.name.split(" ").map((w, wi) => (
                  <span key={wi}>
                    {wi === 0 ? <>{w} </> : <em>{w}</em>}
                  </span>
                ))}
              </div>
              <p style={{
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 24,
                marginTop: 16, color: "var(--mute)", maxWidth: 520
              }}>{f.tagline}.</p>

              <ul className="accords">
                {f.accords.map((a, ai) => (
                  <li key={ai}>
                    <span className="idx">{a[0]}</span>
                    <span className="nm">{a[1]}</span>
                    <span className="pct">{a[2]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing">
              <span className="price">{f.price}</span>
              <div className="sizes">
                <span className="size">30ml</span>
                <span className="size active">50ml</span>
                <span className="size">100ml</span>
              </div>
              <a className="btn" data-hover style={{ marginLeft: "auto" }} href="#finale">
                <span className="dot"></span>
                Add to bag
              </a>
            </div>
          </div>
          <div className="visual">
            <div className="bottle">
              <window.Bottle shape={f.shape} hue={f.hue} label={`N°${f.n}`} name={f.name} size={420}/>
            </div>
            <div style={{
              position: "absolute", top: 24, left: 24,
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--mute)"
            }}>
              Insens / {f.n} / {f.kind}
            </div>
            <div style={{
              position: "absolute", bottom: 24, right: 24,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 160,
              color: "var(--accent)", opacity: 0.22, lineHeight: 1,
              pointerEvents: "none"
            }}>{f.kind}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
window.Collection = Collection;
