'use client';

import { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
    onAuthStateChanged
} from "firebase/auth";
// 🔹 NUEVO: Importamos las herramientas de Firestore
import { doc, setDoc } from "firebase/firestore";
// 🔹 NUEVO: Nos aseguramos de importar la base de datos 'db'
import { auth, db } from "@/firebase/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    /* 🔹 ESTADO PARA DETECTAR CELULARES */
    const [isMobile, setIsMobile] = useState(false);

    /* 🔹 AUTH LISTENER */
    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) console.log("🔥 AUTH OK:", user.uid);
            else console.log("❌ NO autenticado");
        });
        return () => unsubscribe();
    }, []);

    /* 🔹 POSICIONES FIJAS */
    const loginPos = { x: 250, y: 280 };
    const registerPos = { x: 650, y: 290 };

    /* 🔹 TAMAÑO BASE LAPTOP */
    const baseWidth = 1366;
    const baseHeight = 768;
    const [scale, setScale] = useState(1);

    /* 🔹 ESCALADO RESPONSIVE */
    useEffect(() => {
        const updateScale = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
                setScale(1); // En celulares mantiene el tamaño original para permitir scroll
            } else {
                setIsMobile(false);
                const scaleX = window.innerWidth / baseWidth;
                const scaleY = window.innerHeight / baseHeight;
                setScale(Math.min(scaleX, scaleY)); // En PC se adapta a la pantalla
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    /* 🔹 LOGIN */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            setMessage("✅ Sesión iniciada correctamente");
            router.push(`/institucion?uid=${uid}`);
        } catch (error: any) {
            setMessage("❌ Error al iniciar sesión: " + error.message);
        }
    };

    /* 🔹 REGISTRO (CON INYECCIÓN A FIRESTORE) */
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registerEmail.toLowerCase().trim().endsWith("@estudioverdee.edu.ec")) {
            alert("Solo correos @estudioverdee.edu.ec");
            return;
        }

        try {
            // 1. Crear el usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            const user = userCredential.user;

            // 🔹 2. NUEVO: Guardar el registro en Firestore en la colección Usuarios_Registrados
            await setDoc(doc(db, "Usuarios_Registrados", user.uid), {
                uid: user.uid,
                email: user.email,
                // Extraemos el nombre antes del @ para tener un identificador rápido (ej. "juan" de juan@estudioverdee.edu.ec)
                nombre: user.email ? user.email.split("@")[0] : "Usuario",
                rol: "estudiante", // Por defecto todos son estudiantes
                fechaRegistro: new Date().toISOString()
            });

            setMessage("✅ Usuario creado y registrado en la base de datos");
        } catch (error: any) {
            setMessage("❌ Error al crear usuario: " + error.message);
        }
    };

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#000",
                position: "relative",
                // 🌟 Recuperamos el movimiento con el dedo (igual que Deberes y Notas)
                overflowX: "auto",
                overflowY: "auto"
            }}
        >
            {/* 🔹 ESTILOS CSS PARA LA LÁMPARA DE LAVA Y PARTÍCULAS */}
            <style>{`
                .lava-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 0;
                    pointer-events: none;
                    overflow: hidden;
                    background: #000;
                }
                .lava-blobs {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    filter: blur(60px);
                }
                .blob {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.40;
                }
                .blob-green {
                    width: 75vw;
                    height: 75vw;
                    background: #0AF51F;
                    left: -10vw;
                    top: -10vh;
                    animation: moveGreen 10s infinite alternate ease-in-out;
                }
                .blob-purple {
                    width: 70vw;
                    height: 70vw;
                    background: #6E25BA;
                    right: -10vw;
                    bottom: -10vh;
                    animation: movePurple 10s infinite alternate ease-in-out;
                }
                .particles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    /* 🌟 Elimina el scroll fantasma de las partículas */
                    overflow: hidden; 
                }
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    background: white;
                    animation: floatParticle 8s infinite alternate ease-in-out;
                }
                .p1 { width: 6px; height: 6px; left: 20%; top: 80%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 5s; }
                .p2 { width: 8px; height: 8px; left: 75%; top: 40%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 7s; }
                .p3 { width: 15px; height: 15px; left: 40%; top: 20%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 9s; }
                .p4 { width: 7px; height: 7px; left: 85%; top: 85%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 6s; }
                .p5 { width: 9px; height: 9px; left: 10%; top: 30%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 11s; }
                .p6 { width: 6px; height: 6px; left: 60%; top: 70%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 8s; }
                .p7 { width: 7px; height: 7px; left: 30%; top: 10%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 6.5s; }
                .p8 { width: 5px; height: 5px; left: 80%; top: 60%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 8.5s; }
                .p9 { width: 8px; height: 8px; left: 20%; top: 90%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 10s; }
                .p10 { width: 6px; height: 6px; left: 15%; top: 50%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 7.5s; }
                .p11 { width: 15px; height: 15px; left: 40%; top: 77%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 7.5s; }
                .p12 { width: 14px; height: 14px; left: 7%; top: 68%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 7.5s; }
                .p13 { width: 7px; height: 7px; left: 70%; top: 75%; box-shadow: 0 0 15px 4px #0AF51F; animation-duration: 7.5s; }
                .p14 { width: 18px; height: 18px; left: 90%; top: 90%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 7.5s; }
                .p15 { width: 15px; height: 15px; left: 75%; top: 90%; box-shadow: 0 0 15px 4px #8A2BE2; animation-duration: 7.5s; }

                /* Logo con separación dinámica */
                .logo-sello {
                    position: absolute;
                    top: 70px;
                    right: 10px;
                    z-index: 3;
                }

                @media (max-width: 768px) {
                    .logo-sello {
                        right: 90px !important;
                    }
                }

                @keyframes moveGreen {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(40vw, 30vh) scale(1.2); }
                }
                @keyframes movePurple {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-40vw, -30vh) scale(1.3); }
                }
                @keyframes floatParticle {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(-300px) translateX(80px); }
                }
            `}</style>

            {/* FONDO ANIMADO */}
            <div className="lava-bg">
                <div className="lava-blobs">
                    <div className="blob blob-green"></div>
                    <div className="blob blob-purple"></div>
                </div>
                <div className="particles">
                    <div className="particle p1"></div>
                    <div className="particle p2"></div>
                    <div className="particle p3"></div>
                    <div className="particle p4"></div>
                    <div className="particle p5"></div>
                    <div className="particle p6"></div>
                    <div className="particle p7"></div>
                    <div className="particle p8"></div>
                    <div className="particle p9"></div>
                    <div className="particle p10"></div>
                    <div className="particle p11"></div>
                    <div className="particle p12"></div>
                    <div className="particle p13"></div>
                    <div className="particle p14"></div>
                    <div className="particle p15"></div>
                </div>
            </div>

            {/* 🌟 LÍNEAS DECORATIVAS (Acompañan todo el scroll) */}
            <div
                style={{
                    position: isMobile ? "absolute" : "fixed",
                    top: 0,
                    left: 0,
                    width: "20px",
                    height: isMobile ? "100%" : "100vh",
                    backgroundColor: "#0AF51F",
                    zIndex: 9999
                }}
            />
            <div
                style={{
                    position: isMobile ? "absolute" : "fixed",
                    top: 0,
                    left: "20px",
                    width: "20px",
                    height: isMobile ? "100%" : "100vh",
                    backgroundColor: "#1756AD",
                    zIndex: 9999
                }}
            />

            {/* 🖥️ LIENZO DE CONTENIDO (Mantiene los 1366px para que el scroll táctil se active) */}
            <div
                style={{
                    width: `${baseWidth}px`,
                    height: `${baseHeight}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "relative",
                    backgroundColor: "transparent",
                    zIndex: 2
                }}
            >
                {/* LOGO */}
                <div className="logo-sello">
                    <Image src="/EV.png" alt="Sello ESTUDIO" width={260} height={260} priority />
                </div>

                {/* LOGIN */}
                <div
                    style={{
                        position: "absolute",
                        left: loginPos.x,
                        top: loginPos.y,
                        textAlign: "center",
                        backgroundColor: "#222",
                        color: "white",
                        padding: "20px",
                        borderRadius: "15px",
                        width: "300px",
                        boxShadow: "0 0 15px rgba(10, 245, 31, 0.4)",
                        zIndex: 3
                    }}
                >
                    <h1 style={{ marginBottom: "20px" }}>
                        ¿Ya tienes una cuenta Estudio Verde Educativo?
                    </h1>

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginBottom: "10px", padding: "8px", color: "white" }}
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginBottom: "10px", padding: "8px", color: "white" }}
                        />

                        <button
                            type="submit"
                            style={{
                                padding: "8px",
                                backgroundColor: "#0AF51F",
                                color: "#000",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Iniciar sesión
                        </button>
                    </form>
                </div>

                {/* REGISTRO */}
                <div
                    style={{
                        position: "absolute",
                        left: registerPos.x,
                        top: registerPos.y,
                        textAlign: "center",
                        backgroundColor: "#222",
                        color: "white",
                        padding: "20px",
                        borderRadius: "15px",
                        width: "300px",
                        boxShadow: "0 0 15px rgba(23, 86, 173, 0.4)",
                        zIndex: 3
                    }}
                >
                    <h1 style={{ marginBottom: "20px" }}>¿Aún no tienes una cuenta?</h1>

                    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
                        <input
                            type="email"
                            placeholder="Correo electrónico nuevo"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            style={{ marginBottom: "10px", padding: "8px", color: "white" }}
                        />

                        <input
                            type="password"
                            placeholder="Crea una contraseña"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            style={{ marginBottom: "10px", padding: "8px", color: "white" }}
                        />

                        <button
                            type="submit"
                            style={{
                                padding: "8px",
                                backgroundColor: "#1756AD",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Crear cuenta
                        </button>
                    </form>
                </div>

                {/* MENSAJE */}
                <p
                    style={{
                        position: "absolute",
                        bottom: "30px",
                        width: "100%",
                        textAlign: "center",
                        color: "white",
                        zIndex: 3,
                        fontWeight: "bold",
                        textShadow: "0px 0px 5px rgba(0,0,0,0.8)"
                    }}
                >
                    {message}
                </p>
            </div>
        </div>
    );
}