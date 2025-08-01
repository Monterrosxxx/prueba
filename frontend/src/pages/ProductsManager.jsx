// Ruta: frontend/src/pages/ProductsManager.jsx
import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import useDataProducts from "../components/ProductsAdmin/hooks/useDataProducts";
import ProductTable from "../components/ProductsAdmin/ProductTable";
import ProductForm from "../components/ProductsAdmin/ProductForm";

/**
 * Componente principal para la gestión de productos
 * Mantiene exactamente la estructura y diseño original pero mejora la funcionalidad interna
 * Utiliza el hook useDataProducts mejorado para manejar la lógica de productos
 * 
 * @returns {JSX.Element} Componente de gestión de productos
 */
const ProductsManager = () => {
  // ============ HOOK DE PRODUCTOS MEJORADO ============
  
  const {
    // Estados del formulario (mantiene compatibilidad exacta con diseño original)
    id,
    name,
    description,
    price,
    stock,
    categoryId,
    image,
    isPersonalizable,
    details,
    
    // Estados de datos
    products,
    loading,
    categories,
    
    // Estados de validación y envío (nuevos, mejorados)
    validationErrors,
    isSubmitting,
    
    // Funciones CRUD (manteniendo nombres originales)
    createProduct,
    deleteProduct,
    handleEdit,
    updateProduct,
    resetForm,
  } = useDataProducts();

  // ============ ESTADOS LOCALES (ESTRUCTURA ORIGINAL EXACTA) ============
  
  // Estados locales para manejar la búsqueda y el formulario (sin cambios)
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ============ VALIDACIÓN Y FILTRADO (LÓGICA ORIGINAL) ============
  
  // Validación segura: asegurarse de que products sea un array (sin cambios)
  const safeProducts = Array.isArray(products) ? products : [];
  
  // Filtrar productos solo si products es un array válido (lógica original)
  const filteredProducts = safeProducts.filter((product) =>
    product && product.name && 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============ FUNCIONES DE MANEJO (ESTRUCTURA ORIGINAL) ============
  
  /**
   * Funciones para manejar la apertura y cierre del formulario (sin cambios)
   */
  const handleOpenForm = () => {
    setEditingProduct(null);
    resetForm();
    setShowForm(true);
  };

  /**
   * Función para cerrar el formulario y resetear el estado (sin cambios)
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  /**
   * Función para manejar la edición de un producto (lógica original mejorada)
   * 
   * @param {Object} product - Producto a editar
   */
  const handleEditProduct = (product) => {
    console.log("Producto a editar:", product);
    setEditingProduct(product);
    updateProduct(product);
    setShowForm(true);
  };

  /**
   * Función para manejar el envío del formulario (lógica original mejorada)
   * 
   * @param {Object} productData - Datos del producto del formulario
   */
  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        console.log("Editando producto con ID:", id);
        await handleEdit(productData);
      } else {
        console.log("Creando nuevo producto");
        await createProduct(productData);
      }
      // Solo cerrar si no hay errores de validación
      if (!validationErrors || Object.keys(validationErrors).length === 0) {
        handleCloseForm();
      }
    } catch (error) {
      console.error("Error al procesar producto:", error);
      // No cerrar el formulario en caso de error para que el usuario pueda corregir
    }
  };

  // ============ RENDERIZADO CONDICIONAL PARA LOADING (DISEÑO ORIGINAL EXACTO) ============
  
  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-2 sm:p-3 lg:p-6">
          <div className="flex justify-center items-center h-32 sm:h-48 lg:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#FF7260]"></div>
            <span className="ml-3 text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Cargando productos...
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ============ RENDERIZADO PRINCIPAL (ESTRUCTURA ORIGINAL EXACTA) ============
  
  return (
    <AdminLayout>
      <div className="p-2 sm:p-3 lg:p-6">
        {/* Header completamente responsivo (diseño original exacto) */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 font-poppins">
                Gestión de Productos
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base font-poppins">
                Administra tus productos disponibles en el sistema
              </p>
              {/* Información de estado para debug (responsive) */}
              <p className="text-xs text-gray-500 mt-1">
                Total productos: {safeProducts.length} | 
                Filtrados: {filteredProducts.length}
              </p>
            </div>
            <button
              onClick={handleOpenForm}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#FDB4B7] hover:bg-[#F2C6C2] text-white px-3 sm:px-4 lg:px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm lg:text-base shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Poppins, sans-serif", cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="hidden sm:inline">
                {isSubmitting ? 'Procesando...' : 'Añadir Producto'}
              </span>
              <span className="sm:hidden">
                {isSubmitting ? 'Procesando...' : 'Añadir'}
              </span>
            </button>
          </div>

          {/* Filtros y búsqueda responsivos (diseño original exacto) */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7260] focus:border-transparent text-xs sm:text-sm lg:text-base font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <svg className="absolute left-2 sm:left-3 top-2.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  disabled={isSubmitting}
                  className="absolute right-2 sm:right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Contador de resultados */}
            <div className="flex items-center justify-center sm:justify-start">
              <span className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border font-poppins">
                {filteredProducts.length} de {safeProducts.length} productos
              </span>
            </div>
          </div>
        </div>

        {/* Mensajes de estado responsivos (diseño original exacto) */}
        {safeProducts.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-base sm:text-lg text-gray-500 font-poppins">
              No hay productos disponibles
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Comienza añadiendo tu primer producto
            </p>
            <button
              onClick={handleOpenForm}
              disabled={isSubmitting}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FDB4B7] hover:bg-[#F2C6C2] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Procesando...' : 'Añadir Producto'}
            </button>
          </div>
        )}

        {/* Mensaje cuando no hay resultados de búsqueda (diseño original exacto) */}
        {safeProducts.length > 0 && filteredProducts.length === 0 && searchTerm && (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg text-gray-500 font-poppins">
              No se encontraron productos que coincidan con "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              disabled={isSubmitting}
              className="mt-4 text-[#FF7260] hover:text-[#FF7260]/80 text-sm underline disabled:opacity-50"
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Tabla de productos responsiva (diseño original exacto) */}
        {filteredProducts.length > 0 && (
          <ProductTable
            products={filteredProducts}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={deleteProduct}
          />
        )}
      </div>

      {/* Modal del formulario CON FONDO EXACTAMENTE IGUAL AL DE ELIMINAR */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <ProductForm
            isOpen={showForm}
            onClose={handleCloseForm}
            onSubmit={handleProductSubmit}
            productData={editingProduct}
            categories={categories}
            isEditing={!!editingProduct}
            validationErrors={validationErrors}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductsManager;