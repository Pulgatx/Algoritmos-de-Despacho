export function Aside({ procesos, setProcesos, setMostrarGrafico, form, quantum, setQuantum }) {

    const paginaActual = form.toUpperCase();

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
                        <span class="material-symbols-outlined">
                            add_chart
                        </span>
                    </button>
                    {
                        paginaActual === "ROUND ROBIN" && (
                            <>
                                <label className="label_enter">Quantum</label>
                                <input
                                    type="number"
                                    value={quantum}
                                    onChange={(e) => setQuantum(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="input_cell"
                                    disabled={paginaActual !== "ROUND ROBIN"}
                                    min="0"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </>

                        )
                    }
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
                            {
                                paginaActual === "PRIORIDAD" && (
                                    <>
                                        <label className="label_enter">Prioridad</label>
                                        <input
                                            type="number"
                                            value={proceso.prioridad}
                                            onChange={(e) => actualizarProceso(proceso.id, "prioridad", e.target.value === "" ? "" : Number(e.target.value))}
                                            className="input_cell"
                                            disabled={paginaActual !== "PRIORIDAD"}
                                            min="0"
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </>

                                )
                            }

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
