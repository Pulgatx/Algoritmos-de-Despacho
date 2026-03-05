// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import FloatingSideBar from "./Components/floatingSideBar/FloatingSidebar";
import AlgorithmPage from "./Pages/AlgorithmPage";
import ComparePage from "./Pages/ComparePage";
import "./App.css";

export default function App() {
  const [procesos, setProcesos] = useState([{ id: 1, nombre: "Proceso 1", rafaga: 0, tiempoLlegada: 0, prioridad: 0 }]);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);
  const [quantum, setQuantum] = useState(3);

  return (
    <> {/* Use a fragment or just the elements */}
      <FloatingSideBar />
      <div className="page-layout">
        <Routes>
          <Route path="/" element={<Navigate to="/algorithm/fifo" replace />} />
          <Route
            path="/algorithm/:type"
            element={
              <AlgorithmPage
                procesos={procesos}
                setProcesos={setProcesos}
                mostrarGrafico={mostrarGrafico}
                setMostrarGrafico={setMostrarGrafico}
                quantum={quantum}
                setQuantum={setQuantum}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <ComparePage
                procesos={procesos}
                setProcesos={setProcesos}
                mostrarGrafico={mostrarGrafico}
                setMostrarGrafico={setMostrarGrafico}
                quantum={quantum}
                setQuantum={setQuantum}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}