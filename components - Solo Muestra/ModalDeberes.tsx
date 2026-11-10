'use client';

import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

interface ModalDeberesProps {
    isOpen: boolean;
    onClose: () => void;
    materia: string;
    studentUid: string;
    onSuccess: () => void;
}

export default function ModalDeberes({ isOpen, onClose, materia, studentUid, onSuccess }: ModalDeberesProps) {
    const [agrupador, setAgrupador] = useState('');
    const [contenidoGeneral, setContenidoGeneral] = useState('');
    const [subTitulo, setSubTitulo] = useState('');
    const [subDescripcion, setSubDescripcion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agrupador.trim() || !subTitulo.trim() || !subDescripcion.trim()) {
            alert("Por favor, llena el Agrupador, el Título del deber y la Descripción.");
            return;
        }

        setIsSubmitting(true);
        try {
            const nombreDocumento = agrupador.trim();
            const docRef = doc(
                db,
                `EV-Usuario-${materia}-Deberes/${studentUid}/EV-${materia}/Datos/${materia}-Deberes`,
                nombreDocumento
            );

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const docData = docSnap.data();
                let nextIndex = 1;

                for (let i = 1; i <= 20; i++) {
                    if (!docData[`titulo${i}`] && !docData[`descripcion${i}`]) {
                        nextIndex = i;
                        break;
                    }
                }

                if (nextIndex > 20) {
                    alert("Este bloque ya está lleno (máximo 20 deberes). Crea un nuevo bloque.");
                    setIsSubmitting(false);
                    return;
                }

                await updateDoc(docRef, {
                    [`titulo${nextIndex}`]: subTitulo,
                    [`descripcion${nextIndex}`]: subDescripcion
                });

            } else {
                await setDoc(docRef, {
                    titulo: nombreDocumento,
                    contenido: contenidoGeneral,
                    titulo1: subTitulo,
                    descripcion1: subDescripcion
                });
            }

            setAgrupador('');
            setContenidoGeneral('');
            setSubTitulo('');
            setSubDescripcion('');
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al guardar el deber:", error);
            alert("Hubo un error al guardar. Revisa la consola.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999
        }}>
            <div style={{
                backgroundColor: '#111', padding: '30px', borderRadius: '15px',
                width: '90%', maxWidth: '500px', border: '1px solid #1756AD',
                boxShadow: '0 0 20px rgba(23, 86, 173, 0.4)',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <h2 style={{ color: '#1756AD', marginTop: 0, textAlign: 'center' }}>
                    📚 Asignar Nuevo Deber
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                            Agrupador / Bloque (Ej: Etapa - 01)
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre del bloque..."
                            value={agrupador}
                            onChange={(e) => setAgrupador(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0AF51F',
                                backgroundColor: '#000', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                            Instrucciones Generales del Bloque (Opcional)
                        </label>
                        <textarea
                            placeholder="Se mostrará debajo del título principal..."
                            value={contenidoGeneral}
                            onChange={(e) => setContenidoGeneral(e.target.value)}
                            rows={2}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0AF51F',
                                backgroundColor: '#000', color: '#fff', fontSize: '16px', outline: 'none',
                                resize: 'none', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <hr style={{ borderColor: '#333', width: '100%' }} />

                    <div>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                            Título del Deber (Ej: Homework - 1)
                        </label>
                        <textarea
                            placeholder="Título específico de la tarea..."
                            value={subTitulo}
                            onChange={(e) => setSubTitulo(e.target.value)}
                            rows={2}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0AF51F',
                                backgroundColor: '#000', color: '#fff', fontSize: '16px', outline: 'none',
                                resize: 'none', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
                            Descripción y Detalles
                        </label>
                        <textarea
                            placeholder="Instrucciones, links o detalles de entrega..."
                            value={subDescripcion}
                            onChange={(e) => setSubDescripcion(e.target.value)}
                            rows={4}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #0AF51F',
                                backgroundColor: '#000', color: '#fff', fontSize: '16px', outline: 'none',
                                resize: 'none', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                backgroundColor: '#333', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                flex: 2, padding: '10px', borderRadius: '8px', border: 'none',
                                backgroundColor: '#1756AD', color: '#fff', cursor: 'pointer', fontWeight: 'bold',
                                opacity: isSubmitting ? 0.6 : 1
                            }}
                        >
                            {isSubmitting ? '⏳ Asignando...' : '💾 Asignar Deber'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}