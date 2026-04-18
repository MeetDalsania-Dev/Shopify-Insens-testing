function Anatomy() {
  const rows = [
    { label: "Top — 0 to 15 min", notes: "bergamot", em: "pink pepper", extra: "iris concrete", intensity: 28 },
    { label: "Heart — 15 min to 2 h", notes: "iris absolute", em: "violet leaf", extra: "ambrette", intensity: 64 },
    { label: "Base — 2 h onward", notes: "amber", em: "sandalwood", extra: "white musk", intensity: 92 },
  ];
  return (
    <section className="anatomy" id="anatomy">
      <div className="eyebrow">The Anatomy — how a sentence is built</div>
      <h2 className="title" style={{ marginTop: 24 }}>
        Three <em>acts,</em> one
        <br />punctuation mark.
      </h2>
      <div className="pyramid">
        {rows.map((r, i) => (
          <div className="row" key={i}>
            <div className="label">{r.label}</div>
            <div className="notes">
              {r.notes}, <em>{r.em}</em>, {r.extra}.
            </div>
            <div className="bar" style={{ "--w": `${r.intensity}%` }}></div>
          </div>
        ))}
      </div>
      <p style={{
        marginTop: 64, fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: "clamp(22px, 2.4vw, 34px)", maxWidth: 760, color: "var(--mute)"
      }}>
        We list our notes as a sentence — the way your skin reads them — rather than as a pyramid.
        The order is not hierarchy. It’s grammar.
      </p>
    </section>
  );
}
window.Anatomy = Anatomy;
