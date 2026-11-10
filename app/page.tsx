'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// 1. Importamos las funciones de Firebase necesarias
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function LandingPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // 2. Creamos una variable para saber si el usuario ya inició sesión
    const [usuarioLogueado, setUsuarioLogueado] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 3. Activamos el detector de Firebase apenas carga la página
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsuarioLogueado(true); // ¡El usuario ya estaba logueado en este dispositivo!
            } else {
                setUsuarioLogueado(false); // Es alguien nuevo o cerró sesión
            }
        });

        // Apagamos el detector si el componente se desmonta (buenas prácticas de React)
        return () => unsubscribe();
    }, []);

    const carreras = [
        { nombre: "MECATRÓNICA", ruta: "/malla/mecatronica" },
        { nombre: "SOFTWARE", ruta: "/malla/software" },
        { nombre: "MECÁNICA", ruta: "/malla/mecanica" },
        { nombre: "ELECTRÓNICA Y AUTOMATIZACIÓN", ruta: "/malla/electronica-y-automatizacion" },
        { nombre: "TELECOMUNICACIONES", ruta: "/malla/telecomunicaciones" },
    ];

    if (!mounted) return <div style={{ background: "#000", minHeight: "100vh" }} />;

    return (



        <div style={{
            width: "100%",
            minWidth: "1366px",
            minHeight: "100vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowX: "auto",
            backgroundColor: "#000"
        }}>
            {/* 🔹 FONDO LAVA Y PARTÍCULAS (Idéntico al sistema interno) */}
            <style>{`
                .lava-bg { position: absolute; top: 0; left: 0; width: 100%; min-width: 1366px; height: 100%; min-height: 100vh; z-index: 0; pointer-events: none; overflow: hidden; background: transparent; }
                .lava-blobs { position: absolute; width: 100%; height: 100%; filter: blur(60px); }
                .blob { position: absolute; border-radius: 50%; opacity: 0.15; }
                .blob-green { width: 75vw; height: 75vw; background: #0AF51F; left: -10vw; top: -10vh; animation: moveGreen 10s infinite alternate ease-in-out; }
                .blob-purple { width: 70vw; height: 70vw; background: #8A2BE2; right: -10vw; bottom: -10vh; animation: movePurple 10s infinite alternate ease-in-out; }
                .particles { position: absolute; width: 100%; height: 100%; z-index: 1; }
                .particle { position: absolute; border-radius: 50%; background: white; animation: floatParticle 8s infinite alternate ease-in-out; }
                .p1 { width: 6px; height: 6px; left: 20%; top: 80%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 5s; }
                .p2 { width: 8px; height: 8px; left: 75%; top: 40%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 7s; }
                .p3 { width: 5px; height: 5px; left: 40%; top: 20%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 9s; }
                .p4 { width: 7px; height: 7px; left: 85%; top: 85%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 6s; }
                .p5 { width: 9px; height: 9px; left: 10%; top: 30%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 11s; }

                @keyframes moveGreen { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40vw, 30vh) scale(1.2); } }
                @keyframes movePurple { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-40vw, -30vh) scale(1.3); } }
                @keyframes floatParticle { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(-300px) translateX(80px); } }

                /* EFECTOS PLATINADOS PARA LOS BOTONES */
                .btn-platinado-morado {
                    background: linear-gradient(145deg, #8A2BE2, #4B0082);
                    border: 2px solid #E5E4E2; /* Color Platino */
                    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.6), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.5);
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                }
                .btn-platinado-morado:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(138, 43, 226, 0.9), inset 0 2px 4px rgba(255,255,255,0.6); }

                .btn-platinado-negro {
                    background: linear-gradient(145deg, #2a2a2a, #111111);
                    border: 2px solid #C0C0C0; /* Borde Plata/Platino */
                    box-shadow: 0 5px 20px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.2), inset 0 -2px 5px rgba(0,0,0,0.8);
                    color: #E5E4E2; /* Texto platinado */
                    text-shadow: -1px -1px 0 rgba(255,255,255,0.3), 1px 1px 2px rgba(0,0,0,1); /* Efecto relieve (embossed) */
                }
                .btn-platinado-negro:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(10, 245, 31, 0.3), inset 0 2px 5px rgba(255,255,255,0.3); border-color: #0AF51F; color: #0AF51F; }
            `}</style>

            <div className="lava-bg">
                <div className="lava-blobs">
                    <div className="blob blob-green"></div>
                    <div className="blob blob-purple"></div>
                </div>
                <div className="particles">
                    <div className="particle p1"></div><div className="particle p2"></div><div className="particle p3"></div>
                    <div className="particle p4"></div><div className="particle p5"></div>
                </div>
            </div>

            {/* 🖥️ CONTENEDOR PRINCIPAL FLUIDO */}
            <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: "900px", paddingTop: "60px", paddingBottom: "50px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

                {/* LOGO Y TÍTULO */}
                <Image src="/EV.png" alt="Sello Estudio Verde" width={180} height={180} priority style={{ marginBottom: "20px", filter: "drop-shadow(0px 0px 15px rgba(10,245,31,0.5))" }} />
                <h1 style={{ color: "white", fontSize: "42px", fontWeight: "bold", textShadow: "0px 0px 15px rgba(0,0,0,0.9)", margin: "0 0 30px 0" }}>
                    Estudio Verde Educativo
                </h1>

                {/* VISIÓN */}
                <div style={{ background: "rgba(20,20,20,0.7)", padding: "40px 50px", borderRadius: "15px", border: "1px solid #333", marginBottom: "40px", backdropFilter: "blur(10px)", width: "100%", maxWidth: "850px" }}>
                    <h2 style={{ color: "#0AF51F", margin: "0 0 25px 0", fontSize: "28px", letterSpacing: "1px" }}>Nuestra Visión 🌿</h2>

                    <div style={{
                        color: "#d1d5db", /* Un gris ligeramente más claro y moderno */
                        fontSize: "18px",
                        lineHeight: "1.7",
                        textAlign: "center", /* 👈 Cambiamos el justificado por centrado */
                        fontWeight: "400",
                    }}>
                        <p style={{ marginBottom: "25px" }}>
                            Sabemos que dar el paso desde el colegio a la universidad es un desafío súper grande. <br />
                            Es el comienzo de un camino de gran
                            esfuerzo y dedicación, pero no todo es fácil.<br />
                            Casi un <strong style={{ color: "white" }}>80% de cada curso</strong> que ingresa a primer semestre pierde al menos una
                            materia, existe el peligro de las <strong style={{ color: "#ff4d4d" }}>terceras matrículas</strong> y se enfrentan a algunas de las materias más fuertes de la carrera.
                        </p>

                        <p style={{ margin: 0 }}>
                            Pero por eso estamos aquí.<br /> Nosotros nos encargamos de ayudar a los estudiantes con todo lo que podamos para que su semestre sea
                            una <strong style={{ color: "white" }}>experiencia de aprendizaje</strong> y no de sufrimiento por completar los puntos académicos.<br /> ¡Aquí tenemos nuestro <strong style={{ color: "#0AF51F" }}>ecosistema virtual</strong> para nuestros estudiantes y todos los que quieran ser parte de la comunidad Estudio Verde Educativo!
                        </p>
                    </div>
                </div>
                {/* ESCRITO MOTIVADOR */}
                <p style={{ color: "#aaa", fontSize: "18px", maxWidth: "700px", marginBottom: "50px", fontStyle: "italic" }}>
                    "Quieres ver las materias que vas aprobando y tener un regristro de ellas? Aquí tienes las mallas de tu carrera!"
                </p>

                {/* 4. MODIFICAMOS EL BOTÓN MORADO: Ahora es inteligente y sabe a dónde enviarte */}
                <button
                    className="btn-platinado-morado"
                    onClick={() => {
                        // Si ya está logueado, lo manda al Dashboard (institucion). Si no, al Login.
                        if (usuarioLogueado) {
                            router.push('/institucion');
                        } else {
                            router.push('/login');
                        }
                    }}
                    style={{ padding: "12px 30px", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease", marginBottom: "30px" }}
                >
                    {/* Cambia el texto y el icono dependiendo de la sesión */}
                    {usuarioLogueado ? (
                        <>
                            🏠 Estudiante Estudio Verde Educativo
                            <br /> Entra a tu perfil
                        </>
                    ) : (
                        <>
                            🎓 ¿Eres estudiante de Estudio Verde Educativo?
                            <br /> Inicia Sesión
                        </>
                    )}
                </button>

            </div>

            <div
                style={{
                    position: "relative", /* 👈 LA CLAVE QUE DESCUBRISTE - Botones */
                    zIndex: 5,            /* 👈 TRAE EL CONTENEDOR AL FRENTE */
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    rowGap: "30px",
                    columnGap: "30px",
                    width: "100%",
                    maxWidth: "1200px",
                    marginBottom: "40px"
                }}
            >
                {carreras.map((carrera) => (
                    <button
                        key={carrera.ruta}
                        className="btn-platinado-negro"
                        onClick={() => router.push(carrera.ruta)}
                        style={{
                            width: "100%",
                            height: "70px",
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "900",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            letterSpacing: "1px"
                        }}
                    >
                        {carrera.nombre}
                    </button>
                ))}
            </div>

            {/* 🌟 FOOTER AHORA SIGUE A LA BARRA: Añadimos boxSizing: "border-box" */}
            <div className="fix-movil" style={{ marginTop: "20px", position: "sticky", left: 0, width: "100vw", boxSizing: "border-box", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", backgroundColor: "rgba(0, 0, 0, 0.45)", borderTop: "1px solid #222", zIndex: 10 }}>
                <Image src="/EV.png" alt="Sello Estudio Verde" width={130} height={130} />
                <span style={{ color: "#888", fontSize: "20px", fontWeight: "bold", letterSpacing: "2px" }}>
                    ESTUDIO VERDE EDUCATIVO
                </span>
            </div>

        </div>        

    );
}