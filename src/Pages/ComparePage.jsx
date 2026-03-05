import { useState } from "react";
import { CompareAside } from "../Components/Asides/CompareAside";
import { ChartTemplate } from "../Templates/chartTemplate";

export default function ComparePage({ procesos, setProcesos, setMostrarGrafico, quantum, setQuantum }) {

  const [algoritmo1, setAlgoritmo1] = useState("FIFO");
  const [algoritmo2, setAlgoritmo2] = useState("SJF");

  const [avg1, setAvg1] = useState(null);
  const [avg2, setAvg2] = useState(null);

  const mejorAlgoritmo =
    avg1 !== null && avg2 !== null && avg1 !== avg2
      ? avg1 < avg2
        ? 1
        : 2
      : null;

  return (
    <>
      <div className="compare-content">
        <div className={`compare-card ${mejorAlgoritmo === 1 ? "best" : ""} ${mejorAlgoritmo === null ? "tie" : ""}`}>
          <ChartTemplate
            procesos={procesos}
            form={algoritmo1}
            quantum={quantum}
            mode="compare"
            onAverageCalculated={(avg) => setAvg1(avg)}
          />
        </div>

        <div className={`compare-card ${mejorAlgoritmo === 2 ? "best" : ""} ${mejorAlgoritmo === null ? "tie" : ""}`}>
          <ChartTemplate
            procesos={procesos}
            form={algoritmo2}
            quantum={quantum}
            mode="compare"
            onAverageCalculated={(avg) => setAvg2(avg)}
          />
        </div>
      </div>

      <CompareAside
        procesos={procesos}
        setProcesos={setProcesos}
        setMostrarGrafico={setMostrarGrafico}
        quantum={quantum}
        setQuantum={setQuantum}
        onAlgoritmosChange={(alg1, alg2) => {
          setAlgoritmo1(alg1);
          setAlgoritmo2(alg2);
        }}
      />
    </>
  );
}