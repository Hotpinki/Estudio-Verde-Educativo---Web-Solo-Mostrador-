"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "@/firebase/firebase";

interface Props {
    deberId: string;
    userId: string;
    isCompletado?: boolean;
    materia: string;
}

export default function ComponentsDeberesUploader({ RUTA }: Props) {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // Ruta donde se guardará el PDF en Firebase Storage
            const storageRef = ref(storage, `deberes/${XXX}/${XXX}.pdf`);

            // Subir el archivo físicamente
            await uploadBytes(storageRef, file);

            // Obtener URL pública
            const url = await getDownloadURL(storageRef);

            const [docId, numTarea] = deberId.split("__");

            // 🔹 SOLUCIÓN: Ruta dinámica unificada para TODAS las materias, sin excepciones
            const docRef = doc(
                db,
                `EV-Usuario-${XXX}-Deberes`,
                userId,
                `EV-${XXX}`,
                "Datos",
                `${XXX}-DXXX`,
                docId
            );

            // 🔹 Actualizamos la base de datos
            await updateDoc(docRef, {
                [`archivo${numTarea}`]: file.name,
                [`url${numTarea}`]: url
            });

           ...............
        }
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <input
                type="file"
                accept="application/pdf"
                .....................................
                style={{ display: "none" }}
            />
            <label
                htmlFor={`upload-${deberId}`}
                style={{
                    display: "inline-block",
                    backgroundColor: "#8A2BE2",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: uploading ? "not-allowed" : "pointer",
                    color: "#fff",
                    fontWeight: "bold",
                    marginRight: "10px",
                    opacity: uploading ? 0.6 : 1,
                    pointerEvents: uploading ? "none" : "auto"
                }}
            >
                {uploading ? "⏳ Subiendo..." : "📎 Subir PDF"}
            </label>
        </div>
    );
}