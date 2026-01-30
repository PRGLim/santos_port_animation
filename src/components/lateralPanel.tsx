import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ship, Route, BarChart3 } from "lucide-react"
import VesselPanel from "./vessel_panel/vesselPanel"
import { VesselDetail } from "../animation/entities/VesselDetail"
import SegPanel from "./segment_panel/segPanel"
import { QueueAreaChart } from "./charts/queueChart"
import Image from 'next/image'

export type QueuePoint = {
  time: number
  queue: number
}


type Props = {
  selectedVessel: VesselDetail | null
  selectedSegment: any | null
  currentTime: number,
  currentQueue: number,
  avgWaitTime: number,
  maxWaitTime: number,
  history: QueuePoint[]
  onClosedSegment?: () => void
}

export function SidePanelTabs({
  selectedVessel,
  selectedSegment,
  currentTime,
  currentQueue,
  avgWaitTime,
  maxWaitTime,
  history,

  onClosedSegment
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

              <TabsList className="grid grid-cols-3 ml-5 mb-3">
                <TabsTrigger value="vessel">
                  <Ship className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="segment">
                  <Route className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <BarChart3 className="h-4 w-4" />
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
                <VesselPanel  currentTime={currentTime} vessel={selectedVessel}/>
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
                <SegPanel segment={selectedSegment} onClose={onClosedSegment}/>
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
              <QueueAreaChart currentQueue={currentQueue} avgWaitTime={avgWaitTime} maxWaitTime={maxWaitTime} history={history}/>
            
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
                    <div className="text-muted-foreground">Entradas médias:</div>
                    <div className="text-xl font-semibold">{7.2}</div>
                  </div>

                  <div>
                    <div className="text-muted-foreground">Saídas médias:</div>
                    <div className="text-xl font-semibold">{7.2}</div>
                  </div>
                </div>
            </CardContent>
            </Card>


            </CardContent>
          </TabsContent>
          
        </Tabs>
      </Card>
    </div>
  )
}
