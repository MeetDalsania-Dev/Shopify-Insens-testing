function Ritual() {
  return (
    <section className="ritual" id="ritual">
      <div className="left">
        <div className="eyebrow">The House — a short story</div>
        <h2>
          We started
          <br/>with a <em>sentence</em>.
          <br/>The scent came
          <br/>second.
        </h2>
      </div>
      <div className="right">
        <p className="lede">
          In 2023, our founder — a typesetter by training — noticed that every perfume
          she owned smelled like an adjective. She wanted a verb. Then a punctuation mark.
        </p>

        <p>
          <span className="dropcap">I</span>nsens was composed in two cities: Grasse for the raw materials,
          Kyoto for the restraint. Every fragrance in the edition begins with a line
          of writing — a comma, an ellipsis, an em dash — and ends with an accord that
          finishes the thought. The bottles are made of recycled smoke-tinted glass,
          pressed by a family workshop outside Lyon that has been making pharmacy bottles
          since 1912.
        </p>

        <blockquote className="pullquote">
          “A good sentence ends the way a good perfume dries down — quietly, and on purpose.”
        </blockquote>
        <div className="footnote">— Inès Moreau, founder · note on the first batch, n°001</div>

        <p style={{ marginTop: 48 }}>
          We release one edition per year. Six fragrances, numbered and named. When a
          batch is gone, it is gone. Reformulation is a form of lying and we are trying
          not to lie.
        </p>

        <p>
          If you are reading this far, you are the customer we designed this for.
          Write to us. The inbox is answered by a human, usually within a day, almost
          always by Inès.
        </p>

        <div className="footnote" style={{ marginTop: 48 }}>
          ¹ The discovery set is the right way to begin. Wear all six for a week. The
          sentence will choose you.
        </div>
      </div>
    </section>
  );
}
window.Ritual = Ritual;
