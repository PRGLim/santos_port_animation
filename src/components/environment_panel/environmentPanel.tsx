import EnvironmentLabel from "./environmentLabels"
import { EnvSnapshot } from "@/src/animation/entities/Environments/EnvTeste"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { useState } from "react"
import { CloudCog, SlidersHorizontal, X } from "lucide-react"


type Props = {
  tideHeight?: EnvSnapshot,
  current?: EnvSnapshot,
  visibility?: EnvSnapshot,
  waveFreq?: EnvSnapshot,
  waveHeight?: EnvSnapshot,
  windSpeed?: EnvSnapshot,
}

export default function EnvironmentPanel(props: Props) {
  const [open, setOpen] = useState(true)

 return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        {!open && (
          <button
            className="fixed left-8 top-8 z-50 rounded-full bg-background p-3 shadow hover:bg-muted"
            aria-label="Abrir painel"
          >
            <CloudCog className="h-5 w-5" />
          </button>
        )}
      </CollapsibleTrigger>

      {/* 🔹 CONTEÚDO (painel inteiro) */}
      <CollapsibleContent>
        <div className="environment-panel relative w-[320px]">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 z-10 rounded p-1 hover:bg-muted"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>

          <Accordion
            type="multiple"
            className="w-full max-h-400 overflow-y-auto no-scrollbar"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Altura da Maré (m):</AccordionTrigger>
              <AccordionContent>
                <EnvironmentLabel current={props.tideHeight || null}/>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Corrente (nós):</AccordionTrigger>
              <AccordionContent>
                <EnvironmentLabel current={props.current || null}/>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Visibilidade (mn):</AccordionTrigger>
              <AccordionContent>
                <EnvironmentLabel current={props.visibility || null}/>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="item-4">
              <AccordionTrigger>Onda Período (s):</AccordionTrigger>
              <AccordionContent>
                <EnvironmentLabel current={props.waveFreq || null}/>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Altura da Onda (m):</AccordionTrigger>
              <AccordionContent>
                <EnvironmentLabel current={props.waveHeight || null}/>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Velocidade do Vento (nós):</AccordionTrigger>
              <AccordionContent>
                <EnvironmentLabel current={props.windSpeed || null}/>
              </AccordionContent>
            </AccordionItem>            

          </Accordion>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
