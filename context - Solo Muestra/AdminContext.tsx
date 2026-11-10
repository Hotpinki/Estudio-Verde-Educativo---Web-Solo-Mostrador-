'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// 🔹 Creamos la "Radio"
export const AdminContext = createContext<any>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [userRole, setUserRole] = useState<string | null>(null); // "estudiante", "profesor", "admin"
    const [adminUid, setAdminUid] = useState<string | null>(null); // El UID del profesor/admin conectado
    const [selectedStudentUid, setSelectedStudentUid] = useState<string | null>(null); // El UID del alumno a espiar
    const [loadingRole, setLoadingRole] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setAdminUid(user.uid);

                // 🔹 Vamos a Firestore a preguntar "¿Quién es esta persona?"
                const docRef = doc(db, 'Usuarios_Registrados', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const rol = docSnap.data().rol;
                    setUserRole(rol);

                    // 🛡️ REGLA DE ORO: Si es estudiante, el "alumno seleccionado" SIEMPRE es él mismo
                    if (rol === 'estudiante') {
                        setSelectedStudentUid(user.uid);
                    }
                }
            } else {
                // Si cierra sesión, limpiamos todo
                setUserRole(null);
                ..............
            }
            setLoadingRole(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AdminContext.Provider value={{
            userRole,
            adminUid,
            ....................................
    );
}

// 🔹 Un pequeño atajo para usar la radio más fácil en otras páginas
export const useAdmin =...............