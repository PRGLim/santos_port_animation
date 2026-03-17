import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ship, Route, BarChart3, Settings } from "lucide-react";
import VesselPanel from "./vessel_panel/vesselPanel";
import { VesselDetail } from "../animation/entities/VesselDetail";
import SegPanel from "./segment_panel/segPanel";
import { QueueAreaChart } from "./charts/queueChart";
import Image from "next/image";
import { KPIS } from "@/src/animation/types/kpis";

export type QueuePoint = {
  time: number;
  queue: number;
};

type Props = {
  selectedVessel: VesselDetail | null;
  selectedSegment: any | null;
  currentTime: number;
  kpis: KPIS;
  labelMode: "on" | "off" | "simplified";
  onLabelModeChange: (mode: "on" | "off" | "simplified") => void;
  onClosedSegment?: () => void;
};

export function SidePanelTabs({
  selectedVessel,
  selectedSegment,
  currentTime,
  kpis,
  labelMode,
  onLabelModeChange,

  onClosedSegment,
}: Props) {
  return (
    <div className="fixed right-4 top-4 z-50 w-80">
      <Card className="shadow-lg">
        <Tabs defaultValue="vessel">
          {/* ==== TAB ICONS ==== */}

          <div className="flex align-middle">
            <Image
              src="/image/paragon_logo.png"
              alt="Paragon Logo"
              width={130}
              height={50}
              className="z-3 right-5 absolute"
            />

            <TabsList className="grid grid-cols-4 ml-5 mb-3">
              <TabsTrigger value="vessel">
                <Ship className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="segment">
                <Route className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="stats">
                <BarChart3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="config">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ==== VESSEL TAB ==== */}
          <TabsContent value="vessel">
            <CardHeader>
              <CardTitle>Vessel</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVessel ? (
                <VesselPanel
                  currentTime={currentTime}
                  vessel={selectedVessel}
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No vessel selected
                </p>
              )}
            </CardContent>
          </TabsContent>

          {/* ==== SEGMENT TAB ==== */}
          <TabsContent value="segment">
            <CardHeader>
              <CardTitle>Segmento</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSegment ? (
                <SegPanel segment={selectedSegment} onClose={onClosedSegment} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No segment selected
                </p>
              )}
            </CardContent>
          </TabsContent>

          {/* ==== STATS TAB ==== */}
          <TabsContent value="stats">
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <QueueAreaChart
                currentQueue={kpis.queueKPI.queueSize}
                avgWaitTime={kpis.queueKPI.avgWaitTime}
                maxWaitTime={kpis.queueKPI.maxWaitTime}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Throughput</CardTitle>
                  <CardDescription>
                    Throughput médio diário (Navios por Dia)
                  </CardDescription>
                </CardHeader>

                {/* ==== KPIs ==== */}
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">
                        Entradas Total:
                      </div>
                      <div className="text-xl font-semibold">
                        {kpis.throughputKPI.avgEnterByDay}
                      </div>
                    </div>

                    <div>
                      <div className="text-muted-foreground">Saídas Total:</div>
                      <div className="text-xl font-semibold">
                        {kpis.throughputKPI.avgExitsByDay}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </TabsContent>

          {/* ==== CONFIG TAB ==== */}
          <TabsContent value="config">
            <CardHeader>
              <CardTitle>Configuração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm font-medium">Labels do mapa</div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onLabelModeChange("on")}
                  className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                    labelMode === "on"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  Ativar
                </button>

                <button
                  type="button"
                  onClick={() => onLabelModeChange("off")}
                  className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                    labelMode === "off"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  Desativar
                </button>

                <button
                  type="button"
                  onClick={() => onLabelModeChange("simplified")}
                  className={`rounded-md border px-2 py-1 text-sm transition-colors ${
                    labelMode === "simplified"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  Simplificar
                </button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
