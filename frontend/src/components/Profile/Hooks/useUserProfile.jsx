import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

/**
 * Hook personalizado para manejar los datos del perfil del usuario
 * Obtiene y gestiona la información del usuario logueado desde el backend
 */
export const useUserProfile = () => {
    // Estados para manejar los datos del perfil
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Obtener información del usuario logueado desde el contexto
    const { user, userInfo, isAuthenticated } = useAuth();

    /**
     * Función para obtener los datos completos del perfil desde el backend
     */
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Verificar que el usuario esté autenticado
            if (!isAuthenticated || !user?.id) {
                throw new Error('Usuario no autenticado');
            }

            // Hacer petición al backend para obtener datos del usuario
            const response = await fetch('http://localhost:4000/api/login/user-info', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && data.user) {
                setProfileData(data.user);
            } else {
                throw new Error(data.message || 'Error al obtener datos del usuario');
            }

        } catch (err) {
            console.error('Error al obtener perfil del usuario:', err);
            setError(err.message || 'Error al cargar los datos del perfil');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Función para formatear la fecha de registro del usuario
     */
    const formatMemberSince = (createdAt) => {
        if (!createdAt) return 'Fecha no disponible';
        
        try {
            const date = new Date(createdAt);
            return date.getFullYear();
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Fecha no disponible';
        }
    };

    /**
     * Función para obtener las iniciales del nombre del usuario
     * Para usar como fallback en caso de no tener foto de perfil
     */
    const getUserInitials = (fullName) => {
        if (!fullName || typeof fullName !== 'string') return 'U';
        
        const names = fullName.trim().split(' ');
        
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        } else if (names.length === 1) {
            return names[0][0].toUpperCase();
        }
        
        return 'U';
    };

    /**
     * Función para validar si una URL de imagen es válida
     */
    const isValidImageUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        
        // Verificar que la URL tenga un formato básico válido
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Ejecutar fetch al montar el componente o cuando cambie la autenticación
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchUserProfile();
        } else {
            setLoading(false);
            setProfileData(null);
        }
    }, [isAuthenticated, user?.id]);

    // También usar userInfo del contexto como fallback
    useEffect(() => {
        if (userInfo && !profileData && !loading) {
            setProfileData(userInfo);
        }
    }, [userInfo, profileData, loading]);

    return {
        // Datos del perfil
        profileData,
        
        // Estados de carga y error
        loading,
        error,
        
        // Funciones utilitarias
        fetchUserProfile,
        formatMemberSince,
        getUserInitials,
        isValidImageUrl,
        
        // Función para limpiar errores
        clearError: () => setError(null)
    };
};