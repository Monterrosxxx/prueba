// Ruta: frontend/src/components/Profile/EditProfileModal.jsx
import React, { useEffect, useRef } from 'react';
import { FaEdit, FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import { useEditProfileForm } from './Hooks/useEditProfileForm';

/**
 * Modal para editar el perfil del usuario
 * Permite actualizar información personal y foto de perfil
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.userData - Datos actuales del usuario
 * @param {Function} props.onSuccess - Función llamada cuando la actualización es exitosa
 */
const EditProfileModal = ({ isOpen, onClose, userData, onSuccess }) => {
    // ============ HOOK PERSONALIZADO ============
    
    const {
        formData,
        imagePreview,
        errors,
        isLoading,
        success,
        initializeForm,
        handleInputChange,
        handleImageChange,
        submitForm,
        resetForm,
        clearErrors
    } = useEditProfileForm();

    // ============ REFS ============
    
    const fileInputRef = useRef(null);
    const modalRef = useRef(null);

    // ============ EFECTOS ============
    
    /**
     * Inicializar formulario cuando se abre el modal
     */
    useEffect(() => {
        if (isOpen && userData) {
            initializeForm(userData);
        }
    }, [isOpen, userData, initializeForm]);

    /**
     * Manejar tecla Escape para cerrar modal
     */
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isLoading]);

    /**
     * Enfocar modal cuando se abre
     */
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    // ============ MANEJADORES DE EVENTOS ============
    
    /**
     * Maneja el cierre del modal
     */
    const handleClose = () => {
        if (!isLoading) {
            resetForm();
            onClose();
        }
    };

    /**
     * Maneja el click en el overlay para cerrar el modal
     */
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            handleClose();
        }
    };

    /**
     * Maneja el click en el botón de imagen para abrir selector de archivos
     */
    const handleImageClick = () => {
        if (!isLoading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    /**
     * Maneja el envío del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isLoading) return;

        const result = await submitForm();
        
        if (result.success) {
            // Esperar un momento para mostrar el mensaje de éxito
            setTimeout(() => {
                onSuccess && onSuccess(result.data);
                handleClose();
            }, 1500);
        }
    };

    /**
     * Obtiene la imagen a mostrar (preview o existente)
     */
    const getDisplayImage = () => {
        if (imagePreview) {
            return imagePreview;
        }
        if (userData?.profilePicture) {
            return userData.profilePicture;
        }
        return null;
    };

    /**
     * Obtiene las iniciales del usuario para el avatar por defecto
     */
    const getUserInitials = () => {
        if (!userData?.name) return 'U';
        const names = userData.name.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    // ============ RENDERIZADO ============
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleOverlayClick}
        >
            <div 
                ref={modalRef}
                className="relative w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: '#FFFFFF' }}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header del Modal */}
                <div 
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: '#F2C6C2' }}
                >
                    <h2 
                        className="text-xl font-bold flex items-center gap-2"
                        style={{ 
                            fontFamily: 'Poppins, sans-serif',
                            color: '#000000'
                        }}
                    >
                        <FaEdit style={{ color: '#FDB4B7' }} />
                        Editar Perfil
                    </h2>
                    
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50"
                        style={{ 
                            backgroundColor: '#FADDDD',
                            color: '#999999'
                        }}
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {/* Contenido del Modal */}
                <form onSubmit={handleSubmit} className="p-6">
                    
                    {/* Mensaje de Error General */}
                    {errors.general && (
                        <div 
                            className="mb-4 p-3 rounded-lg border text-sm"
                            style={{ 
                                backgroundColor: '#FEF2F2',
                                borderColor: '#FCA5A5',
                                color: '#DC2626'
                            }}
                        >
                            {errors.general}
                        </div>
                    )}

                    {/* Mensaje de Éxito */}
                    {success && (
                        <div 
                            className="mb-4 p-3 rounded-lg border text-sm"
                            style={{ 
                                backgroundColor: '#F0FDF4',
                                borderColor: '#86EFAC',
                                color: '#166534'
                            }}
                        >
                            ¡Perfil actualizado exitosamente!
                        </div>
                    )}

                    {/* Foto de Perfil */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <div 
                                className="w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
                                onClick={handleImageClick}
                                style={{ backgroundColor: '#F2C6C2' }}
                            >
                                {getDisplayImage() ? (
                                    <img
                                        src={getDisplayImage()}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div 
                                        className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                                        style={{ 
                                            background: 'linear-gradient(135deg, #FDB4B7, #F2C6C2)',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    >
                                        {getUserInitials()}
                                    </div>
                                )}
                                
                                {/* Overlay de edición */}
                                <div 
                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    style={{ borderRadius: '50%' }}
                                >
                                    <FaCamera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            
                            {/* Botón de edición flotante */}
                            <button
                                type="button"
                                onClick={handleImageClick}
                                disabled={isLoading}
                                className="absolute -bottom-1 -right-1 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                style={{ backgroundColor: '#FDB4B7' }}
                            >
                                <FaEdit className="w-3 h-3 text-white" />
                            </button>
                        </div>
                        
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                        
                        <p 
                            className="text-xs mt-2 text-center"
                            style={{ 
                                color: '#999999',
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            Haz clic para cambiar la foto
                        </p>
                        
                        {errors.profilePicture && (
                            <p 
                                className="text-xs mt-1"
                                style={{ color: '#DC2626' }}
                            >
                                {errors.profilePicture}
                            </p>
                        )}
                    </div>

                    {/* Campos del Formulario */}
                    <div className="space-y-4">
                        
                        {/* Nombre Completo */}
                        <div>
                            <label 
                                className="block text-sm font-medium mb-2"
                                style={{ 
                                    color: '#000000',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                <FaUser className="inline w-4 h-4 mr-2" style={{ color: '#FDB4B7' }} />
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none disabled:opacity-50"
                                style={{
                                    borderColor: errors.fullName ? '#DC2626' : '#F2C6C2',
                                    backgroundColor: '#FFFFFF',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                                placeholder="Ingresa tu nombre completo"
                                maxLength="100"
                            />
                            {errors.fullName && (
                                <p 
                                    className="text-xs mt-1"
                                    style={{ color: '#DC2626' }}
                                >
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label 
                                className="block text-sm font-medium mb-2"
                                style={{ 
                                    color: '#000000',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                <FaPhone className="inline w-4 h-4 mr-2" style={{ color: '#FDB4B7' }} />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none disabled:opacity-50"
                                style={{
                                    borderColor: errors.phone ? '#DC2626' : '#F2C6C2',
                                    backgroundColor: '#FFFFFF',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                                placeholder="7123-4567"
                                maxLength="9"
                            />
                            {errors.phone && (
                                <p 
                                    className="text-xs mt-1"
                                    style={{ color: '#DC2626' }}
                                >
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div>
                            <label 
                                className="block text-sm font-medium mb-2"
                                style={{ 
                                    color: '#000000',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                <FaMapMarkerAlt className="inline w-4 h-4 mr-2" style={{ color: '#FDB4B7' }} />
                                Dirección
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                rows="3"
                                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none resize-none disabled:opacity-50"
                                style={{
                                    borderColor: errors.address ? '#DC2626' : '#F2C6C2',
                                    backgroundColor: '#FFFFFF',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                                placeholder="Ingresa tu dirección completa"
                                maxLength="200"
                            />
                            {errors.address && (
                                <p 
                                    className="text-xs mt-1"
                                    style={{ color: '#DC2626' }}
                                >
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Email (Solo lectura) */}
                        <div>
                            <label 
                                className="block text-sm font-medium mb-2"
                                style={{ 
                                    color: '#999999',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                Correo Electrónico (no editable)
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 rounded-lg border-2 cursor-not-allowed"
                                style={{
                                    borderColor: '#F2C6C2',
                                    backgroundColor: '#FADDDD',
                                    color: '#999999',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            style={{
                                borderColor: '#F2C6C2',
                                backgroundColor: '#FFFFFF',
                                color: '#999999',
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            Cancelar
                        </button>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: '#FDB4B7',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FaEdit className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                                </form>
                            </div>
                        </div>
                );
            };
            
            export default EditProfileModal;