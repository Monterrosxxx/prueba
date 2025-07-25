// Ruta: frontend/src/components/Profile/Hooks/useEditProfileForm.jsx
import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

/**
 * Hook personalizado para manejar la edición del perfil del usuario
 * Proporciona funcionalidades para actualizar información personal y foto de perfil
 * 
 * @returns {Object} Objeto con estados y funciones para la edición del perfil
 */
export const useEditProfileForm = () => {
    // ============ ESTADOS DEL FORMULARIO ============
    
    /**
     * Datos del formulario de edición
     */
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: '',
        profilePicture: null // Archivo de imagen
    });

    /**
     * Estado para mostrar vista previa de la imagen
     */
    const [imagePreview, setImagePreview] = useState(null);

    /**
     * Errores de validación del formulario
     */
    const [errors, setErrors] = useState({});

    /**
     * Estado de carga durante la actualización
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Estado de éxito de la operación
     */
    const [success, setSuccess] = useState(false);

    // Hook de autenticación
    const { getUserInfo } = useAuth();

    // ============ FUNCIONES DE VALIDACIÓN ============
    
    /**
     * Valida el nombre completo
     * @param {string} fullName - Nombre a validar
     * @returns {Object} Resultado de la validación
     */
    const validateFullName = useCallback((fullName) => {
        if (!fullName || !fullName.trim()) {
            return { isValid: false, error: 'El nombre completo es requerido' };
        }
        
        const trimmedName = fullName.trim();
        
        if (trimmedName.length < 2) {
            return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
        }
        
        if (trimmedName.length > 100) {
            return { isValid: false, error: 'El nombre no puede exceder 100 caracteres' };
        }
        
        const nameRegex = /^[a-zA-ZàáâäèéêëìíîïòóôöùúûüÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜñÑ\s\-\.\']+$/;
        if (!nameRegex.test(trimmedName)) {
            return { isValid: false, error: 'El nombre contiene caracteres no válidos' };
        }
        
        return { isValid: true, error: null };
    }, []);

    /**
     * Valida el teléfono salvadoreño
     * @param {string} phone - Teléfono a validar
     * @returns {Object} Resultado de la validación
     */
    const validatePhone = useCallback((phone) => {
        if (!phone || !phone.trim()) {
            return { isValid: false, error: 'El teléfono es requerido' };
        }
        
        const cleaned = phone.trim();
        const phoneRegex = /^7\d{3}-\d{4}$/;
        
        if (!phoneRegex.test(cleaned)) {
            return { isValid: false, error: 'Formato: 7XXX-XXXX (ej: 7123-4567)' };
        }
        
        return { isValid: true, error: null };
    }, []);

    /**
     * Valida la dirección
     * @param {string} address - Dirección a validar
     * @returns {Object} Resultado de la validación
     */
    const validateAddress = useCallback((address) => {
        if (!address || !address.trim()) {
            return { isValid: false, error: 'La dirección es requerida' };
        }
        
        const trimmedAddress = address.trim();
        
        if (trimmedAddress.length < 10) {
            return { isValid: false, error: 'La dirección debe tener al menos 10 caracteres' };
        }
        
        if (trimmedAddress.length > 200) {
            return { isValid: false, error: 'La dirección no puede exceder 200 caracteres' };
        }
        
        return { isValid: true, error: null };
    }, []);

    /**
     * Valida todos los campos del formulario
     * @returns {Object} Resultado de la validación completa
     */
    const validateAllFields = useCallback(() => {
        const newErrors = {};
        let isFormValid = true;

        // Validar nombre completo
        const fullNameValidation = validateFullName(formData.fullName);
        if (!fullNameValidation.isValid) {
            newErrors.fullName = fullNameValidation.error;
            isFormValid = false;
        }

        // Validar teléfono
        const phoneValidation = validatePhone(formData.phone);
        if (!phoneValidation.isValid) {
            newErrors.phone = phoneValidation.error;
            isFormValid = false;
        }

        // Validar dirección
        const addressValidation = validateAddress(formData.address);
        if (!addressValidation.isValid) {
            newErrors.address = addressValidation.error;
            isFormValid = false;
        }

        return { isValid: isFormValid, errors: newErrors };
    }, [formData, validateFullName, validatePhone, validateAddress]);

    // ============ MANEJADORES DE EVENTOS ============
    
    /**
     * Inicializa el formulario con los datos del usuario
     * @param {Object} userData - Datos del usuario actual
     */
    const initializeForm = useCallback((userData) => {
        setFormData({
            fullName: userData.name || '',
            phone: userData.phone || '',
            address: userData.address || '',
            email: userData.email || '',
            profilePicture: null
        });
        
        // Establecer vista previa de imagen existente
        if (userData.profilePicture) {
            setImagePreview(userData.profilePicture);
        }
        
        // Limpiar errores y estados
        setErrors({});
        setSuccess(false);
    }, []);

    /**
     * Maneja los cambios en los campos de texto
     * @param {Event} e - Evento de cambio
     */
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Formatear teléfono automáticamente
        let processedValue = value;
        if (name === 'phone') {
            let cleanValue = value.replace(/\D/g, '');
            
            if (cleanValue.length > 0 && !cleanValue.startsWith('7')) {
                if (cleanValue.length <= 7) {
                    cleanValue = '7' + cleanValue;
                }
            }
            
            if (cleanValue.length > 4) {
                cleanValue = cleanValue.slice(0, 4) + '-' + cleanValue.slice(4, 8);
            }
            
            processedValue = cleanValue;
        }
        
        // Capitalizar primera letra de cada palabra para nombre
        if (name === 'fullName') {
            processedValue = value.replace(/\b\w/g, l => l.toUpperCase());
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
        
        // Limpiar mensaje de éxito
        if (success) {
            setSuccess(false);
        }
    }, [errors, success]);

    /**
     * Maneja el cambio de imagen de perfil
     * @param {Event} e - Evento de cambio del input file
     */
    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        
        if (!file) {
            return;
        }

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                profilePicture: 'Solo se permiten imágenes JPG, PNG o WEBP'
            }));
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                profilePicture: 'La imagen no puede superar los 5MB'
            }));
            return;
        }

        // Limpiar error de imagen
        setErrors(prev => ({
            ...prev,
            profilePicture: null
        }));

        // Establecer archivo y vista previa
        setFormData(prev => ({
            ...prev,
            profilePicture: file
        }));

        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        // Limpiar mensaje de éxito
        if (success) {
            setSuccess(false);
        }
    }, [success]);

    /**
     * Envía los datos del formulario para actualizar el perfil
     * @returns {Object} Resultado de la operación
     */
    const submitForm = useCallback(async () => {
        try {
            // Validar formulario
            const validation = validateAllFields();
            if (!validation.isValid) {
                setErrors(validation.errors);
                return { success: false, message: 'Por favor corrige los errores en el formulario' };
            }

            setIsLoading(true);
            setErrors({});

            // Preparar FormData para envío
            const updateData = new FormData();
            updateData.append('fullName', formData.fullName.trim());
            updateData.append('phone', formData.phone.trim());
            updateData.append('address', formData.address.trim());
            
            // Solo agregar imagen si se seleccionó una nueva
            if (formData.profilePicture) {
                updateData.append('profilePicture', formData.profilePicture);
            }

            // Realizar petición de actualización
            const response = await fetch('http://localhost:4000/api/clients/update-profile', {
                method: 'PUT',
                credentials: 'include',
                body: updateData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccess(true);
                
                // Actualizar información del usuario en el contexto
                await getUserInfo();
                
                return { 
                    success: true, 
                    message: 'Perfil actualizado exitosamente',
                    data: result.data 
                };
            } else {
                const errorMessage = result.message || 'Error al actualizar el perfil';
                setErrors({ general: errorMessage });
                return { success: false, message: errorMessage };
            }

        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            const errorMessage = 'Error de conexión. Inténtalo nuevamente.';
            setErrors({ general: errorMessage });
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateAllFields, getUserInfo]);

    /**
     * Limpia el formulario y sus estados
     */
    const resetForm = useCallback(() => {
        setFormData({
            fullName: '',
            phone: '',
            address: '',
            email: '',
            profilePicture: null
        });
        setImagePreview(null);
        setErrors({});
        setSuccess(false);
        setIsLoading(false);
    }, []);

    /**
     * Limpia solo los errores
     */
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    // ============ RETORNO DEL HOOK ============
    
    return {
        // Estados del formulario
        formData,
        imagePreview,
        errors,
        isLoading,
        success,
        
        // Funciones de manejo
        initializeForm,
        handleInputChange,
        handleImageChange,
        submitForm,
        resetForm,
        clearErrors,
        
        // Función de validación
        validateAllFields
    };
};