import React from 'react';
import { Card } from '../Card';
import SeparatorPerfil from '../SeparadorPerfil';
import LoadingSpinner from '../LoadingSpinner';

// Iconos importados
import correo from '../../assets/CorreoMarqueza.png';
import telefono from '../../assets/TelefonoMarqueza.png';
import ubicacion from '../../assets/ubicacion.png';

/**
 * Componente para mostrar la información personal del usuario
 * Incluye foto de perfil, datos básicos y información de contacto
 */
const UserInfoCard = ({ 
    profileData, 
    loading, 
    error, 
    getUserInitials, 
    isValidImageUrl, 
    formatMemberSince 
}) => {
    // Mostrar spinner de carga
    if (loading) {
        return (
            <Card className="p-6">
                <LoadingSpinner text="Cargando información del perfil..." size="md" />
            </Card>
        );
    }

    // Mostrar mensaje de error
    if (error) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar perfil</h3>
                    <p className="text-sm text-gray-600">{error}</p>
                </div>
            </Card>
        );
    }

    // Mostrar mensaje si no hay datos
    if (!profileData) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin información de perfil</h3>
                    <p className="text-sm text-gray-600">No se pudieron cargar los datos del usuario</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">Información personal</h2>
            
            <div className="flex flex-col items-center text-center">
                {/* Foto de perfil o avatar con iniciales */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-3 overflow-hidden bg-gray-300 flex items-center justify-center">
                    {isValidImageUrl(profileData.profilePicture) ? (
                        <img
                            src={profileData.profilePicture}
                            alt={`Foto de perfil de ${profileData.name || 'Usuario'}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Si la imagen falla al cargar, mostrar las iniciales
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    
                    {/* Avatar con iniciales como fallback */}
                    <div 
                        className={`w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-2xl md:text-3xl ${
                            isValidImageUrl(profileData.profilePicture) ? 'hidden' : 'flex'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {getUserInitials(profileData.name)}
                    </div>
                </div>

                {/* Nombre del usuario */}
                <p className="font-bold text-lg md:text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {profileData.name || 'Nombre no disponible'}
                </p>
                
                {/* Fecha de registro */}
                <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Miembro desde {formatMemberSince(profileData.createdAt)}
                </p>
                
                <SeparatorPerfil />
                
                {/* Información de contacto */}
                <div className="text-sm text-left w-full space-y-4 mt-4">
                    {/* Email */}
                    <div className="flex items-start gap-2">
                        <img src={correo} alt="correo" className="w-5 h-5 mt-1" />
                        <p style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {profileData.email || 'Email no disponible'}
                        </p>
                    </div>
                    
                    {/* Teléfono */}
                    <div className="flex items-start gap-2">
                        <img src={telefono} alt="telefono" className="w-5 h-5 mt-1" />
                        <p style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {profileData.phone || 'Teléfono no disponible'}
                        </p>
                    </div>
                    
                    {/* Dirección */}
                    <div className="flex items-start gap-2">
                        <img src={ubicacion} alt="ubicacion" className="w-5 h-5 mt-1" />
                        <p style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {profileData.address || 'Dirección no disponible'}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default UserInfoCard;