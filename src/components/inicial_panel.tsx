"use client";

import { ScenarioConfig, SCENARIOS } from "../animation/entities/scenario_infos";

type Props = {
  onSelectScenario: (scenario: ScenarioConfig) => void;
};

export default function InicialConfig({ onSelectScenario }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#0b1f2a",
          padding: "30px",
          borderRadius: "12px",
          color: "white",
          minWidth: "300px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Escolha o cenário
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#1f6feb",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}