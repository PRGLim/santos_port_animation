import { formatTime } from "@/src/utils/formatters";

type Props = {
  arrivalTime?: string;   
  duration?: string;  
  actualEnd?: string;     
  currentTime: number;
}



export default function ProgressBerth({ arrivalTime, duration, actualEnd, currentTime }: Props) {
    const idealDepartureTime = Number(arrivalTime) + Number(duration)

  return (
    <div className="timeline">
        <p>{formatTime(currentTime, "ms")}</p>
        <div className="bar">
            <div className="expected" />
            <div className="actual" />
        </div>


        <div className="progress-labels">
            <span>{formatTime(Number(arrivalTime), "h")}</span>
            <span>{formatTime(Number(idealDepartureTime), "h")}</span>
            {
            (idealDepartureTime != Number(actualEnd))
                && formatTime(Number(actualEnd), "h")
            }
        </div>
    </div>

  )
}
