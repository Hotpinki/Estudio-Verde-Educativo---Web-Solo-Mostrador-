import Image from "next/image";

export default function InstitucionLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            width: "100%",
            minWidth: "1366px", 
            minHeight: "100vh",
            background: "#000",
            position: "relative",
            overflowX: "auto"
        }}>
            {/* 🚀 EL SALVAVIDAS: Esta regla obliga a la lava a cubrir todo el póster, matando el fondo negro */}
            <style>{`
                .lava-bg {
                    position: absolute !important;
                    width: 100% !important;
                    min-width: 1366px !important;
                    height: 100% !important;
                    min-height: 100vh !important;
                }
            `}</style>

            {/* LÍNEAS LATERALES GLOBALES */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "20px", background: "#0AF51F", zIndex: 9999, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "20px", width: "20px", background: "#1756AD", zIndex: 9999, pointerEvents: "none" }} />

            {/* SELLO GLOBAL */}
            <div style={{ position: "absolute", top: "60px", right: "60px", zIndex: 9999, pointerEvents: "none" }}>
                <Image src="/EV.png" alt="Sello Estudio Verde" width={200} height={200} priority />
            </div>

            {/* CONTENIDO DE LAS PÁGINAS */}
            <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
                {children}
            </div>
        </div>
    );
}