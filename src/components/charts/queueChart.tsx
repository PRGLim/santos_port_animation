import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
} from "recharts"

type QueuePoint = {
  time: number
  queue: number
}

type QueueStats = {
  currentQueue: number
  avgWaitTime: number
  maxWaitTime: number
}
const queueChartConfig = {
  queue: {
    label: "Fila na barra",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function QueueAreaChart({
  currentQueue,
  avgWaitTime,
  maxWaitTime,
}: QueueStats) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fila na Barra</CardTitle>
        <CardDescription>
          Situação da fila
        </CardDescription>
      </CardHeader>

      {/* ==== KPIs ==== */}
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Fila atual</div>
            <div className="text-xl font-semibold">{currentQueue}</div>
          </div>

          <div>
            <div className="text-muted-foreground">Tempo médio</div>
            <div className="text-xl font-semibold">
              {avgWaitTime.toFixed(1)} h
            </div>
          </div>

          <div>
            <div className="text-muted-foreground">Tempo máximo</div>
            <div className="text-xl font-semibold">
              {maxWaitTime.toFixed(1)} h
            </div>
          </div>
        </div>

        {/* ==== CHART ====
        <ChartContainer config={queueChartConfig}>
          <AreaChart data={history} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v)}s`}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(label) => `Tempo: ${label}s`}
                />
              }
            />

            <Area
              type="linear"
              dataKey="queue"
              fill="var(--color-queue)"
              stroke="var(--color-queue)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer> */}
      </CardContent>

      {/* <CardFooter>
        <span className="text-sm text-muted-foreground">
          Evolução da fila desde o início da simulação
        </span>
      </CardFooter> */}
    </Card>
  )
}

