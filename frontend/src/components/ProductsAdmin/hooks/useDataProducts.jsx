// Ruta: frontend/src/components/ProductsAdmin/hooks/useDataProducts.jsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

/**
 * Hook personalizado mejorado para manejar toda la lógica relacionada con productos
 * 
 * Funcionalidades principales:
 * - Gestión completa del estado de productos y categorías
 * - Operaciones CRUD con validaciones exhaustivas
 * - Manejo de errores detallado y user-friendly
 * - Integración optimizada con react-hook-form
 * - Control de estados de carga y UI
 * 
 * @returns {Object} Estados y funciones para gestión completa de productos
 */
const useDataProducts = () => {
  // ============ ESTADOS DE NAVEGACIÓN ============

  /**
   * Controla qué pestaña está activa en la interfaz de administración
   * - "list": Vista de tabla con todos los productos
   * - "form": Vista de formulario para crear/editar productos
   */
  const [activeTab, setActiveTab] = useState("list");

  // ============ CONFIGURACIÓN DE API ============

  // URL base para todas las operaciones de productos
  const API = "http://localhost:4000/api/products";

  // ============ ESTADOS DEL FORMULARIO ============

  // Estados para todos los campos del formulario de productos
  const [id, setId] = useState(""); // ID del producto (para edición)
  const [name, setName] = useState(""); // Nombre del producto
  const [description, setDescription] = useState(""); // Descripción detallada
  const [price, setPrice] = useState(""); // Precio en formato string para inputs
  const [stock, setStock] = useState(0); // Cantidad en inventario
  const [categoryId, setCategoryId] = useState(""); // ID de la categoría asociada
  const [isPersonalizable, setIsPersonalizable] = useState(false); // Si se puede personalizar
  const [details, setDetails] = useState(""); // Detalles adicionales del producto
  const [image, setImage] = useState(null); // Archivo de imagen seleccionado

  // ============ ESTADOS DE DATOS ============

  const [products, setProducts] = useState([]); // Lista de todos los productos
  const [loading, setLoading] = useState(true); // Estado de carga general
  const [categories, setCategories] = useState([]); // Lista de categorías disponibles

  // ============ ESTADOS DE VALIDACIÓN ============

  const [validationErrors, setValidationErrors] = useState({}); // Errores de validación
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de envío

  // ============ FUNCIONES DE UTILIDAD ============

  /**
   * Función auxiliar para manejar respuestas HTTP del servidor
   * Maneja tanto respuestas JSON como HTML (errores del servidor)
   * Proporciona mensajes de error más descriptivos
   * 
   * @param {Response} response - Objeto Response de fetch
   * @returns {Promise<Object>} Datos parseados de la respuesta
   * @throws {Error} Error con mensaje descriptivo si la respuesta no es válida
   */
  const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    // Verificar que la respuesta sea JSON válido
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('❌ Respuesta no es JSON:', textResponse);
      throw new Error(`El servidor devolvió HTML en lugar de JSON. Status: ${response.status}`);
    }

    const data = await response.json();

    // Verificar si la respuesta HTTP fue exitosa
    if (!response.ok) {
      // Extraer mensaje de error específico del backend
      const errorMessage = data.error || data.message || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  };

  /**
   * Valida los datos del producto antes de enviar al servidor
   * Realiza validaciones exhaustivas del lado cliente
   * 
   * @param {Object} productData - Datos del producto a validar
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  const validateProductData = (productData) => {
    const errors = {};

    // Validación de nombre (obligatorio, longitud mínima)
    if (!productData.name || !productData.name.trim()) {
      errors.name = "El nombre del producto es obligatorio";
    } else if (productData.name.trim().length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (productData.name.trim().length > 100) {
      errors.name = "El nombre no puede exceder 100 caracteres";
    }

    // Validación de descripción (obligatorio, longitud mínima)
    if (!productData.description || !productData.description.trim()) {
      errors.description = "La descripción del producto es obligatoria";
    } else if (productData.description.trim().length < 10) {
      errors.description = "La descripción debe tener al menos 10 caracteres";
    } else if (productData.description.trim().length > 500) {
      errors.description = "La descripción no puede exceder 500 caracteres";
    }

    // Validación de precio (obligatorio, numérico, positivo)
    if (!productData.price) {
      errors.price = "El precio es obligatorio";
    } else {
      const priceValue = parseFloat(productData.price);
      if (isNaN(priceValue)) {
        errors.price = "El precio debe ser un número válido";
      } else if (priceValue <= 0) {
        errors.price = "El precio debe ser mayor a 0";
      } else if (priceValue > 999999.99) {
        errors.price = "El precio no puede exceder $999,999.99";
      }
    }

    // Validación de stock (obligatorio, entero, no negativo)
    if (productData.stock === undefined || productData.stock === null || productData.stock === '') {
      errors.stock = "El stock es obligatorio";
    } else {
      const stockValue = parseInt(productData.stock);
      if (isNaN(stockValue)) {
        errors.stock = "El stock debe ser un número entero";
      } else if (stockValue < 0) {
        errors.stock = "El stock no puede ser negativo";
      } else if (stockValue > 999999) {
        errors.stock = "El stock no puede exceder 999,999 unidades";
      }
    }

    // Validación de categoría (obligatorio)
    if (!productData.categoryId || !productData.categoryId.trim()) {
      errors.categoryId = "Debe seleccionar una categoría";
    }

    // Validación de imagen (obligatorio para productos nuevos)
    if (!id && !productData.image) {
      errors.image = "La imagen del producto es obligatoria";
    } else if (productData.image && productData.image instanceof File) {
      // Validar tamaño de archivo (máximo 5MB)
      if (productData.image.size > 5 * 1024 * 1024) {
        errors.image = "La imagen no puede exceder 5MB";
      }

      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(productData.image.type)) {
        errors.image = "La imagen debe ser JPG, PNG, WebP o GIF";
      }
    }

    // Validación de detalles (opcional, pero con límite de caracteres)
    if (productData.details && productData.details.length > 1000) {
      errors.details = "Los detalles no pueden exceder 1000 caracteres";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // ============ FUNCIONES DE CARGA DE DATOS ============

  /**
   * Carga todas las categorías disponibles desde el servidor
   * Maneja tanto la nueva estructura de respuesta como la anterior
   */
  const fetchCategories = async () => {
    try {
      console.log('📂 Cargando categorías...');
      const response = await fetch("http://localhost:4000/api/categories");
      const data = await handleResponse(response);

      // Manejar nueva estructura de respuesta { success, data, message }
      if (data.success && Array.isArray(data.data)) {
        console.log(`✅ ${data.data.length} categorías cargadas`);
        setCategories(data.data);
      } else if (Array.isArray(data)) {
        // Retrocompatibilidad con controladores antiguos
        console.log(`✅ ${data.length} categorías cargadas (formato anterior)`);
        setCategories(data);
      } else {
        console.warn("⚠️ Estructura de respuesta de categorías inesperada:", data);
        setCategories([]);
      }
    } catch (error) {
      toast.error("Error al cargar las categorías");
      console.error("❌ Error al cargar categorías:", error);
      setCategories([]); // Fallback a array vacío
    }
  };

  /**
   * Carga todos los productos desde el servidor
   * Maneja diferentes estructuras de respuesta y estados de error
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Cargando productos...');

      const response = await fetch(API);
      const data = await handleResponse(response);

      // Manejar nueva estructura de respuesta del controlador
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        console.log(`✅ ${data.data.length} productos cargados exitosamente`);
      } else if (Array.isArray(data)) {
        // Retrocompatibilidad con controladores que devuelven array directo
        setProducts(data);
        console.log(`✅ ${data.length} productos cargados (formato anterior)`);
      } else {
        console.warn("⚠️ Estructura de respuesta de productos inesperada:", data);
        setProducts([]);
      }
    } catch (error) {
      toast.error("Error al cargar los productos");
      console.error("❌ Error al cargar productos:", error);
      setProducts([]); // Fallback a array vacío
    } finally {
      setLoading(false);
    }
  };

  // ============ EFECTO DE INICIALIZACIÓN ============

  /**
   * Efecto que se ejecuta una vez al montar el componente
   * Carga datos iniciales de productos y categorías
   */
  useEffect(() => {
    console.log('🚀 Inicializando hook de productos...');
    fetchProducts();
    fetchCategories();
  }, []);

  // ============ FUNCIONES DE UTILIDAD DEL FORMULARIO ============

  /**
   * Limpia todos los campos del formulario y resetea el estado
   * Se usa después de crear/editar productos exitosamente
   */
  const resetForm = () => {
    console.log('🧹 Limpiando formulario de productos');
    setId("");
    setName("");
    setDescription("");
    setPrice("");
    setStock(0);
    setCategoryId("");
    setIsPersonalizable(false);
    setDetails("");
    setImage(null);
    setValidationErrors({});
  };

  // ============ FUNCIÓN PARA CREAR PRODUCTO ============

  /**
   * Crea un nuevo producto en el servidor
   * Incluye validaciones exhaustivas y manejo de archivos
   * 
   * @param {Object} productData - Datos del producto a crear
   */
  const createProduct = async (productData) => {
    console.log('➕ Iniciando creación de producto...');

    // ---- Validar datos antes de enviar ----
    const validation = validateProductData(productData);
    if (!validation.isValid) {
      console.log('❌ Validación fallida:', validation.errors);
      setValidationErrors(validation.errors);
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationErrors({});

      // ---- Preparar datos para envío ----
      const formData = new FormData();
      formData.append("name", productData.name.trim());
      formData.append("description", productData.description.trim());
      formData.append("price", parseFloat(productData.price));
      formData.append("stock", parseInt(productData.stock) || 0);
      formData.append("categoryId", productData.categoryId);
      formData.append("isPersonalizable", productData.isPersonalizable ? "true" : "false");
      formData.append("details", productData.details || "");

      // Agregar imagen si existe
      if (productData.image) {
        formData.append("images", productData.image);
      }

      console.log('📤 Enviando producto al servidor...');

      // ---- Enviar petición POST ----
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        body: formData // FormData maneja automáticamente el Content-Type
      });

      const data = await handleResponse(res);

      // ---- Procesar respuesta exitosa ----
      const newProduct = data.success ? data.data : data;

      // Enriquecer producto con información de categoría
      const categoryInfo = categories.find(cat => cat._id === productData.categoryId);
      const enrichedProduct = {
        ...newProduct,
        categoryId: categoryInfo ? {
          _id: categoryInfo._id,
          name: categoryInfo.name
        } : newProduct.categoryId
      };

      // Actualizar lista local de productos
      setProducts((prev) => [...prev, enrichedProduct]);

      // Mostrar mensaje de éxito
      const successMessage = data.success ? data.message : "Producto creado exitosamente";
      toast.success(successMessage);

      // Limpiar formulario y volver a la lista
      resetForm();
      setActiveTab("list");

      console.log('✅ Producto creado exitosamente');
    } catch (error) {
      console.error("❌ Error completo:", error);
      toast.error(error.message || "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ FUNCIÓN PARA ELIMINAR PRODUCTO ============

  /**
   * Elimina un producto específico del servidor
   * 
   * @param {string} id - ID del producto a eliminar
   */
  const deleteProduct = async (id) => {
    try {
      console.log(`🗑️ Eliminando producto ID: ${id}`);

      const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      const data = await handleResponse(res);

      // Mostrar mensaje de éxito
      const successMessage = data.success ? data.message : "Producto eliminado";
      toast.success(successMessage);

      // Recargar lista de productos
      fetchProducts();

      console.log('✅ Producto eliminado exitosamente');
    } catch (error) {
      toast.error(error.message || "Error al eliminar producto");
      console.error("❌ Error al eliminar:", error);
    }
  };

  // ============ FUNCIÓN PARA PREPARAR EDICIÓN ============

  /**
   * Prepara el formulario para editar un producto existente
   * Llena todos los campos con los datos actuales del producto
   * 
   * @param {Object} product - Objeto del producto a editar
   */
  const updateProduct = (product) => {
    console.log("📝 Preparando edición de producto:", product);
    console.log("🆔 ID del producto:", product._id);

    // ---- Llenar todos los campos del formulario ----
    setId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString()); // Convertir a string para inputs
    setStock(product.stock || 0);
    setCategoryId(product.categoryId._id || product.categoryId || "");
    setIsPersonalizable(product.isPersonalizable || false);
    setDetails(product.details || "");
    setImage(null); // Resetear imagen (se mostrará la actual en el preview)
    setValidationErrors({}); // Limpiar errores de validación

    // Cambiar a la pestaña de formulario
    setActiveTab("form");

    console.log('✅ Formulario preparado para edición');
  };

  // ============ FUNCIÓN PARA GUARDAR EDICIÓN ============

  /**
   * Guarda los cambios de un producto editado en el servidor
   * Maneja tanto actualizaciones con nuevas imágenes como solo texto
   * 
   * @param {Object} productData - Datos actualizados del producto
   */
  const handleEdit = async (productData) => {
    console.log(`💾 Guardando cambios en producto ID: ${id}`);

    // ---- Validar datos antes de enviar ----
    const validation = validateProductData(productData);
    if (!validation.isValid) {
      console.log('❌ Validación fallida:', validation.errors);
      setValidationErrors(validation.errors);
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    // ---- Verificar que existe el ID ----
    if (!id) {
      console.error("❌ ID del producto no encontrado. ID actual:", id);
      toast.error("ID del producto no encontrado");
      return;
    }

    console.log(`📤 Actualizando producto en: ${API}/${id}`);

    try {
      setIsSubmitting(true);
      setValidationErrors({});

      let res;

      // ---- Determinar tipo de actualización ----
      if (productData.image instanceof File) {
        // Caso 1: Nueva imagen seleccionada - usar FormData
        console.log('📁 Actualizando con nueva imagen');

        const formData = new FormData();
        formData.append("name", productData.name.trim());
        formData.append("description", productData.description.trim());
        formData.append("price", parseFloat(productData.price));
        formData.append("stock", parseInt(productData.stock) || 0);
        formData.append("categoryId", productData.categoryId);
        formData.append("isPersonalizable", productData.isPersonalizable ? "true" : "false");
        formData.append("details", productData.details || "");
        formData.append("images", productData.image);

        res = await fetch(`${API}/${id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Caso 2: Solo actualización de texto - usar JSON
        console.log('📝 Actualizando solo datos de texto');

        const body = {
          name: productData.name.trim(),
          description: productData.description.trim(),
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock) || 0,
          categoryId: productData.categoryId,
          isPersonalizable: productData.isPersonalizable,
          details: productData.details || "",
        };

        res = await fetch(`${API}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      // ---- Logging de debugging ----
      console.log("📊 Response status:", res.status);
      console.log("📋 Response URL:", res.url);

      const data = await handleResponse(res);

      // ---- Manejar éxito ----
      const successMessage = data.success ? data.message : "Producto actualizado";
      toast.success(successMessage);

      // Limpiar formulario y volver a la lista
      resetForm();
      setActiveTab("list");
      fetchProducts(); // Recargar lista

      console.log('✅ Producto actualizado exitosamente');
    } catch (error) {
      console.error("❌ Error completo:", error);
      toast.error(error.message || "Error al editar producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ RETORNO DEL HOOK ============

  /**
   * Retorna todos los estados y funciones necesarias para manejar productos
   * Los componentes que usen este hook tendrán acceso completo a la funcionalidad
   */
  return {
    // ---- Estados de navegación ----
    activeTab,              // Pestaña activa ("list" o "form")
    setActiveTab,           // Función para cambiar de pestaña

    // ---- Estados del formulario ----
    id,                     // ID del producto (para edición)
    name,                   // Nombre del producto
    setName,                // Función para actualizar nombre
    description,            // Descripción del producto
    setDescription,         // Función para actualizar descripción
    price,                  // Precio del producto (string)
    setPrice,               // Función para actualizar precio
    stock,                  // Stock/inventario del producto
    setStock,               // Función para actualizar stock
    categoryId,             // ID de la categoría seleccionada
    setCategoryId,          // Función para actualizar categoría
    isPersonalizable,       // Si el producto es personalizable
    setIsPersonalizable,    // Función para toggle personalizable
    details,                // Detalles adicionales del producto
    setDetails,             // Función para actualizar detalles
    image,                  // Imagen seleccionada (File o URL)
    setImage,               // Función para actualizar imagen

    // ---- Estados de datos ----
    products,               // Array de todos los productos
    loading,                // Estado de carga booleano
    categories,             // Array de categorías disponibles

    // ---- Estados de validación ----
    validationErrors,       // Errores de validación actuales
    setValidationErrors,    // Función para establecer errores
    isSubmitting,           // Estado de envío del formulario

    // ---- Funciones de operaciones CRUD ----
    createProduct,          // Crear nuevo producto
    deleteProduct,          // Eliminar producto existente
    updateProduct,          // Preparar edición de producto
    handleEdit,             // Guardar cambios en producto editado

    // ---- Función de utilidad ----
    resetForm,              // Limpiar formulario manualmente
    validateProductData,    // Función de validación externa
  };
};

export default useDataProducts;