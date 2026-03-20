export type ScenarioConfig = {
  id: string;
  name: string;
  startDate: Date;
  startFilterDate: Date;
  endFilterDate: Date;
};

export const SCENARIOS: ScenarioConfig[] = [
    {
    id: "2SemDragagem2030",
    name: "Cenário 1: 2030 15m",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },
  {
    id: "2SemDragagem20302",
    name: "Cenário 2: 2030 15m Tecon10 + Rumo",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },
  {
    id: "ComDragagem2030",
    name: "Cenário 3: 2030 17m",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },
  {
    id: "ComDragagem20302",
    name: "Cenário 4: 2030 17m Tecon10 + Rumo",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },
  {
    id: "2SemDragagem2035",
    name: "Cenário 5: 2035 15m",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },
  {
    id: "ComDragagem2035",
    name: "Cenário 6: 2035 17m",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },

  {
    id: "S2025",
    name: "2025 Base",
    startDate: new Date(2025, 7, 1, 0, 0, 0),
    startFilterDate: new Date(2025, 7, 1, 0, 0, 0),
    endFilterDate: new Date(2025, 9, 30, 0, 0, 0),
  },
];