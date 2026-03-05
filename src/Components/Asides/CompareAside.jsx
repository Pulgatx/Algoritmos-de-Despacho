import { useState } from "react";

export function CompareAside({ procesos, setProcesos, setMostrarGrafico, quantum, setQuantum, onAlgoritmosChange }) {
    const ALGORITMOS = ["FIFO", "SJF", "ROUND ROBIN", "PRIORIDAD"];

    const [algoritmo1, setAlgoritmo1] = useState("FIFO");
    const [algoritmo2, setAlgoritmo2] = useState("SJF");

    const handleAlgoritmo1 = (valor) => {
        setAlgoritmo1(valor);
        onAlgoritmosChange?.(valor, algoritmo2);
    };

    const handleAlgoritmo2 = (valor) => {
        setAlgoritmo2(valor);
        onAlgoritmosChange?.(algoritmo1, valor);
    };

    const necesitaQuantum = algoritmo1 === "ROUND ROBIN" || algoritmo2 === "ROUND ROBIN";
    const necesitaPrioridad = algoritmo1 === "PRIORIDAD" || algoritmo2 === "PRIORIDAD";

    const agregarProceso = () => {
        setProcesos((prevProcesos) => {
            const nuevoId = prevProcesos.length + 1;
            const nuevoProceso = { id: nuevoId, nombre: `Proceso ${nuevoId}`, rafaga: 0, tiempoLlegada: 0, prioridad: 0 };
            return [...prevProcesos, nuevoProceso];
        });
    };

    const actualizarProceso = (id, campo, valor) => {
        if (valor >= 0 || valor === "") {
            setProcesos((prevProcesos) =>
                prevProcesos.map((proceso) =>
                    proceso.id === id ? { ...proceso, [campo]: valor } : proceso
                )
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMostrarGrafico(true);
    };

    const eliminarProceso = (id) => {
        setProcesos((prevProcesos) => {
            const procesosFiltrados = prevProcesos.filter((proceso) => proceso.id !== id);

            return procesosFiltrados.map((proceso, index) => ({
                ...proceso,
                id: index + 1,
                nombre: `Proceso ${index + 1}`
            }));
        });
    };

    return (
        <aside className="aside">
            <form onSubmit={handleSubmit} className="main_form">
                <div className="processButtons">
                    <button type="submit" className="form_button">
                        <span>Generar Gráfico</span>
                        <span className="material-symbols-outlined">add_chart</span>
                    </button>

                    <label className="label_enter">Algoritmo 1</label>
                    <select
                        value={algoritmo1}
                        onChange={(e) => handleAlgoritmo1(e.target.value)}
                        className="input_cell"
                    >
                        {ALGORITMOS
                            .filter((alg) => alg !== algoritmo2)
                            .map((alg) => (
                                <option key={alg} value={alg}>{alg}</option>
                            ))}
                    </select>

                    <label className="label_enter">Algoritmo 2</label>
                    <select
                        value={algoritmo2}
                        onChange={(e) => handleAlgoritmo2(e.target.value)}
                        className="input_cell"
                    >
                        {ALGORITMOS
                            .filter((alg) => alg !== algoritmo1)
                            .map((alg) => (
                                <option key={alg} value={alg}>{alg}</option>
                            ))}
                    </select>

                    {necesitaQuantum && (
                        <>
                            <label className="label_enter">Quantum</label>
                            <input
                                type="number"
                                value={quantum}
                                onChange={(e) => setQuantum(e.target.value === "" ? "" : Number(e.target.value))}
                                className="input_cell"
                                min="1"
                                onWheel={(e) => e.target.blur()}
                            />
                        </>
                    )}
                </div>

                {procesos.map((proceso) => (
                    <div key={proceso.id} className="form_process_container">
                        <button
                            type="button"
                            className="delete_button"
                            onClick={() => eliminarProceso(proceso.id)}
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                        <h2 className="process_name">{proceso.nombre}</h2>
                        <div className="sub_form">
                            <label className="label_enter">Ráfaga</label>
                            <input
                                type="number"
                                value={proceso.rafaga}
                                onChange={(e) => actualizarProceso(proceso.id, "rafaga", e.target.value === "" ? "" : Number(e.target.value))}
                                className="input_cell"
                                min="0"
                                onWheel={(e) => e.target.blur()}
                            />
                            <label className="label_enter">Tiempo de llegada</label>
                            <input
                                type="number"
                                value={proceso.tiempoLlegada}
                                onChange={(e) => actualizarProceso(proceso.id, "tiempoLlegada", e.target.value === "" ? "" : Number(e.target.value))}
                                className="input_cell"
                                min="0"
                                onWheel={(e) => e.target.blur()}
                            />
                            {necesitaPrioridad && (
                                <>
                                    <label className="label_enter">Prioridad</label>
                                    <input
                                        type="number"
                                        value={proceso.prioridad}
                                        onChange={(e) => actualizarProceso(proceso.id, "prioridad", e.target.value === "" ? "" : Number(e.target.value))}
                                        className="input_cell"
                                        min="0"
                                        onWheel={(e) => e.target.blur()}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
                <button type="button" onClick={agregarProceso} className="addProcessButton">
                    <span>Agregar Proceso</span>
                    <span className="material-symbols-outlined">add</span>
                </button>

            </form>
        </aside>
    );
}