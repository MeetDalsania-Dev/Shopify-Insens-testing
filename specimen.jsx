function Specimen() {
  return (
    <section className="specimen" id="specimen">
      <div className="hdr">
        <div>
          <div className="eyebrow">Specimen Sheet — the honest part</div>
          <h2 style={{ marginTop: 16 }}>
            Written <em>plainly,</em>
            <br/>so you know what you’re buying.
          </h2>
        </div>
        <div className="mono" style={{ color: "var(--mute)" }}>/ doc n°001 · public</div>
      </div>

      <div className="grid">
        <div className="cell col-6">
          <div className="num">01 / sizes</div>
          <div className="big">30 · <em>50</em> · 100 <span style={{ fontSize: 22, color: "var(--mute)" }}>ml</span></div>
          <div className="desc">Three formats, one juice. The 30ml fits a breast pocket; the 50ml is the honest daily; the 100ml is a declaration.</div>
        </div>

        <div className="cell col-6">
          <div className="num">02 / longevity</div>
          <div className="big">8 <em>hours</em></div>
          <div className="desc">Measured on human skin, not a blotter. Your mileage will vary by body chemistry, which is part of the point.</div>
          <div className="longevity">
            {[...Array(12)].map((_, i) => (
              <span key={i} className={i < 8 ? "on" : ""}></span>
            ))}
          </div>
        </div>

        <div className="cell col-4">
          <div className="num">03 / sillage</div>
          <div className="big">close — <em>intimate</em></div>
          <div className="desc">Readable within a handshake, not across a room. We are not here to announce ourselves.</div>
          <div className="sillage"></div>
        </div>

        <div className="cell col-4">
          <div className="num">04 / concentration</div>
          <div className="big">22%</div>
          <div className="desc">Eau de Parfum, pressed closer to extrait. Aged ninety days in amber glass before bottling.</div>
        </div>

        <div className="cell col-4">
          <div className="num">05 / cruelty</div>
          <div className="big">none.</div>
          <div className="desc">IFRA-compliant. Vegan. Not tested on anyone or anything. The sandalwood is plantation-grown.</div>
        </div>

        <div className="cell col-8">
          <div className="num">06 / materials sourced from</div>
          <div className="cities" style={{ marginTop: "auto" }}>
            <span className="city">Grasse<sup>FR</sup></span>
            <span className="city">Kannauj<sup>IN</sup></span>
            <span className="city">Kyoto<sup>JP</sup></span>
            <span className="city">Ouarzazate<sup>MA</sup></span>
            <span className="city">Sofia<sup>BG</sup></span>
            <span className="city">Mysore<sup>IN</sup></span>
            <span className="city">Reggio Calabria<sup>IT</sup></span>
            <span className="city">Haiti<sup>HT</sup></span>
          </div>
        </div>

        <div className="cell col-4">
          <div className="num">07 / returns</div>
          <div className="big">14 <em>days</em></div>
          <div className="desc">Even opened. Even half-gone. If the sentence isn’t yours, return it; we recycle the juice into our studio diffuser.</div>
        </div>

        <div className="cell col-12">
          <div className="num">08 / the honest price</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, marginTop: 8
          }}>
            <div>
              <div className="big">$148</div>
              <div className="desc" style={{ marginTop: 8 }}>50 ml · the starting edition, three of six scents at this price.</div>
            </div>
            <div>
              <div className="big"><em>$18</em></div>
              <div className="desc" style={{ marginTop: 8 }}>Discovery set · all six, in 2ml glass ampoules. Credit toward your first bottle.</div>
            </div>
            <div>
              <div className="big">free</div>
              <div className="desc" style={{ marginTop: 8 }}>Carbon-neutral shipping over $80. Refills at 40% off forever.</div>
            </div>
            <div>
              <div className="big">0%</div>
              <div className="desc" style={{ marginTop: 8 }}>Margin on refills. A bottle is furniture; a refill is ritual. We sell the ritual at cost.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Specimen = Specimen;
