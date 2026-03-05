import { useParams } from "react-router-dom";
import { Aside } from "../Components/Asides/Aside";
import { ChartTemplate } from "../Templates/chartTemplate";

export default function AlgorithmPage({ procesos, setProcesos, mostrarGrafico, setMostrarGrafico, quantum, setQuantum }) {
  const { type } = useParams();

  return (
    <>
      <div className="main-content">
        <ChartTemplate
          procesos={procesos}
          form={type?.toUpperCase()}
          quantum={quantum}
        />
      </div>
      <Aside
        procesos={procesos}
        setProcesos={setProcesos}
        setMostrarGrafico={setMostrarGrafico}
        form={type?.toUpperCase()}
        quantum={quantum}
        setQuantum={setQuantum}
      />
    </>
  );
}