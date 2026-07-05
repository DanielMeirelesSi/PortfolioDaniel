import type { Project } from "@/data/content";

export default function Preview({ id }: { id: Project["id"] }) {
  if (id === "kmcontrol") {
    return (
      <div className="pv">
        <div className="pv-top">
          <span className="lbl">Dashboard · frota</span>
        </div>
        <div className="pv-body">
          <div className="pv-bars">
            <div className="pv-bar" style={{ height: "48%" }} />
            <div className="pv-bar acc" style={{ height: "82%" }} />
            <div className="pv-bar" style={{ height: "60%" }} />
            <div className="pv-bar" style={{ height: "72%" }} />
            <div className="pv-bar acc" style={{ height: "40%" }} />
            <div className="pv-bar" style={{ height: "66%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (id === "maisgrana") {
    return (
      <div className="pv">
        <div className="pv-top">
          <span className="lbl">Dashboard financeiro</span>
        </div>
        <div className="pv-body">
          <div className="pv-bars">
            <div className="pv-bar" style={{ height: "40%" }} />
            <div className="pv-bar" style={{ height: "64%" }} />
            <div className="pv-bar acc" style={{ height: "90%" }} />
            <div className="pv-bar" style={{ height: "52%" }} />
            <div className="pv-bar" style={{ height: "74%" }} />
            <div className="pv-bar acc" style={{ height: "38%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pv">
      <div className="pv-top">
        <span className="lbl">API · ingressos</span>
      </div>
      <div className="pv-body">
        <div className="pv-api">
          <div className="pv-row">
            <span className="pv-m g">GET</span> /api/sessoes
          </div>
          <div className="pv-row">
            <span className="pv-m">POST</span> /api/ingressos/comprar
          </div>
          <div className="pv-row">
            <span className="pv-m g">GET</span> /api/sessoes/{"{id}"}/assentos
          </div>
          <div className="pv-row">
            <span className="pv-m g">GET</span> /api/filmes
          </div>
        </div>
      </div>
    </div>
  );
}