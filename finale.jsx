function Finale() {
  const [time, setTime] = React.useState({ d: 3, h: 14, m: 22, s: 8 });
  React.useEffect(() => {
    const id = setInterval(() => {
      setTime(t => {
        let { d, h, m, s } = t;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        if (d < 0) { d = 0; h = 0; m = 0; s = 0; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="finale" id="finale">
      <div className="eyebrow">The Offer — read this last</div>
      <h2>
        Claim your
        <br/><em>sentence.</em>
      </h2>

      <p style={{
        marginTop: 40, fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: "clamp(22px, 2vw, 28px)", color: "var(--mute)",
        maxWidth: 640, marginLeft: "auto", marginRight: "auto"
      }}>
        The first batch of the SS·26 edition is 842 bottles. When they are gone, they are gone.
      </p>

      <div className="cta-row">
        <a className="btn primary" data-hover href="#" style={{ padding: "24px 36px", fontSize: 12 }}>
          <span className="dot"></span>
          Order a discovery set — $18
        </a>
        <a className="btn" data-hover href="#" style={{ padding: "24px 36px", fontSize: 12 }}>
          Shop full bottles
        </a>
      </div>

      <div style={{
        marginTop: 56, display: "flex", gap: 24, justifyContent: "center",
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em",
        textTransform: "uppercase", color: "var(--mute)"
      }}>
        <span>Discovery set pre-order closes in</span>
        <span style={{ color: "var(--accent)" }}>
          {pad(time.d)}d : {pad(time.h)}h : {pad(time.m)}m : {pad(time.s)}s
        </span>
      </div>

      <div className="trust">
        <div className="t"><span className="v">$18</span><span className="k">Try all six first</span></div>
        <div className="t"><span className="v">14 days</span><span className="k">Honest returns</span></div>
        <div className="t"><span className="v">Free</span><span className="k">Shipping over $80</span></div>
        <div className="t"><span className="v">842</span><span className="k">Bottles in this batch</span></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="col">
        <h4>Insens Maison · Paris · Kyoto</h4>
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 20, maxWidth: 420, lineHeight: 1.4 }}>
          A small fragrance house founded by a typesetter and a nose. One edition per year.
          No reformulations. No discounts. The inbox is answered by a human.
        </p>
      </div>
      <div className="col">
        <h4>Shop</h4>
        <a data-hover>The Collection</a>
        <a data-hover>Discovery Set</a>
        <a data-hover>Refills</a>
        <a data-hover>Gift Card</a>
      </div>
      <div className="col">
        <h4>Read</h4>
        <a data-hover>Journal</a>
        <a data-hover>The Archive</a>
        <a data-hover>Formulation Notes</a>
        <a data-hover>Press</a>
      </div>
      <div className="col">
        <h4>Help</h4>
        <a data-hover>Returns</a>
        <a data-hover>Shipping</a>
        <a data-hover>Contact Inès</a>
        <a data-hover>FAQ</a>
      </div>
      <div className="col">
        <h4>Newsletter</h4>
        <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, marginBottom: 12 }}>
          One letter per season. Never promotional.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="your@email" style={{
            flex: 1, padding: "12px 14px", background: "transparent",
            border: "1px solid var(--rule)", color: "var(--fg)",
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
            outline: "none"
          }}/>
          <button className="btn" data-hover style={{ padding: "10px 16px" }}>→</button>
        </div>
      </div>

      <div className="wordmark">Ins<em>ens.</em></div>
      <div className="legal">
        <span>© 2026 Insens Maison</span>
        <span>Paris · Kyoto · Grasse</span>
        <span>Privacy · Terms · Ingredients</span>
      </div>
    </footer>
  );
}
window.Finale = Finale;
window.Footer = Footer;
