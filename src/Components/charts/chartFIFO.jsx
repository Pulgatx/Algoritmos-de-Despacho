import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ChartFIFO({ procesos, mode, onAverageCalculated }) {
    const procesosOrdenados = [...procesos].sort((a, b) => a.tiempoLlegada - b.tiempoLlegada);

    let tiempoActual = 0;
    let ganttData = [];
    let tiempos = [];

    procesosOrdenados.forEach(proceso => {
        // Si el tiempo actual es menor al tiempo de llegada, avanzar el reloj
        if (tiempoActual < Number(proceso.tiempoLlegada)) {
            tiempoActual = Number(proceso.tiempoLlegada);
        }

        const inicio = tiempoActual;
        const fin = inicio + Number(proceso.rafaga);
        const tiempoEspera = inicio - Number(proceso.tiempoLlegada);
        const tiempoSistema = fin - Number(proceso.tiempoLlegada);

        ganttData.push({
            nombre: proceso.nombre,
            inicio: inicio,
            fin: fin,
            duracion: Number(proceso.rafaga)
        });

        tiempos.push({
            nombre: proceso.nombre,
            tiempoEspera,
            tiempoSistema
        });

        tiempoActual = fin;
    });

    const promedioEspera = tiempos.reduce((sum, p) => sum + p.tiempoEspera, 0) / tiempos.length;
    const promedioSistema = tiempos.reduce((sum, p) => sum + p.tiempoSistema, 0) / tiempos.length;

    if (onAverageCalculated) {
        onAverageCalculated(promedioEspera);
    }
    const ganttDataInvertido = [...ganttData].reverse();

    return (
        <div className="chart-info">
            <h2>Gráfica de Gantt - FIFO</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ganttDataInvertido} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    <Tooltip
                        // 2. Color del fondo al pasar el cursor (el "cursor")
                        // Se usa rgba para la transparencia (0.1 es 10% opaco)
                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}

                        // 3. Personalización del contenido del Tooltip
                        contentStyle={{
                            backgroundColor: '#1a2b3c', // Fondo del cuadro de diálogo del tooltip
                            border: '1px solid #ffffff33',
                            borderRadius: '4px',
                            color: 'white' // Color de texto general por defecto
                        }}
                        labelStyle={{ color: '#D0E7FA', fontWeight: 'bold' }} // Color para el nombre del proceso
                        itemStyle={{ color: 'white' }} // Color para los valores (Tiempo: X)

                        // Formateador opcional para cambiar la info mostrada
                        formatter={(value, name, props) => {
                            if (name === "duracion") {
                                return [`${value} unidades`, "Duración"];
                            }
                            // Ocultamos el valor de la barra transparente 'espera' en el tooltip
                            if (name === "espera") {
                                return null;
                            }
                            return [value, name];
                        }}
                    />
                    <Bar dataKey="inicio" name="Inicio" stackId="a" fill="transparent" />
                    <Bar dataKey="duracion" name="Duración" stackId="a" fill="#D0E7FA" radius={[0, 5, 5, 0]} />
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
                procesos.length > 0 &&(
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
                                {tiempos.map(({ nombre, tiempoEspera, tiempoSistema }) => (
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
