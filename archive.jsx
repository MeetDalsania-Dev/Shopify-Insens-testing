function Archive() {
  return (
    <section className="archive" id="archive">
      <div className="hdr">
        <h2>The Archive</h2>
        <div className="masthead">
          THE INSENS PRESS<br/>
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 20, letterSpacing: 0, textTransform: "none", color: "var(--fg)" }}>est. 2026</span>
        </div>
        <div className="edition">Vol. IV — Spring Edition · Price: Complimentary</div>
      </div>

      <div className="archive-grid" style={{ marginTop: 64 }}>
        <div className="clipping big">
          <div className="pub">Vogue Italia</div>
          <div className="date">March 2026 · Print Edition</div>
          <blockquote className="quote">
            “A fragrance that <em>reads</em> rather than performs. Insens has
            turned perfume into editorial design.”
          </blockquote>
          <div className="byline">— Chiara Di Leone, Beauty Editor</div>
        </div>
        <div className="clipping">
          <div className="pub">Monocle</div>
          <div className="date">Issue 161</div>
          <blockquote className="quote">
            “Insens is doing for scent what small presses did for <em>paperbacks</em>:
            restoring the object.”
          </blockquote>
          <div className="byline">— S. Tuck, Design Desk</div>
        </div>
        <div className="clipping">
          <div className="pub">The Gentlewoman</div>
          <div className="date">Fall / Winter 2025</div>
          <blockquote className="quote">
            “Em Dash is the smokiest, most confident leather I’ve worn this year. It interrupts rooms.”
          </blockquote>
          <div className="byline">— Anonymous Nose</div>
          <div className="rating">★★★★★</div>
        </div>

        <div className="clipping" style={{ gridColumn: "span 2" }}>
          <div className="pub">Customer Letter — unedited</div>
          <div className="date">Received 02.14.26 · New York, NY</div>
          <blockquote className="quote" style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}>
            I bought N°01 on a whim in Lisbon. My husband said it smelled like the moment
            before rain. I have worn it every day since. Please do not reformulate. Please
            do not discontinue. I will ration it if I must. <em>— M., 41</em>
          </blockquote>
        </div>
        <div className="clipping" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            fontFamily: "var(--serif)", fontWeight: 300,
            fontSize: "clamp(56px, 7vw, 120px)", lineHeight: 1, letterSpacing: "-0.03em"
          }}>
            4.91<span style={{ fontSize: 32, color: "var(--accent)" }}>★</span>
          </div>
          <div className="byline">14,208 verified reviews</div>
          <div className="date" style={{ marginTop: 16 }}>98% would re-purchase</div>
        </div>
      </div>
    </section>
  );
}
window.Archive = Archive;
