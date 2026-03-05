import { ChartFIFO } from "../Components/charts/chartFIFO";
import { ChartSJF } from "../Components/charts/chartSJF";
import { ChartPrioridad } from "../Components/charts/chartPrioridad";
import { ChartRoundRobin } from "../Components/charts/chartRoundRobin";


export function ChartTemplate({ procesos, form, quantum, mode, onAverageCalculated }) {
    const selectAlgorithm = (form) => {
        switch (form) {
            case 'FIFO':
                return <ChartFIFO procesos={procesos} mode={mode} onAverageCalculated={onAverageCalculated} />;
            case 'SJF':
                return <ChartSJF procesos={procesos} mode={mode} onAverageCalculated={onAverageCalculated} />;
            case 'PRIORIDAD':
                return <ChartPrioridad procesos={procesos} mode={mode} onAverageCalculated={onAverageCalculated} />;
            case 'ROUND ROBIN':
                return <ChartRoundRobin procesos={procesos} quantum={quantum} mode={mode} onAverageCalculated={onAverageCalculated} />;
            default:
                return null;
        }
    }

    return (
        <div>
            {selectAlgorithm(form)}
        </div>
    );
}
