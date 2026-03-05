import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

export function ChartRoundRobin({ procesos, quantum = 3, mode, onAverageCalculated }) {
    const procesosOrdenados = [...procesos].sort(
        (a, b) => Number(a.tiempoLlegada) - Number(b.tiempoLlegada)
    ); 

    let tiempoActual = 0;
    let rafagasTemporales = [];
    let tiemposFinal = {};

    let procesosPendientes = procesosOrdenados.map((p) => ({
        ...p,
        rafagaRestante: Number(p.rafaga),
        tiempoLlegadaNum: Number(p.tiempoLlegada),
    }));

    while (procesosPendientes.length > 0) {
        let disponibles = procesosPendientes.filter(
            (p) => p.tiempoLlegadaNum <= tiempoActual
        );
        if (disponibles.length === 0) {
            tiempoActual = Math.min(...procesosPendientes.map((p) => p.tiempoLlegadaNum));
            disponibles = procesosPendientes.filter(
                (p) => p.tiempoLlegadaNum <= tiempoActual
            );
        }

        let proceso = disponibles[0];
        const tiempoEjecucion = Math.min(quantum, proceso.rafagaRestante);
        const inicio = tiempoActual;
        const fin = inicio + tiempoEjecucion;

        rafagasTemporales.push({ nombre: proceso.nombre, inicio, fin, duracion: tiempoEjecucion });
        tiemposFinal[proceso.nombre] = fin;

        proceso.rafagaRestante -= tiempoEjecucion;
        tiempoActual = fin;

        procesosPendientes = procesosPendientes.filter((p) => p !== proceso);
        if (proceso.rafagaRestante > 0) procesosPendientes.push(proceso);
    }

    const tiempoTotal = tiempoActual;
    const nombresProcesos = [...new Set(procesosOrdenados.map((p) => p.nombre))];

    const segmentosPorProceso = {};
    nombresProcesos.forEach((nombre) => {
        let pos = 0;
        const segs = [];
        rafagasTemporales
            .filter((r) => r.nombre === nombre)
            .forEach((r) => {
                segs.push({ tipo: "gap", valor: Math.max(r.inicio - pos, 0) });
                segs.push({ tipo: "raf", valor: r.duracion });
                pos = r.fin;
            });
        segmentosPorProceso[nombre] = segs;
    });

    const maxSegmentos = Math.max(...nombresProcesos.map((n) => segmentosPorProceso[n].length), 0);

    const chartData = nombresProcesos.map((nombre) => {
        const fila = { nombre };
        const segs = segmentosPorProceso[nombre];
        for (let i = 0; i < maxSegmentos; i++) {
            fila[`seg_${i}`] = segs[i] ? segs[i].valor : 0;
            fila[`tipo_${i}`] = segs[i] ? segs[i].tipo : "gap";
        }
        return fila;
    });

    // ── Tiempos ────────────────────────────────────────────────────────────────
    const tiemposResultados = procesosOrdenados.map((p) => {
        const llegada = Number(p.tiempoLlegada);
        const rafagaTotal = Number(p.rafaga);
        const tiempoFin = tiemposFinal[p.nombre] || 0;
        return {
            nombre: p.nombre,
            tiempoEspera: tiempoFin - llegada - rafagaTotal,
            tiempoSistema: tiempoFin - llegada,
        };
    });

    const promedioEspera = tiemposResultados.reduce((s, p) => s + p.tiempoEspera, 0) / (tiemposResultados.length || 1);
    const promedioSistema = tiemposResultados.reduce((s, p) => s + p.tiempoSistema, 0) / (tiemposResultados.length || 1);

    if (onAverageCalculated) {
        onAverageCalculated(promedioEspera);
    }
    const chartDataInvertido = [...chartData].reverse();
    return (
        <div className="chart-info">
            <h2>Gráfica de Gantt — Round Robin { mode !== "compare" ? `(Quantum: ${quantum})` : "" }</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartDataInvertido}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="25%"
                >
                    <CartesianGrid
                        strokeDasharray="0" // Cambiado de "3 3" a "0" (o null) para línea sólida
                        stroke="rgba(255, 255, 255, 0.3)" // Blanco sólido con algo de transparencia para que no distraiga
                        fill="transparent"
                    />
                    <XAxis
                        type="number"
                        domain={[0, tiempoActual]}
                        tick={{ fill: 'white' }}
                        stroke="white"
                        tickLine={{ stroke: 'white' }}
                    />

                    <YAxis
                        dataKey="nombre"
                        type="category"
                        width={140}
                        tick={{ fill: 'white' }}
                        stroke="white"
                        tickLine={{ stroke: 'white' }}
                    />

                    {[...Array(maxSegmentos)].map((_, i) => (
                        <Bar
                            key={`seg_${i}`}
                            dataKey={`seg_${i}`}
                            stackId="stack"
                            isAnimationActive={false}
                            legendType="none"
                            radius={[0, 5, 5, 0]}
                        >
                            {chartDataInvertido.map((entry) => {
                                const esGap = entry[`tipo_${i}`] === "gap";
                                return (
                                    <Cell
                                        key={entry.nombre}
                                        fill={esGap ? "transparent" : "#D0E7FA"}
                                        stroke={esGap ? "none" : "rgba(0,0,0,0.15)"}
                                        strokeWidth={1}
                                    />
                                );
                            })}
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
            {
                procesos.length === 0 && (
                    <p style={{ color: 'white', marginTop: '20px', fontSize: '20px' }}>
                        No hay procesos para mostrar. Agrega algunos procesos en el panel de Procesos
                    </p>
                )
            }
            {
                procesos.length > 0 && (
                    <>
                        <h3>Tiempos de Espera y de Sistema</h3>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Proceso</th>
                                    <th>Tiempo de Espera</th>
                                    <th>Tiempo de Sistema</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tiemposResultados.map(({ nombre, tiempoEspera, tiempoSistema }) => (
                                    <tr key={nombre}>
                                        <td>{nombre}</td>
                                        <td>{tiempoEspera}</td>
                                        <td>{tiempoSistema}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><b>Promedio</b></td>
                                    <td><b>{promedioEspera.toFixed(2)}</b></td>
                                    <td><b>{promedioSistema.toFixed(2)}</b></td>
                                </tr>
                            </tfoot>
                        </table>

                    </>
                )
            }
        </div>
    );
}