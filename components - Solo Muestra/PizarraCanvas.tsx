'use client';

import { useEffect, useState, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ref, update, onValue, get, off } from "firebase/database";
import { doc, updateDoc, increment } from "firebase/firestore";
import { rtdb, db } from "@/firebase/firebase";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";

export default function PizarraCanvas({ mxxxx }: any) {
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isUpdatingRef = useRef(false);

    const lastElementsHashRef = useRef<string>("");
    const lastFilesHashRef = useRef<string>("{}");
    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [datosIniciales, setDatosIniciales] = useState<any>(null);

    const decodificarDatos = (datosCrudos: string, valorPorDefecto: any = []) => {
        if (!datosCrudos) return valorPorDefecto;
        try {
            const descomprimido = decompressFromUTF16(datosCrudos);
            if (descomprimido) return JSON.parse(descomprimido);
            return JSON.parse(datosCrudos);
        } catch (error) {
            return JSON.parse(datosCrudos);
        }
    };

    // 1. CARGA INICIAL
    useEffect(() => {
        const pizarraRef = ref(rtdb, `pizarras_tiempo_real/${materia}/${pizarraId}`);
        get(pizarraRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const elementosParseados = decodificarDatos(data.elementos, []);
                const archivosParseados = data.archivos ? decodificarDatos(data.archivos, {}) : {};

                setDatosIniciales({
                    elements: elementosParseados,
                    files: archivosParseados
                });
                lastElementsHashRef.current = JSON.stringify(elementosParseados);
                lastFilesHashRef.current = JSON.stringify(archivosParseados);
            } else {
                setDatosIniciales({ elements: [], files: {} });
                lastElementsHashRef.current = "[]";
                lastFilesHashRef.current = "{}";
            }
            setCargandoInicial(false);
        });
    }, [materia, pizarraId]);

    // 2. ESCUCHA DE CAMBIOS (Trazos e Imágenes en tiempo real para los alumnos)
    useEffect(() => {
        if (!excalidrawAPI || cargandoInicial) return;
        if (puedeEditar && isTeacher) return;

        const elementosRef = ref(rtdb, `pizarras_tiempo_real/${materia}/${pizarraId}/elementos`);
        const archivosRef = ref(rtdb, `pizarras_tiempo_real/${materia}/${pizarraId}/archivos`);

        ...........................................................................................................
        });

        const unsubArchivos = onValue(archivosRef, (snapshot) => {
            if (isUpdatingRef.current) return;
            if (!snapshot.exists()) return;

            const datosCrudos = snapshot.val();
            const archivosParseados = decodificarDatos(datosCrudos, {});
            const nuevoFilesHash = JSON.stringify(archivosParseados);

            if (nuevoFilesHash !== lastFilesHashRef.current) {
                try {
                    lastFilesHashRef.current = nuevoFilesHash;
                    const listaArchivos = Object.values(archivosParseados);
                    if (listaArchivos.length > 0) {
                        excalidrawAPI.addFiles(listaArchivos);
                    }
                } catch (error) { console.error("Error actualizando archivos en vivo:", error); }
            }
        });

        return () => {
            off(elementosRef);
            off(archivosRef);
        };
    }, [excalidrawAPI, materia, pizarraId, cargandoInicial, puedeEditar, isTeacher]);

    // GUARDADO INSTANTÁNEO AL ENCENDER "MODO INTERACTIVO"
    useEffect(() => {
        if (!modoInteractivo || !excalidrawAPI || !puedeEditar || !isTeacher || cargandoInicial) return;

        const elementos = excalidrawAPI.getSceneElements();
        const elementosActivos = elementos.filter((el: any) => el.isDeleted !== true);
        const currentHash = JSON.stringify(elementosActivos);

        // CAPA 1: LIMPIEZA DE HUÉRFANOS (Solo extraemos archivos que están actualmente en el lienzo)
        const todosLosArchivos = excalidrawAPI.getFiles();
        const archivosActivos: Record<string, any> = {};
        elementosActivos.forEach((el: any) => {
            if (el.type === "image" && el.fileId && todosLosArchivos?.[el.fileId]) {
                archivosActivos[el.fileId] = todosLosArchivos[el.fileId];
            }
        });
        const currentFilesHash = JSON.stringify(archivosActivos);

        const payload: Record<string, any> = {};
        const paquetesParaPesar: string[] = [];

        if (currentHash !== lastElementsHashRef.current) {
            lastElementsHashRef.current = currentHash;
            const datosComprimidos = compressToUTF16(currentHash);
            payload.elementos = datosComprimidos;
            paquetesParaPesar.push(datosComprimidos);
        }

        // CAPA 2: DETECCIÓN DIFERENCIAL (Solo entra si el hash de los archivos activos cambió)
        if (currentFilesHash !== lastFilesHashRef.current) {
            lastFilesHashRef.current = currentFilesHash;
            // CAPA 3: COMPRESIÓN EN UTF-16
            const archivosComprimidos = compressToUTF16(currentFilesHash);
            payload.archivos = archivosComprimidos;
            paquetesParaPesar.push(archivosComprimidos);
        }

        if (Object.keys(payload).length > 0) {
            const pizarraRef = ref(rtdb, `pizarras_tiempo_real/${materia}/${pizarraId}`);
            update(pizarraRef, payload);

            // CAPA 4: BÁSCULA VIRTUAL (Solo pesa lo transmitido en este instante)
            if (materia === "personal" && paquetesParaPesar.length > 0) {
                const sizeInBytes = new Blob(paquetesParaPesar).size;
                const sizeInMB = sizeInBytes / (1024 * 1024);

                updateDoc(doc(db, 'Pizarras_Personales', pizarraId), {
                    consumoDiarioMB: increment(sizeInMB),
                    fechaUltimaEdicion: new Date().toISOString()
                }).catch(err => console.error("Error actualizando consumo:", err));
            }
        }
    }, [modoInteractivo, excalidrawAPI, puedeEditar, isTeacher, cargandoInicial, materia, pizarraId]);


    // 3. PROCESAMIENTO Y TRANSMISIÓN CONTINUA (El motor principal)
    const guardarEnFirebase = (elementos: readonly any[], appState: any, files: any) => {
        if (!puedeEditar || cargandoInicial) return;

        let huboReemplazoDeMacros = false;

        // SISTEMA DE MACROS MATEMÁTICOS (Permanece Intacto)
        ..............................................................................................
                let nuevoTexto = el.text;
                const simbolos: Record<string, string> = {
                    "\\angle": "∠", "\\Delta": "Δ", "\\delta": "δ", "\\partial": "∂",
                    "\\div": "÷", "\\ohm": "Ω", "\\int": "∫", "\\pi": "π",
                    "\\theta": "θ", "\\mu": "μ", "\\infty": "∞", "\\pm": "±",
                    "\\approx": "≈", "\\neq": "≠"
                };

                Object.keys(simbolos).forEach(comando => {
                    if (nuevoTexto.includes(comando)) {
                        nuevoTexto = nuevoTexto.split(comando).join(simbolos[comando]);
                    }
                });

                const matrizRegex = /\\m\((\d+),(\d+)\)/g;
                if (matrizRegex.test(nuevoTexto)) {
                    nuevoTexto = nuevoTexto.replace(matrizRegex, (match: string, f: string, c: string) => {
                        const filas = parseInt(f);
                        const columnas = parseInt(c);
                        return Array.from({ length: filas })
                            .map(() => "[  " + Array(columnas).fill("0").join("   ") + "  ]")
                            .join("\n");
                    });
                }

                const superindices: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "x": "ˣ", "+": "⁺", "-": "⁻" };
                const subindices: Record<string, string> = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋" };

                nuevoTexto = nuevoTexto.replace(/\^([0-9\+\-]+)/g, (match: string, p1: string) => {
                    return p1.split('').map((char: string) => superindices[char] || char).join('');
                });

                nuevoTexto = nuevoTexto.replace(/_([0-9\+\-]+)/g, (match: string, p1: string) => {
                    return p1.split('').map((char: string) => subindices[char] || char).join('');
                });

                if (nuevoTexto !== el.text) {
                    huboReemplazoDeMacros = true;
                    return { ...el, text: nuevoTexto, originalText: nuevoTexto, version: el.version + 1 };
                }
            }
            return el;
        });

        if (huboReemplazoDeMacros) {
            excalidrawAPI.updateScene({ elements: elementosProcesados });
            return;
        }

        // EL MURO MAESTRO DE EMISIÓN
        if (isTeacher && !modoInteractivo) return;

        const elementosActivos = elementosProcesados.filter(el => el.isDeleted !== true);
        const currentHash = JSON.stringify(elementosActivos);

        // CAPA 1: LIMPIEZA DE HUÉRFANOS (En el proceso continuo)
        .............................................................................................
        });
        const currentFilesHash = JSON.stringify(archivosActivos);

        // Si nada cambió, salimos silenciosamente
        if (currentHash === lastElementsHashRef.current && currentFilesHash === lastFilesHashRef.current) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        // TEMPORIZADOR DE BATCHING (10s para no saturar Firebase)
        timerRef.current = setTimeout(() => {
            const payload: Record<string, any> = {};
            const paquetesParaPesar: string[] = [];

            if (currentHash !== lastElementsHashRef.current) {
                lastElementsHashRef.current = currentHash;
                const datosComprimidos = compressToUTF16(currentHash);
                payload.elementos = datosComprimidos;
                paquetesParaPesar.push(datosComprimidos);
            }

       ...................................................................................................
            }

        }, 10000); // 10 Segundos de Debounce
    };

    if (cargandoInicial) {
        return <div style={{ color: '#0AF51F', textAlign: 'center', paddingTop: '100px', fontWeight: 'bold' }}>Descomprimiendo base de datos...</div>;
    }

    return (
        <div spellCheck={false} style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative', zIndex: 10 }}>
            <div style={{ position: "absolute", inset: 0 }}>
                <Excalidraw
                    theme="dark"
                    viewModeEnabled={!puedeEditar}
                    initialData={datosIniciales}
                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                    onChange={guardarEnFirebase}
                    UIOptions={{
                        canvasActions: {
                            loadScene: false,
                            export: {
                                saveFileToDisk: true
                            },
                            saveToActiveFile: false,
                            changeViewBackgroundColor: true,
                            clearCanvas: true,
                        }
                    }}
                />
            </div>
        </div>
    );
}